import ItaewonSubServicePage from '@/components/ItaewonSubServicePage';

export const metadata = {
  title: 'Information | ITAEWON World Music Spirit Festival 2026',
  description: 'Festival background, participation overview, and key information for the ITAEWON World Music Spirit Festival 2026.',
};

const secondaryLinks = [
  {
    label: 'Announcement',
    href: '/india-pre-selection/announcement',
    description: 'Read the official notices and updates before applying.',
  },
  {
    label: 'Apply',
    href: '/india-pre-selection/apply',
    description: 'Open the application page and send your details.',
  },
];

export default function InformationPage() {
  return (
    <ItaewonSubServicePage
      badge="Information"
      title="ITAEWON World Music Spirit 2026 - Information"
      description="This page explains the festival purpose, the India pre-selection path, and the most important details users should know before moving to announcements or application."
      highlights={[
        'Festival goal: remembrance, healing, unity, and shared humanity through music and culture.',
        'Official India pre-selection page is linked to the main festival journey in Seoul.',
        'Use this page as the starting point before reading announcements or submitting an application.',
        'The main festival path includes the India pre-selection, official rounds, and the October 2026 event.',
      ]}
      notes={[
        'If you only need the core event overview, stay on this page.',
        'If you need updated notices, move to the Announcement page next.',
      ]}
      primaryCta={{ label: 'Go to announcement', href: '/india-pre-selection/announcement' }}
      secondaryLinks={secondaryLinks}
    />
  );
}
