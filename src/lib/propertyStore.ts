import { Property, StatusImovel } from '@/types/property';
import { MOCK_PROPERTIES } from './mock';

const STORAGE_KEY = 'ingrid_bossa_properties_v1';
const EVENT_NAME = 'ingrid_properties_updated';

// Função para obter todos os imóveis (do localStorage ou MOCK)
export function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') {
    return MOCK_PROPERTIES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Inicializa o localStorage com os dados padrão
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROPERTIES));
      return MOCK_PROPERTIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return MOCK_PROPERTIES;
  } catch (err) {
    console.error('Erro ao ler imóveis do localStorage:', err);
    return MOCK_PROPERTIES;
  }
}

// Salva lista no localStorage e emite evento para atualizar a UI
export function saveProperties(properties: Property[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { properties } }));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

// Busca imóvel por ID
export function getStoredPropertyById(id: string): Property | null {
  const list = getStoredProperties();
  return list.find((p) => String(p.id) === String(id)) || null;
}

// Atualiza dados de um imóvel
export function updateStoredProperty(id: string, updates: Partial<Property>): Property | null {
  const list = getStoredProperties();
  const index = list.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return null;

  const updated: Property = {
    ...list[index],
    ...updates,
    updatedAt: new Date(),
  };

  list[index] = updated;
  saveProperties(list);
  return updated;
}

// Atualiza especificamente as fotos de um imóvel
export function updatePropertyImages(id: string, images: string[]): Property | null {
  return updateStoredProperty(id, { imagens: images });
}

// Atualiza status do imóvel
export function updatePropertyStatus(id: string, status: StatusImovel): Property | null {
  return updateStoredProperty(id, { status });
}

// Exclui um imóvel
export function deleteStoredProperty(id: string): boolean {
  const list = getStoredProperties();
  const filtered = list.filter((p) => String(p.id) !== String(id));
  if (filtered.length === list.length) return false;
  saveProperties(filtered);
  return true;
}

// Insere um novo imóvel
export function addStoredProperty(
  data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>
): Property {
  const list = getStoredProperties();
  const newId = 'ib-' + String(Date.now());
  const newProperty: Property = {
    ...data,
    id: newId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  list.unshift(newProperty);
  saveProperties(list);
  return newProperty;
}

// Restaura os imóveis padrão
export function resetPropertiesToDefault(): Property[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROPERTIES));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { properties: MOCK_PROPERTIES } }));
  }
  return MOCK_PROPERTIES;
}

// Ouvinte de atualizações
export function subscribeProperties(callback: (properties: Property[]) => void) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ properties: Property[] }>;
    if (customEvent.detail?.properties) {
      callback(customEvent.detail.properties);
    } else {
      callback(getStoredProperties());
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
