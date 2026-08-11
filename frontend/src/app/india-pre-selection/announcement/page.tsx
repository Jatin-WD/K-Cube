import ItaewonSubServicePage from '@/components/ItaewonSubServicePage';

export const metadata = {
  title: 'Announcement | ITAEWON World Music Spirit Festival 2026',
  description: 'Official updates, notices, and reminders for the ITAEWON World Music Spirit Festival 2026.',
};

const secondaryLinks = [
  {
    label: 'Information',
    href: '/india-pre-selection/information',
    description: 'Review the festival overview and participation context.',
  },
  {
    label: 'Apply',
    href: '/india-pre-selection/apply',
    description: 'Submit your application after checking the latest notices.',
  },
];

export default function AnnouncementPage() {
  return (
    <ItaewonSubServicePage
      badge="Announcement"
      title="ITAEWON World Music Spirit 2026 - Announcement"
      description="Use this page for official notices, timeline reminders, and coordination updates that may affect applicants and visitors."
      highlights={[
        'Official notices should be checked before submitting any application.',
        'Important dates, stage details, or process updates can be posted here.',
        'This page acts as the public notice board for the sub-service flow.',
        'Always move back to Information if you need the full festival context.',
      ]}
      notes={[
        'When a new notice is published, link it from this page first.',
        'If a visitor is ready to apply, guide them directly to the Apply page.',
      ]}
      primaryCta={{ label: 'Open apply page', href: '/india-pre-selection/apply' }}
      secondaryLinks={secondaryLinks}
    />
  );
}
