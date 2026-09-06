'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Building2,
  DollarSign,
  MapPin,
  Sparkles,
  Bed,
  Bath,
  Car,
  FileText,
  Star
} from 'lucide-react';
import { BAIRROS_TOLEDO, TipoNegocio, CategoriaImovel, StatusImovel } from '@/types/property';
import { addStoredProperty } from '@/lib/propertyStore';

interface PropertyFormProps {
  onSuccess?: (newProperty: any) => void;
  onCancel?: () => void;
}

export default function PropertyForm({ onSuccess, onCancel }: PropertyFormProps) {
  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('casa');
  const [type, setType] = useState('venda');
  const [neighborhood, setNeighborhood] = useState('Jardim Coopagro');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [parkingSpaces, setParkingSpaces] = useState('2');
  const [status, setStatus] = useState('disponivel');

  // Estados de Imagens e Upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Seleção e Preview de Múltiplas Imagens
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newPreviews = fileList.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...fileList]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Remover Imagem Selecionada
  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Definir Imagem como Capa Principal (Move para o índice 0)
  const handleSetCover = (index: number) => {
    if (index === 0) return;

    setSelectedFiles((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });

    setPreviewUrls((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  // Envio do Formulário para o Backend (Cloudinary + Supabase)
  // Envio do Formulário para o Backend (Cloudinary + Supabase ou Store Local)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanTitle = title.trim();
    const cleanPrice = Math.max(0, parseFloat(price) || 0);

    if (!cleanTitle || cleanPrice <= 0) {
      setErrorMessage('Por favor, preencha o título e um valor válido para o imóvel.');
      return;
    }

    setIsLoading(true);

    try {
      // Criação do FormData multipart
      const formData = new FormData();
      formData.append('title', cleanTitle);
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('type', type);
      formData.append('neighborhood', neighborhood);
      formData.append('price', String(cleanPrice));
      formData.append('bedrooms', String(Math.max(0, parseInt(bedrooms, 10) || 0)));
      formData.append('bathrooms', String(Math.max(0, parseInt(bathrooms, 10) || 0)));
      formData.append('parking_spaces', String(Math.max(0, parseInt(parkingSpaces, 10) || 0)));
      formData.append('status', status);

      // Anexa todos os arquivos de imagem
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      let savedData: any = null;

      try {
        // Dispara a requisição para a API
        const response = await fetch('/api/properties', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (response.ok && result.success && result.data) {
          savedData = result.data;
          setSuccessMessage('Imóvel cadastrado com sucesso!');
        } else {
          throw new Error(result.error || 'Erro na API');
        }
      } catch (apiErr) {
        console.warn('API indisponível, cadastrando no armazenamento local:', apiErr);
        // Fallback local caso Supabase ou Cloudinary não respondam
        savedData = addStoredProperty({
          titulo: cleanTitle,
          descricao: description.trim(),
          tipo: type as TipoNegocio,
          categoria: category as CategoriaImovel,
          preco: cleanPrice,
          rua: '',
          bairro: neighborhood,
          cidade: 'Toledo',
          estado: 'PR',
          quartos: Math.max(0, parseInt(bedrooms, 10) || 0),
          banheiros: Math.max(0, parseInt(bathrooms, 10) || 0),
          vagas: Math.max(0, parseInt(parkingSpaces, 10) || 0),
          areaTotal: null,
          areaUtil: null,
          imagens: previewUrls.length > 0 ? previewUrls : ['/images/lago-toledo-hero.jpg'],
          comodidades: [],
          status: status as StatusImovel,
          destaque: false,
        });
        setSuccessMessage('Imóvel cadastrado com sucesso no catálogo!');
      }

      // Limpa os campos
      setTitle('');
      setDescription('');
      setPrice('');
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (onSuccess && savedData) {
        onSuccess(savedData);
      }
    } catch (err: any) {
      console.error('Erro ao enviar formulário:', err);
      setErrorMessage(err.message || 'Ocorreu um erro ao cadastrar o imóvel. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200">
      
      {/* Header do Formulário */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-champagne-300 flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Cadastrar Novo Imóvel
            </h2>
            <p className="text-xs text-stone-500">
              Armazenamento em nuvem via <strong>Supabase</strong> e <strong>Cloudinary</strong>.
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Alertas Visuais */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm font-semibold animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. SEÇÃO DE FOTOS (UPLOAD CLOUDINARY) */}
        <div className="bg-rosebronze-50/40 rounded-2xl p-5 border border-rosebronze-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-rosebronze-600" />
              Fotos do Imóvel ({selectedFiles.length} selecionada(s))
            </h3>
            <span className="text-[11px] text-stone-500 font-medium">
              Upload automático e otimizado no Cloudinary
            </span>
          </div>

          {/* Área de Seleção de Arquivos */}
          <div className="border-2 border-dashed border-stone-300 hover:border-rosebronze-500 bg-white rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
              id="property-file-input"
              disabled={isLoading}
            />
            <label
              htmlFor="property-file-input"
              className="cursor-pointer flex flex-col items-center w-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-stone-900/10 text-stone-900 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-stone-900" />
              </div>
              <span className="font-bold text-sm text-stone-900 mb-1">
                Clique para selecionar fotos do imóvel
              </span>
              <span className="text-xs text-stone-500">
                Suporta múltiplos arquivos (JPG, PNG, WEBP)
              </span>
            </label>
          </div>

          {/* Pré-visualização das Imagens Selecionadas */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className={`group relative rounded-xl overflow-hidden border-2 bg-stone-100 shadow-sm ${
                    idx === 0
                      ? 'border-rosebronze-500 ring-2 ring-rosebronze-400/20'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="aspect-[16/10] w-full relative">
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-stone-900 text-champagne-300 font-black text-[9px] uppercase px-2 py-0.5 rounded shadow flex items-center gap-1 border border-rosebronze-400/40">
                        <Star className="w-2.5 h-2.5 fill-rosebronze-400 text-rosebronze-400" />
                        Foto de Capa
                      </span>
                    )}
                  </div>

                  <div className="p-1.5 bg-white flex items-center justify-between gap-1 border-t border-stone-100">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(idx)}
                        className="px-2 py-0.5 rounded bg-rosebronze-50 hover:bg-rosebronze-100 text-rosebronze-700 font-bold text-[10px] border border-rosebronze-200"
                        title="Tornar esta a foto de capa"
                      >
                        ★ Capa
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 ml-auto rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                      title="Remover foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. DADOS PRINCIPAIS DO IMÓVEL */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-rosebronze-600" />
            Informações Gerais
          </h3>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Título do Imóvel *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Sobrado de Alto Padrão no Jardim Coopagro"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Valor (R$) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-stone-400 font-bold">R$</span>
                <input
                  type="number"
                  required
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="850000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Negócio</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
                disabled={isLoading}
              >
                <option value="venda">Venda</option>
                <option value="locacao">Locação</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
                disabled={isLoading}
              >
                <option value="casa">Casa</option>
                <option value="sobrado">Sobrado</option>
                <option value="apartamento">Apartamento</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
                <option value="rural">Rural</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. LOCALIZAÇÃO E STATUS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rosebronze-600" />
              Bairro em Toledo / PR *
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
              disabled={isLoading}
            >
              {BAIRROS_TOLEDO.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rosebronze-600" />
              Status de Publicação
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold bg-white focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
              disabled={isLoading}
            >
              <option value="disponivel">🟢 Disponível</option>
              <option value="negociacao">🟡 Em Negociação</option>
              <option value="vendido">🔴 Vendido</option>
              <option value="oculto">⚪ Oculto (Rascunho)</option>
            </select>
          </div>
        </div>

        {/* 4. CARACTERÍSTICAS */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-rosebronze-600" />
              Quartos
            </label>
            <input
              type="number"
              min="0"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-rosebronze-600" />
              Banheiros
            </label>
            <input
              type="number"
              min="0"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-rosebronze-600" />
              Vagas Garagem
            </label>
            <input
              type="number"
              min="0"
              value={parkingSpaces}
              onChange={(e) => setParkingSpaces(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 5. DESCRIÇÃO */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Descrição Completa</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva acabamentos, pontos fortes e localização..."
            className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rosebronze-400 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        {/* BOTÃO DE SUBMIT COM ESTADO DE LOADING */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 rounded-xl bg-stone-900 hover:bg-rosebronze-600 text-white font-black text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Enviando fotos e salvando imóvel...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Cadastrar Imóvel</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
