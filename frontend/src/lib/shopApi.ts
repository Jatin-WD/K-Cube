import type { ShopProduct } from '@/lib/shopCatalog';

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
};

const trimSlash = (value: string) => value.replace(/\/+$/, '');

export const resolveShopApiBase = (baseUrl?: string) => {
  const configured = trimSlash(baseUrl || process.env.NEXT_PUBLIC_API_URL || '/api/v1');
  return configured || '/api/v1';
};

const fetchJson = async <T,>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;
    const body = (await response.json()) as ApiEnvelope<T> | T;
    if (body && typeof body === 'object' && 'data' in body) {
      return (body as ApiEnvelope<T>).data ?? null;
    }
    return body as T;
  } catch {
    return null;
  }
};

export const fetchLiveShopProducts = async (baseUrl?: string): Promise<ShopProduct[]> => {
  const apiBase = resolveShopApiBase(baseUrl);
  const products = await fetchJson<ShopProduct[]>(`${apiBase}/shop/products`);
  return Array.isArray(products) ? products : [];
};

export const fetchLiveShopProduct = async (slug: string, baseUrl?: string): Promise<ShopProduct | null> => {
  const apiBase = resolveShopApiBase(baseUrl);
  const product = await fetchJson<ShopProduct>(`${apiBase}/shop/products/${encodeURIComponent(slug)}`);
  return product || null;
};

