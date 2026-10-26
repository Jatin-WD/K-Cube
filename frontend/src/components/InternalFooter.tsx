"use client";

import { contact } from '@/lib/contact';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppStore, type Language } from '@/store/useAppStore';
import { repairMojibakeTree } from '@/lib/repairMojibake';

const footerCopy: Record<Language, Record<string, string>> = {
  en: {
    line: 'A points-first Korean culture, learning, shopping, events, and rewards ecosystem.',
    platform: 'Platform',
    support: 'Support',
    commerce: 'Commerce',
    rights: 'Designed for K-CUBE.store with an internal rewards-based shop experience.',
    activities: 'Activities',
    learning: 'Korean Learning',
    kfood: 'K-Food',
    shop: 'Shop',
    rewards: 'Rewards',
    events: 'Events',
    about: 'About',
    contact: 'Contact',
    manpower: 'Manpower',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    trip: 'Trip to Korea',
  },
  ko: {
    line: '포인트 중심의 한국 문화, 학습, 쇼핑, 이벤트, 리워드 생태계입니다.',
    platform: '플랫폼',
    support: '지원',
    commerce: '커머스',
    rights: 'K-CUBE.store 내부 리워드 기반 쇼핑 경험을 위해 설계되었습니다.',
    activities: '활동',
    learning: '한국어 학습',
    kfood: 'K-Food',
    shop: 'Shop',
    rewards: '리워드',
    events: '이벤트',
    about: '소개',
    contact: '문의',
    manpower: '인력 지원',
    signIn: '로그인',
    signUp: '회원가입',
    trip: '한국 여행',
  },
  hi: {
    line: 'Points-first Korean culture, learning, shopping, events aur rewards ecosystem.',
    platform: 'Platform',
    support: 'Support',
    commerce: 'Commerce',
    rights: 'K-CUBE.store ke internal rewards-based shop experience ke liye design kiya gaya hai.',
    activities: 'Activities',
    learning: 'Korean Learning',
    kfood: 'K-Food',
    shop: 'Shop',
    rewards: 'Rewards',
    events: 'Events',
    about: 'About',
    contact: 'Contact',
    manpower: 'Manpower',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    trip: 'Trip to Korea',
  },
};

const repairedFooterCopy = repairMojibakeTree(footerCopy);

const InternalFooter = () => {
  const language = useAppStore((state) => state.language);
  const pathname = usePathname();
  const t = repairedFooterCopy[language];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="culture-footer px-5 lg:px-10">
      <div className="mx-auto grid kc-content grid-cols-2 gap-x-10 gap-y-7 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" aria-label="K-CUBE home" className="inline-flex items-center gap-4">
            <Image src="/assets/k-cube-logo.png" alt="K-CUBE" width={1316} height={1195} sizes="80px" className="h-14 w-auto object-contain" />
            <span><span className="block text-2xl font-black tracking-tight">K-CUBE</span><span className="mt-1 block text-xs font-medium footer-tagline">Your little world of Korea.</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 footer-description">{t.line}</p>
          <address className="mt-4 flex flex-col items-start gap-2 text-sm not-italic">
            <a href={contact.phoneHref} className="footer-contact inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"><Phone size={15} aria-hidden="true" />{contact.phone}</a>
            <a href={`mailto:${contact.email}`} className="footer-contact inline-flex items-center gap-2 break-all font-semibold underline-offset-4 hover:underline"><Mail size={15} aria-hidden="true" />{contact.email}</a>
          </address>
        </div>
        <div className="footer-links">
          <p className="text-xs font-bold uppercase tracking-[0.18em] footer-heading">{t.platform}</p>
          <Link href="/activities" className="block text-sm hover:text-white">{t.activities}</Link>
          <Link href="/learning" className="block text-sm hover:text-white">{t.learning}</Link>
          <Link href="/kfood" className="block text-sm hover:text-white">{t.kfood}</Link>
          <Link href="/shop" className="block text-sm hover:text-white">{t.shop}</Link>
          <Link href="/rewards" className="block text-sm hover:text-white">{t.rewards}</Link>
        </div>
        <div className="footer-links">
          <p className="text-xs font-bold uppercase tracking-[0.18em] footer-heading">{t.support}</p>
          <Link href="/events" className="block text-sm hover:text-white">{t.events}</Link>
          <Link href="/about" className="block text-sm hover:text-white">{t.about}</Link>
          <Link href="/contact" className="block text-sm hover:text-white">{t.contact}</Link>
          <Link href="/apply-for-manpower" className="block text-sm hover:text-white">{t.manpower}</Link>
        </div>
        <div className="footer-links">
          <p className="text-xs font-bold uppercase tracking-[0.18em] footer-heading">{t.commerce}</p>
          <Link href="/shop" className="block text-sm hover:text-white">{t.shop}</Link>
          <Link href="/shop?category=beauty" className="block text-sm hover:text-white">{language === 'ko' ? '코스메틱' : 'Cosmetics'}</Link>
          <Link href="/signin" className="block text-sm hover:text-white">{t.signIn}</Link>
          <Link href="/signup" className="block text-sm hover:text-white">{t.signUp}</Link>
          <Link href="/trip-to-korea" className="block text-sm hover:text-white">{t.trip}</Link>
        </div>
      </div>
      <div className="mx-auto mt-8 kc-content border-t border-white/15 pt-5 text-xs footer-legal">
        © 2026 K-CUBE. {t.rights}
      </div>
    </footer>
  );
};

export default InternalFooter;
