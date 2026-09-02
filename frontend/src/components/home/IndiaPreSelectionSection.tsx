"use client";

import Link from 'next/link';
import { ArrowRight, CalendarDays, Music4, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { festival2026 } from '@/lib/festival2026';

const timeline = [
  {
    title: festival2026.indiaPreSelection.title,
    date: festival2026.indiaPreSelection.date,
    dateTime: festival2026.indiaPreSelection.dateTime,
    label: 'Completed stage',
    description: festival2026.indiaPreSelection.description,
    tone: 'border-[#12a66a]/35 bg-[#effbf6] text-[#334155]',
    dateTone: 'text-[#087f52]',
  },
  {
    title: festival2026.officialSecondRound.title,
    date: festival2026.officialSecondRound.date,
    dateTime: festival2026.officialSecondRound.dateTime,
    label: 'Official round',
    description: 'The second official round before the Seoul festival stage.',
    tone: 'border-[#d8e1ee] bg-[#f8fbff] text-[#334155]',
    dateTone: 'text-[#0f172a]',
  },
  {
    title: 'ITAEWON World Music Spirit Festival',
    date: festival2026.mainFestival.date,
    dateTime: festival2026.mainFestival.dateTime,
    label: 'Festival',
    description: 'Seoul, South Korea',
    extra: 'Final destination of the journey',
    tone: 'border-[#d8e1ee] bg-white text-[#334155]',
    dateTone: 'text-[#0f172a]',
  },
] as const;

const benefits = [
  { title: 'Perform', text: 'Show your talent through the India pre-selection.' },
  { title: 'Learn', text: 'Explore Korean culture, language and creative experiences.' },
  { title: 'Earn', text: 'Complete K-CUBE activities and earn points.' },
  { title: 'Experience', text: 'Follow the journey from India toward Korea.' },
] as const;

const IndiaPreSelectionSection = () => {
  return (
    <section aria-labelledby="kcube-india-preselection" className="px-3 py-10 sm:px-4 sm:py-14 lg:px-10 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-[1760px] overflow-hidden rounded-[28px] border border-[#d8e1ee] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(36,87,214,0.08),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(255,216,20,0.16),_transparent_18%),radial-gradient(circle_at_bottom_left,_rgba(96,165,250,0.08),_transparent_22%)]" />
          <div className="relative grid gap-8 px-5 py-7 sm:px-6 sm:py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10 lg:px-8 lg:py-10">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
              className="flex h-full flex-col"
            >
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2457d6]/15 bg-[#2457d6]/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#2457d6]">
                <Sparkles className="h-4 w-4" />
                Event journey
              </p>

              <div className="mt-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-md border border-[#12a66a]/30 bg-[#effbf6] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#087f52]">
                  <span className="h-2 w-2 rounded-full bg-[#12a66a]" /> Completed: India Pre-Selection
                </div>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.34em] text-[#2457d6]">India to Seoul 2026</p>
                <h2 id="kcube-india-preselection" className="mt-3 text-2xl font-black leading-[1] tracking-tight text-[#0f172a] sm:text-3xl lg:text-4xl">
                  Your journey starts here
                </h2>
                <p className="mt-4 text-base font-semibold leading-7 text-[#334155] sm:text-lg">
                  Your voice. Your message. Your stage.
                </p>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[#64748b] sm:text-sm sm:leading-7 lg:text-base">
                  The India pre-selection stage is complete. Follow official updates for the next round and the ITAEWON World Music Spirit Festival 2026.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/india-pre-selection/apply"
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#2457d6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1f4bb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457d6] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  View Official Updates
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/india-pre-selection"
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-[#d8e1ee] bg-[#f8fbff] px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6]"
                >
                  View Event Details
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {benefits.map((item) => (
                  <article key={item.title} className="rounded-[20px] border border-[#d8e1ee] bg-[#f8fbff] px-4 py-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#2457d6]">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[#475569]">{item.text}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-[#d8e1ee] bg-white p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-[#334155]">
                  <Music4 className="h-4 w-4 text-[#2457d6]" />
                  Official festival artwork and event message stay aligned with the timeline below.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="flex h-full flex-col"
            >
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#2457d6]">Important dates</p>
                <h3 className="text-xl font-black text-[#0f172a] sm:text-2xl">One clear timeline</h3>
                <p className="max-w-2xl text-xs leading-6 text-[#64748b] sm:text-sm sm:leading-7">
                  The India pre-selection, official rounds, and final festival are presented as one continuous journey.
                </p>
              </div>

              <ol className="relative mt-6 flex flex-1 flex-col gap-4 lg:mt-8">
                {timeline.map((item, index) => (
                  <li key={item.title} className="relative lg:grid lg:grid-cols-[30px_1fr] lg:items-stretch lg:gap-4">
                    <div className="relative hidden lg:block">
                      <span
                        className={`absolute left-1/2 top-6 h-full w-px -translate-x-1/2 ${
                          index === timeline.length - 1 ? 'bg-gradient-to-b from-[#2457d6] via-[#d8e1ee] to-transparent' : 'bg-[#d8e1ee]'
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`absolute left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full border shadow-[0_0_0_6px_rgba(36,87,214,0.08)] ${
                          index === 0 ? 'border-[#12a66a] bg-[#12a66a]' : 'border-[#2457d6]/35 bg-white'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <article
                      className={`relative h-full overflow-hidden rounded-[22px] border p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition sm:p-6 ${item.tone}`}
                    >
                      {index === 0 ? <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#2457d6] to-transparent" /> : null}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${index === 0 ? 'text-[#087f52]' : 'text-current/65'}`}>{item.label}</p>
                          <h4 className="mt-3 text-base font-black leading-tight text-[#0f172a] sm:text-lg">{item.title}</h4>
                        </div>
                        <CalendarDays className={`mt-0.5 h-5 w-5 shrink-0 ${index === 0 ? 'text-[#2457d6]' : 'text-[#94a3b8]'}`} />
                      </div>

                      <time
                        dateTime={item.dateTime}
                        className={`mt-4 block text-[1.5rem] font-black leading-none tracking-tight sm:text-[1.75rem] ${item.dateTone}`}
                      >
                        {item.date}
                      </time>

                      <p className={`mt-3 text-xs leading-6 sm:text-sm sm:leading-7 ${index === 0 ? 'text-[#475569]' : 'text-[#64748b]'}`}>
                        {item.description}
                      </p>

                      {'extra' in item ? (
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-[#2457d6]">
                          {item.extra}
                        </p>
                      ) : null}
                    </article>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto mt-5 max-w-[1760px] rounded-[28px] border border-[#d8e1ee] bg-white px-5 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#2457d6]">Why join K-CUBE?</p>
            <h3 className="mt-2 text-xl font-black text-[#0f172a] sm:text-2xl">A compact reason to get involved</h3>
          </div>
          <p className="max-w-3xl text-xs leading-6 text-[#64748b] sm:text-sm sm:leading-7">
            Keep this section light and motivating so it supports the main timeline instead of repeating it.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item) => (
            <article key={item.title} className="rounded-[22px] border border-[#d8e1ee] bg-[#f8fbff] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2457d6]">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#475569]">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndiaPreSelectionSection;
