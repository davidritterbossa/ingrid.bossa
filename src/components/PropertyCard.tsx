import Link from 'next/link';
import { Bed, Bath, Car, MessageCircle, ArrowUpRight, MapPin, Maximize2 } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const hasImage = property.imagens && property.imagens.length > 0;
  const whatsappUrl = `https://wa.me/5545998100534?text=${encodeURIComponent(
    `Olá Ingrid! Tenho interesse no imóvel "${property.titulo}" (Cód: ${property.codigo || property.id.split('-')[0]}). Pode me passar mais informações?`
  )}`;

  return (
    <div className="group relative bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(163,109,70,0.15)] transition-all duration-500 flex flex-col border border-stone-200/70 overflow-hidden hover:-translate-y-2">
      {/* Container da Imagem */}
      <Link href={`/imoveis/${property.id}`} className="relative aspect-[4/3] overflow-hidden bg-stone-100 block">
        {hasImage ? (
          <img 
            src={property.imagens[0]} 
            alt={property.titulo}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 font-medium text-sm">
            Sem Imagem
          </div>
        )}

        {/* Gradiente sutil na imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141211]/60 via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Badges Superiores */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 text-[10px] font-extrabold text-white rounded-xl uppercase tracking-wider backdrop-blur-md shadow-sm bg-[#1c1917]/70 border border-white/20">
              {property.tipo === 'venda' ? 'Venda' : 'Locação'}
            </span>

            {property.status === 'negociacao' && (
              <span className="px-2.5 py-1.5 text-[10px] font-black text-amber-950 rounded-xl uppercase tracking-wider backdrop-blur-md shadow-sm bg-amber-400/90">
                Negociação
              </span>
            )}
            {property.status === 'vendido' && (
              <span className="px-2.5 py-1.5 text-[10px] font-black text-white rounded-xl uppercase tracking-wider backdrop-blur-md shadow-sm bg-rose-600/90">
                Vendido
              </span>
            )}
          </div>

          <span className="bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl">
            Cód: {property.codigo || property.id.split('-')[0]}
          </span>
        </div>

        {/* Tag de Categoria */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-xl text-stone-900 text-[10px] font-black px-3.5 py-1.5 rounded-xl shadow-md tracking-wider uppercase border border-rosebronze-200/50">
            {property.categoria}
          </span>
        </div>
      </Link>

      {/* Área de Conteúdo */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow">
        {/* Bairro e Localização */}
        <p className="text-[11px] text-rosebronze-600 font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {property.bairro}, {property.cidade}
        </p>
        
        {/* Título */}
        <Link href={`/imoveis/${property.id}`}>
          <h3 className="text-xl font-bold text-stone-900 line-clamp-1 group-hover:text-rosebronze-600 transition-colors mb-2" title={property.titulo}>
            {property.titulo}
          </h3>
        </Link>
        
        {/* Preço */}
        <div className="mb-5 mt-auto">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mb-0.5">Valor de Venda</span>
          <p className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-rosebronze-600 transition-colors duration-300">
            {formatPrice(property.preco)}
          </p>
        </div>
        
        {/* Características Técnicas */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-xs text-stone-600 mb-5 bg-stone-50/70 rounded-2xl px-3">
          <div className="flex items-center gap-1.5 justify-center" title={`${property.quartos} Quartos`}>
            <Bed className="w-4 h-4 text-rosebronze-600" />
            <span className="font-bold">{property.quartos} qts</span>
          </div>
          
          <div className="flex items-center gap-1.5 justify-center" title={`${property.banheiros} Banheiros`}>
            <Bath className="w-4 h-4 text-rosebronze-600" />
            <span className="font-bold">{property.banheiros} ban</span>
          </div>
          
          <div className="flex items-center gap-1.5 justify-center" title={`${property.vagas} Vagas`}>
            <Car className="w-4 h-4 text-rosebronze-600" />
            <span className="font-bold">{property.vagas} vgs</span>
          </div>
        </div>

        {/* Botões de Ação do Card */}
        <div className="flex items-center gap-2.5 mt-auto">
          <Link
            href={`/imoveis/${property.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-rosebronze-600 text-white font-bold text-xs transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          >
            <span>Ver Detalhes</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Falar com Ingrid Bossa sobre este imóvel"
            className="p-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5c] text-white transition-all hover:scale-110 shadow-md hover:shadow-lg active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
