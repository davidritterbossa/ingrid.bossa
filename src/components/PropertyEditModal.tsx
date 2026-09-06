'use client';

import React, { useState, useRef } from 'react';
import { Property, TipoNegocio, CategoriaImovel, StatusImovel, BAIRROS_TOLEDO, CATEGORIAS } from '@/types/property';
import {
  X,
  Check,
  Edit3,
  Plus,
  Trash2,
  Home,
  MapPin,
  DollarSign,
  Sparkles,
  Camera,
  Upload,
  Link as LinkIcon,
  Star,
  ChevronLeft,
  ChevronRight,
  Layers,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface PropertyEditModalProps {
  property: Property;
  allProperties?: Property[]; // Novo prop para receber todos os imóveis e extrair categorias/bairros
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProperty: Property) => void;
}

export default function PropertyEditModal({
  property,
  allProperties = [],
  isOpen,
  onClose,
  onSave,
}: PropertyEditModalProps) {
  const [formData, setFormData] = useState<Property>({ ...property });
  
  // Categorias e Bairros do Banco de Dados
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [dbNeighborhoods, setDbNeighborhoods] = useState<string[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/categories').then(res => res.json()).then(json => {
        if (json.success) setDbCategories(json.data.map((c: any) => c.name));
      });
      fetch('/api/neighborhoods').then(res => res.json()).then(json => {
        if (json.success) setDbNeighborhoods(json.data.map((n: any) => n.name));
      });
    }
  }, [isOpen]);
  // pendingFiles: arquivos locais e suas object URLs
  const [pendingFiles, setPendingFiles] = useState<{ url: string; file: File }[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Estados para exibição de input de texto no lugar do select
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewBairroInput, setShowNewBairroInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- COMPRESSÃO DE IMAGENS CLIENT-SIDE ---
  // Evita estourar o limite de 4.5MB da Vercel ao enviar 20 fotos
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1280;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > width && height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(file);
          
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' }));
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.7
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    showToast(`Otimizando ${files.length} foto(s)... Por favor, aguarde.`);
    
    const processed = await Promise.all(
      Array.from(files).map(async (file) => {
        const compressed = await compressImage(file);
        return {
          url: URL.createObjectURL(compressed),
          file: compressed,
        };
      })
    );
    
    setPendingFiles((prev) => [...prev, ...processed]);
    
    const newUrls = processed.map((p) => p.url);
    handleChange('imagens', [...(formData.imagens || []), ...newUrls]);
    
    showToast(`${processed.length} foto(s) prontas para envio!`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    if (!newImageUrl.startsWith('http://') && !newImageUrl.startsWith('https://') && !newImageUrl.startsWith('/')) {
      setUrlError('Insira um link de imagem válido (iniciando com https:// ou http://)');
      return;
    }

    const merged = [...(formData.imagens || []), newImageUrl.trim()];
    handleChange('imagens', merged);
    setNewImageUrl('');
    setUrlError('');
    showToast('Foto adicionada por link!');
  };

  const handleDeletePhoto = (index: number) => {
    const updated = (formData.imagens || []).filter((_, i) => i !== index);
    handleChange('imagens', updated);
    showToast('Foto removida');
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const currentImgs = formData.imagens || [];
    const selected = currentImgs[index];
    const rest = currentImgs.filter((_, i) => i !== index);
    handleChange('imagens', [selected, ...rest]);
    showToast('Foto definida como capa principal!');
  };

  const handleMovePhotoLeft = (index: number) => {
    if (index === 0) return;
    const currentImgs = [...(formData.imagens || [])];
    const temp = currentImgs[index];
    currentImgs[index] = currentImgs[index - 1];
    currentImgs[index - 1] = temp;
    handleChange('imagens', currentImgs);
  };

  const handleMovePhotoRight = (index: number) => {
    const currentImgs = [...(formData.imagens || [])];
    if (index === currentImgs.length - 1) return;
    const temp = currentImgs[index];
    currentImgs[index] = currentImgs[index + 1];
    currentImgs[index + 1] = temp;
    handleChange('imagens', currentImgs);
  };

  // --- COMODIDADES ---
  const handleAddAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenity.trim()) return;
    if (!formData.comodidades.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        comodidades: [...prev.comodidades, newAmenity.trim()],
      }));
    }
    setNewAmenity('');
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      comodidades: prev.comodidades.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');

    try {
      // Salva categoria no banco se for nova
      if (formData.categoria && !dbCategories.includes(formData.categoria) && !CATEGORIAS[formData.categoria]) {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.categoria })
        }).catch(err => console.error('Erro ao salvar categoria no banco:', err));
      }

      // Salva bairro no banco se for novo
      if (formData.bairro && !dbNeighborhoods.includes(formData.bairro) && !BAIRROS_TOLEDO.includes(formData.bairro)) {
        await fetch('/api/neighborhoods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.bairro })
        }).catch(err => console.error('Erro ao salvar bairro no banco:', err));
      }

      // --- 1. UPLOAD DE IMAGENS PENDENTES ---
      let finalImages = [...(formData.imagens || [])];
      const hasPendingFiles = finalImages.some((url) => url.startsWith('blob:'));

      if (hasPendingFiles) {
        showToast('Enviando imagens... Aguarde.');
        
        // Upload em lotes de 3 para não travar o navegador ou tomar timeout longo
        const batchSize = 3;
        for (let i = 0; i < finalImages.length; i += batchSize) {
          const batchPromises = finalImages.slice(i, i + batchSize).map(async (url, idx) => {
            const actualIndex = i + idx;
            if (url.startsWith('blob:')) {
              const pending = pendingFiles.find((p) => p.url === url);
              if (pending) {
                const uploadFd = new FormData();
                uploadFd.append('file', pending.file);
                
                const upRes = await fetch('/api/upload', { method: 'POST', body: uploadFd });
                const upJson = await upRes.json();
                if (!upJson.success) throw new Error(upJson.error || 'Erro no upload de foto');
                
                finalImages[actualIndex] = upJson.url; // Substitui o blob: pela URL real
              }
            }
          });
          await Promise.all(batchPromises);
        }
      }

      const isNew = !formData.id;

      if (isNew) {
        // --- CRIAR NOVO IMÓVEL via POST com FormData ---
        const fd = new FormData();
        fd.append('title', formData.titulo);
        if (formData.codigo) fd.append('code', formData.codigo);
        fd.append('description', formData.descricao || '');
        fd.append('type', formData.tipo);
        fd.append('category', formData.categoria);
        fd.append('neighborhood', formData.bairro);
        if (formData.rua) fd.append('street', formData.rua);
        if (formData.cidade) fd.append('city', formData.cidade);
        if (formData.estado) fd.append('state', formData.estado);
        fd.append('price', String(formData.preco));
        fd.append('bedrooms', String(formData.quartos));
        fd.append('bathrooms', String(formData.banheiros));
        fd.append('parking_spaces', String(formData.vagas));
        if (formData.areaTotal) fd.append('total_area', String(formData.areaTotal));
        if (formData.areaUtil) fd.append('useful_area', String(formData.areaUtil));
        fd.append('status', formData.status);
        if (formData.destaque) fd.append('featured', String(formData.destaque));
        if (formData.comodidades.length > 0) {
          fd.append('amenities', JSON.stringify(formData.comodidades));
        }

        // Agora todas as imagens em finalImages são URLs. O backend lida com URLs (strings).
        finalImages.forEach((url) => {
          fd.append('images', url);
        });

        const res = await fetch('/api/properties', { method: 'POST', body: fd });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Erro ao cadastrar imóvel');
        onSave(json.data);
      } else {
        // --- EDITAR IMÓVEL EXISTENTE via PATCH ---
        const res = await fetch(`/api/properties/${formData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, imagens: finalImages })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Erro ao atualizar imóvel');
        onSave(json.data);
      }

      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar imóvel:', err);
      setSaveError(err.message || 'Ocorreu um erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 relative">
        
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1c1917] text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-[#b87d5b]/40 text-xs font-bold animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1c1917] to-[#141211] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#b87d5b]/20 text-[#b87d5b]">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {formData.titulo ? `Editar: ${formData.titulo}` : 'Cadastrar Novo Imóvel'}
              </h3>
              <p className="text-xs text-gray-300">Anexe fotos, defina preços, endereço e características.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. SEÇÃO DE FOTOS DO IMÓVEL (NOVO E DESTAQUE) */}
          <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1c1917] uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#b87d5b]" />
                Fotos do Imóvel ({formData.imagens?.length || 0})
              </h4>
              <span className="text-[11px] text-gray-500 font-medium">
                A 1ª foto será a <strong>Capa Principal</strong> do anúncio.
              </span>
            </div>

            {/* Upload e Inserção por Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Botão de Upload Local */}
              <div className="border-2 border-dashed border-gray-300 hover:border-[#b87d5b] bg-white rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="modal-photo-upload"
                />
                <label
                  htmlFor="modal-photo-upload"
                  className="cursor-pointer flex flex-col items-center w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1c1917]/10 text-[#1c1917] flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5 text-[#1c1917]" />
                  </div>
                  <span className="font-bold text-xs text-gray-900 mb-0.5">
                    Adicionar Fotos do Computador
                  </span>
                  <span className="text-[10px] text-gray-500">
                    JPG, PNG, WEBP (selecione uma ou várias fotos)
                  </span>
                </label>
              </div>

              {/* Inserir por Link */}
              <div className="border border-gray-200 bg-white rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-[#b87d5b]" />
                    Inserir por Link (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://site.com/foto.jpg"
                    value={newImageUrl}
                    onChange={(e) => {
                      setNewImageUrl(e.target.value);
                      setUrlError('');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                  />
                  {urlError && <p className="text-[10px] text-red-500 font-bold mt-1">{urlError}</p>}
                </div>
                <button
                  type="button"
                  onClick={handleAddPhotoByUrl}
                  className="mt-2 w-full py-2 rounded-xl bg-[#1c1917] hover:bg-[#b87d5b] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Inserir Foto
                </button>
              </div>
            </div>

            {/* Grid de Miniaturas das Fotos */}
            {formData.imagens && formData.imagens.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.imagens.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className={`group relative rounded-xl overflow-hidden border-2 bg-gray-100 shadow-sm ${
                      idx === 0
                        ? 'border-[#b87d5b] ring-2 ring-[#b87d5b]/20'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="aspect-[16/10] w-full relative">
                      <img
                        src={imgSrc}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 ? (
                        <span className="absolute top-1.5 left-1.5 bg-[#1c1917] text-[#b87d5b] font-black text-[9px] uppercase px-2 py-0.5 rounded shadow flex items-center gap-1 border border-[#b87d5b]/40">
                          <Star className="w-2.5 h-2.5 fill-[#b87d5b]" />
                          Capa
                        </span>
                      ) : (
                        <span className="absolute top-1.5 left-1.5 bg-black/60 text-white font-bold text-[10px] px-1.5 py-0.2 rounded shadow">
                          #{idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="p-1.5 bg-white flex items-center justify-between gap-1 border-t border-gray-100">
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMovePhotoLeft(idx)}
                          disabled={idx === 0}
                          className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-20"
                          title="Mover foto para trás"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMovePhotoRight(idx)}
                          disabled={idx === formData.imagens.length - 1}
                          className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-20"
                          title="Mover foto para frente"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-[#8e5433] font-bold text-[10px] border border-amber-200"
                          title="Definir como foto de capa"
                        >
                          ★ Capa
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(idx)}
                        className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-gray-200 text-center text-xs text-gray-500">
                Nenhuma foto anexada ainda. Adicione as fotos do imóvel acima para exibi-las na galeria do site.
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* 2. Informações Gerais */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Home className="w-4 h-4 text-[#b87d5b]" />
              Informações Gerais
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">Título do Anúncio *</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                  placeholder="Ex: Casa Moderna com Piscina no La Salle"
                />
              </div>
              
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Cód. Referência</label>
                <input
                  type="text"
                  value={formData.codigo || ''}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                  placeholder="Ex: REF123"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Preço (R$) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-gray-500 font-bold">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.preco}
                    onChange={(e) => handleChange('preco', e.target.value ? parseFloat(e.target.value) : 0)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Negócio</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleChange('tipo', e.target.value as TipoNegocio)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                >
                  <option value="venda">Venda</option>
                  <option value="locacao">Locação</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
                {showNewCategoryInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Galpão"
                      value={formData.categoria}
                      onChange={(e) => handleChange('categoria', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        handleChange('categoria', 'casa'); // volta ao padrão ao cancelar
                      }}
                      className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.categoria}
                    onChange={(e) => {
                      if (e.target.value === 'novo') {
                        setShowNewCategoryInput(true);
                        handleChange('categoria', ''); // limpa para digitar
                      } else {
                        handleChange('categoria', e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                  >
                    {dbCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    {/* Caso a categoria salva não exista na lista do banco, exibe mesmo assim */}
                    {formData.categoria && !dbCategories.includes(formData.categoria) && (
                      <option value={formData.categoria}>{formData.categoria}</option>
                    )}
                    <option value="novo" className="font-bold text-[#1c1917]">+ Adicionar nova categoria...</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 3. Status e Visibilidade */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#b87d5b]" />
              Status e Destaque
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status do Imóvel</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as StatusImovel)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold bg-white focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                >
                  <option value="disponivel">🟢 Disponível</option>
                  <option value="negociacao">🟡 Em Negociação</option>
                  <option value="vendido">🔴 Vendido</option>
                  <option value="oculto">⚪ Oculto / Rascunho</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.destaque}
                    onChange={(e) => handleChange('destaque', e.target.checked)}
                    className="w-5 h-5 rounded text-[#1c1917] focus:ring-[#b87d5b] border-gray-300"
                  />
                  <span className="text-sm font-bold text-gray-800">
                    Destacar imóvel na página inicial (Home)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 4. Localização */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#b87d5b]" />
              Localização
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bairro *</label>
                {showNewBairroInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Jardim das Acácias"
                      value={formData.bairro}
                      onChange={(e) => handleChange('bairro', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewBairroInput(false);
                        handleChange('bairro', BAIRROS_TOLEDO[0]); // volta ao padrão
                      }}
                      className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.bairro}
                    onChange={(e) => {
                      if (e.target.value === 'novo') {
                        setShowNewBairroInput(true);
                        handleChange('bairro', ''); // limpa para digitar
                      } else {
                        handleChange('bairro', e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                  >
                    {dbNeighborhoods.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    {/* Caso o bairro salvo não exista na lista do banco, exibe mesmo assim */}
                    {formData.bairro && !dbNeighborhoods.includes(formData.bairro) && (
                      <option value={formData.bairro}>{formData.bairro}</option>
                    )}
                    <option value="novo" className="font-bold text-[#1c1917]">+ Adicionar novo bairro...</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rua / Endereço (Opcional)</label>
                <input
                  type="text"
                  value={formData.rua || ''}
                  onChange={(e) => handleChange('rua', e.target.value)}
                  placeholder="Ex: Rua das Palmeiras, 123"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cidade / UF</label>
                <input
                  type="text"
                  disabled
                  value={`${formData.cidade || 'Toledo'} - ${formData.estado || 'PR'}`}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 font-semibold"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 5. Características do Imóvel */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Características & Dimensões
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quartos</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quartos}
                  onChange={(e) => handleChange('quartos', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Banheiros</label>
                <input
                  type="number"
                  min="0"
                  value={formData.banheiros}
                  onChange={(e) => handleChange('banheiros', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Vagas</label>
                <input
                  type="number"
                  min="0"
                  value={formData.vagas}
                  onChange={(e) => handleChange('vagas', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Área Construída (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.areaTotal || ''}
                  onChange={(e) => handleChange('areaTotal', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Área do Terreno (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.areaUtil || ''}
                  onChange={(e) => handleChange('areaUtil', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 6. Comodidades */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Diferenciais & Comodidades
            </h4>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Piscina Aquecida, Energia Solar, Churrasqueira Gourmet"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 rounded-xl bg-[#1c1917] hover:bg-[#b87d5b] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.comodidades.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 7. Descrição */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">Descrição Completa</label>
            <textarea
              rows={4}
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Descreva todos os detalhes e pontos fortes do imóvel..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
            />
          </div>

          {/* Botões do Form */}
          <div className="pt-4 flex flex-col gap-3 border-t border-gray-100">
            {saveError && (
              <p className="text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                ⚠️ {saveError}
              </p>
            )}
            {pendingFiles.length > 0 && (
              <p className="text-xs font-semibold text-amber-700 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                📎 {pendingFiles.length} foto(s) local(is) serão enviadas ao Cloudinary ao salvar.
              </p>
            )}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#1c1917] hover:bg-[#b87d5b] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Salvar Imóvel
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
