import { notFound } from 'next/navigation';
import DetailPage from '@/components/DetailPage';
import { detailItems, findDetail } from '@/lib/kcubeContent';

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const item = findDetail('learning', resolvedParams.slug);
  return { title: item ? `${item.title.en} | K-CUBE Korean Learning` : 'K-CUBE Korean Learning' };
};

const LearningDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const item = findDetail('learning', resolvedParams.slug);
  if (!item) notFound();
  return <DetailPage item={item} />;
};

export default LearningDetailPage;
