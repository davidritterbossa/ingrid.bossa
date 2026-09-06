import { CheckCircle2 } from 'lucide-react';

interface AmenitiesListProps {
  comodidades?: string[];
}

export default function AmenitiesList({ comodidades }: AmenitiesListProps) {
  if (!comodidades || comodidades.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200/70 mt-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-rosebronze-500" />
        Comodidades e Diferenciais
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {comodidades.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100/80">
            <CheckCircle2 className="w-5 h-5 text-rosebronze-600 flex-shrink-0" />
            <span className="text-stone-800 text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
