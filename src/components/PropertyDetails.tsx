import { Property, STATUS_IMOVEL_CONFIG, CATEGORIAS } from '@/types/property';
import { MapPin, Bed, Bath, Car, Maximize } from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const formatPrice = (value: number | undefined | null): string => {
    const num = typeof value === 'number' && !isNaN(value) ? value : Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const statusConfig = STATUS_IMOVEL_CONFIG[property.status] || STATUS_IMOVEL_CONFIG.disponivel;
  const categoriaLabel = CATEGORIAS[property.categoria] || property.categoria || 'Imóvel';
  const propertyCode = property.codigo || String(property.id || '').split('-')[0] || 'REF';

  return (
    <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-stone-200/70">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {/* Tipo */}
            <span className="px-3.5 py-1 text-xs font-black text-white rounded-xl uppercase tracking-wider bg-stone-900">
              {property.tipo === 'venda' ? 'Venda' : 'Locação'}
            </span>

            {/* Categoria */}
            <span className="px-3.5 py-1 text-xs font-bold text-stone-700 rounded-xl uppercase tracking-wider bg-stone-100 border border-stone-200">
              {categoriaLabel}
            </span>

            {/* Status */}
            <span className={`px-3 py-1 text-xs font-black rounded-xl uppercase tracking-wider border flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>

            {/* Código Ref */}
            <span className="text-stone-400 text-xs font-medium ml-1">
              Ref: #{propertyCode}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-stone-900 mb-3 leading-tight tracking-tight">
            {property.titulo}
          </h1>
          
          <div className="flex items-center gap-2 text-stone-600">
            <MapPin className="w-5 h-5 text-rosebronze-600 flex-shrink-0" />
            <span className="text-base sm:text-lg">
              {property.rua ? `${property.rua}, ` : ''}{property.bairro}, {property.cidade} - {property.estado}
            </span>
          </div>
        </div>
        
        <div className="md:text-right flex-shrink-0">
          <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Valor do Imóvel</span>
          <p className="text-3xl md:text-4xl font-black text-stone-900">
            {formatPrice(property.preco)}
          </p>
        </div>
      </div>

      <hr className="border-stone-100 mb-8" />

      {/* Characteristics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-10">
        {property.quartos !== undefined && (
          <div className="flex flex-col items-center justify-center p-4 bg-stone-50/80 rounded-2xl border border-stone-100 text-center">
            <Bed className="w-7 h-7 text-rosebronze-600 mb-1.5" />
            <span className="text-xl font-black text-stone-900">{property.quartos}</span>
            <span className="text-xs text-stone-500 font-medium">Quartos</span>
          </div>
        )}
        
        {property.banheiros !== undefined && (
          <div className="flex flex-col items-center justify-center p-4 bg-stone-50/80 rounded-2xl border border-stone-100 text-center">
            <Bath className="w-7 h-7 text-rosebronze-600 mb-1.5" />
            <span className="text-xl font-black text-stone-900">{property.banheiros}</span>
            <span className="text-xs text-stone-500 font-medium">Banheiros</span>
          </div>
        )}
        
        {property.vagas !== undefined && (
          <div className="flex flex-col items-center justify-center p-4 bg-stone-50/80 rounded-2xl border border-stone-100 text-center">
            <Car className="w-7 h-7 text-rosebronze-600 mb-1.5" />
            <span className="text-xl font-black text-stone-900">{property.vagas}</span>
            <span className="text-xs text-stone-500 font-medium">Vagas de Garagem</span>
          </div>
        )}

        {property.areaTotal !== undefined && property.areaTotal !== null && (
          <div className="flex flex-col items-center justify-center p-4 bg-stone-50/80 rounded-2xl border border-stone-100 text-center">
            <Maximize className="w-7 h-7 text-rosebronze-600 mb-1.5" />
            <span className="text-xl font-black text-stone-900">
              {property.areaTotal.toLocaleString('pt-BR')} m²
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Área Construída
            </span>
          </div>
        )}

        {property.areaUtil !== undefined && property.areaUtil !== null && (
          <div className="flex flex-col items-center justify-center p-4 bg-stone-50/80 rounded-2xl border border-stone-100 text-center">
            <Maximize className="w-7 h-7 text-rosebronze-600 mb-1.5" />
            <span className="text-xl font-black text-stone-900">
              {property.areaUtil.toLocaleString('pt-BR')} m²
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Área do Terreno
            </span>
          </div>
        )}
      </div>

      {/* Description Section */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          Sobre este imóvel
        </h2>
        <div className="prose prose-stone max-w-none text-stone-600 text-sm sm:text-base leading-relaxed">
          {(property.descricao || 'Entre em contato com Ingrid Bossa para saber todos os detalhes deste imóvel.')
            .split('\n')
            .filter((p) => p.trim().length > 0)
            .map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
            ))}
        </div>
      </div>
      
    </div>
  );
}
