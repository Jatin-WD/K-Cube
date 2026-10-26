import { notFound } from 'next/navigation';
import ShopCatalogProductPage from '@/components/ShopCatalogProductPage';
import type { ShopProduct } from '@/lib/shopCatalog';
import { shopServerBase } from '@/lib/shopServer';
import { fetchLiveShopProduct, fetchLiveShopProducts } from '@/lib/shopApi';

export const dynamic = 'force-dynamic';

const resolveProduct = async (slug: string): Promise<ShopProduct | null> => {
  return fetchLiveShopProduct(slug, await shopServerBase());
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

  const related = (await fetchLiveShopProducts(await shopServerBase())).filter((item) => item.id !== product.id && item.categoryKey === product.categoryKey).slice(0, 4);
  return <ShopCatalogProductPage product={product} relatedProducts={related} />;
};

export default ShopProductRoute;
