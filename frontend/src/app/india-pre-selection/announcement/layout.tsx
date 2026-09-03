import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Announcements | ITAEWON World Music Spirit Festival 2026 | K-CUBE',
  description: 'Official live notices, selection status, participant instructions and important dates for the K-CUBE India Pre-Selection.',
};

export default function AnnouncementLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
