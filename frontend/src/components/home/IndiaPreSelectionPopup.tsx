"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

export default function IndiaPreSelectionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Keep this popup desktop-only, including large touch devices that should
    // not see the announcement modal.
    const mediaQuery = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');

    const updateIsDesktop = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateIsDesktop();
    mediaQuery.addEventListener('change', updateIsDesktop);

    return () => mediaQuery.removeEventListener('change', updateIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [isDesktop]);

  useEffect(() => {
    if (!isOpen || !isDesktop) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isDesktop]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!isOpen) {
    return null;
  }

  if (!isDesktop) {
    return null;
  }

  const dismiss = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="India Pre-Selection announcement"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-[var(--kc-border)] bg-white text-[var(--kc-text)] shadow-[0_30px_100px_rgba(48,37,45,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--kc-border)] bg-white text-[var(--kc-text)] transition hover:bg-[var(--kc-bg)]"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center justify-center bg-[var(--kc-bg)] p-4 sm:p-6 lg:min-h-[78vh] lg:p-8">
            <div className="relative h-[78vh] w-full max-w-[580px] overflow-hidden rounded-[22px] border border-[var(--kc-border)] bg-white">
              <Image
                src="/assets/itaewon.jpg"
                alt="Itaewon World Music Spirit Festival poster"
                fill
                priority
                className="object-contain object-center"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--kc-blue-700)]">
              Special announcement
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[var(--kc-text)] sm:text-4xl">
              India Pre-Selection is completed
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--kc-text-secondary)] sm:text-base sm:leading-8">
              The August 30, 2026 India Pre-Selection stage is complete. Open the official updates for the next stage.
              Use the button below to go straight to the form.
            </p>

            <div className="mt-5 grid gap-3 rounded-[22px] border border-[var(--kc-border)] bg-[var(--kc-surface-soft)] p-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--kc-blue-700)]">Festival</p>
                <p className="mt-1 text-sm font-bold text-[var(--kc-text)]">ITAEWON World Music Spirit Festival 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--kc-blue-700)]">Official updates</p>
                <p className="mt-1 text-sm leading-6 text-[var(--kc-text-secondary)]">
                  Check the next official stage and festival timeline from the K-CUBE notice board.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/india-pre-selection/announcement"
                onClick={dismiss}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--kc-blue-700)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--kc-blue-800)]"
              >
                View Official Updates
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center justify-center rounded-full border border-[var(--kc-border)] bg-white px-5 py-3 text-sm font-bold text-[var(--kc-text)] transition hover:bg-[var(--kc-bg)]"
              >
                Not now
              </button>
            </div>

            <p className="mt-4 text-xs leading-6 text-[var(--kc-text-muted)]">
              You can close this popup and continue browsing. It will show again on refresh or a fresh visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
