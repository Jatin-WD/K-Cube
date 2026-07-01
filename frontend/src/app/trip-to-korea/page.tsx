import KCubePage from '@/components/KCubePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Trip to Korea | K-CUBE Grand Reward',
  description: 'K-CUBE Trip to Korea reward page for top verified point holders.',
};

const TripToKoreaPage = () => {
  return <KCubePage pageKey="trip" />;
};

export default TripToKoreaPage;
