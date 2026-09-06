import PropertyClientPage from './PropertyClientPage';
import { Property } from '@/types/property';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || 'http://localhost:3000';
    const res = await fetch(`${siteUrl}/api/properties/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
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
