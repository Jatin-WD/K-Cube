import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import './home-refinements.css';
import './responsive-layout.css';
import Providers from '@/components/Providers';
import Header from '@/components/header/Header';
import InternalFooter from '@/components/InternalFooter';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://k-cube.store'),
  title: 'K-CUBE - Korean Culture Points Ecosystem',
  description: 'Korean activities, language learning, K-Food discovery, events, rewards, and Korea trip progression.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-transparent text-[var(--kc-text)]">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-1px)]">{children}</main>
          <InternalFooter />
        </Providers>
      </body>
    </html>
  );
}
