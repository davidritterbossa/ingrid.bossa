import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Ingrid Bossa | Corretora de Imóveis • Toledo - PR (CRECI F-58168)',
  description: 'Encontre o imóvel dos seus sonhos em Toledo/PR com Ingrid Bossa, Corretora de Imóveis (CRECI F-58168). Consultoria especializada em casas, sobrados, apartamentos e terrenos.',
  keywords: ['Ingrid Bossa', 'Corretora Toledo PR', 'Imóveis em Toledo', 'CRECI F-58168', 'Comprar casa Toledo', 'Loteamento Brisa do Lago', 'Jardim Coopagro', 'Cristo Rei Toledo'],
  openGraph: {
    title: 'Ingrid Bossa | Corretora de Imóveis • Toledo - PR',
    description: 'Atendimento exclusivo e humanizado para compra, venda e investimentos imobiliários em Toledo e região.',
    url: 'https://ingridbossa.com.br',
    siteName: 'Ingrid Bossa Corretora de Imóveis',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen bg-[#faf8f5] text-stone-900 antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
