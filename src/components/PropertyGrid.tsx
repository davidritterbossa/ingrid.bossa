import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { Property } from '@/types/property';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export default function PropertyGrid({ 
  properties, 
  title = 'Imóveis em Destaque', 
  subtitle = 'Seleção exclusiva com curadoria personalizada em Toledo e região',
  showViewAll = false 
}: PropertyGridProps) {
  return (
    <section className="py-20 md:py-28 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rosebronze-100 text-rosebronze-700 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rosebronze-600" />
            Curadoria Exclusiva
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-stone-500 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            {subtitle}
          </p>
        </div>

        {/* Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-stone-200/60 max-w-md mx-auto text-stone-500 text-sm">
            Nenhum imóvel encontrado no momento.
          </div>
        )}

        {/* View All Button */}
        {showViewAll && (
          <div className="mt-16 text-center">
            <Link 
              href="/imoveis" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 hover:bg-rosebronze-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 text-sm sm:text-base group"
            >
              <span>Explorar Todo o Catálogo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
