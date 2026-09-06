import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const secureUrl = await uploadImageToCloudinary(buffer, 'imoveis-ingrid-bossa');
    
    return NextResponse.json({ success: true, url: secureUrl });
  } catch (error: any) {
    console.error('Erro no upload de arquivo:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro no upload' },
      { status: 500 }
    );
  }
}
