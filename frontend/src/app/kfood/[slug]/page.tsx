import { notFound } from 'next/navigation';
import DetailPage from '@/components/DetailPage';
import { detailItems, findDetail } from '@/lib/kcubeContent';

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const item = findDetail('kfood', resolvedParams.slug);
  return { title: item ? `${item.title.en} | K-CUBE K-Food` : 'K-CUBE K-Food' };
};

const KFoodDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const item = findDetail('kfood', resolvedParams.slug);
  if (!item) notFound();
  return <DetailPage item={item} />;
};

export default KFoodDetailPage;
