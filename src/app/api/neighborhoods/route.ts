import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BAIRROS_TOLEDO } from '@/types/property';

export const dynamic = 'force-dynamic';

export async function GET() {
  const fallback = BAIRROS_TOLEDO.map(name => ({ name }));

  if (!isSupabaseConfigured) {
    return NextResponse.json({ success: true, data: fallback, isFallback: true });
  }

  try {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .order('name');
      
    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: true, data: fallback, isFallback: true });
    }
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: fallback, isFallback: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ success: false, error: 'Nome obrigatório' }, { status: 400 });

    const { data, error } = await supabase
      .from('neighborhoods')
      .insert([{ name }])
      .select()
      .single();
      
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
