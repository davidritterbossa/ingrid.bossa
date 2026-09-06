'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, MessageCircle, ArrowLeft, Instagram } from 'lucide-react';
import PropertyGallery from '@/components/PropertyGallery';
import PropertyDetails from '@/components/PropertyDetails';
import AmenitiesList from '@/components/AmenitiesList';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import PropertyAdminBar from '@/components/PropertyAdminBar';
import PropertyEditModal from '@/components/PropertyEditModal';
import { Property, StatusImovel, STATUS_IMOVEL_CONFIG } from '@/types/property';
import { useAuth } from '@/context/AuthContext';
import { getStoredPropertyById } from '@/lib/propertyStore';

interface PropertyClientPageProps {
  initialProperty: Property | null;
  id: string;
}

export default function PropertyClientPage({
  initialProperty,
  id,
}: PropertyClientPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(initialProperty || getStoredPropertyById(id));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(!initialProperty && !getStoredPropertyById(id));

  // Se initialProperty não veio do servidor, busca via API ou fallback
  useEffect(() => {
    if (!initialProperty) {
      setIsFetching(true);
      fetch(`/api/properties/${id}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            setProperty(json.data);
          } else {
            const fallback = getStoredPropertyById(id);
            if (fallback) setProperty(fallback);
          }
        })
        .catch(() => {
          const fallback = getStoredPropertyById(id);
          if (fallback) setProperty(fallback);
        })
        .finally(() => setIsFetching(false));
    }
  }, [id, initialProperty]);

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-900 font-bold bg-[#faf8f5]">
        Carregando detalhes do imóvel...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f5] pt-28 pb-16 px-4 text-center">
        <h1 className="text-3xl font-black text-stone-900 mb-3">Imóvel não encontrado</h1>
        <p className="text-stone-600 mb-8 max-w-md">
          O imóvel que você está procurando não existe, foi excluído ou está temporariamente indisponível.
        </p>
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-rosebronze-600 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista de Imóveis
        </Link>
      </div>
    );
  }

  // Ações da Corretora — chamam a API
  const handleStatusChange = async (newStatus: StatusImovel) => {
    setProperty((prev) => prev ? { ...prev, status: newStatus } : prev);
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) setProperty(json.data);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleImagesChange = async (newImages: string[]) => {
    setProperty((prev) => prev ? { ...prev, imagens: newImages } : prev);
    try {
      await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagens: newImages }),
      });
    } catch (err) {
      console.error('Erro ao atualizar imagens:', err);
    }
  };

  const handleSavePropertyData = (updatedData: Property) => {
    setProperty(updatedData);
  };

  const handleDeleteProperty = async () => {
    try {
      await fetch(`/api/properties/${property.id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Erro ao excluir imóvel:', err);
    }
    router.push('/imoveis');
  };

  // Formatação de Preço
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(property.preco);

  const statusConfig = STATUS_IMOVEL_CONFIG[property.status] || STATUS_IMOVEL_CONFIG.disponivel;
  const whatsappMessage = encodeURIComponent(
    `Olá, Ingrid! Tenho interesse no imóvel "${property.titulo}" (Ref: #${property.codigo || property.id.split('-')[0]}). Gostaria de mais informações!`
  );
  const whatsappUrl = `https://wa.me/5545998100534?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-28 sm:pt-32 pb-28 lg:pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Painel da Corretora (Visível exclusivamente quando autenticada) */}
        {isAuthenticated && (
          <PropertyAdminBar
            property={property}
            onStatusChange={handleStatusChange}
            onOpenPhotoManager={() => {
              const triggerBtn = document.querySelector('button[title="Adicionar, excluir ou reordenar fotos"]') as HTMLButtonElement;
              if (triggerBtn) triggerBtn.click();
            }}
            onOpenEditModal={() => setIsEditModalOpen(true)}
            onDeleteProperty={handleDeleteProperty}
          />
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-stone-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-stone-900 transition-colors font-medium">
            Início
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <Link href="/imoveis" className="hover:text-stone-900 transition-colors font-medium">
            Imóveis
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="text-stone-900 truncate font-semibold">{property.titulo}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda: Galeria, Detalhes e Comodidades */}
          <div className="lg:col-span-8 space-y-8">
            {/* Galeria de Fotos */}
            <PropertyGallery
              images={property.imagens}
              title={property.titulo}
              onImagesChange={handleImagesChange}
              isEditable={isAuthenticated}
            />

            {/* Detalhes do Imóvel */}
            <PropertyDetails property={property} />

            {/* Lista de Comodidades */}
            <AmenitiesList comodidades={property.comodidades} />
          </div>

          {/* Coluna Direita: Sidebar Fixo de Contato */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-6 md:p-8 sticky top-28 border border-stone-200/70 space-y-6">
              {/* Preço e Status */}
              <div className="border-b border-stone-100 pb-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider rounded-xl bg-rosebronze-100 text-rosebronze-800">
                    {property.tipo === 'venda' ? 'Imóvel à Venda' : 'Imóvel para Locação'}
                  </span>

                  <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                    {statusConfig.label}
                  </span>
                </div>

                <p className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                  {formattedPrice}
                </p>
              </div>

              {/* Resumo de Características */}
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center text-stone-600 border-b border-stone-50 pb-2.5">
                  <span className="text-stone-500">Bairro</span>
                  <span className="font-bold text-stone-900 text-right">📍 {property.bairro}</span>
                </div>
                {property.areaTotal !== undefined && property.areaTotal !== null && (
                  <div className="flex justify-between items-center text-stone-600 border-b border-stone-50 pb-2.5">
                    <span className="text-stone-500">Área Construída</span>
                    <span className="font-bold text-stone-900 text-right">{property.areaTotal.toLocaleString('pt-BR')} m²</span>
                  </div>
                )}
                {property.areaUtil !== undefined && property.areaUtil !== null && (
                  <div className="flex justify-between items-center text-stone-600 border-b border-stone-50 pb-2.5">
                    <span className="text-stone-500">Área do Terreno</span>
                    <span className="font-bold text-stone-900 text-right">{property.areaUtil.toLocaleString('pt-BR')} m²</span>
                  </div>
                )}
                {property.quartos > 0 && (
                  <div className="flex justify-between items-center text-stone-600 border-b border-stone-50 pb-2.5">
                    <span className="text-stone-500">Quartos</span>
                    <span className="font-bold text-stone-900 text-right">{property.quartos}</span>
                  </div>
                )}
                {property.banheiros > 0 && (
                  <div className="flex justify-between items-center text-stone-600 border-b border-stone-50 pb-2.5">
                    <span className="text-stone-500">Banheiros</span>
                    <span className="font-bold text-stone-900 text-right">{property.banheiros}</span>
                  </div>
                )}
                {property.vagas > 0 && (
                  <div className="flex justify-between items-center text-stone-600 border-b border-stone-50 pb-2.5">
                    <span className="text-stone-500">Vagas de Garagem</span>
                    <span className="font-bold text-stone-900 text-right">{property.vagas}</span>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-base hover:bg-[#20bd5c] transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  <MessageCircle className="w-6 h-6" />
                  Tenho Interesse (WhatsApp)
                </a>

                <a
                  href="https://www.instagram.com/ingridbossa_corretora/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] text-white flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm hover:opacity-95 transition-all shadow-md"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Ver perfil no Instagram</span>
                </a>
              </div>

              {/* Perfil da Corretora */}
              <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 text-champagne-300 flex items-center justify-center font-bold font-serif-luxury text-lg shadow-sm flex-shrink-0">
                  IB
                </div>
                <div>
                  <p className="font-extrabold text-stone-900 text-sm">Ingrid Bossa</p>
                  <p className="text-xs text-stone-500">Corretora Credenciada • CRECI F-58168</p>
                  <p className="text-xs text-rosebronze-600 font-bold mt-0.5">(45) 99810-0534</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl z-40">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white flex items-center justify-center py-3.5 rounded-2xl font-extrabold text-base shadow-md"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Falar no WhatsApp
        </a>
      </div>

      {/* Modal de Edição de Dados */}
      {isAuthenticated && (
        <PropertyEditModal
          property={property}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSavePropertyData}
        />
      )}

      <WhatsAppCTA propertyTitle={property.titulo} propertyId={property.codigo || property.id.split('-')[0]} />
    </div>
  );
}
