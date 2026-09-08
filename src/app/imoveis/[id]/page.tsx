import PropertyClientPage from './PropertyClientPage';
import { Property } from '@/types/property';
import { MOCK_PROPERTIES } from '@/lib/mock';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { fromSupabase, SupabaseProperty } from '@/lib/supabaseMapper';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60;

async function getProperty(id: string): Promise<Property | null> {
  const fallback = MOCK_PROPERTIES.find(p => String(p.id) === String(id) || String(p.codigo) === String(id)) || null;

  if (!isSupabaseConfigured) {
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return fromSupabase(data as SupabaseProperty);
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const initialProperty = await getProperty(params.id);

  return (
    <PropertyClientPage
      initialProperty={initialProperty}
      id={params.id}
    />
  );
}
