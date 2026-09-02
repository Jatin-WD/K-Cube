"use client";

import Link from 'next/link';
import { ArrowRight, Compass, FileText, Sparkles, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';

const journeyCards = [
  {
    title: 'Festival overview',
    body: 'A music and culture journey built around remembrance, healing, unity, and shared humanity.',
    icon: Sparkles,
  },
  {
    title: 'Purpose / objective',
    body: 'Explain why the festival exists and how the India pre-selection supports the wider event path.',
    icon: Compass,
  },
  {
    title: 'India pre-selection context',
    body: 'India is the first selection track before the official rounds and the Seoul festival stage.',
    icon: Users,
  },
  {
    title: 'Process overview',
    body: 'The completed India stage is preserved; check official updates for what comes next.',
    icon: FileText,
  },
] as const;

export default function IndiaPreSelectionInformationHero() {
  const heroRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const backdrop = backdropRef.current;
    if (!hero || !backdrop) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    let raf = 0;

    const applyTransform = () => {
      raf = 0;
      const reduceMotion = prefersReducedMotion.matches || !desktopQuery.matches;
      if (reduceMotion) {
        backdrop.style.transform = 'translate3d(0, 0, 0) scale(1.045)';
        return;
      }

      const rect = hero.getBoundingClientRect();
      const viewportMid = window.innerHeight * 0.5;
      const progress = (viewportMid - rect.top) / Math.max(rect.height, 1);
      const shift = Math.max(-15, Math.min(15, (progress - 0.5) * 28));
      backdrop.style.transform = `translate3d(0, ${shift}px, 0) scale(1.045)`;
    };

    const requestUpdate = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(applyTransform);
    };

    const onScroll = () => {
      requestUpdate();
    };

    const onResize = () => {
      requestUpdate();
    };

    const onMotionChange = () => {
      requestUpdate();
    };

    backdrop.style.willChange = 'transform';
    requestUpdate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    prefersReducedMotion.addEventListener('change', onMotionChange);
    desktopQuery.addEventListener('change', onMotionChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      prefersReducedMotion.removeEventListener('change', onMotionChange);
      desktopQuery.removeEventListener('change', onMotionChange);
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, []);

  return (
    <section ref={heroRef} className="px-3 py-6 sm:px-4 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[1760px] gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <article className="relative h-full overflow-hidden rounded-[32px] border border-[#d5d9d9] bg-[#07101b] p-4 text-white shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:p-6 lg:p-7">
          <div
            ref={backdropRef}
            className="pointer-events-none absolute inset-0 origin-center"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgb(0 45 99 / 98%) 0%, rgb(0 49 108 / 94%) 28%, rgb(0 52 115 / 80%) 54%, rgb(7 16 27 / 0%) 100%), linear-gradient(rgb(7 16 27 / 0%) 0%, rgb(7 16 27 / 0%) 100%), url('/assets/k-cube-banner.png')",
              backgroundPosition: 'center right',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              transform: 'translate3d(0, 0, 0) scale(1.045)',
            }}
          />
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">
              <Sparkles className="h-4 w-4" />
              Information dossier
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              ITAEWON World Music Spirit 2026
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d5d9d9] sm:leading-7">
              Understand the festival, the India pre-selection, and the journey before you apply.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/india-pre-selection/announcement"
                className="kc-button kc-button-primary w-full whitespace-nowrap sm:w-auto"
              >
                View announcement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/india-pre-selection/announcement"
                className="kc-button kc-button-secondary w-full whitespace-nowrap sm:w-auto"
              >
                View official updates
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {journeyCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="rounded-[20px] border border-[#d8e1ee] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:bg-[#f8fbff]"
                  >
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#f08a24]">
                      <Icon className="h-4 w-4" />
                      {card.title}
                    </p>
                    <p className="mt-2.5 text-sm leading-6 text-[#475569]">{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </article>

        <aside className="flex h-full flex-col justify-between gap-4 lg:pt-0">
          <div className="rounded-[24px] border border-[#d5d9d9] bg-white p-3 shadow-sm sm:p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">About this page</p>
            <div className="mt-2.5 rounded-[22px] border border-[#d5d9d9] bg-[#f7fafa] p-3 sm:p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b12704] sm:text-sm sm:tracking-[0.18em]">
                What to do here
              </p>
              <p className="mt-2 text-sm leading-6 text-[#565959]">
                Use this page to understand the event before moving to the latest notice board or the application form.
              </p>
            </div>

            <div className="mt-2.5 grid gap-2">
              {[
                'Festival overview and purpose',
                'India pre-selection context',
                'How the journey flows to Apply',
              ].map((fact, index) => (
                <div key={fact} className="flex items-start gap-3 rounded-[18px] border border-[#d5d9d9] bg-white px-3 py-2.5 sm:px-4 sm:py-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111827] text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-5 text-[#565959] sm:leading-6">{fact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#d8e1ee] bg-[#f8fbff] p-3 text-[#0f172a] shadow-sm sm:p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2457d6]">Journey at a glance</p>
            <div className="mt-2.5 space-y-2">
              {[
                '1. Understand the event story and the reason it exists.',
                '2. Read Announcement for the latest dates, notices and status.',
                '3. Move to Apply when you are ready to submit.',
              ].map((step) => (
                <div key={step} className="rounded-[18px] border border-[#d8e1ee] bg-white px-3 py-2.5 text-sm leading-5 text-[#475569] sm:px-4 sm:py-3 sm:leading-6">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
