import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/header/Header';
import InternalFooter from '@/components/InternalFooter';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'K-CUBE - Korean Culture Points Ecosystem',
  description: 'Korean activities, language learning, K-Food discovery, events, rewards, and Korea trip progression.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-transparent text-white">
        <Providers>
          <Header />
          <main>{children}</main>
          <InternalFooter />
        </Providers>
      </body>
    </html>
  );
}
