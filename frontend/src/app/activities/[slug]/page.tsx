import { notFound } from 'next/navigation';
import DetailPage from '@/components/DetailPage';
import { findDetail } from '@/lib/kcubeContent';

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const item = findDetail('activities', resolvedParams.slug);
  return { title: item ? `${item.title.en} | K-CUBE Activities` : 'K-CUBE Activity' };
};

const ActivityDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const item = findDetail('activities', resolvedParams.slug);
  if (!item) notFound();
  return <DetailPage item={item} />;
};

export default ActivityDetailPage;
