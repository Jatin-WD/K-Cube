"use client";

import Link from 'next/link';
import { ArrowRight, Check, Coins, Gift, Plane, ShoppingBag, Star } from 'lucide-react';
import { actions, copy, pages, type PageKey } from '@/lib/kcubeContent';
import { shopProducts } from '@/lib/shopCatalog';
import { useAppStore } from '@/store/useAppStore';
import IndiaPreSelectionSection from './home/IndiaPreSelectionSection';
import IndiaPreSelectionPopup from './home/IndiaPreSelectionPopup';

interface KCubePageProps {
  pageKey: PageKey;
  showActions?: boolean;
}

const isExternal = (href: string) => href.startsWith('http');

const pageVisuals: Record<PageKey, { hero: string; strip: string; accent: string }> = {
  home: {
    hero: '/assets/k-cube-banner.png',
    strip: 'NEXT EVENT · K-CUBE INDIA PRE-SELECTION · AUGUST 30, 2026',
    accent: 'Next event',
  },
  activities: {
    hero: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=80',
    strip: 'K-Pop, K-Dance, drama reviews and creator missions',
    accent: 'Creator Picks',
  },
  learning: {
    hero: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80',
    strip: 'Daily Hangul chapters, vocabulary streaks and speaking tasks',
    accent: 'Learning Pass',
  },
  kfood: {
    hero: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1800&q=80',
    strip: 'Korean snacks, sauces, recipes and K-CUBE shop rewards',
    accent: 'Food Store',
  },
  rewards: {
    hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
    strip: 'Redeem points and climb toward the Korea trip leaderboard',
    accent: 'Rewards Hub',
  },
  studyAbroad: {
    hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80',
    strip: 'Study abroad guidance, partner colleges, visa support and intake tracking',
    accent: 'Study Abroad',
  },
  events: {
    hero: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80',
    strip: 'Workshops, RSVP campaigns and Korean community moments',
    accent: 'Event Store',
  },
  about: {
    hero: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1800&q=80',
    strip: 'A Korean business ecosystem built in India',
    accent: 'About K-CUBE',
  },
  apply: {
    hero: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80',
    strip: 'Join K-CUBE event, content and operations teams',
    accent: 'Hiring Desk',
  },
  trip: {
    hero: 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=1800&q=80',
    strip: 'The highest verified point holders compete for Korea travel rewards',
    accent: 'Grand Prize',
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

const featuredShopProducts = shopProducts.slice(0, 3);
const homeSelectionSupportPoints = [
  { value: '100 pts', label: 'K-CUBE Registration' },
  { value: '+200 pts', label: 'Preliminary Round Video Submission' },
  { value: '+300 pts', label: 'Passing the Preliminary Round' },
  { value: '+1,000 pts', label: 'Passing the Final Selection' },
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
    <main className="min-h-screen bg-[#e7e7e7] text-[#111827]">
      {pageKey === 'home' ? <IndiaPreSelectionPopup /> : null}

      <section className="border-b border-[#d5d9d9] bg-[#131921] px-3 py-2 text-xs text-white sm:px-4 sm:py-3 sm:text-sm lg:px-10">
        <div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-3">
          <span className="rounded-sm bg-[#f3a847] px-3 py-1 font-black text-[#111827]">{visual.accent}</span>
          <span className="font-semibold leading-5">{visual.strip}</span>
          <Link href="/dashboard" className="hidden items-center gap-2 rounded-sm border border-white/30 px-3 py-1 font-bold hover:border-[#f3a847] sm:ml-auto sm:inline-flex">
            Member dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section
        className="relative overflow-hidden border-b border-[#d5d9d9] bg-cover bg-center px-3 py-5 sm:px-4 sm:py-8 lg:px-10 lg:py-12"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8,12,20,0.97) 0%, rgba(8,12,20,0.92) 38%, rgba(8,12,20,0.72) 58%, rgba(8,12,20,0.18) 100%), url(${visual.hero})`,
        }}
      >
        <div className="mx-auto grid max-w-[1760px] gap-6 lg:grid-cols-1 lg:items-stretch">
          {pageKey === 'home' ? (
            <div className="py-3 sm:min-h-[440px] sm:py-8">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#f3a847]/60 bg-[#f3a847] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#111827] shadow-[0_8px_24px_rgba(243,168,71,0.18)] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                  <span className="h-2 w-2 rounded-full bg-[#111827]" />
                  ITAEWON WORLD MUSIC SPIRIT FESTIVAL 2026
                </div>
                <h1 className="mt-4 max-w-5xl text-3xl font-black leading-[0.96] tracking-tight text-white drop-shadow-xl sm:mt-6 sm:text-4xl lg:text-6xl">
                  K-CUBE INDIA PRE-SELECTION
                </h1>
                <div className="mt-5 inline-flex flex-col rounded-[24px] border border-[#f3a847]/35 bg-[#f3a847]/10 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f3a847]">Application deadline</p>
                  <p className="mt-2 text-xl font-black uppercase tracking-[0.18em] text-[#ffd814] sm:text-2xl">AUGUST 30, 2026</p>
                </div>
                <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-[#f3f4f6] sm:text-lg">
                  Your voice. Your message. Your stage.
                </p>
                <div className="mt-5 rounded-[24px] border border-[#f3a847]/25 bg-[#0f1726]/82 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f3a847]">Important selection & travel support</p>
                      <h2 className="mt-2 text-xl font-black leading-tight text-white sm:text-2xl">Selection, points, airfare, and accommodation</h2>
                    </div>
                    <Link
                      href="/india-pre-selection/announcement"
                      className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-sm border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-black text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
                    >
                      View Full Announcement
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {homeSelectionSupportPoints.map((item) => (
                      <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffd814]">{item.value}</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#f8fafc]">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 text-sm text-[#d5d9d9]">
                      <p className="font-semibold text-[#f8fafc]">Apply before the deadline to stay in the selection flow.</p>
                      <p>Use the notice board for the latest updates and the main information page for the broader festival story.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                      <Link
                        href="/india-pre-selection/apply"
                        className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] shadow-[0_18px_40px_rgba(255,216,20,0.24)] transition hover:bg-[#f7ca00]"
                      >
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/india-pre-selection"
                        className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 bg-[#0b1220]/60 px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
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
                <p className="inline-flex rounded-sm border border-[#f3a847]/70 bg-[#f3a847] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#111827] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                  {page.badge[language]}
                </p>
                <h1 className="mt-4 max-w-5xl text-2xl font-black leading-tight tracking-tight text-white drop-shadow-xl sm:mt-6 sm:text-5xl lg:text-6xl">
                  {page.title[language]}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-[#f3f4f6] sm:mt-5 sm:text-lg sm:leading-8">{page.subtitle[language]}</p>
                <p className="mt-3 max-w-3xl text-xs leading-6 text-[#d5d9d9] sm:mt-4 sm:text-sm sm:leading-7">{page.description[language]}</p>
                <div className="mt-5 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
                  {isExternal(page.primaryHref) ? (
                    <a
                      href={page.primaryHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] shadow hover:bg-[#f7ca00]"
                    >
                      {page.primaryCta[language]} <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={page.primaryHref}
                      className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] shadow hover:bg-[#f7ca00]"
                    >
                      {page.primaryCta[language]} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href="/rewards"
                    className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/40 bg-[#111827]/70 px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
                  >
                    {t.koreaTrip}
                  </Link>
                </div>
              </div>

              <aside className="rounded-sm border border-[#d5d9d9] bg-white p-4 text-[#111827] shadow-[0_12px_30px_rgba(0,0,0,0.22)] sm:p-5">
                <div className="flex items-center justify-between gap-4 border-b border-[#d5d9d9] pb-5">
                  <div>
                    <p className="text-sm font-bold text-[#565959]">{t.pointsWallet}</p>
                    <p className="mt-1 text-4xl font-black text-[#b12704]">{user ? points : '--'}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-[#ffd814] text-[#111827]">
                    <Coins className="h-7 w-7" />
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-sm border border-[#d5d9d9] bg-[#f7fafa] p-4">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-[#b12704]" />
                      <p className="text-sm font-bold text-[#111827]">100 welcome points</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#565959]">
                      {user ? `${copy[language].hello}, ${user.fullName}` : t.welcomeBonus}
                    </p>
                  </div>
                  <div className="rounded-sm border border-[#d5d9d9] bg-[#f7fafa] p-4">
                    <div className="flex items-center gap-3">
                      <Plane className="h-5 w-5 text-[#b12704]" />
                      <p className="text-sm font-bold text-[#111827]">{t.koreaTrip}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#d5d9d9]">
                      <div className="h-full rounded-full bg-[#ffa41c]" style={{ width: `${user ? Math.min(points / 20, 100) : 0}%` }} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#565959]">{t.tripLine}</p>
                  </div>
                </div>
              </aside>
            </>
          )}
        </div>
      </section>

      {pageKey === 'home' ? <IndiaPreSelectionSection /> : null}

      <section className={`px-3 pb-7 sm:px-4 sm:pb-8 lg:px-10 ${pageKey === 'home' ? 'sm:mt-0' : 'sm:-mt-10'}`}>
        <div className="mx-auto grid max-w-[1760px] auto-cols-[78%] grid-flow-col gap-3 overflow-x-auto pb-1 sm:auto-cols-auto sm:grid-flow-row sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {marketplaceTiles.map((tile) => (
            <article key={tile.title} className="rounded-sm border border-[#d5d9d9] bg-white p-4 shadow-sm">
              <h2 className="text-lg font-black text-[#111827] sm:text-xl">{tile.title}</h2>
              <div className="mt-3 h-28 bg-cover bg-center sm:h-36" style={{ backgroundImage: `url(${tile.image})` }} />
              <p className="mt-3 text-sm font-bold text-[#007185]">{tile.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-3 pb-8 sm:px-4 sm:pb-10 lg:px-10">
        <div className="mx-auto max-w-[1760px] rounded-[28px] border border-[#d5d9d9] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">{visual.accent}</p>
              <h2 className="text-xl font-black text-[#111827] sm:text-2xl">Explore by category</h2>
            </div>
            <span className="hidden items-center gap-1 text-sm font-bold text-[#007185] sm:inline-flex">
              <Star className="h-4 w-4 fill-[#ffa41c] text-[#ffa41c]" /> Curated for India
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {page.cards.map((card, index) => (
              <article key={card.title.en} className="overflow-hidden rounded-[28px] border border-[#d5d9d9] bg-[#f7fafa] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="grid grid-rows-[220px_1fr] sm:grid-rows-[240px_1fr]">
                  <div
                    className="relative bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(17,24,39,0.04), rgba(17,24,39,0.5)), url(${cardImages[index % cardImages.length]})` }}
                  />
                  <div className="p-5 sm:p-6">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b12704]">{visual.accent}</p>
                    <h3 className="mt-3 text-xl font-black text-[#111827] sm:text-2xl">{card.title[language]}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#565959]">{card.description[language]}</p>
                    {isExternal(card.href) ? (
                      <a href={card.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#b12704] hover:text-[#c7511f]">
                        {card.cta[language]} <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link href={card.href} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#b12704] hover:text-[#c7511f]">
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
        <div className="mx-auto max-w-[1760px] rounded-[28px] border border-[#d5d9d9] bg-[#111827] p-4 text-white shadow-sm sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a847]">Shop spotlight</p>
              <h2 className="text-xl font-black sm:text-2xl">Featured products on the homepage</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-[#f3a847]">
              Open shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredShopProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04]">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(17,24,39,0.08), rgba(17,24,39,0.72)), url(${product.image})` }} />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f3a847]">{product.category.en}</p>
                    <span className="rounded-full bg-[#ffd814] px-3 py-1 text-xs font-black text-[#111827]">+{product.rewardPoints} pts</span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-white">{product.title.en}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#d5d9d9]">{product.subtitle.en}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#f3a847]">₹{product.price}</p>
                      {product.compareAtPrice ? <p className="text-xs text-[#9ca3af] line-through">₹{product.compareAtPrice}</p> : null}
                    </div>
                    <Link href="/shop" className="inline-flex items-center gap-2 rounded-sm bg-[#ffd814] px-4 py-2 text-sm font-black text-[#111827]">
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
          <div className="mx-auto max-w-[1760px] rounded-sm border border-[#d5d9d9] bg-[#111827] p-4 text-white shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a847]">Contact</p>
                <h2 className="mt-2 text-xl font-black sm:text-2xl">Contact K-CUBE</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#d5d9d9]">
                For partnership, support, festival coordination, or study abroad inquiries, reach the K-CUBE team directly.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-sm border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f3a847]">Email</p>
                <a href="mailto:kcubeadm@gmail.com" className="mt-2 block text-lg font-black text-white transition hover:text-[#ffd814] sm:text-xl">
                  kcubeadm@gmail.com
                </a>
                <p className="mt-2 text-sm leading-6 text-[#d5d9d9]">
                  Primary contact mailbox for admin coordination and business inquiries.
                </p>
              </article>
              <article className="rounded-sm border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f3a847]">Phone</p>
                <a href="tel:+919810097323" className="mt-2 block text-lg font-black text-white transition hover:text-[#ffd814] sm:text-xl">
                  9810097323
                </a>
                <p className="mt-2 text-sm leading-6 text-[#d5d9d9]">
                  Mr. Tae Hwan Lim
                </p>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      {showActions ? (
        <section id="point-actions" className="px-3 pb-12 sm:px-4 sm:pb-16 lg:px-10">
          <div className="mx-auto max-w-[1760px] rounded-[28px] border border-[#d5d9d9] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
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
              {actions.slice(0, 6).map((action) => {
                const completed = completedActions.includes(action.id);
                return (
                  <article key={action.id} className="rounded-[24px] border border-[#d5d9d9] bg-[#f7fafa] p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b12704] sm:text-xs sm:tracking-[0.22em]">{action.category[language]}</p>
                        <h3 className="mt-2 text-lg font-black text-[#111827] sm:mt-3 sm:text-xl">{action.title[language]}</h3>
                      </div>
                      <span className="rounded-sm bg-[#fff4cc] px-3 py-1 text-sm font-black text-[#b12704]">
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
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00] disabled:cursor-not-allowed disabled:bg-[#d5d9d9] disabled:text-[#565959]"
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
