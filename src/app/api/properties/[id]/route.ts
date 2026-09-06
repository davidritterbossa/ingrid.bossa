import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fromSupabase, toSupabase, SupabaseProperty } from '@/lib/supabaseMapper';

export const dynamic = 'force-dynamic';

// GET: Busca um imóvel pelo ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }

    return NextResponse.json({ success: true, data: fromSupabase(data as SupabaseProperty) });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// PATCH: Atualiza dados de um imóvel (status, destaque, campos gerais)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Converte campos em português para o schema do Supabase
    const payload = toSupabase(body);

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nenhum campo válido para atualizar.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('properties')
      .update(payload)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar imóvel no Supabase:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: fromSupabase(data as SupabaseProperty),
    });
  } catch (err: any) {
    console.error('Erro na rota PATCH /api/properties/[id]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// DELETE: Remove um imóvel pelo ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erro ao excluir imóvel no Supabase:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Imóvel excluído com sucesso.' });
  } catch (err: any) {
    console.error('Erro na rota DELETE /api/properties/[id]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
