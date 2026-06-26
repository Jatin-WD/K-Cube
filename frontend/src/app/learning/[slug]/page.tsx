import { notFound } from 'next/navigation';
import LearningTrackPage from '@/components/LearningTrackPage';
import { findDetail } from '@/lib/kcubeContent';

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
  return <LearningTrackPage slug={resolvedParams.slug} />;
};

export default LearningDetailPage;
