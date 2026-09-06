'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import {
  ImageIcon,
  Maximize2,
  X,
  Upload,
  Link as LinkIcon,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface PropertyGalleryProps {
  images: string[];
  title?: string;
  onImagesChange?: (newImages: string[]) => void;
  isEditable?: boolean;
}

export default function PropertyGallery({
  images = [],
  title = 'Imóvel',
  onImagesChange,
  isEditable = true,
}: PropertyGalleryProps) {
  const [activeImages, setActiveImages] = useState<string[]>(Array.isArray(images) ? images : []);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveImages(Array.isArray(images) ? images : []);
  }, [images]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleUpdateImages = (updatedList: string[]) => {
    setActiveImages(updatedList);
    if (onImagesChange) {
      onImagesChange(updatedList);
    }
  };

  // Upload local de arquivo (Converte para Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    const promises = Array.from(files).map((file) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPhotos.push(event.target.result as string);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(() => {
      const merged = [...activeImages, ...newPhotos];
      handleUpdateImages(merged);
      showToast(`${newPhotos.length} foto(s) adicionada(s) com sucesso!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  // Adicionar por URL
  const handleAddByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    if (!newImageUrl.startsWith('http://') && !newImageUrl.startsWith('https://') && !newImageUrl.startsWith('/')) {
      setUrlError('Insira um link de imagem válido (iniciando com https:// ou http://)');
      return;
    }

    const merged = [...activeImages, newImageUrl.trim()];
    handleUpdateImages(merged);
    setNewImageUrl('');
    setUrlError('');
    showToast('Foto adicionada por link!');
  };

  // Excluir foto
  const handleDeletePhoto = (index: number) => {
    if (activeImages.length <= 1) {
      if (!confirm('Esta é a única foto do imóvel. Tem certeza que deseja remover?')) return;
    }
    const updated = activeImages.filter((_, i) => i !== index);
    handleUpdateImages(updated);
    showToast('Foto removida com sucesso');
  };

  // Definir como Capa (mover para o topo)
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const selected = activeImages[index];
    const rest = activeImages.filter((_, i) => i !== index);
    const updated = [selected, ...rest];
    handleUpdateImages(updated);
    showToast('Foto definida como capa principal!');
  };

  // Mover foto para a esquerda / anterior
  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...activeImages];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    handleUpdateImages(updated);
  };

  // Mover foto para a direita / posterior
  const handleMoveRight = (index: number) => {
    if (index === activeImages.length - 1) return;
    const updated = [...activeImages];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    handleUpdateImages(updated);
  };

  // Navegação no Lightbox
  const handleNextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % activeImages.length);
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + activeImages.length) % activeImages.length);
  };

  // Fechar com teclado Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowRight') handleNextLightbox();
        if (e.key === 'ArrowLeft') handlePrevLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeImages]);

  return (
    <div className="w-full space-y-4 relative">
      {/* Toast de Feedback */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-rosebronze-400/50 animate-fade-in">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-sm">{successToast}</span>
        </div>
      )}

      {/* Barra de Ações Rápidas da Galeria */}
      {isEditable && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700">
            <Camera className="w-4 h-4 text-rosebronze-600" />
            <span>Galeria com <strong>{activeImages.length}</strong> foto(s)</span>
          </div>

          <button
            onClick={() => setIsManagerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-rosebronze-600 text-white font-bold text-xs sm:text-sm transition-all shadow hover:shadow-md hover:scale-[1.02]"
            title="Adicionar, excluir ou reordenar fotos"
          >
            <Layers className="w-4 h-4 text-champagne-300" />
            <span>Gerenciar Fotos do Imóvel</span>
          </button>
        </div>
      )}

      {/* Galeria Vazia */}
      {(!activeImages || activeImages.length === 0) ? (
        <div className="w-full aspect-[16/9] bg-stone-50 rounded-3xl flex flex-col items-center justify-center text-stone-400 border-2 border-dashed border-stone-300 p-6 text-center">
          <ImageIcon className="w-16 h-16 mb-4 text-stone-300 stroke-[1.5]" />
          <p className="text-lg font-semibold text-stone-800 mb-1">Nenhuma foto cadastrada</p>
          <p className="text-sm text-stone-500 mb-5 max-w-sm">Adicione fotos em alta qualidade para destacar o imóvel aos compradores.</p>
          {isEditable && (
            <button
              onClick={() => setIsManagerOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold text-sm shadow-md hover:bg-rosebronze-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Adicionar Primeira Foto
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Main Slider Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-stone-950 group aspect-[16/9] w-full">
            <Swiper
              style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#c58569',
              } as React.CSSProperties}
              spaceBetween={0}
              navigation={true}
              pagination={{ clickable: true, dynamicBullets: true }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[Navigation, Pagination, Thumbs]}
              className="w-full h-full"
            >
              {activeImages.map((src, index) => (
                <SwiperSlide key={index} className="relative w-full h-full flex items-center justify-center bg-black/90">
                  <img
                    src={src}
                    alt={`${title} - Foto ${index + 1}`}
                    className="w-full h-full object-cover select-none cursor-pointer"
                    onClick={() => setLightboxIndex(index)}
                  />

                  {/* Badge de Capa */}
                  {index === 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-stone-900/90 backdrop-blur-md text-champagne-300 border border-rosebronze-400/40 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5" />
                      Foto de Capa
                    </div>
                  )}

                  {/* Contador de fotos */}
                  <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {index + 1} / {activeImages.length}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Botão de Expandir / Lightbox */}
            <button
              onClick={() => setLightboxIndex(0)}
              className="absolute bottom-4 right-4 z-10 bg-black/70 hover:bg-stone-900 text-white p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg hover:scale-110 opacity-90 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold"
              title="Ver em tela cheia"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Ver em Tela Cheia</span>
            </button>
          </div>

          {/* Thumbnails Slider */}
          {activeImages.length > 1 && (
            <div className="h-20 sm:h-24">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Thumbs]}
                className="h-full w-full rounded-2xl"
                breakpoints={{
                  480: { slidesPerView: 5 },
                  768: { slidesPerView: 6 },
                  1024: { slidesPerView: 7 },
                }}
              >
                {activeImages.map((src, index) => (
                  <SwiperSlide
                    key={`thumb-${index}`}
                    className="cursor-pointer opacity-50 [&.swiper-slide-thumb-active]:opacity-100 rounded-2xl overflow-hidden border-2 border-transparent [&.swiper-slide-thumb-active]:border-rosebronze-500 [&.swiper-slide-thumb-active]:scale-95 transition-all shadow-sm relative group"
                  >
                    <img
                      src={src}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-1 right-1 bg-stone-900 text-champagne-300 text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                        Capa
                      </span>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </>
      )}

      {/* MODAL DO GERENCIADOR DE FOTOS (Corretora) */}
      {isManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Header do Modal */}
            <div className="p-6 bg-gradient-to-r from-stone-900 to-[#141211] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rosebronze-500/20 text-rosebronze-300">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Gerenciador de Fotos do Imóvel</h3>
                  <p className="text-xs text-stone-300">Adicione, defina a foto de capa, reordene ou exclua fotos.</p>
                </div>
              </div>
              <button
                onClick={() => setIsManagerOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Seção 1: Adicionar Fotos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Local */}
                <div className="border-2 border-dashed border-stone-300 hover:border-rosebronze-500 rounded-2xl p-5 text-center bg-stone-50 hover:bg-rosebronze-50/20 transition-all flex flex-col items-center justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="property-file-upload"
                  />
                  <label
                    htmlFor="property-file-upload"
                    className="cursor-pointer flex flex-col items-center w-full"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-stone-900/10 text-stone-900 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-stone-900" />
                    </div>
                    <span className="font-bold text-sm text-stone-900 mb-1">
                      Enviar Fotos do Computador
                    </span>
                    <span className="text-xs text-stone-500">
                      Formatos JPG, PNG, WEBP (selecione uma ou várias)
                    </span>
                  </label>
                </div>

                {/* Adicionar por URL */}
                <form
                  onSubmit={handleAddByUrl}
                  className="border border-stone-200 rounded-2xl p-5 bg-stone-50 flex flex-col justify-between"
                >
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-rosebronze-600" />
                      Adicionar por Link de Imagem
                    </label>
                    <input
                      type="url"
                      placeholder="https://exemplo.com/foto-do-imovel.jpg"
                      value={newImageUrl}
                      onChange={(e) => {
                        setNewImageUrl(e.target.value);
                        setUrlError('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rosebronze-400 bg-white mb-1"
                    />
                    {urlError && <p className="text-xs text-red-500 font-semibold">{urlError}</p>}
                  </div>
                  <button
                    type="submit"
                    className="mt-3 w-full py-2.5 rounded-xl bg-stone-900 hover:bg-rosebronze-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Inserir Foto por Link
                  </button>
                </form>
              </div>

              {/* Seção 2: Lista e Reordenação das Fotos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rosebronze-600" />
                    Fotos Cadastradas ({activeImages.length})
                  </h4>
                  <span className="text-xs text-stone-500">
                    A primeira foto é a <strong>Capa Principal</strong> do anúncio.
                  </span>
                </div>

                {activeImages.length === 0 ? (
                  <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200">
                    <p className="text-sm text-stone-500">Nenhuma foto adicionada ainda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeImages.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className={`group relative rounded-2xl overflow-hidden border-2 bg-stone-100 shadow-sm transition-all ${
                          idx === 0
                            ? 'border-rosebronze-500 ring-2 ring-rosebronze-400/20'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {/* Imagem */}
                        <div className="aspect-[16/10] w-full relative">
                          <img
                            src={imgSrc}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Tag de Capa ou Posição */}
                          <div className="absolute top-2 left-2 z-10">
                            {idx === 0 ? (
                              <span className="bg-stone-900 text-champagne-300 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow flex items-center gap-1 border border-rosebronze-400/40">
                                <Star className="w-3 h-3 fill-rosebronze-400 text-rosebronze-400" />
                                Capa Principal
                              </span>
                            ) : (
                              <span className="bg-black/60 backdrop-blur-md text-white font-bold text-xs px-2 py-0.5 rounded-md shadow">
                                #{idx + 1}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Barra de Ações da Foto */}
                        <div className="p-2.5 bg-white flex items-center justify-between gap-1 border-t border-stone-100">
                          {/* Reordenar */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveLeft(idx)}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Mover para a esquerda"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveRight(idx)}
                              disabled={idx === activeImages.length - 1}
                              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Mover para a direita"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Tornar Capa */}
                          {idx !== 0 && (
                            <button
                              onClick={() => handleSetCover(idx)}
                              className="px-2.5 py-1.5 rounded-lg bg-rosebronze-50 hover:bg-rosebronze-100 text-rosebronze-700 font-bold text-[11px] flex items-center gap-1 transition-colors border border-rosebronze-200"
                              title="Definir como foto de capa principal"
                            >
                              <Star className="w-3 h-3" />
                              Tornar Capa
                            </button>
                          )}

                          {/* Excluir Foto */}
                          <button
                            onClick={() => handleDeletePhoto(idx)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200"
                            title="Remover esta foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">
                As fotos são salvas e atualizadas em tempo real.
              </span>
              <button
                onClick={() => setIsManagerOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-rosebronze-600 text-white font-bold text-sm transition-all shadow-md"
              >
                Concluir e Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FULLSCREEN MODAL */}
      {lightboxIndex !== null && activeImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-fade-in">
          {/* Header do Lightbox */}
          <div className="p-4 flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm sm:text-base">{title}</span>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full text-stone-200">
                {lightboxIndex + 1} de {activeImages.length}
              </span>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/30 text-white transition-colors"
              title="Fechar tela cheia (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Imagem Central e Controles */}
          <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden">
            <button
              onClick={handlePrevLightbox}
              className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all hover:scale-110"
              title="Foto anterior (Seta esquerda)"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={activeImages[lightboxIndex]}
              alt={`Foto ${lightboxIndex + 1}`}
              className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl transition-all"
            />

            <button
              onClick={handleNextLightbox}
              className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all hover:scale-110"
              title="Próxima foto (Seta direita)"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Miniaturas no Rodapé do Lightbox */}
          <div className="p-4 bg-black/60 flex items-center justify-center gap-2 overflow-x-auto max-w-full">
            {activeImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  lightboxIndex === i ? 'border-rosebronze-400 scale-110 opacity-100' : 'border-transparent opacity-40 hover:opacity-80'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
