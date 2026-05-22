"use client";

import Link from 'next/link';
import { ArrowRight, Check, Coins, Gift, Plane, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { actions, copy, pages, type PageKey } from '@/lib/kcubeContent';
import { useAppStore } from '@/store/useAppStore';

interface KCubePageProps {
  pageKey: PageKey;
  showActions?: boolean;
}

const isExternal = (href: string) => href.startsWith('http');

const pageVisuals: Record<PageKey, { hero: string; strip: string; accent: string }> = {
  home: {
    hero: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1800&q=80',
    strip: 'Korean culture, food, learning and rewards in one member marketplace',
    accent: 'K-CUBE Deals',
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
    strip: 'Korean snacks, sauces, recipes and K-Food.in purchase rewards',
    accent: 'Food Store',
  },
  rewards: {
    hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
    strip: 'Redeem points and climb toward the Korea trip leaderboard',
    accent: 'Rewards Hub',
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
  { title: 'Welcome bonus', value: '+250 points', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=700&q=80' },
  { title: 'Refer friends', value: '+150 / +100', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=80' },
  { title: 'Upload videos', value: 'Admin reviewed', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80' },
  { title: 'Shop K-Food', value: 'Claim rewards', image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=700&q=80' },
];

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
      <section className="border-b border-[#d5d9d9] bg-[#131921] px-5 py-3 text-sm text-white lg:px-10">
        <div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-3">
          <span className="rounded-sm bg-[#f3a847] px-3 py-1 font-black text-[#111827]">{visual.accent}</span>
          <span className="font-semibold">{visual.strip}</span>
          <Link href="/dashboard" className="ml-auto inline-flex items-center gap-2 rounded-sm border border-white/30 px-3 py-1 font-bold hover:border-[#f3a847]">
            Member dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section
        className="relative border-b border-[#d5d9d9] bg-cover bg-center px-5 py-8 lg:px-10 lg:py-12"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(19,25,33,0.92), rgba(19,25,33,0.66), rgba(19,25,33,0.12)), url(${visual.hero})` }}
      >
        <div className="mx-auto grid max-w-[1760px] gap-6 lg:grid-cols-[1.1fr_370px] lg:items-stretch">
          <div className="min-h-[420px] py-8">
            <p className="inline-flex rounded-sm border border-[#f3a847]/70 bg-[#f3a847] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#111827]">
              {page.badge[language]}
            </p>
            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-tight tracking-tight text-white drop-shadow-xl sm:text-5xl lg:text-6xl">
              {page.title[language]}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#f3f4f6]">{page.subtitle[language]}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d5d9d9]">{page.description[language]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isExternal(page.primaryHref) ? (
                <a
                  href={page.primaryHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] shadow hover:bg-[#f7ca00]"
                >
                  {page.primaryCta[language]} <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={page.primaryHref}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] shadow hover:bg-[#f7ca00]"
                >
                  {page.primaryCta[language]} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/rewards"
                className="inline-flex items-center gap-2 rounded-sm border border-white/40 bg-[#111827]/70 px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
              >
                {t.koreaTrip}
              </Link>
            </div>
          </div>

          <aside className="rounded-sm border border-[#d5d9d9] bg-white p-5 text-[#111827] shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
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
                  <p className="text-sm font-bold text-[#111827]">250 welcome points</p>
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
        </div>
      </section>

      <section className="-mt-10 px-5 pb-8 lg:px-10">
        <div className="mx-auto grid max-w-[1760px] gap-5 md:grid-cols-2 xl:grid-cols-4">
          {marketplaceTiles.map((tile) => (
            <article key={tile.title} className="rounded-sm border border-[#d5d9d9] bg-white p-4 shadow-sm">
              <h2 className="text-xl font-black text-[#111827]">{tile.title}</h2>
              <div className="mt-3 h-36 bg-cover bg-center" style={{ backgroundImage: `url(${tile.image})` }} />
              <p className="mt-3 text-sm font-bold text-[#007185]">{tile.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-10 lg:px-10">
        <div className="mx-auto rounded-sm border border-[#d5d9d9] bg-white p-5 shadow-sm max-w-[1760px]">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">{visual.accent}</p>
              <h2 className="text-2xl font-black text-[#111827]">Explore by category</h2>
            </div>
            <span className="hidden items-center gap-1 text-sm font-bold text-[#007185] sm:inline-flex">
              <Star className="h-4 w-4 fill-[#ffa41c] text-[#ffa41c]" /> Curated for India
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
          {page.cards.map((card, index) => (
            <article key={card.title.en} className="overflow-hidden rounded-sm border border-[#d5d9d9] bg-[#f7fafa]">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${cardImages[index % cardImages.length]})` }} />
              <div className="p-5">
              <Sparkles className="h-6 w-6 text-[#b12704]" />
              <h3 className="mt-4 text-xl font-black text-[#111827]">{card.title[language]}</h3>
              <p className="mt-3 min-h-[76px] text-sm leading-7 text-[#565959]">{card.description[language]}</p>
              {isExternal(card.href) ? (
                <a href={card.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#007185] hover:text-[#c7511f]">
                  {card.cta[language]} <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <Link href={card.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#007185] hover:text-[#c7511f]">
                  {card.cta[language]} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>

      {showActions ? (
        <section id="point-actions" className="px-5 pb-16 lg:px-10">
          <div className="mx-auto max-w-[1760px] rounded-sm border border-[#d5d9d9] bg-white p-5 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b12704]">{t.earnPoints}</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">K-CUBE point actions</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#565959]">
                Verified activities, learning progress, K-Food purchase claims and referrals feed into the backend points ledger.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {actions.map((action) => {
                const completed = completedActions.includes(action.id);
                return (
                  <article key={action.id} className="rounded-sm border border-[#d5d9d9] bg-[#f7fafa] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b12704]">{action.category[language]}</p>
                        <h3 className="mt-3 text-xl font-black text-[#111827]">{action.title[language]}</h3>
                      </div>
                      <span className="rounded-sm bg-[#fff4cc] px-3 py-1 text-sm font-black text-[#b12704]">
                        +{action.points}
                      </span>
                    </div>
                    <p className="mt-3 min-h-[52px] text-sm leading-6 text-[#565959]">{action.description[language]}</p>
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
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default KCubePage;
