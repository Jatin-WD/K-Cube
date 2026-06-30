import { notFound } from 'next/navigation';
import ShopCatalogProductPage from '@/components/ShopCatalogProductPage';
import { findShopProduct } from '@/lib/shopCatalog';

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const product = findShopProduct(resolvedParams.slug);
  return { title: product ? `${product.title.en} | K-CUBE Shop` : 'K-CUBE Shop' };
};

const ShopProductRoute = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const product = findShopProduct(resolvedParams.slug);
  if (!product) notFound();

  return <ShopCatalogProductPage product={product} />;
};

export default ShopProductRoute;
