import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Announcements | ITAEWON World Music Spirit Festival 2026 | K-CUBE',
  description: 'Archived 2026 festival notices and India participation history. The festival concluded on October 6, 2026; applications are closed.',
};

export default function AnnouncementLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
