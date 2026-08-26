"use client";

import Link from 'next/link';
import { Check, Coins, Lock, SearchCheck } from 'lucide-react';
import { copy, type DetailItem } from '@/lib/kcubeContent';
import { useAppStore } from '@/store/useAppStore';
import api from '@/lib/api';
import { useEffect, useState } from 'react';

interface DetailPageProps {
  item: DetailItem;
}

const DetailPage = ({ item }: DetailPageProps) => {
  const [cmsItem, setCmsItem] = useState<DetailItem>(item);
  const language = useAppStore((state) => state.language);
  const user = useAppStore((state) => state.user);
  const completedActions = useAppStore((state) => state.completedActions);
  const awardPoints = useAppStore((state) => state.awardPoints);
  const t = copy[language];
  useEffect(() => {
    let cancelled = false;
    api.get(`/learning/cms/public/${item.slug}`)
      .then((response) => {
        const page = response.data?.data || response.data;
        const block = page?.blocks?.find((entry: { blockKey?: string }) => entry.blockKey === 'static_detail_content');
        const content = block?.contentEn;
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        if (!cancelled && parsed && parsed.category === item.category && parsed.slug === item.slug && parsed.title && parsed.summary) {
          setCmsItem(parsed as DetailItem);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [item.category, item.slug]);

  const activeItem = cmsItem;
  const actionId = `${activeItem.category}-${activeItem.slug}`;
  const completed = completedActions.includes(actionId);
  const image = detailImages[activeItem.slug] || detailImages[activeItem.category] || detailImages.default;
  const toAnchor = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return (
    <main className="min-h-screen bg-[#e7e7e7] text-[#111827]">
      <section className="border-b border-[#d5d9d9] bg-[#131921] px-4 py-3 text-sm text-white lg:px-10">
        <div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-3">
          <span className="rounded-sm bg-[#f3a847] px-3 py-1 font-black text-[#111827]">K-CUBE Detail</span>
          <span className="font-semibold">{activeItem.eyebrow[language]}</span>
        </div>
      </section>

      <section className="px-4 py-6 sm:py-8 lg:px-10">
        <div className="mx-auto grid max-w-[1760px] gap-6 lg:grid-cols-[minmax(420px,0.92fr)_1fr_350px]">
          <div className="overflow-hidden rounded-sm border border-[#d5d9d9] bg-white p-4 shadow-sm">
            <div className="h-64 bg-cover bg-center sm:h-[420px]" style={{ backgroundImage: `url(${image})` }} />
          </div>

          <div className="rounded-sm border border-[#d5d9d9] bg-white p-6 shadow-sm">
          <p className="inline-flex rounded-sm border border-[#f3a847]/60 bg-[#fff4cc] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#b12704]">
            {activeItem.eyebrow[language]}
          </p>
          <h1 className="mt-5 text-3xl font-black leading-tight text-[#111827] sm:text-4xl lg:text-5xl">{activeItem.title[language]}</h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-[#565959] sm:text-lg sm:leading-8">{activeItem.summary[language]}</p>
          <div className="mt-5 flex items-center gap-1 text-[#ffa41c]">
            {Array.from({ length: 5 }).map((_, index) => <span key={index}>★</span>)}
            <span className="ml-2 text-sm font-bold text-[#007185]">Verified point activity</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#565959]">
            <span className="inline-flex items-center gap-2 rounded-sm border border-[#d5d9d9] bg-[#f7fafa] px-4 py-2">
              <SearchCheck className="h-4 w-4 text-[#007185]" />
              SEO: {activeItem.seo}
            </span>
            {activeItem.points ? (
              <span className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/50 bg-[#fff4cc] px-4 py-2 font-black text-[#b12704]">
                <Coins className="h-4 w-4" />
                +{activeItem.points}
              </span>
            ) : null}
          </div>
          </div>

          <aside className="rounded-sm border border-[#d5d9d9] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#111827]">{t.earnPoints}</h2>
            <p className="mt-3 text-sm leading-6 text-[#565959]">
              {activeItem.protectedAction ? t.loginRequired : t.tripLine}
            </p>
            <div className="mt-5 rounded-sm border border-[#d5d9d9] bg-[#f7fafa] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#565959]">Reward value</p>
              <p className="mt-2 text-3xl font-black text-[#b12704]">{activeItem.points ? `+${activeItem.points}` : 'Verified'}</p>
            </div>
            {activeItem.protectedAction && activeItem.points ? (
              user ? (
                <button
                  type="button"
                  disabled={completed}
                  onClick={() => awardPoints(actionId, activeItem.points ?? 0)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-4 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00] disabled:cursor-not-allowed disabled:bg-[#d5d9d9] disabled:text-[#565959]"
                >
                  {completed ? <Check className="h-4 w-4" /> : <Coins className="h-4 w-4" />}
                  {completed ? t.completed : `${t.applyNow} (+${activeItem.points})`}
                </button>
              ) : (
                <Link href="/signin" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-4 text-sm font-black text-[#111827]">
                  <Lock className="h-4 w-4" />
                  {t.signIn}
                </Link>
              )
            ) : null}
          </aside>
        </div>
      </section>

      <section className="px-4 pb-12 lg:px-10">
        <div className="mx-auto max-w-[1760px]">
          <article className="rounded-sm border border-[#d5d9d9] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#111827]">Detailed content</h2>
            <div className="mt-5 grid gap-4">
              {activeItem.bullets.map((bullet) => (
                <div key={bullet.en} className="rounded-sm border border-[#d5d9d9] bg-[#f7fafa] p-4">
                  <p className="text-sm leading-7 text-[#565959]">{bullet[language]}</p>
                </div>
              ))}
            </div>
            {activeItem.sections ? (
              <div className="mt-10 space-y-10">
                {activeItem.sections.map((section) => (
                  <div key={section.title.en} id={toAnchor(section.title.en)}>
                    <h3 className="text-2xl font-black text-[#111827]">{section.title[language]}</h3>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-[#565959]">
                      {section.content.map((paragraph) => (
                        <p key={paragraph.en}>{paragraph[language]}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  );
};

const detailImages: Record<string, string> = {
  activities: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  learning: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  kfood: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
  rewards: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  events: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  'k-pop-missions': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
  'k-dance-covers': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
  'k-drama-culture-tasks': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80',
  'beginner-korean-learning': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'korean-recipes': 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
  'kfood-missions': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
};

export default DetailPage;
