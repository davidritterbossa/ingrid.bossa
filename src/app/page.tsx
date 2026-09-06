import Link from 'next/link';
import { 
  MapPin, 
  Award, 
  Building, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  MessageCircle, 
  Instagram, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import PropertyGrid from '@/components/PropertyGrid';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { Property } from '@/types/property';

export const revalidate = 0; // Evita cache estático, força atualização em tempo real

import { supabase } from '@/lib/supabase';
import { fromSupabase, SupabaseProperty } from '@/lib/supabaseMapper';
import { MOCK_PROPERTIES } from '@/lib/mock';

async function getDestaques(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'disponivel')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_PROPERTIES.filter(p => p.destaque);
    }
    
    return data.map((row) => fromSupabase(row as SupabaseProperty));
  } catch {
    return MOCK_PROPERTIES.filter(p => p.destaque);
  }
}

export default async function HomePage() {
  const destaqueProperties = await getDestaques();

  return (
    <>
      {/* 1. Hero Section com Imagem de Toledo e Buscador */}
      <HeroSection />

      {/* 2. Seção de Diferenciais Rápidos */}
      <section className="py-14 bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-3xl bg-stone-50/70 border border-stone-200/70 hover:border-rosebronze-400 hover:shadow-luxury transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-rosebronze-300 flex items-center justify-center flex-shrink-0 shadow-md">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Atendimento Humanizado</h4>
                <p className="text-xs text-stone-600 leading-relaxed">Atenção personalizada a cada detalhe e aos objetivos únicos da sua família.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-3xl bg-stone-50/70 border border-stone-200/70 hover:border-rosebronze-400 hover:shadow-luxury transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-rosebronze-300 flex items-center justify-center flex-shrink-0 shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Especialista em Toledo</h4>
                <p className="text-xs text-stone-600 leading-relaxed">Conhecimento real de bairros tradicionais e novos loteamentos com alto potencial.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-3xl bg-stone-50/70 border border-stone-200/70 hover:border-rosebronze-400 hover:shadow-luxury transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-rosebronze-300 flex items-center justify-center flex-shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Segurança Jurídica</h4>
                <p className="text-xs text-stone-600 leading-relaxed">Registro CRECI F-58168, documentação rigorosamente checada e transparência total.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-3xl bg-stone-50/70 border border-stone-200/70 hover:border-rosebronze-400 hover:shadow-luxury transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-rosebronze-300 flex items-center justify-center flex-shrink-0 shadow-md">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Melhores Oportunidades</h4>
                <p className="text-xs text-stone-600 leading-relaxed">Condições assertivas para quem deseja morar com qualidade ou investir com retorno.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vitrine de Imóveis em Destaque */}
      <PropertyGrid properties={destaqueProperties} showViewAll={true} />

      {/* 4. Seção Sobre Ingrid Bossa */}
      <section id="sobre" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Coluna Texto */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rosebronze-100 text-rosebronze-800 text-xs font-extrabold uppercase tracking-wider mb-4">
                <UserCheck className="w-4 h-4 text-rosebronze-600" />
                Corretora de Imóveis Credenciada
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 mb-6 leading-tight tracking-tight">
                Mais que imóveis, conectamos pessoas a novos começos.
              </h2>

              <p className="text-base sm:text-lg text-stone-700 mb-6 leading-relaxed">
                Olá, eu sou a <strong className="text-stone-900">Ingrid Bossa</strong>. Atuo no mercado imobiliário de Toledo e região Oeste do Paraná guiada por princípios de integridade, dedicação e proximidade com cada cliente.
              </p>

              <p className="text-base sm:text-lg text-stone-700 mb-8 leading-relaxed">
                Comprar ou vender um imóvel é uma das decisões mais importantes da vida. Por isso, conduzo cada processo com rigor técnico, cuidado pessoal e assessoria do início ao fim, garantindo que você e sua família façam sempre a melhor escolha com total tranquilidade.
              </p>

              {/* Lista de Garantias */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>CRECI F-58168 Regularizado</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Avaliação Mercadológica em Toledo</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Acompanhamento em Cartórios e Bancos</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Divulgação Estratégica em Redes</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/5545998100534?text=Ol%C3%A1%20Ingrid!%20Gostaria%20de%20conversar%20sobre%20meu%20pr%C3%B3ximo%20im%C3%B3vel."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar Direto no WhatsApp
                </a>

                <a
                  href="https://www.instagram.com/ingridbossa_corretora/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-5 py-4 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                >
                  <Instagram className="w-5 h-5" />
                  Seguir no Instagram
                </a>
              </div>
            </div>

            {/* Coluna Card Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-br from-stone-900 via-[#1c1917] to-stone-950 p-8 sm:p-10 text-white border border-rosebronze-400/25">
                <div className="absolute top-0 right-0 w-48 h-48 bg-rosebronze-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-rosebronze-400 via-champagne-300 to-white p-1 mb-5 shadow-2xl">
                    <div className="w-full h-full rounded-[1.35rem] bg-stone-900 flex items-center justify-center">
                      <span className="font-serif-luxury text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-champagne-300 via-rosebronze-200 to-white">
                        IB
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-1">Ingrid Bossa</h3>
                  <p className="text-rosebronze-400 font-semibold text-sm mb-5">Corretora de Imóveis • CRECI F-58168</p>
                  
                  <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 backdrop-blur-md border border-white/10">
                    <p className="text-[11px] text-stone-400 uppercase tracking-widest mb-1 font-bold">Praça de Atuação</p>
                    <p className="text-sm font-bold text-white">Toledo & Região Oeste do Paraná</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full text-left text-xs mb-6">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <span className="text-stone-400 block mb-0.5">Telefone / Whats</span>
                      <strong className="text-white text-sm">(45) 99810-0534</strong>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <span className="text-stone-400 block mb-0.5">Instagram</span>
                      <strong className="text-white text-sm">@ingridbossa_corretora</strong>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/5545998100534"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Solicitar Atendimento Exclusivo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Banner de Conversão Final */}
      <section className="py-20 bg-gradient-to-r from-stone-950 via-stone-900 to-[#141211] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c58569_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
            Quer Comprar, Vender ou Avaliar seu Imóvel em Toledo?
          </h2>
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto mb-10">
            Fale agora mesmo com Ingrid Bossa e tenha a consultoria mais acolhedora e eficiente da região.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/5545998100534?text=Ol%C3%A1%20Ingrid!%20Gostaria%20de%20uma%20avalia%C3%A7%C3%A3o%20do%20meu%20im%C3%B3vel."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-extrabold text-base shadow-xl hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chamar no WhatsApp: (45) 99810-0534
            </a>

            <a
              href="https://www.instagram.com/ingridbossa_corretora/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-95 text-white font-extrabold text-base shadow-xl hover:scale-105 transition-all"
            >
              <Instagram className="w-5 h-5" />
              Siga no Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Floating Action Button (WhatsApp + Instagram) */}
      <WhatsAppCTA />
    </>
  );
}
