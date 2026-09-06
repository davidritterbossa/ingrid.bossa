'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Instagram, MessageCircle, ShieldCheck, LogOut, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === '/';
  const isSolid = isScrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Imóveis', href: '/imoveis' },
    { name: 'Sobre Ingrid', href: '/#sobre' },
    { name: 'Contato', href: '/#contato' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
        isSolid
          ? 'bg-[#faf8f5]/90 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] py-3 md:py-4 border-b border-stone-200/60'
          : 'bg-transparent py-5 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Ingrid Bossa */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#292524] via-[#1c1917] to-[#0c0a09] border border-rosebronze-400/40 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
            <span className="font-serif-luxury text-xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-champagne-300 via-rosebronze-200 to-white tracking-tight">
              IB
            </span>
          </div>
          <div className="flex flex-col">
            <span className={`text-xl sm:text-2xl font-extrabold tracking-tight leading-none transition-colors ${
              isSolid ? 'text-stone-900' : 'text-white drop-shadow-md'
            }`}>
              Ingrid Bossa
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-semibold text-rosebronze-600 dark:text-rosebronze-400 uppercase tracking-wider flex items-center gap-1">
                Corretora de Imóveis
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                isSolid ? 'bg-stone-200/70 text-stone-700' : 'bg-white/20 text-white/95 backdrop-blur-sm'
              }`}>
                CRECI F-58168
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition-all relative py-1 group/link ${
                isSolid ? 'text-stone-700 hover:text-rosebronze-700' : 'text-white/90 drop-shadow hover:text-white'
              }`}
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-rosebronze-500 group-hover/link:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions (WhatsApp, Instagram, Painel) */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-900 text-champagne-300 border border-rosebronze-500/30 shadow-sm hover:scale-105 transition-all"
                title="Acessar Painel da Corretora"
              >
                <ShieldCheck className="w-4 h-4 text-rosebronze-400" />
                <span>Painel</span>
              </Link>
              <button
                onClick={() => logout()}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  isSolid ? 'text-stone-500 hover:text-rose-600 hover:bg-stone-100' : 'text-white/70 hover:text-rose-300 hover:bg-white/10'
                }`}
                title="Sair da Área da Corretora"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/ingridbossa_corretora/"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram: @ingridbossa_corretora"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-95 text-white shadow-sm hover:shadow-md hover:scale-105"
          >
            <Instagram className="w-4 h-4" />
            <span className="hidden xl:inline">@ingridbossa_corretora</span>
          </a>

          {/* WhatsApp Direct CTA Button */}
          <a
            href="https://wa.me/5545998100534?text=Ol%C3%A1%20Ingrid!%20Vim%20pelo%20site%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20im%C3%B3veis%20em%20Toledo."
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp: (45) 99810-0534"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-[#25D366] hover:bg-[#20bd5c] text-white shadow-md hover:shadow-lg hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>(45) 99810-0534</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated && (
            <Link
              href="/admin"
              className="p-2 rounded-lg bg-stone-900 text-champagne-300 border border-rosebronze-400/40"
              title="Painel Corretora"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
          )}

          <a
            href="https://wa.me/5545998100534?text=Ol%C3%A1%20Ingrid!%20Vim%20pelo%20site%20e%20gostaria%20de%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-[#25D366] text-white sm:hidden"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <button
            className={`p-2 rounded-xl transition-colors ${
              isSolid ? 'text-stone-900 hover:bg-stone-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-[#141211]/95 backdrop-blur-2xl z-[60] transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } lg:hidden flex flex-col justify-between p-6`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#292524] to-[#0c0a09] border border-rosebronze-400/40 flex items-center justify-center">
                <span className="font-serif-luxury text-lg font-bold text-champagne-300">IB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-none">Ingrid Bossa</span>
                <span className="text-xs text-rosebronze-400 mt-1">CRECI F-58168 • Toledo/PR</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white p-2 rounded-xl hover:bg-white/10"
              aria-label="Fechar menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-bold text-stone-200 hover:text-rosebronze-400 transition-colors py-2.5 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-bold text-champagne-300 py-2.5 flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-rosebronze-400" />
                <span>Painel da Corretora</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-stone-400 hover:text-white py-2 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Área Restrita</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Drawer Social Actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-stone-800">
          <p className="text-xs text-center text-stone-400 mb-1 uppercase tracking-wider">
            Fale diretamente com Ingrid Bossa
          </p>

          <a
            href="https://wa.me/5545998100534?text=Ol%C3%A1%20Ingrid!%20Vim%20pelo%20site%20e%20gostaria%20de%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-white font-bold text-sm shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Conversar no WhatsApp
          </a>

          <a
            href="https://www.instagram.com/ingridbossa_corretora/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] text-white font-bold text-sm shadow-md"
          >
            <Instagram className="w-5 h-5" />
            @ingridbossa_corretora
          </a>
        </div>
      </div>
    </header>
  );
}
