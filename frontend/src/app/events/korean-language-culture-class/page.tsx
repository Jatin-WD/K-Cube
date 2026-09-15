import KoreanLanguageClassEvent from '@/components/KoreanLanguageClassEventClean';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Free Korean Language & Culture Class | K-CUBE',
  description: 'Join K-CUBE for a free four-week Korean language and culture class in Gurugram.',
  alternates: { canonical: '/events/korean-language-culture-class' },
  openGraph: {
    title: 'Free Korean Language & Culture Class | K-CUBE',
    description: 'Join K-CUBE for a free four-week Korean language and culture class in Gurugram.',
    type: 'website',
    url: '/events/korean-language-culture-class',
  },
};

export default function KoreanLanguageCultureClassPage() {
  return <KoreanLanguageClassEvent />;
}
