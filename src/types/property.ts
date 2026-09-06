export type TipoNegocio = 'venda' | 'locacao';

export type CategoriaImovel = 'casa' | 'apartamento' | 'terreno' | 'sobrado' | 'comercial' | 'rural' | string;

export type StatusImovel = 'disponivel' | 'negociacao' | 'vendido' | 'oculto';

export const STATUS_IMOVEL_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  disponivel: {
    label: 'Disponível',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  negociacao: {
    label: 'Em Negociação',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  vendido: {
    label: 'Vendido',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
  oculto: {
    label: 'Oculto (Rascunho)',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-300',
    dot: 'bg-stone-500',
  },
};

export interface Property {
  id: string;
  codigo?: string;
  titulo: string;
  descricao: string;
  tipo: TipoNegocio;
  categoria: string;
  preco: number;
  rua: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  areaTotal: number | null;
  areaUtil: number | null;
  imagens: string[];
  comodidades: string[];
  status: StatusImovel;
  destaque: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  tipo?: TipoNegocio;
  categoria?: CategoriaImovel;
  bairro?: string;
}

export const BAIRROS_TOLEDO = [
  'Centro',
  'Jardim Coopagro',
  'Loteamento Brisa do Lago',
  'Cristo Rei',
  'Jardim La Salle',
  'Jardim Santa Maria',
  'Jardim Europa',
  'Vila Industrial',
  'Jardim Pancera',
  'Tocantins',
  'Jardim Gisela',
  'Jardim Porto Alegre',
  'Vila Becker',
  'Vila Pioneiro',
  'Jardim Bressan',
  'Jardim Concordia',
  'Vila Boa Esperança'
];

export const CATEGORIAS: Record<string, string> = {
  casa: 'Casa',
  sobrado: 'Sobrado',
  apartamento: 'Apartamento',
  terreno: 'Terreno / Lote',
  comercial: 'Comercial',
  rural: 'Chácara / Rural',
};
