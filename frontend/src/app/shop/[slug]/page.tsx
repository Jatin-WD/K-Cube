import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import ShopCatalogProductPage from '@/components/ShopCatalogProductPage';
import { findShopProduct, type ShopProduct } from '@/lib/shopCatalog';
import { fetchLiveShopProduct } from '@/lib/shopApi';

export const dynamic = 'force-dynamic';

const resolveRequestBaseUrl = async () => {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') || headerStore.get('host');
  const proto = headerStore.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http');

  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
};

const resolveProduct = async (slug: string): Promise<ShopProduct | null> => {
  const liveProduct = await fetchLiveShopProduct(slug, await resolveRequestBaseUrl());
  return liveProduct || findShopProduct(slug) || null;
};

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const product = await resolveProduct(resolvedParams.slug);
  return { title: product ? `${product.title.en} | K-CUBE Shop` : 'K-CUBE Shop' };
};

const ShopProductRoute = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const product = await resolveProduct(resolvedParams.slug);
  if (!product) notFound();

  return <ShopCatalogProductPage product={product} />;
};

export default ShopProductRoute;
