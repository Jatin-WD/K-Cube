import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, CheckCircle2, Globe2, Sparkles } from 'lucide-react';

export default function IndiaPreSelectionInformationHero() {
  return (
    <section className="px-3 py-6 sm:px-4 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[1320px] overflow-hidden rounded-[28px] border border-[#cbd9ea] bg-[#082f68] text-white shadow-[0_24px_65px_rgba(15,55,95,0.18)] lg:grid-cols-[1.02fr_0.98fr]">
        <article className="relative flex flex-col justify-center overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2468d8]/20 blur-3xl" aria-hidden="true" />
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#8cb8ff]/35 bg-[#174e9b]/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#bcd7ff]">
              <Globe2 className="h-4 w-4" />
              Global music • culture • remembrance
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">ITAEWON World Music Festival</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#d5e5fb] sm:text-lg">An international music and cultural gathering bringing voices from around the world together in Itaewon, Seoul.</p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-[#a7e5d0]/45 bg-[#0d5a58]/45 px-4 py-3 text-sm font-bold text-[#c6f3e1]"><CheckCircle2 className="h-5 w-5 shrink-0" />2026 India pre-selection • Closed</div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#c3d8f1]">India&apos;s 2026 pre-selection was conducted through K-CUBE on 30 August 2026. Follow official announcements for the current festival cycle and future participation updates.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/india-pre-selection/announcement" className="kc-button kc-button-primary w-full whitespace-nowrap sm:w-auto">View announcements<ArrowRight className="h-4 w-4" /></Link>
              <a href="#festival-story" className="kc-button kc-button-secondary w-full whitespace-nowrap sm:w-auto">Explore the festival<ArrowRight className="h-4 w-4" /></a>
            </div>
            <a href="#official-india-representation" className="mt-5 inline-flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#d7e7ff] underline decoration-[#d29b24] underline-offset-4 hover:text-white">Official India representation<ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </article>
        <figure className="relative min-h-[360px] overflow-hidden bg-[#101b36] lg:min-h-[500px]">
          <Image src="/assets/k-cube-banner.png" alt="2026 official ITAEWON World Music Festival India Pre-Selection campaign banner" fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover object-center" priority />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07101b]/90 via-[#07101b]/35 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#07101b]/60 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-sm"><Sparkles className="h-4 w-4" />2026 official India pre-selection campaign</p>
            <figcaption className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#e5edf9]"><CalendarDays className="h-4 w-4" />Archival campaign poster for the completed 2026 season</figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
