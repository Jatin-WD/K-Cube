"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore, type Language } from '@/store/useAppStore';

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

const InternalFooter = () => {
  const language = useAppStore((state) => state.language);
  const pathname = usePathname();
  const t = footerCopy[language];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-[#1d67c9] bg-[#062b63] px-5 py-10 text-[#d8e7f9] lg:px-10">
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-black text-[#0b4eae]">K</span>
            <div>
              <p className="text-xl font-black tracking-tight text-white">K-CUBE</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9fc4ef]">Korean Culture Ecosystem</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#c4d8ee]">{t.line}</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9fc4ef]">{t.platform}</p>
          <Link href="/activities" className="block text-sm hover:text-white">{t.activities}</Link>
          <Link href="/learning" className="block text-sm hover:text-white">{t.learning}</Link>
          <Link href="/kfood" className="block text-sm hover:text-white">{t.kfood}</Link>
          <Link href="/shop" className="block text-sm hover:text-white">{t.shop}</Link>
          <Link href="/rewards" className="block text-sm hover:text-white">{t.rewards}</Link>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9fc4ef]">{t.support}</p>
          <Link href="/events" className="block text-sm hover:text-white">{t.events}</Link>
          <Link href="/about" className="block text-sm hover:text-white">{t.about}</Link>
          <Link href="/about#contact" className="block text-sm hover:text-white">{t.contact}</Link>
          <Link href="/apply-for-manpower" className="block text-sm hover:text-white">{t.manpower}</Link>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9fc4ef]">{t.commerce}</p>
          <Link href="/shop" className="block text-sm hover:text-white">{t.shop}</Link>
          <Link href="/signin" className="block text-sm hover:text-white">{t.signIn}</Link>
          <Link href="/signup" className="block text-sm hover:text-white">{t.signUp}</Link>
          <Link href="/trip-to-korea" className="block text-sm hover:text-white">{t.trip}</Link>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[1320px] border-t border-white/15 pt-5 text-xs text-[#9fc4ef]">
        © 2026 K-CUBE. {t.rights}
      </div>
    </footer>
  );
};

export default InternalFooter;
