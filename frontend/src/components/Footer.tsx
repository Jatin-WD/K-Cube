"use client";

import Link from 'next/link';
import { useAppStore, type Language } from '@/store/useAppStore';

const footerCopy: Record<Language, Record<string, string>> = {
  en: {
    line: 'A points-first Korean culture, learning, K-Food, events, and rewards ecosystem.',
    platform: 'Platform',
    support: 'Support',
    commerce: 'Commerce',
    rights: 'Designed for K-CUBE.store and the K-Food.in commerce bridge.',
    activities: 'Activities',
    learning: 'Korean Learning',
    kfood: 'K-Food',
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
    line: '포인트 중심의 한국 문화, 학습, K-Food, 이벤트, 리워드 생태계.',
    platform: '플랫폼',
    support: '지원',
    commerce: '커머스',
    rights: 'K-CUBE.store와 K-Food.in 커머스 연결을 위해 설계되었습니다.',
    activities: '활동',
    learning: '한국어 학습',
    kfood: 'K-푸드',
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
    line: 'पॉइंट्स-केंद्रित कोरियाई संस्कृति, सीखने, के-फूड, इवेंट्स और पुरस्कारों का इकोसिस्टम।',
    platform: 'प्लेटफ़ॉर्म',
    support: 'सहायता',
    commerce: 'कॉमर्स',
    rights: 'K-CUBE.store और K-Food.in कॉमर्स कनेक्शन के लिए डिज़ाइन किया गया।',
    activities: 'गतिविधियाँ',
    learning: 'कोरियाई भाषा सीखना',
    kfood: 'के-फूड',
    rewards: 'पुरस्कार',
    events: 'इवेंट्स',
    about: 'हमारे बारे में',
    contact: 'संपर्क',
    manpower: 'मैनपावर',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    trip: 'कोरिया यात्रा',
  },
};

const Footer = () => {
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
          <a href="https://www.k-food.in" target="_blank" rel="noreferrer" className="block text-sm hover:text-white">K-Food.in</a>
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

export default Footer;
