import ShopCatalogPage from '@/components/ShopCatalogPage';
import { fetchShopCatalog } from '@/lib/shopApi';
import { shopServerBase } from '@/lib/shopServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ShopRoutePage = async ({ searchParams }: { searchParams?: Promise<{ category?: string; store?: string }> }) => {
  const query = await searchParams;
  const category = query?.category === 'beauty' || query?.store === 'moa_beauty' ? 'beauty' : undefined;
  return <ShopCatalogPage category={category} products={await fetchShopCatalog(await shopServerBase())} />;
};

export default ShopRoutePage;
