"use client";

import Link from 'next/link';
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
  const t = footerCopy[language];

  return (
    <footer className="border-t border-white/10 bg-[#09090a] px-5 py-12 text-[#aab5c6] lg:px-10">
      <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-black text-white">K-CUBE</p>
          <p className="mt-3 max-w-sm text-sm leading-7">{t.line}</p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffc400]">{t.platform}</p>
          <Link href="/activities" className="block text-sm hover:text-white">{t.activities}</Link>
          <Link href="/learning" className="block text-sm hover:text-white">{t.learning}</Link>
          <Link href="/kfood" className="block text-sm hover:text-white">{t.kfood}</Link>
          <Link href="/shop" className="block text-sm hover:text-white">{t.shop}</Link>
          <Link href="/rewards" className="block text-sm hover:text-white">{t.rewards}</Link>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffc400]">{t.support}</p>
          <Link href="/events" className="block text-sm hover:text-white">{t.events}</Link>
          <Link href="/about" className="block text-sm hover:text-white">{t.about}</Link>
          <Link href="/about#contact" className="block text-sm hover:text-white">{t.contact}</Link>
          <Link href="/apply-for-manpower" className="block text-sm hover:text-white">{t.manpower}</Link>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffc400]">{t.commerce}</p>
          <Link href="/shop" className="block text-sm hover:text-white">{t.shop}</Link>
          <Link href="/signin" className="block text-sm hover:text-white">{t.signIn}</Link>
          <Link href="/signup" className="block text-sm hover:text-white">{t.signUp}</Link>
          <Link href="/trip-to-korea" className="block text-sm hover:text-white">{t.trip}</Link>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1480px] border-t border-white/10 pt-6 text-sm text-[#778295]">
        © 2026 K-CUBE. {t.rights}
      </div>
    </footer>
  );
};

export default InternalFooter;
