"use client";

import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, History, MapPin } from 'lucide-react';
import { festival2026 } from '@/lib/festival2026';

export default function IndiaPreSelectionApplyPage() {
  return (
    <main className="min-h-screen bg-[#eef4f8] px-4 py-8 text-[#102a43] sm:px-6 lg:px-10 lg:py-12">
      <section className="mx-auto max-w-[1320px] rounded-xl border border-[#dce6f0] bg-white p-6 shadow-[0_4px_18px_rgba(15,55,95,0.05)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="kc-eyebrow">India Pre-Selection</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">Applications are closed</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#486581]">The India Pre-Selection stage took place on {festival2026.indiaPreSelection.date}. New applications for this completed stage are no longer being accepted.</p>
            <div className="mt-6 rounded-lg border border-[#12a66a]/25 bg-[#effbf6] p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-[#087f52]"><CheckCircle2 className="h-4 w-4" /> India Pre-Selection: Completed</p>
              <p className="mt-2 text-sm leading-6 text-[#486581]">Historical submissions and review data remain preserved for the K-CUBE team.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/india-pre-selection/announcement" className="kc-button kc-button-primary">View official updates <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/india-pre-selection/information" className="kc-button kc-button-secondary">Festival information</Link>
            </div>
          </div>
          <aside className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-5">
            <p className="kc-eyebrow">What happens next</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-[#0b4eae]/20 bg-[#eaf3ff] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b4eae]">Upcoming</p><p className="mt-2 font-bold text-[#102a43]">{festival2026.officialSecondRound.title}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-[#486581]"><CalendarDays className="h-4 w-4" /> {festival2026.officialSecondRound.date}</p></div>
              <div className="rounded-lg border border-[#f59e0b]/30 bg-[#fff8e7] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#a16207]">Main festival</p><p className="mt-2 font-bold text-[#102a43]">{festival2026.mainFestival.title}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-[#486581]"><MapPin className="h-4 w-4" /> {festival2026.mainFestival.date}</p></div>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#6b7c93]"><History className="mt-0.5 h-4 w-4 shrink-0" /> Existing application records remain available through member and admin areas.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
