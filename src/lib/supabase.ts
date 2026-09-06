import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Supabase URL ou Anon Key não configuradas no ambiente.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
