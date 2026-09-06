'use client';

import { MessageCircle, Instagram } from 'lucide-react';

interface WhatsAppCTAProps {
  propertyTitle?: string;
  propertyId?: string;
  showBar?: boolean;
}

export default function WhatsAppCTA({ propertyTitle, propertyId, showBar = false }: WhatsAppCTAProps) {
  const phoneNumber = '5545998100534';
  
  let message = 'Olá Ingrid! Gostaria de mais informações sobre imóveis disponíveis em Toledo.';
  if (propertyTitle && propertyId) {
    message = `Olá Ingrid! Tenho interesse no imóvel: "${propertyTitle}" (Cód: ${propertyId}). Podemos conversar?`;
  }
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const instagramUrl = 'https://www.instagram.com/ingridbossa_corretora/';

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end gap-3.5">
        {/* Instagram Floating Button */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#dc2743] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="Instagram Ingrid Bossa"
        >
          <Instagram className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" />
          
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3.5 bg-stone-900/90 backdrop-blur-md text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap hidden sm:block">
            Siga @ingridbossa_corretora
          </span>
        </a>

        {/* WhatsApp Floating Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20bd5c] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="Falar no WhatsApp com Ingrid Bossa"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 w-full h-full bg-[#25D366] rounded-full opacity-60 animate-ping pointer-events-none" />
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 relative z-10" />
          
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3.5 bg-stone-900/90 backdrop-blur-md text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Fale com Ingrid no WhatsApp
          </span>
        </a>
      </div>

      {/* Sticky Bottom Bar on Mobile (when requested) */}
      {showBar && (
        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-stone-200 p-3.5 z-40 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.08)] flex gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 flex-1 bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] text-white font-bold rounded-xl text-sm"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      )}
    </>
  );
}
