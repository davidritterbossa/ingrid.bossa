'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchFilter from '@/components/SearchFilter';
import PropertyCard from '@/components/PropertyCard';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { Property } from '@/types/property';
import { getStoredProperties, subscribeProperties } from '@/lib/propertyStore';
import { Sparkles, Home } from 'lucide-react';

function ImoveisContent() {
  const searchParams = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca imóveis do Supabase via API ao montar o componente
  useEffect(() => {
    async function fetchProperties() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/properties', { cache: 'no-store' });
        if (!res.ok) throw new Error('Erro ao buscar imóveis');
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setAllProperties(json.data);
        } else {
          setAllProperties(getStoredProperties());
        }
      } catch (err) {
        console.error('Erro ao carregar imóveis, usando fallback local:', err);
        setAllProperties(getStoredProperties());
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();

    const unsubscribe = subscribeProperties((updatedList) => {
      setAllProperties(updatedList);
    });
    return () => unsubscribe();
  }, []);

  // Aplica filtros de URL sobre os dados já carregados
  useEffect(() => {
    const tipo = searchParams.get('tipo');
    const categoria = searchParams.get('categoria');
    const bairro = searchParams.get('bairro');

    // Filtra imóveis visíveis (ocultos não aparecem na listagem pública)
    let result = allProperties.filter((p) => p.status !== 'oculto');

    if (tipo) {
      result = result.filter((p) => p.tipo.toLowerCase() === tipo.toLowerCase());
    }
    if (categoria) {
      result = result.filter((p) => p.categoria.toLowerCase() === categoria.toLowerCase());
    }
    if (bairro) {
      result = result.filter((p) => p.bairro.toLowerCase().includes(bairro.toLowerCase()));
    }

    setFilteredProperties(result);
  }, [searchParams, allProperties]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-900 font-bold bg-[#faf8f5]">
        Carregando imóveis...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da Listagem */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rosebronze-100 text-rosebronze-700 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rosebronze-600" />
            Catálogo Oficial • Toledo - PR
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 mt-1 tracking-tight">
            Imóveis Selecionados
          </h1>
          <p className="text-stone-600 mt-2 text-sm sm:text-base">
            Encontramos <strong className="text-stone-900">{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'} com atendimento de Ingrid Bossa.
          </p>
        </div>

        {/* Buscador com Filtros */}
        <div className="mb-14">
          <SearchFilter />
        </div>

        {/* Grid de Imóveis */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white rounded-3xl shadow-sm border border-stone-200/60 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rosebronze-50 text-rosebronze-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              🔍
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-stone-500 text-sm mb-6">Tente ajustar os filtros ou selecionar outro bairro de Toledo para ver mais opções.</p>
            <a
              href="/imoveis"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-stone-900 text-white text-xs font-bold hover:bg-rosebronze-600 transition-colors"
            >
              Limpar Filtros
            </a>
          </div>
        )}
      </div>
      <WhatsAppCTA />
    </div>
  );
}

export default function ImoveisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-900 font-bold bg-[#faf8f5]">Carregando catálogo de imóveis...</div>}>
      <ImoveisContent />
    </Suspense>
  );
}
