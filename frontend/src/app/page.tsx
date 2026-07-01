import KCubePage from '@/components/KCubePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return <KCubePage pageKey="home" />;
}
