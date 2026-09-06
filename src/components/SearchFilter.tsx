'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, Building2, MapPin, Sparkles } from 'lucide-react';
import { BAIRROS_TOLEDO, CATEGORIAS } from '@/types/property';

export default function SearchFilter() {
  const router = useRouter();
  const [tipo, setTipo] = useState<'venda' | 'locacao' | ''>('venda');
  const [categoria, setCategoria] = useState('');
  const [bairro, setBairro] = useState('');

  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [dbNeighborhoods, setDbNeighborhoods] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setDbCategories(json.data.map((c: any) => c.name));
        } else {
          setDbCategories(Object.values(CATEGORIAS));
        }
      })
      .catch(() => setDbCategories(Object.values(CATEGORIAS)));

    fetch('/api/neighborhoods')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setDbNeighborhoods(json.data.map((n: any) => n.name));
        } else {
          setDbNeighborhoods(BAIRROS_TOLEDO);
        }
      })
      .catch(() => setDbNeighborhoods(BAIRROS_TOLEDO));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (categoria) params.append('categoria', categoria);
    if (bairro) params.append('bairro', bairro);

    const queryString = params.toString();
    router.push(`/imoveis${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(20,18,17,0.12)] p-6 sm:p-8 md:p-9 w-full border border-white/80 text-left relative overflow-hidden">
      {/* Cabeçalho do Buscador */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-stone-200/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1c1917] text-white font-bold text-xs sm:text-sm shadow-md">
            <Home className="w-4 h-4 text-champagne-400" />
            <span>Imóveis Selecionados</span>
          </div>
          <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
            Toledo e Região Oeste do PR
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-rosebronze-700 font-bold bg-rosebronze-100/80 px-3.5 py-1.5 rounded-full border border-rosebronze-200">
          <Sparkles className="w-3.5 h-3.5 text-rosebronze-600" />
          Oportunidades com Ingrid Bossa
        </div>
      </div>

      {/* Formulário de Busca */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tipo de Imóvel */}
        <div className="flex flex-col">
          <label htmlFor="categoria" className="text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-rosebronze-600" />
            Tipo de Imóvel
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border border-stone-200 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-rosebronze-400 text-stone-800 font-semibold bg-stone-50/70 hover:bg-white transition-all text-sm"
          >
            <option value="">Todas as categorias</option>
            {dbCategories.map(cat => (
              <option key={cat} value={cat}>✨ {cat}</option>
            ))}
          </select>
        </div>

        {/* Bairro */}
        <div className="flex flex-col">
          <label htmlFor="bairro" className="text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rosebronze-600" />
            Bairro em Toledo
          </label>
          <select
            id="bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="w-full border border-stone-200 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-rosebronze-400 text-stone-800 font-semibold bg-stone-50/70 hover:bg-white transition-all text-sm"
          >
            <option value="">Todos os bairros</option>
            {dbNeighborhoods.map(b => (
              <option key={b} value={b}>📍 {b}</option>
            ))}
          </select>
        </div>

        {/* Botão de Busca */}
        <div className="flex flex-col justify-end sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#b87d5b] via-[#a36d46] to-[#7f4f2c] hover:from-[#c58569] hover:to-[#8e5433] text-white font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-[0_10px_25px_rgba(163,109,70,0.3)] hover:shadow-[0_15px_30px_rgba(163,109,70,0.4)] hover:scale-[1.02] active:scale-[0.98] h-[52px] text-base"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            Buscar Imóveis
          </button>
        </div>
      </form>
    </div>
  );
}
