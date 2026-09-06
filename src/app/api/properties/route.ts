import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { fromSupabase, SupabaseProperty } from '@/lib/supabaseMapper';
import { MOCK_PROPERTIES } from '@/lib/mock';

export const dynamic = 'force-dynamic';

// GET: Listagem de imóveis do Supabase (com fallback resiliente para mock)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const type = searchParams.get('type');

  try {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'todos') {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase offline ou tabela inexistente, servindo catálogo local de Toledo:', error.message);
      let mockData = [...MOCK_PROPERTIES];
      if (status && status !== 'todos') mockData = mockData.filter(p => p.status === status);
      if (category) mockData = mockData.filter(p => (p.categoria || '').toLowerCase() === category.toLowerCase());
      if (type) mockData = mockData.filter(p => (p.tipo || '').toLowerCase() === type.toLowerCase());
      return NextResponse.json({ success: true, data: mockData, isFallback: true }, { status: 200 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, data: MOCK_PROPERTIES, isFallback: true }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: data.map((row) => fromSupabase(row as SupabaseProperty)) }, { status: 200 });
  } catch (err: any) {
    console.warn('Exceção no GET /api/properties, usando fallback local:', err);
    let mockData = [...MOCK_PROPERTIES];
    if (status && status !== 'todos') mockData = mockData.filter(p => p.status === status);
    if (category) mockData = mockData.filter(p => (p.categoria || '').toLowerCase() === category.toLowerCase());
    if (type) mockData = mockData.filter(p => (p.tipo || '').toLowerCase() === type.toLowerCase());
    return NextResponse.json({ success: true, data: mockData, isFallback: true }, { status: 200 });
  }
}

// POST: Upload de imagens no Cloudinary + Cadastro no Supabase
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 1. Extração dos campos de texto e números
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const category = (formData.get('category') as string) || 'casa';
    const type = (formData.get('type') as string) || 'venda';
    const neighborhood = (formData.get('neighborhood') as string) || 'Centro';
    const street = (formData.get('street') as string) || null;
    const city = (formData.get('city') as string) || 'Toledo';
    const state = (formData.get('state') as string) || 'PR';
    const price = parseFloat((formData.get('price') as string) || '0');
    const bedrooms = parseInt((formData.get('bedrooms') as string) || '0', 10);
    const bathrooms = parseInt((formData.get('bathrooms') as string) || '0', 10);
    const parkingSpaces = parseInt((formData.get('parking_spaces') as string) || '0', 10);
    
    let totalArea = null;
    if (formData.has('total_area')) {
      const parsed = parseFloat(formData.get('total_area') as string);
      if (!isNaN(parsed)) totalArea = parsed;
    }
    
    let usefulArea = null;
    if (formData.has('useful_area')) {
      const parsed = parseFloat(formData.get('useful_area') as string);
      if (!isNaN(parsed)) usefulArea = parsed;
    }

    const status = (formData.get('status') as string) || 'disponivel';
    const featured = formData.get('featured') === 'true';

    let amenities: string[] = [];
    if (formData.has('amenities')) {
      try {
        amenities = JSON.parse(formData.get('amenities') as string);
      } catch (e) {
        // ignore parse errors
      }
    }

    // Validação básica de campos obrigatórios
    if (!title || isNaN(price)) {
      return NextResponse.json(
        { success: false, error: 'Título e Preço são campos obrigatórios.' },
        { status: 400 }
      );
    }

    // 2. Processamento e Upload das Imagens para o Cloudinary
    const imageFiles = formData.getAll('images') as (File | string)[];
    const uploadedUrls: string[] = [];

    const uploadPromises = imageFiles.map(async (item) => {
      if (typeof item === 'string') {
        // Se já for uma URL (ex: link externo ou foto já existente)
        if (item.trim().startsWith('http')) {
          return item.trim();
        }
        return null;
      } else if (item && typeof item === 'object' && 'arrayBuffer' in item && item.size > 0) {
        // Arquivo enviado via FormData -> Converte em Buffer e sobe para Cloudinary
        const arrayBuffer = await item.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const secureUrl = await uploadImageToCloudinary(buffer, 'imoveis-ingrid-bossa');
        return secureUrl;
      }
      return null;
    });

    const results = await Promise.all(uploadPromises);
    results.forEach((url) => {
      if (url) uploadedUrls.push(url);
    });

    // 3. Inserção dos dados no Supabase (PostgreSQL)
    const propertyPayload: any = {
      title,
      description,
      category,
      type,
      street,
      neighborhood,
      city,
      state,
      price,
      bedrooms,
      bathrooms,
      parking_spaces: parkingSpaces,
      total_area: totalArea,
      useful_area: usefulArea,
      images: uploadedUrls,
      amenities,
      status,
      featured,
    };

    const code = formData.get('code') as string;
    if (code) {
      propertyPayload.code = code;
    }
    const { data: newProperty, error: dbError } = await supabase
      .from('properties')
      .insert([propertyPayload])
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar no Supabase:', dbError);
      return NextResponse.json(
        { success: false, error: `Erro no banco de dados: ${dbError.message}` },
        { status: 500 }
      );
    }

    // 4. Retorno de Sucesso
    return NextResponse.json(
      {
        success: true,
        message: 'Imóvel e fotos cadastrados com sucesso!',
        data: fromSupabase(newProperty as SupabaseProperty),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erro na rota /api/properties:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Ocorreu um erro ao processar o cadastro do imóvel.',
      },
      { status: 500 }
    );
  }
}
