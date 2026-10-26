import CultureHome from '@/components/home/CultureHome';
import { fetchShopCatalog } from '@/lib/shopApi';
import { shopServerBase } from '@/lib/shopServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const products = await fetchShopCatalog(await shopServerBase());
  return <CultureHome initialProducts={products} />;
}
