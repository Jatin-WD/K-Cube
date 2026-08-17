import IndiaPreSelectionApplicationForm from '@/components/IndiaPreSelectionApplicationForm';
import ItaewonSubServicePage from '@/components/ItaewonSubServicePage';

export const metadata = {
  title: 'Apply | ITAEWON World Music Spirit Festival 2026',
  description: 'Internal application route for the ITAEWON World Music Spirit Festival 2026 India pre-selection.',
};

const secondaryLinks = [
  {
    label: 'Information',
    href: '/india-pre-selection/information',
    description: 'Read the festival overview before applying.',
  },
  {
    label: 'Announcement',
    href: '/india-pre-selection/announcement',
    description: 'Check the latest notices and updates.',
  },
];

export default function ApplyPage() {
  return (
    <ItaewonSubServicePage
      badge="Apply"
      title="ITAEWON World Music Spirit 2026 - Apply"
      description="This page lets you submit your India pre-selection application directly inside K-CUBE. No email workflow is needed."
      highlights={[
        'Submit the application form inside your K-CUBE account.',
        'Your first successful submission earns points automatically.',
        'You can update your saved application later if needed.',
        'Keep your performance details and video link ready before submitting.',
      ]}
      notes={[
        'The application is stored inside K-CUBE for internal review.',
        'Use the Information and Announcement pages if you need the latest festival context first.',
      ]}
      primaryCta={{ label: 'Jump to application', href: '#application' }}
      secondaryLinks={secondaryLinks}
      contact={{
        title: 'Internal review',
        body: 'Applications are stored inside K-CUBE and reviewed by the team from the backend. For official contact, use the dedicated mailbox and phone below.',
        email: 'kcubeadm@gmail.com',
        emailHref: 'mailto:kcubeadm@gmail.com',
        emailLabel: 'kcubeadm@gmail.com',
        phone: '9810097323',
        phoneHref: 'tel:+919810097323',
        phoneLabel: '9810097323',
        extra: 'If the team needs follow-up details, they can also contact you from the saved record.',
      }}
    >
      <IndiaPreSelectionApplicationForm />
    </ItaewonSubServicePage>
  );
}
