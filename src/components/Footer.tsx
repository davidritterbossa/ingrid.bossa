import Link from 'next/link';
import { Instagram, MapPin, Shield, MessageCircle, ArrowUpRight, Lock, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contato" className="bg-[#141211] text-stone-200 pt-20 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Coluna 1: Marca e Apresentação */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#292524] via-[#1c1917] to-[#0c0a09] border border-rosebronze-400/40 flex items-center justify-center shadow-md">
                <span className="font-serif-luxury text-xl font-bold text-champagne-300">IB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-none">
                  Ingrid Bossa
                </span>
                <span className="text-xs font-semibold text-rosebronze-400 uppercase tracking-wider mt-1">
                  Corretora de Imóveis
                </span>
              </div>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Consultoria imobiliária humanizada, segura e personalizada em Toledo e região Oeste do Paraná. O cuidado e a dedicação que sua família merece em cada negociação.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-stone-300">
              <Shield className="w-4 h-4 text-rosebronze-400" />
              CRECI F-58168
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-champagne-300">
              Navegação
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Início</span>
                </Link>
              </li>
              <li>
                <Link href="/imoveis" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Catálogo Completo</span>
                </Link>
              </li>
              <li>
                <Link href="/imoveis?categoria=casa" className="text-stone-400 hover:text-white transition-colors">
                  <span>Casas & Residências</span>
                </Link>
              </li>
              <li>
                <Link href="/imoveis?categoria=sobrado" className="text-stone-400 hover:text-white transition-colors">
                  <span>Sobrados Modernos</span>
                </Link>
              </li>
              <li>
                <Link href="/imoveis?categoria=terreno" className="text-stone-400 hover:text-white transition-colors">
                  <span>Terrenos & Lotes</span>
                </Link>
              </li>
              <li>
                <Link href="/#sobre" className="text-stone-400 hover:text-white transition-colors">
                  <span>Sobre Ingrid Bossa</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Regiões de Atuação */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-champagne-300">
              Toledo / PR
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="flex items-center gap-2">📍 Jardim Coopagro</li>
              <li className="flex items-center gap-2">📍 Loteamento Brisa do Lago</li>
              <li className="flex items-center gap-2">📍 Cristo Rei</li>
              <li className="flex items-center gap-2">📍 Jardim Santa Maria</li>
              <li className="flex items-center gap-2">📍 Jardim La Salle</li>
              <li className="flex items-center gap-2">📍 Centro & Região</li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Redes */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-champagne-300">
              Fale Diretamente
            </h3>
            
            <div className="flex flex-col gap-3">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/5545998100534?text=Ol%C3%A1%20Ingrid!%20Gostaria%20de%20um%20atendimento%20imobili%C3%A1rio."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-white font-semibold text-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-stone-400 leading-none">WhatsApp Oficial</span>
                  <span className="text-sm font-bold text-white mt-1">(45) 99810-0534</span>
                </div>
                <ArrowUpRight className="w-4 h-4 ml-auto text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Instagram Button */}
              <a
                href="https://www.instagram.com/ingridbossa_corretora/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#dc2743] flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-stone-400 leading-none">Instagram</span>
                  <span className="text-sm font-bold text-white mt-1">@ingridbossa_corretora</span>
                </div>
                <ArrowUpRight className="w-4 h-4 ml-auto text-rosebronze-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Ingrid Bossa • Corretora de Imóveis • CRECI F-58168. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Toledo, Paraná — Brasil</span>
            <span>•</span>
            <Link
              href="/login"
              className="text-stone-400 hover:text-champagne-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Área da Corretora</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
