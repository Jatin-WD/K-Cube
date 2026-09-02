"use client";

import Link from 'next/link';
import { ArrowRight, Check, Coins, Gift, Plane, ShoppingBag, Star } from 'lucide-react';
import { actions, copy, pages, type PageKey } from '@/lib/kcubeContent';
import { shopProducts } from '@/lib/shopCatalog';
import { useAppStore } from '@/store/useAppStore';
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

const tileAccents = ['#0b4eae', '#12a66a', '#f59e0b', '#7356d8'];
const cardAccents = ['#0b4eae', '#12a66a', '#f59e0b', '#7356d8', '#1d67c9', '#12a66a'];

const featuredShopProducts = shopProducts.slice(0, 3);
const homeSelectionSupportPoints = [
  { value: '100 pts', label: 'K-CUBE Registration' },
  { value: '+200 pts', label: 'Preliminary Round Video Submission' },
  { value: '+300 pts', label: 'Passing the Preliminary Round' },
  { value: '+1,000 pts', label: 'Passing the Final Selection', supporting: 'Earn points for the final round' },
] as const;

const KCubePage = ({ pageKey, showActions = true }: KCubePageProps) => {
  const language = useAppStore((state) => state.language);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const completedActions = useAppStore((state) => state.completedActions);
  const awardPoints = useAppStore((state) => state.awardPoints);
  const page = pages[pageKey];
  const t = copy[language];
  const visual = pageVisuals[pageKey];

  return (
    <main className="mx-auto min-h-screen max-w-[1320px] overflow-hidden bg-white text-[#111827] shadow-[0_6px_20px_rgba(15,55,95,0.07)]">

      <section className="border-b border-[#d8e1ee] bg-white px-3 py-2 text-xs text-[#0f172a] sm:px-4 sm:py-3 sm:text-sm lg:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-3">
          <span className="rounded-full px-3 py-1 font-black text-white shadow-[0_10px_20px_rgba(15,23,42,0.14)]" style={{ backgroundColor: visual.accentHex }}>{visual.accent}</span>
          <span className="font-semibold leading-5 text-[#475569]">{visual.strip}</span>
          <Link href="/dashboard" className="hidden items-center gap-2 rounded-full border border-[#d8e1ee] px-3 py-1 font-bold text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6] sm:ml-auto sm:inline-flex">
            Member dashboard <ArrowRight className="h-4 w-4" />
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
                  ITAEWON WORLD MUSIC SPIRIT FESTIVAL 2026
                </div>
                <h1 className="mt-4 max-w-5xl text-3xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-xl sm:mt-6 sm:text-4xl lg:text-6xl">
                  K-CUBE INDIA PRE-SELECTION
                </h1>
                <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-[#d8e7f9] sm:text-lg">
                  Your voice. Your message. Your stage.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#12a66a]/40 bg-[#effbf6] px-3 py-2 text-xs font-bold text-[#087f52]">
                  <Check className="h-4 w-4" /> India Pre-Selection completed on August 30, 2026
                </div>
                <div className="mt-5 max-w-6xl rounded-[22px] border border-[#d8e1ee] bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#2457d6]">Important selection & travel support</p>
                      <span className="mt-2 inline-flex items-center gap-2 rounded-md border border-[#12a66a]/30 bg-[#effbf6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#087f52]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#12a66a]" /> India Pre-Selection completed
                      </span>
                      <h2 className="mt-2 text-xl font-black leading-tight text-[#0f172a] sm:text-2xl">Official festival stages and updates</h2>
                    </div>
                    <Link
                      href="/india-pre-selection/announcement"
                      className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-[#d8e1ee] bg-[#f8fbff] px-4 py-2.5 text-sm font-black text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6]"
                    >
                      View Full Announcement
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {homeSelectionSupportPoints.map((item) => (
                      <div key={item.label} className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#2457d6]">{item.value}</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#0f172a]">{item.label}</p>
                        {'supporting' in item ? <p className="mt-1 text-xs leading-5 text-[#486581]">{item.supporting}</p> : null}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-[#e6edf6] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 text-sm text-[#64748b]">
                      <p className="font-semibold text-[#0f172a]">The India Pre-Selection application window is closed.</p>
                      <p>Use the notice board for the next official stage and the main information page for the broader festival story.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                      <Link
                        href="/india-pre-selection/apply"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2457d6] px-5 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(36,87,214,0.18)] transition hover:bg-[#1f4bb8]"
                      >
                        View Official Updates
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/india-pre-selection"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e1ee] bg-white px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6]"
                      >
                        View Event Details
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
                  {page.title[language]}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-[#334155] sm:mt-5 sm:text-lg sm:leading-8">{page.subtitle[language]}</p>
                <p className="mt-3 max-w-3xl text-xs leading-6 text-[#64748b] sm:mt-4 sm:text-sm sm:leading-7">{page.description[language]}</p>
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
                <div className="flex items-center justify-between gap-4 border-b border-[#e6edf6] pb-5">
                  <div>
                    <p className="text-sm font-bold text-[#64748b]">{t.pointsWallet}</p>
                    <p className="mt-1 text-4xl font-black text-[#2457d6]">{user ? points : '--'}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2457d6] text-white">
                    <Coins className="h-7 w-7" />
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-4">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-[#2457d6]" />
                      <p className="text-sm font-bold text-[#0f172a]">100 welcome points</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#64748b]">
                      {user ? `${copy[language].hello}, ${user.fullName}` : t.welcomeBonus}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-4">
                    <div className="flex items-center gap-3">
                      <Plane className="h-5 w-5 text-[#2457d6]" />
                      <p className="text-sm font-bold text-[#0f172a]">{t.koreaTrip}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#d8e1ee]">
                      <div className="h-full rounded-full bg-[#2457d6]" style={{ width: `${user ? Math.min(points / 20, 100) : 0}%` }} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#64748b]">{t.tripLine}</p>
                  </div>
                </div>
              </aside>
            </>
          )}
        </div>
      </section>

      {pageKey === 'home' ? <IndiaPreSelectionSection /> : null}

      <section className="px-3 pb-7 sm:px-4 sm:pb-8 lg:px-10">
        <div className="mx-auto grid max-w-[1320px] auto-cols-[78%] grid-flow-col gap-3 overflow-x-auto pb-1 sm:auto-cols-auto sm:grid-flow-row sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketplaceTiles.map((tile, index) => (
            <article key={tile.title} className="overflow-hidden rounded-[24px] border border-[#d8e1ee] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <div className="h-1" style={{ backgroundColor: tileAccents[index] }} />
              <div className="p-4">
              <h2 className="text-lg font-black text-[#0f172a] sm:text-xl">{tile.title}</h2>
              <div className="mt-3 h-28 rounded-[16px] bg-cover bg-center sm:h-36" style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0.2)), url(${tile.image})` }} />
              <p className="mt-3 text-sm font-bold" style={{ color: tileAccents[index] }}>{tile.value}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-3 pb-8 sm:px-4 sm:pb-10 lg:px-10">
        <div className="mx-auto max-w-[1320px] rounded-[12px] border border-[#d5d9d9] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: visual.accentHex }}>{visual.accent}</p>
              <h2 className="text-xl font-black text-[#111827] sm:text-2xl">Explore by category</h2>
            </div>
            <span className="hidden items-center gap-1 text-sm font-bold text-[#007185] sm:inline-flex">
              <Star className="h-4 w-4 fill-[#ffa41c] text-[#ffa41c]" /> Curated for India
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
                      {visual.accent}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: visual.accentHex }}>{visual.accent}</p>
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f08a24]">Shop spotlight</p>
              <h2 className="text-xl font-black sm:text-2xl">Featured products on the homepage</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-[#f3a847]">
              Open shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredShopProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[26px] border border-[#d8e1ee] bg-[#f8fbff] shadow-sm">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(36,87,214,0.02), rgba(8,35,94,0.5)), url(${product.image})` }} />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2457d6]">{product.category.en}</p>
                    <span className="rounded-full bg-[#fff0d9] px-3 py-1 text-xs font-black text-[#c45f08]">+{product.rewardPoints} pts</span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-[#0f172a]">{product.title.en}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748b]">{product.subtitle.en}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#f3a847]">₹{product.price}</p>
                      {product.compareAtPrice ? <p className="text-xs text-[#9ca3af] line-through">₹{product.compareAtPrice}</p> : null}
                    </div>
                    <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-[#2457d6] px-4 py-2 text-sm font-black text-white">
                      View in shop <ShoppingBag className="h-4 w-4" />
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
                <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">K-CUBE point actions</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#565959]">
                Verified activities, learning progress, K-Food purchase claims and referrals feed into the backend points ledger.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {actions.slice(0, 6).map((action, index) => {
                const completed = completedActions.includes(action.id);
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
                      disabled={completed}
                      onClick={() => {
                        if (!user) {
                          window.location.href = '/signin';
                          return;
                        }
                        awardPoints(action.id, action.points);
                      }}
                      className="kc-button kc-button-primary mt-5 w-full disabled:cursor-not-allowed disabled:bg-[#d8e4f0] disabled:text-[#486581]"
                    >
                      {completed ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                      {completed ? t.completed : user ? t.earnPoints : t.loginRequired}
                    </button>
                  </article>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <Link href="/rewards#point-actions" className="inline-flex items-center gap-2 rounded-sm border border-[#d5d9d9] bg-white px-5 py-3 text-sm font-black text-[#111827] transition hover:border-[#f3a847] hover:text-[#b12704]">
                View All Point Actions
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
