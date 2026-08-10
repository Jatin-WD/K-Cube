"use client";

import Link from 'next/link';
import { ArrowRight, CalendarDays, Music4, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const timeline = [
  {
    title: '🇮🇳 K-CUBE INDIA PRE-SELECTION',
    date: 'August 20, 2026',
    dateTime: '2026-08-20',
    label: 'PRIMARY / K-CUBE DEADLINE',
    description: 'India-level pre-selection for singers and musical artists.',
    tone: 'border-[#f3a847]/60 bg-[#151d2d] text-[#ffd814]',
    dateTone: 'text-[#ffd814]',
  },
  {
    title: '🇰🇷 OFFICIAL 1ST ROUND',
    date: 'August 30, 2026',
    dateTime: '2026-08-30',
    label: 'OFFICIAL ROUND',
    description: 'The first official round leading toward the festival lineup.',
    tone: 'border-white/10 bg-white/[0.03] text-[#aab5c6]',
    dateTone: 'text-white',
  },
  {
    title: '🇰🇷 OFFICIAL 2ND ROUND',
    date: 'September 15, 2026',
    dateTime: '2026-09-15',
    label: 'OFFICIAL ROUND',
    description: 'The second official round before the Seoul festival stage.',
    tone: 'border-white/10 bg-white/[0.03] text-[#aab5c6]',
    dateTone: 'text-white',
  },
  {
    title: '🎤 ITAEWON WORLD MUSIC SPIRIT FESTIVAL',
    date: 'October 4–6, 2026',
    dateTime: '2026-10-04',
    label: 'FESTIVAL',
    description: 'Seoul, South Korea',
    extra: 'Final destination of the journey',
    tone: 'border-white/10 bg-[#0d1626] text-[#aab5c6]',
    dateTone: 'text-white',
  },
] as const;

const IndiaPreSelectionSection = () => {
  return (
    <section aria-labelledby="kcube-india-preselection" className="px-3 py-10 sm:px-4 sm:py-14 lg:px-10 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto max-w-[1760px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#111827_0%,#0b1220_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.34)]"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(243,168,71,0.11),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.08),_transparent_18%),radial-gradient(circle_at_bottom_left,_rgba(255,216,20,0.05),_transparent_22%)]" />
          <div className="relative grid gap-10 px-5 py-7 sm:px-6 sm:py-8 lg:min-h-[780px] lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch lg:gap-12 lg:px-8 lg:py-10">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
              className="flex h-full flex-col"
            >
              <p className="inline-flex w-fit items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">
                🇮🇳 K-CUBE INDIA
              </p>

              <div className="mt-6 max-w-2xl">
                <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#f3a847]">India → Seoul 2026</p>
                <h2 id="kcube-india-preselection" className="mt-3 text-3xl font-black leading-[0.98] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.65rem]">
                  K-CUBE INDIA PRE-SELECTION
                </h2>
                <p className="mt-4 text-lg font-semibold leading-8 text-[#f8fafc] sm:text-xl">
                  Your voice. Your message. Your stage.
                </p>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[#d5d9d9] sm:text-base sm:leading-8">
                  K-CUBE India is inviting singers and musical artists from across India to participate in the India Pre-Selection for the ITAEWON World Music Spirit Festival 2026.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/india-pre-selection"
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd814] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]"
                >
                  Open dedicated page
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="max-w-sm text-xs leading-6 text-[#aab5c6]">
                  Submit details and apply from the dedicated page. For direct email help, contact{' '}
                  <a href="mailto:kcubeadm@gmail.com" className="font-bold text-[#f3a847] transition hover:text-[#ffd814]">
                    kcubeadm@gmail.com
                  </a>
                  .
                </p>
              </div>

              <div className="mt-9 flex flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-square w-full max-w-[560px]">
                  <img
                    src="/assets/kcube-india-preselection-cube.png"
                    alt="K-CUBE India event image"
                    className="h-full w-full object-contain object-center"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,18,0.12),rgba(8,11,18,0.78))]" />
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                    <div className="max-w-xl">
                      <p className="mt-2 text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
                        Official festival artwork for the October 4-6, 2026 event in Itaewon, Seoul, Korea.
                      </p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/90 sm:inline-flex">
                      <Music4 className="h-4 w-4 text-[#ffd814]" />
                      Main performance Oct 6, 7:00-9:30 PM
                    </div>
                  </div>
                </div>
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
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#f3a847]">Important dates</p>
                <h3 className="text-2xl font-black text-white sm:text-3xl">One clear timeline</h3>
                <p className="max-w-2xl text-sm leading-7 text-[#aab5c6]">
                  K-CUBE India pre-selection, the official rounds, and the final festival path are shown in one sequence only.
                </p>
              </div>

              <ol className="relative mt-6 flex flex-1 flex-col gap-4 lg:mt-8">
                {timeline.map((item, index) => (
                  <li key={item.title} className="relative lg:grid lg:grid-cols-[30px_1fr] lg:items-stretch lg:gap-4">
                    <div className="relative hidden lg:block">
                      <span
                        className={`absolute left-1/2 top-6 h-full w-px -translate-x-1/2 ${
                          index === timeline.length - 1 ? 'bg-gradient-to-b from-[#f3a847] via-white/20 to-transparent' : 'bg-[#354152]'
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`absolute left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full border shadow-[0_0_0_6px_rgba(243,168,71,0.08)] ${
                          index === 0
                            ? 'border-[#f3a847]/80 bg-[#ffd814]'
                            : 'border-[#f3a847]/45 bg-[#111827]'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <article
                      className={`relative h-full overflow-hidden rounded-[22px] border p-5 shadow-[0_14px_30px_rgba(0,0,0,0.2)] transition sm:p-6 ${item.tone} ${index === 0 ? 'lg:ml-0' : 'lg:ml-0'}`}
                    >
                      {index === 0 ? <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f3a847] to-transparent" /> : null}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-current/75">{item.label}</p>
                          <h4 className="mt-3 text-lg font-black leading-tight text-white sm:text-xl">{item.title}</h4>
                        </div>
                        <CalendarDays className={`mt-0.5 h-5 w-5 shrink-0 ${index === 0 ? 'text-[#ffd814]' : 'text-[#8a93a4]'}`} />
                      </div>

                      <time
                        dateTime={item.dateTime}
                        className={`mt-4 block text-[1.75rem] font-black leading-none tracking-tight sm:text-[2rem] ${item.dateTone}`}
                      >
                        {item.date}
                      </time>

                      <p className={`mt-3 text-sm leading-7 ${index === 0 ? 'text-[#dbe7f3]' : 'text-[#aab5c6]'}`}>
                        {item.description}
                      </p>

                      {'extra' in item ? (
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f3a847]">
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
    </section>
  );
};

export default IndiaPreSelectionSection;
