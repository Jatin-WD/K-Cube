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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="India Pre-Selection announcement"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0f172a] text-white shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition hover:bg-black/60"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center justify-center bg-[#07162a] p-4 sm:p-6 lg:min-h-[78vh] lg:p-8">
            <div className="relative h-[78vh] w-full max-w-[580px] overflow-hidden rounded-[22px] border border-white/10 bg-[#102849]">
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
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#f3a847]">
              Special announcement
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              India Pre-Selection is open
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#d5d9d9] sm:text-base sm:leading-8">
              Open the dedicated application page to submit your details for the K-CUBE India Pre-Selection.
              Use the button below to go straight to the form.
            </p>

            <div className="mt-5 grid gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f3a847]">Festival</p>
                <p className="mt-1 text-sm font-bold text-white">ITAEWON World Music Spirit Festival 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f3a847]">Apply</p>
                <p className="mt-1 text-sm leading-6 text-[#d5d9d9]">
                  Submit your application, bio, and singing video from the K-CUBE form.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/india-pre-selection/apply"
                onClick={dismiss}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
              >
                Not now
              </button>
            </div>

            <p className="mt-4 text-xs leading-6 text-[#aab5c6]">
              You can close this popup and continue browsing. It will show again on refresh or a fresh visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
