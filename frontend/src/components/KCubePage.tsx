"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Coins, Plane, ShoppingBag, Star } from 'lucide-react';
import { actions, copy, pages, type PageKey } from '@/lib/kcubeContent';
import { shopProducts } from '@/lib/shopCatalog';
import { useAppStore } from '@/store/useAppStore';
import api from '@/lib/api';
import IndiaPreSelectionSection from './home/IndiaPreSelectionSection';

interface KCubePageProps {
  pageKey: PageKey;
  showActions?: boolean;
}

const isExternal = (href: string) => href.startsWith('http');

const pageVisuals: Record<PageKey, { hero: string; strip: string; accent: string; accentHex: string }> = {
  home: {
    hero: '/assets/k-cube-banner.png',
    strip: 'K-CUBE INDIA PRE-SELECTION · APPLICATION WINDOW CLOSED · OFFICIAL UPDATES',
    accent: 'Next event', accentHex: '#2563eb',
  },
  activities: {
    hero: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=80',
    strip: 'K-Pop, K-Dance, drama reviews and creator missions',
    accent: 'Creator Picks', accentHex: '#db2777',
  },
  learning: {
    hero: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80',
    strip: 'Daily Hangul chapters, vocabulary streaks and speaking tasks',
    accent: 'Learning Pass', accentHex: '#7c3aed',
  },
  kfood: {
    hero: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1800&q=80',
    strip: 'Korean snacks, sauces, recipes and K-CUBE shop rewards',
    accent: 'Food Store', accentHex: '#ea580c',
  },
  rewards: {
    hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
    strip: 'Redeem points and climb toward the Korea trip leaderboard',
    accent: 'Rewards Hub', accentHex: '#d97706',
  },
  studyAbroad: {
    hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80',
    strip: 'Study abroad guidance, partner colleges, visa support and intake tracking',
    accent: 'Study Abroad', accentHex: '#0891b2',
  },
  events: {
    hero: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80',
    strip: 'Workshops, RSVP campaigns and Korean community moments',
    accent: 'Event Store', accentHex: '#059669',
  },
  about: {
    hero: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1800&q=80',
    strip: 'A Korean business ecosystem built in India',
    accent: 'About K-CUBE', accentHex: '#4f46e5',
  },
  apply: {
    hero: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80',
    strip: 'Join K-CUBE event, content and operations teams',
    accent: 'Hiring Desk', accentHex: '#0f766e',
  },
  trip: {
    hero: 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=1800&q=80',
    strip: 'The highest verified point holders compete for Korea travel rewards',
    accent: 'Grand Prize', accentHex: '#c026d3',
  },
};

const cardImages = [
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
];

const marketplaceTiles = [
  { title: 'Welcome bonus', value: '+100 points', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=700&q=80' },
  { title: 'Refer friends', value: '+150 / +100', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=80' },
  { title: 'Upload videos', value: 'Admin reviewed', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80' },
  { title: 'Shop Korean Products', value: 'Earn purchase rewards', image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=700&q=80' },
];

const marketplaceTileLabels = {
  en: ['Welcome bonus', 'Refer friends', 'Upload videos', 'Shop Korean Products'],
  ko: ['웰컴 보너스', '친구 추천', '영상 업로드', '한국 상품 쇼핑'],
  hi: ['वेलकम बोनस', 'दोस्तों को रेफर करें', 'वीडियो अपलोड करें', 'Korean Products Shop'],
} as const;

const marketplaceTileValues = {
  en: ['+100 points', '+150 / +100', 'Admin reviewed', 'Earn purchase rewards'],
  ko: ['+100 포인트', '+150 / +100', '관리자 검토', '구매 보상 적립'],
  hi: ['+100 पॉइंट्स', '+150 / +100', 'एडमिन रिव्यू', 'खरीदारी rewards कमाएँ'],
} as const;

const homeSectionCopy = {
  en: { next: 'Next event', explore: 'Explore by category', curated: 'Curated for India', spotlight: 'Shop spotlight', featured: 'Shop & Earn Points', openShop: 'Open shop', viewShop: 'View in shop', actions: 'K-CUBE point actions', actionsDesc: 'Verified activities, learning progress, K-Food purchase claims and referrals feed into the points ledger.', allActions: 'View All Point Actions', dashboard: 'Member dashboard', welcome: 'Account activity' },
  ko: { next: '다음 이벤트', explore: '카테고리 둘러보기', curated: '인도를 위한 큐레이션', spotlight: '쇼핑 추천', featured: '홈페이지 추천 상품', openShop: '쇼핑몰 열기', viewShop: '쇼핑몰에서 보기', actions: 'K-CUBE 포인트 활동', actionsDesc: '인증된 활동, 학습 진행, K-Food 구매 신청 및 추천이 포인트 장부에 반영됩니다.', allActions: '모든 포인트 활동 보기', dashboard: '회원 대시보드', welcome: '웰컴 포인트 100점' },
  hi: { next: 'अगला इवेंट', explore: 'कैटेगरी देखें', curated: 'India के लिए curated', spotlight: 'Shop spotlight', featured: 'Shop से Points कमाएँ', openShop: 'Shop खोलें', viewShop: 'Shop में देखें', actions: 'K-CUBE point actions', actionsDesc: 'Verified activities, learning progress, K-Food claims और referrals points ledger में जुड़ते हैं।', allActions: 'सभी point actions देखें', dashboard: 'Member dashboard', welcome: 'Account activity' },
} as const;

const homeBannerCopy = {
  en: {
    strip: 'K-CUBE INDIA PRE-SELECTION · APPLICATION WINDOW CLOSED · OFFICIAL UPDATES',
    festival: 'ITAEWON WORLD MUSIC SPIRIT FESTIVAL 2026',
    title: 'K-CUBE INDIA PRE-SELECTION',
    subtitle: 'Your voice. Your message. Your stage.',
    completed: 'India Pre-Selection completed on August 30, 2026',
    support: 'Important selection & travel support',
    status: 'India Pre-Selection completed',
    stages: 'Official festival stages and updates',
    announcement: 'View Full Announcement',
    points: [
      { value: '100 pts', label: 'K-CUBE Registration' },
      { value: '+200 pts', label: 'Preliminary Round Video Submission' },
      { value: '+300 pts', label: 'Passing the Preliminary Round' },
      { value: 'Award: 1,000 pts', label: 'After passing the final selection' },
    ],
    closed: 'The India Pre-Selection application window is closed.',
    notice: 'Use the notice board for the next official stage and the main information page for the broader festival story.',
    updates: 'View Official Updates',
    details: 'View Event Details',
  },
  ko: {
    strip: 'K-CUBE 인도 프리셀렉션 · 신청 기간 종료 · 공식 업데이트',
    festival: '이태원 월드 뮤직 스피릿 페스티벌 2026',
    title: 'K-CUBE 인도 프리셀렉션',
    subtitle: '당신의 목소리. 당신의 메시지. 당신의 무대.',
    completed: '인도 프리셀렉션이 2026년 8월 30일 완료되었습니다',
    support: '중요 선발 및 여행 지원 안내',
    status: '인도 프리셀렉션 완료',
    stages: '공식 페스티벌 단계 및 업데이트',
    announcement: '전체 공지 보기',
    points: [
      { value: '100점', label: 'K-CUBE 등록' },
      { value: '+200점', label: '예선 라운드 영상 제출' },
      { value: '+300점', label: '예선 라운드 통과' },
      { value: '최종 선발 후 1,000점 지급', label: '최종 선발 통과 후' },
    ],
    closed: '인도 프리셀렉션 신청 기간이 종료되었습니다.',
    notice: '다음 공식 단계는 공지 게시판에서 확인하고, 페스티벌의 전체 내용은 안내 페이지에서 확인하세요.',
    updates: '공식 업데이트 보기',
    details: '이벤트 상세 보기',
  },
  hi: {
    strip: 'K-CUBE इंडिया प्री-सेलेक्शन · आवेदन विंडो बंद · आधिकारिक अपडेट्स',
    festival: 'इतेवॉन वर्ल्ड म्यूज़िक स्पिरिट फेस्टिवल 2026',
    title: 'K-CUBE इंडिया प्री-सेलेक्शन',
    subtitle: 'आपकी आवाज़। आपका संदेश। आपका मंच।',
    completed: 'इंडिया प्री-सेलेक्शन 30 अगस्त 2026 को पूरा हुआ',
    support: 'ज़रूरी चयन और यात्रा सहायता',
    status: 'इंडिया प्री-सेलेक्शन पूरा हुआ',
    stages: 'आधिकारिक फेस्टिवल चरण और अपडेट्स',
    announcement: 'पूरा अनाउंसमेंट देखें',
    points: [
      { value: '100 पॉइंट्स', label: 'K-CUBE रजिस्ट्रेशन' },
      { value: '+200 पॉइंट्स', label: 'प्रीलिमिनरी राउंड वीडियो सबमिशन' },
      { value: '+300 पॉइंट्स', label: 'प्रीलिमिनरी राउंड पास करना' },
      { value: 'फाइनल चयन के बाद 1,000 पॉइंट्स', label: 'फाइनल सेलेक्शन पास करने के बाद' },
    ],
    closed: 'इंडिया प्री-सेलेक्शन आवेदन विंडो बंद हो चुकी है।',
    notice: 'अगले आधिकारिक चरण के लिए नोटिस बोर्ड देखें और फेस्टिवल की पूरी जानकारी के लिए मुख्य इन्फॉर्मेशन पेज देखें।',
    updates: 'आधिकारिक अपडेट्स देखें',
    details: 'इवेंट की जानकारी देखें',
  },
} as const;

const tileAccents = ['#0b4eae', '#12a66a', '#f59e0b', '#7356d8'];
const cardAccents = ['#0b4eae', '#12a66a', '#f59e0b', '#7356d8', '#1d67c9', '#12a66a'];

const featuredShopProducts = shopProducts.slice(0, 3);
const rewardsUi = {
  en: {
    title: 'Earn Points. Unlock Rewards. Go Further.',
    subtitle: 'Earn K-CUBE Points through eligible activities, learning, referrals, shopping and events — then use them toward rewards and special opportunities.',
    description: 'Discover ways to earn, review your personal wallet and follow the Trip to Korea program from one trusted place.',
    wallet: 'My points wallet',
    lifetime: 'Lifetime earned',
    redeemed: 'Redeemed',
    pending: 'Pending',
    activity: 'Recent point activity',
    noActivity: 'Your verified point activity will appear here after an eligible action.',
    trip: 'Trip to Korea',
    tripCopy: 'Qualification is based on the current program rules and verified points. Follow official updates for eligibility information.',
    viewWallet: 'View points wallet',
  },
  ko: {
    title: '포인트를 적립하고, 리워드를 만나고, 더 멀리 가세요.',
    subtitle: '활동, 학습, 추천, 쇼핑 및 이벤트를 통해 K-CUBE 포인트를 적립하고 리워드와 특별한 기회를 확인하세요.',
    description: '적립 방법과 개인 지갑, 한국 여행 프로그램을 한 곳에서 확인하세요.',
    wallet: '내 포인트 지갑', lifetime: '누적 적립', redeemed: '사용됨', pending: '대기 중', activity: '최근 포인트 활동', noActivity: '적립 활동 후 인증된 포인트 내역이 표시됩니다.', trip: '한국 여행', tripCopy: '자격은 현재 프로그램 규칙과 인증된 포인트에 따라 결정됩니다. 공식 업데이트를 확인하세요.', viewWallet: '포인트 지갑 보기',
  },
  hi: {
    title: 'पॉइंट्स कमाएँ। रिवॉर्ड्स अनलॉक करें। आगे बढ़ें।',
    subtitle: 'योग्य activities, learning, referrals, shopping और events से K-CUBE पॉइंट्स कमाएँ और उन्हें rewards व special opportunities के लिए इस्तेमाल करें।',
    description: 'कमाने के तरीके, अपना wallet और Trip to Korea program एक ही जगह देखें।',
    wallet: 'मेरा पॉइंट्स वॉलेट', lifetime: 'कुल कमाए', redeemed: 'रिडीम किए', pending: 'पेंडिंग', activity: 'हाल की पॉइंट गतिविधि', noActivity: 'योग्य action के बाद verified point activity यहाँ दिखेगी।', trip: 'Trip to Korea', tripCopy: 'Eligibility current program rules और verified points पर निर्भर है। Official updates देखें।', viewWallet: 'पॉइंट्स वॉलेट देखें',
  },
} as const;

const KCubePage = ({ pageKey, showActions = true }: KCubePageProps) => {
  const language = useAppStore((state) => state.language);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const page = pages[pageKey];
  const t = copy[language];
  const homeText = homeSectionCopy[language];
  const bannerText = homeBannerCopy[language];
  const visual = pageVisuals[pageKey];
  const rewardsText = rewardsUi[language];
  const [wallet, setWallet] = useState<{ balance: number; summary: { lifetime_earned: number; redeemed: number; pending: number }; transactions: Array<{ id: number; source_type: string; points_delta: number; status: string; created_at: string }> } | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    if (pageKey !== 'rewards' || !user) {
      setWallet(null);
      return;
    }
    let cancelled = false;
    setWalletLoading(true);
    api.get('/users/points-wallet')
      .then((response) => {
        if (!cancelled) setWallet(response.data?.data || null);
      })
      .catch(() => { if (!cancelled) setWallet(null); })
      .finally(() => { if (!cancelled) setWalletLoading(false); });
    return () => { cancelled = true; };
  }, [pageKey, user]);

  return (
    <main className="mx-auto min-h-screen max-w-[1320px] overflow-hidden bg-white text-[#111827] shadow-[0_6px_20px_rgba(15,55,95,0.07)]">

      <section className="border-b border-[#d8e1ee] bg-white px-3 py-2 text-xs text-[#0f172a] sm:px-4 sm:py-3 sm:text-sm lg:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-3">
          <span className="rounded-full px-3 py-1 font-black text-white shadow-[0_10px_20px_rgba(15,23,42,0.14)]" style={{ backgroundColor: visual.accentHex }}>{pageKey === 'home' ? homeText.next : visual.accent}</span>
          <span className="font-semibold leading-5 text-[#475569]">{pageKey === 'home' ? bannerText.strip : visual.strip}</span>
          <Link href="/dashboard" className="hidden items-center gap-2 rounded-full border border-[#d8e1ee] px-3 py-1 font-bold text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6] sm:ml-auto sm:inline-flex">
            {homeText.dashboard} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section
        className="relative overflow-hidden border-b border-[#d8e1ee] bg-cover bg-center px-3 py-5 sm:px-4 sm:py-8 lg:px-10 lg:py-12"
        style={{
          backgroundImage: pageKey === 'home'
            ? `linear-gradient(120deg, rgb(6 43 99) 0%, rgb(11 78 174 / 75%) 52%, rgb(29 103 201 / 0%) 100%), url(${visual.hero})`
            : `linear-gradient(90deg, rgba(247,251,255,0.92) 0%, rgba(247,251,255,0.78) 32%, rgba(36,87,214,0.48) 68%, rgba(8,35,94,0.82) 100%), url(${visual.hero})`,
        }}
      >
        <div className="mx-auto grid max-w-[1320px] gap-6 lg:grid-cols-1 lg:items-stretch">
          {pageKey === 'home' ? (
            <div className="py-3 sm:min-h-[390px] sm:py-7">
                <div className="inline-flex max-w-full items-center gap-2 rounded-md border border-white/35 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_4px_18px_rgba(15,55,95,0.12)] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                  {bannerText.festival}
                </div>
                <h1 className="mt-4 max-w-5xl text-3xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-xl sm:mt-6 sm:text-4xl lg:text-6xl">
                  {bannerText.title}
                </h1>
                <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-[#d8e7f9] sm:text-lg">
                  {bannerText.subtitle}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#12a66a]/40 bg-[#effbf6] px-3 py-2 text-xs font-bold text-[#087f52]">
                  <Check className="h-4 w-4" /> {bannerText.completed}
                </div>
                <div className="mt-5 max-w-6xl rounded-[22px] border border-[#d8e1ee] bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#2457d6]">{bannerText.support}</p>
                      <span className="mt-2 inline-flex items-center gap-2 rounded-md border border-[#12a66a]/30 bg-[#effbf6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#087f52]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#12a66a]" /> {bannerText.status}
                      </span>
                      <h2 className="mt-2 text-xl font-black leading-tight text-[#0f172a] sm:text-2xl">{bannerText.stages}</h2>
                    </div>
                    <Link
                      href="/india-pre-selection/announcement"
                      className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-[#d8e1ee] bg-[#f8fbff] px-4 py-2.5 text-sm font-black text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6]"
                    >
                      {bannerText.announcement}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {bannerText.points.map((item) => (
                      <div key={item.label} className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#2457d6]">{item.value}</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#0f172a]">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-[#e6edf6] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 text-sm text-[#64748b]">
                      <p className="font-semibold text-[#0f172a]">{bannerText.closed}</p>
                      <p>{bannerText.notice}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                      <Link
                        href="/india-pre-selection/apply"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2457d6] px-5 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(36,87,214,0.18)] transition hover:bg-[#1f4bb8]"
                      >
                        {bannerText.updates}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/india-pre-selection"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e1ee] bg-white px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6]"
                      >
                        {bannerText.details}
                      </Link>
                    </div>
                  </div>
                </div>
            </div>
          ) : (
            <>
              <div className="py-3 sm:min-h-[420px] sm:py-8">
                <p className="inline-flex rounded-full border border-[#2457d6]/15 bg-[#2457d6] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                  {page.badge[language]}
                </p>
                <h1 className="mt-4 max-w-5xl text-2xl font-black leading-tight tracking-tight text-[#0f172a] drop-shadow-xl sm:mt-6 sm:text-5xl lg:text-6xl">
                  {pageKey === 'rewards' ? rewardsText.title : page.title[language]}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-[#334155] sm:mt-5 sm:text-lg sm:leading-8">{pageKey === 'rewards' ? rewardsText.subtitle : page.subtitle[language]}</p>
                <p className="mt-3 max-w-3xl text-xs leading-6 text-[#64748b] sm:mt-4 sm:text-sm sm:leading-7">{pageKey === 'rewards' ? rewardsText.description : page.description[language]}</p>
                <div className="mt-5 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
                  {isExternal(page.primaryHref) ? (
                    <a
                      href={page.primaryHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2457d6] px-5 py-3 text-sm font-black text-white shadow hover:bg-[#1f4bb8]"
                    >
                      {page.primaryCta[language]} <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={page.primaryHref}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2457d6] px-5 py-3 text-sm font-black text-white shadow hover:bg-[#1f4bb8]"
                    >
                      {page.primaryCta[language]} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href="/rewards"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e1ee] bg-white px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6]"
                  >
                    {t.koreaTrip}
                  </Link>
                </div>
              </div>

              <aside className="rounded-[24px] border border-[#d8e1ee] bg-white p-4 text-[#111827] shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-5">
                {pageKey === 'rewards' ? (
                  <>
                    <div className="flex items-start justify-between gap-4 border-b border-[#e6edf6] pb-5">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2457d6]">{rewardsText.wallet}</p>
                        <p className="mt-2 text-4xl font-black text-[#2457d6]" aria-live="polite">
                          {walletLoading ? <span className="inline-block h-9 w-24 animate-pulse rounded bg-[#e8f0ff]" aria-label="Loading points" /> : wallet ? `${wallet.balance} pts` : '—'}
                        </p>
                      </div>
                      <Coins className="h-8 w-8 text-[#2457d6]" aria-hidden="true" />
                    </div>
                    {wallet ? (
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        {[[rewardsText.lifetime, wallet.summary.lifetime_earned], [rewardsText.redeemed, wallet.summary.redeemed], [rewardsText.pending, wallet.summary.pending]].map(([label, value]) => (
                          <div key={String(label)} className="rounded-xl bg-[#f8fbff] p-2">
                            <p className="text-[10px] font-bold text-[#64748b]">{label}</p>
                            <p className="mt-1 text-sm font-black text-[#0f172a]">{value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <Link href="/dashboard" className="mt-4 inline-flex text-sm font-black text-[#2457d6]">{rewardsText.viewWallet} →</Link>
                    <div className="mt-5 border-t border-[#e6edf6] pt-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d97706]">{rewardsText.trip}</p>
                      <p className="mt-2 text-sm leading-6 text-[#64748b]">{rewardsText.tripCopy}</p>
                      <Link href="/trip-to-korea" className="mt-3 inline-flex text-sm font-black text-[#2457d6]">{t.koreaTrip} →</Link>
                    </div>
                  </>
                ) : null}
                {pageKey !== 'rewards' ? <>
                <div className="flex items-center justify-between gap-4 border-b border-[#e6edf6] pb-5">
                  <div>
                    <p className="text-sm font-bold text-[#64748b]">{t.pointsWallet}</p>
                    <p className="mt-1 text-4xl font-black text-[#2457d6]">{user ? points : '--'}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2457d6] text-white">
                    <Coins className="h-7 w-7" />
                  </div>
                </div>
                <div className="mt-5">
                  <div className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-4">
                    <div className="flex items-center gap-3">
                      <Plane className="h-5 w-5 text-[#2457d6]" />
                      <p className="text-sm font-bold text-[#0f172a]">{t.koreaTrip}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#64748b]">{t.tripLine}</p>
                  </div>
                </div>
                </> : null}
              </aside>
            </>
          )}
        </div>
      </section>

      {pageKey === 'rewards' && user ? (
        <section className="border-b border-[#d8e1ee] bg-[#f8fbff] px-3 py-6 sm:px-4 lg:px-10">
          <div className="mx-auto grid max-w-[1320px] gap-4 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-2xl border border-[#d8e1ee] bg-white p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d97706]">{rewardsText.activity}</p>
                  <h2 className="mt-2 text-xl font-black text-[#0f172a]">{wallet?.transactions.length ? `${wallet.transactions.length} recent records` : rewardsText.activity}</h2>
                </div>
                {wallet?.transactions.length ? <span className="text-xs font-bold text-[#64748b]">Verified ledger</span> : null}
              </div>
              {walletLoading ? <div className="mt-4 h-14 animate-pulse rounded-xl bg-[#eef4fb]" aria-label="Loading point activity" /> : wallet?.transactions.length ? (
                <div className="mt-4 divide-y divide-[#edf2f7]">
                  {wallet.transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between gap-3 py-3">
                      <div><p className="text-sm font-bold capitalize text-[#0f172a]">{transaction.source_type.replace(/_/g, ' ')}</p><p className="text-xs text-[#64748b]">{new Date(transaction.created_at).toLocaleDateString()}</p></div>
                      <span className={`text-sm font-black ${transaction.points_delta >= 0 ? 'text-[#087f52]' : 'text-[#b12704]'}`}>{transaction.points_delta >= 0 ? '+' : ''}{transaction.points_delta} pts</span>
                    </div>
                  ))}
                </div>
              ) : <p className="mt-4 rounded-xl bg-[#f8fbff] p-4 text-sm text-[#64748b]">{rewardsText.noActivity}</p>}
            </div>
            <div className="rounded-2xl border border-[#d8e1ee] bg-[#eef5ff] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2457d6]">Wallet guidance</p>
              <h2 className="mt-2 text-xl font-black text-[#0f172a]">Your balance stays tied to verified activity.</h2>
              <p className="mt-3 text-sm leading-6 text-[#64748b]">Pending reviews and approved rewards are kept separate in the points ledger. No points are added by visiting this page.</p>
              <Link href="/dashboard" className="mt-4 inline-flex rounded-full bg-[#2457d6] px-4 py-2.5 text-sm font-black text-white">View wallet details <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      ) : null}

      {pageKey === 'home' ? <IndiaPreSelectionSection /> : null}

      <section className="px-3 pb-7 sm:px-4 sm:pb-8 lg:px-10">
        <div className="mx-auto grid max-w-[1320px] auto-cols-[78%] grid-flow-col gap-3 overflow-x-auto pb-1 sm:auto-cols-auto sm:grid-flow-row sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketplaceTiles.map((tile, index) => (
            <article key={tile.title} className="overflow-hidden rounded-[24px] border border-[#d8e1ee] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <div className="h-1" style={{ backgroundColor: tileAccents[index] }} />
              <div className="p-4">
              <h2 className="text-lg font-black text-[#0f172a] sm:text-xl">{marketplaceTileLabels[language][index]}</h2>
              <div className="mt-3 h-28 rounded-[16px] bg-cover bg-center sm:h-36" style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0.2)), url(${tile.image})` }} />
              <p className="mt-3 text-sm font-bold" style={{ color: tileAccents[index] }}>{marketplaceTileValues[language][index]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-3 pb-8 sm:px-4 sm:pb-10 lg:px-10">
        <div className="mx-auto max-w-[1320px] rounded-[12px] border border-[#d5d9d9] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: visual.accentHex }}>{pageKey === 'home' ? homeText.next : visual.accent}</p>
              <h2 className="text-xl font-black text-[#111827] sm:text-2xl">{homeText.explore}</h2>
            </div>
            <span className="hidden items-center gap-1 text-sm font-bold text-[#007185] sm:inline-flex">
              <Star className="h-4 w-4 fill-[#ffa41c] text-[#ffa41c]" /> {homeText.curated}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {page.cards.map((card, index) => (
              <article key={card.title.en} className="overflow-hidden rounded-[28px] border border-[#d8e1ee] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(36,87,214,0.14)]">
                <div className="grid grid-rows-[220px_1fr] sm:grid-rows-[240px_1fr]">
                  <div
                    className="relative bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(36,87,214,0.02), rgba(8,35,94,0.62)), url(${cardImages[index % cardImages.length]})` }}
                  >
                    <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-lg" style={{ backgroundColor: cardAccents[index % cardAccents.length] }}>
                      {pageKey === 'home' ? homeText.next : visual.accent}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: visual.accentHex }}>{pageKey === 'home' ? homeText.next : visual.accent}</p>
                    <h3 className="mt-3 text-xl font-black text-[#111827] sm:text-2xl">{card.title[language]}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#565959]">{card.description[language]}</p>
                    {isExternal(card.href) ? (
                        <a href={card.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#2457d6] hover:text-[#1f4bb8]">
                        {card.cta[language]} <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link href={card.href} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#2457d6] hover:text-[#1f4bb8]">
                        {card.cta[language]} <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-8 sm:px-4 sm:pb-10 lg:px-10">
        <div className="mx-auto max-w-[1320px] rounded-[12px] border border-[#d8e1ee] bg-white p-4 text-[#0f172a] shadow-[0_6px_20px_rgba(15,55,95,0.07)] sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f08a24]">{homeText.spotlight}</p>
              <h2 className="text-xl font-black sm:text-2xl">{homeText.featured}</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-[#f3a847]">
              {homeText.openShop} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredShopProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[26px] border border-[#d8e1ee] bg-[#f8fbff] shadow-sm">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(36,87,214,0.02), rgba(8,35,94,0.5)), url(${product.image})` }} />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2457d6]">{product.category[language]}</p>
                    <span className="rounded-full bg-[#fff0d9] px-3 py-1 text-xs font-black text-[#c45f08]">+{product.rewardPoints} pts</span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-[#0f172a]">{product.title[language]}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748b]">{product.subtitle[language]}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#f3a847]">₹{product.price}</p>
                      {product.compareAtPrice ? <p className="text-xs text-[#9ca3af] line-through">₹{product.compareAtPrice}</p> : null}
                    </div>
                    <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-[#2457d6] px-4 py-2 text-sm font-black text-white">
                      {homeText.viewShop} <ShoppingBag className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {pageKey === 'about' ? (
        <section id="contact" className="px-3 pb-8 sm:px-4 sm:pb-10 lg:px-10">
          <div className="mx-auto max-w-[1320px] rounded-[12px] border border-[#d8e1ee] bg-white p-4 text-[#0f172a] shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2457d6]">Contact</p>
                <h2 className="mt-2 text-xl font-black sm:text-2xl">Contact K-CUBE</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#64748b]">
                For partnership, support, festival coordination, or study abroad inquiries, reach the K-CUBE team directly.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[22px] border border-[#d8e1ee] bg-[#f8fbff] p-4 sm:p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#2457d6]">Email</p>
                <a href="mailto:kcubeadm@gmail.com" className="mt-2 block text-lg font-black text-[#0f172a] transition hover:text-[#2457d6] sm:text-xl">
                  kcubeadm@gmail.com
                </a>
                <p className="mt-2 text-sm leading-6 text-[#64748b]">
                  Primary contact mailbox for admin coordination and business inquiries.
                </p>
              </article>
              <article className="rounded-[22px] border border-[#d8e1ee] bg-[#fffaf3] p-4 sm:p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f08a24]">Phone</p>
                <a href="tel:+919810097323" className="mt-2 block text-lg font-black text-[#0f172a] transition hover:text-[#f08a24] sm:text-xl">
                  9810097323
                </a>
                <p className="mt-2 text-sm leading-6 text-[#64748b]">
                  Mr. Tae Hwan Lim
                </p>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      {showActions ? (
        <section id="point-actions" className="px-3 pb-12 sm:px-4 sm:pb-16 lg:px-10">
          <div className="mx-auto max-w-[1320px] rounded-[12px] border border-[#d5d9d9] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704] sm:text-sm sm:tracking-[0.24em]">{t.earnPoints}</p>
                <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">{homeText.actions}</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#565959]">
                {homeText.actionsDesc}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {actions.slice(0, 6).map((action, index) => {
                return (
                  <article key={action.id} className="rounded-[24px] border border-[#d8e1ee] bg-[#f8fbff] p-4 sm:p-5" style={{ borderTop: `4px solid ${cardAccents[index % cardAccents.length]}` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#2457d6] sm:text-xs sm:tracking-[0.22em]">{action.category[language]}</p>
                        <h3 className="mt-2 text-lg font-black text-[#111827] sm:mt-3 sm:text-xl">{action.title[language]}</h3>
                      </div>
                      <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-sm font-black text-[#2457d6]">
                        +{action.points}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#565959] sm:min-h-[52px]">{action.description[language]}</p>
                    <button
                      type="button"
                      onClick={() => { window.location.href = user ? `/${action.id.replace('-', '/')}` : '/signin'; }}
                      className="kc-button kc-button-primary mt-5 w-full"
                    >
                      <ArrowRight className="h-4 w-4" />
                      {user ? 'View details' : t.loginRequired}
                    </button>
                  </article>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <Link href="/rewards#point-actions" className="inline-flex items-center gap-2 rounded-sm border border-[#d5d9d9] bg-white px-5 py-3 text-sm font-black text-[#111827] transition hover:border-[#f3a847] hover:text-[#b12704]">
                {homeText.allActions}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default KCubePage;
