import Image from 'next/image';
import { MessageCircle, Instagram, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import SearchFilter from './SearchFilter';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-center overflow-hidden">
      {/* Imagem de Fundo: Toledo PR com overlay acolhedor e luxuoso */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/lago-toledo-hero.jpg"
          alt="Toledo PR - Vista da Cidade e Lago Municipal"
          fill
          priority
          quality={95}
          className="object-cover object-center scale-102 transition-transform duration-1000"
        />
        {/* Overlay escuro aconchegante com gradiente espresso e bronze */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141211]/85 via-[#1c1917]/75 to-[#141211]/95 backdrop-brightness-[0.9]" />
      </div>
      
      {/* Conteúdo Central */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-32 pb-20">
        {/* Badges de Destaque */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white border border-rosebronze-400/30 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-champagne-300" />
            Toledo - PR e Região
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/95 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            CRECI F-58168
          </div>
        </div>
        
        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-extrabold mb-6 max-w-4xl leading-[1.1] tracking-tight drop-shadow-2xl animate-fade-in-up [animation-delay:100ms]">
          Encontre o imóvel onde a sua <br className="hidden sm:inline" />
          <span className="font-serif-luxury italic font-normal bg-gradient-to-r from-champagne-200 via-rosebronze-200 to-champagne-400 bg-clip-text text-transparent">
            história vai acontecer.
          </span>
        </h1>
        
        {/* Subtítulo */}
        <p className="text-base sm:text-lg md:text-xl text-stone-200 mb-8 max-w-2xl font-normal leading-relaxed drop-shadow animate-fade-in-up [animation-delay:200ms]">
          Casas modernas, sobrados, apartamentos e terrenos com atendimento humanizado, dedicação e segurança jurídica com a corretora <strong className="text-white font-semibold">Ingrid Bossa</strong>.
        </p>

        {/* Botões Rápidos de Contato */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10 animate-fade-in-up [animation-delay:300ms]">
          <a
            href="https://wa.me/5545998100534?text=Ol%C3%A1%20Ingrid!%20Gostaria%20de%20consultar%20oportunidades%20de%20im%C3%B3veis%20em%20Toledo."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(37,211,102,0.35)] hover:shadow-[0_0_35px_rgba(37,211,102,0.5)] hover:-translate-y-1 transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
          </a>

          <a
            href="https://www.instagram.com/ingridbossa_corretora/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Instagram className="w-5 h-5" />
            @ingridbossa_corretora
          </a>
        </div>

        {/* Buscador de Imóveis Sobreposto */}
        <div className="w-full max-w-5xl shadow-2xl animate-fade-in-up [animation-delay:400ms]">
          <SearchFilter />
        </div>
      </div>
    </section>
  );
}
