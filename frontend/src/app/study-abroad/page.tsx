import KCubePage from '@/components/KCubePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Study Abroad | K-CUBE',
  description: 'Study abroad guidance, partner college workflows, visa support, and intake tracking for K-CUBE.',
};

const StudyAbroadPage = () => {
  return <KCubePage pageKey="studyAbroad" />;
};

export default StudyAbroadPage;
