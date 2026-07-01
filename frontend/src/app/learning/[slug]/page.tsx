import KoreanLearningTrack from '@/components/KoreanLearningTrack';
import { getTrackBySlug } from '@/lib/koreanLearningBank';

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const track = getTrackBySlug(resolvedParams.slug);
  return { title: track ? `${track.title} | K-CUBE Korean Learning` : 'K-CUBE Korean Learning' };
};

const LearningDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  return <KoreanLearningTrack slug={resolvedParams.slug} />;
};

export default LearningDetailPage;
