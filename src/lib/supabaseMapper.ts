/**
 * Mapeamento entre o schema do Supabase (snake_case inglês)
 * e o tipo Property do frontend (camelCase português).
 */
import { Property, TipoNegocio, CategoriaImovel, StatusImovel } from '@/types/property';

// Representa uma linha bruta retornada pelo Supabase
export interface SupabaseProperty {
  id: string;
  code?: string | null;
  title: string;
  description: string;
  type: string;
  category: string;
  price: number;
  street?: string | null;
  neighborhood: string;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  total_area?: number | null;
  useful_area?: number | null;
  images?: string[];
  amenities?: string[];
  status: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Converte linha do Supabase para o tipo Property usado no frontend */
export function fromSupabase(row: SupabaseProperty): Property {
  return {
    id: row.id,
    codigo: row.code || undefined,
    titulo: row.title,
    descricao: row.description,
    tipo: row.type as TipoNegocio,
    categoria: row.category as CategoriaImovel,
    preco: row.price,
    rua: row.street ?? null,
    bairro: row.neighborhood,
    cidade: row.city ?? 'Toledo',
    estado: row.state ?? 'PR',
    quartos: row.bedrooms ?? 0,
    banheiros: row.bathrooms ?? 0,
    vagas: row.parking_spaces ?? 0,
    areaTotal: row.total_area ?? null,
    areaUtil: row.useful_area ?? null,
    imagens: row.images ?? [],
    comodidades: row.amenities ?? [],
    status: row.status as StatusImovel,
    destaque: row.featured ?? false,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/** Converte um Property parcial para o payload do Supabase */
export function toSupabase(property: Partial<Property>): Partial<SupabaseProperty> {
  const payload: Partial<SupabaseProperty> = {};

  if (property.codigo !== undefined) payload.code = property.codigo || null;
  if (property.titulo !== undefined) payload.title = property.titulo;
  if (property.descricao !== undefined) payload.description = property.descricao;
  if (property.tipo !== undefined) payload.type = property.tipo;
  if (property.categoria !== undefined) payload.category = property.categoria;
  if (property.preco !== undefined) payload.price = property.preco;
  if (property.rua !== undefined) payload.street = property.rua;
  if (property.bairro !== undefined) payload.neighborhood = property.bairro;
  if (property.cidade !== undefined) payload.city = property.cidade;
  if (property.estado !== undefined) payload.state = property.estado;
  if (property.quartos !== undefined) payload.bedrooms = property.quartos;
  if (property.banheiros !== undefined) payload.bathrooms = property.banheiros;
  if (property.vagas !== undefined) payload.parking_spaces = property.vagas;
  if (property.areaTotal !== undefined) payload.total_area = property.areaTotal;
  if (property.areaUtil !== undefined) payload.useful_area = property.areaUtil;
  if (property.imagens !== undefined) payload.images = property.imagens;
  if (property.comodidades !== undefined) payload.amenities = property.comodidades;
  if (property.status !== undefined) payload.status = property.status;
  if (property.destaque !== undefined) payload.featured = property.destaque;

  return payload;
}
