"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, CheckCircle2, Globe2, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const heroCopy = {
  en: { eyebrow: 'Global music · culture · remembrance', title: 'ITAEWON World Music Festival', intro: 'An international music and cultural gathering bringing voices from around the world together in Itaewon, Seoul.', status: '2026 India pre-selection · Closed', detail: "India's 2026 pre-selection was conducted through K-CUBE on 30 August 2026. Follow official announcements for the current festival cycle and future participation updates.", announcements: 'View announcements', explore: 'Explore the festival', representation: 'Official India representation', alt: 'ITAEWON World Music Festival logo' },
  ko: { eyebrow: '글로벌 음악 · 문화 · 추모', title: '이태원 세계 음악 페스티벌', intro: '서울 이태원에서 전 세계의 목소리가 음악과 문화를 통해 만나는 국제 축제입니다.', status: '2026 인도 프리셀렉션 · 종료', detail: '2026 인도 프리셀렉션은 2026년 8월 30일 K-CUBE를 통해 진행되었습니다. 현재 축제 일정과 향후 참가 소식은 공식 공지를 확인하세요.', announcements: '공지사항 보기', explore: '축제 알아보기', representation: '인도 공식 대표 안내', alt: '이태원 세계 음악 페스티벌 로고' },
  hi: { eyebrow: 'वैश्विक संगीत · संस्कृति · स्मरण', title: 'इटावॉन वर्ल्ड म्यूज़िक फेस्टिवल', intro: 'सियोल के इटावॉन में दुनिया भर की आवाज़ों को संगीत और संस्कृति के माध्यम से जोड़ने वाला अंतरराष्ट्रीय उत्सव।', status: '2026 इंडिया प्री-सेलेक्शन · बंद', detail: '2026 इंडिया प्री-सेलेक्शन 30 अगस्त 2026 को K-CUBE के माध्यम से आयोजित हुआ। वर्तमान फेस्टिवल चक्र और भविष्य के अपडेट के लिए आधिकारिक घोषणाएँ देखें।', announcements: 'घोषणाएँ देखें', explore: 'फेस्टिवल जानें', representation: 'भारत का आधिकारिक प्रतिनिधित्व', alt: 'इटावॉन वर्ल्ड म्यूज़िक फेस्टिवल लोगो' },
} as const;

export default function IndiaPreSelectionInformationHero() {
  const language = useAppStore((state) => state.language);
  const t = heroCopy[language];
  return (
    <section className="px-3 py-6 sm:px-4 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[1320px] overflow-hidden rounded-[28px] border border-[#cbd9ea] bg-[#082f68] text-white shadow-[0_24px_65px_rgba(15,55,95,0.18)] lg:grid-cols-[1.02fr_0.98fr]">
        <article className="relative flex flex-col justify-center overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2468d8]/20 blur-3xl" aria-hidden="true" />
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#8cb8ff]/35 bg-[#174e9b]/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#bcd7ff]">
              <Globe2 className="h-4 w-4" />
              {t.eyebrow}
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">{t.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#d5e5fb] sm:text-lg">{t.intro}</p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-[#a7e5d0]/45 bg-[#0d5a58]/45 px-4 py-3 text-sm font-bold text-[#c6f3e1]"><CheckCircle2 className="h-5 w-5 shrink-0" />{t.status}</div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#c3d8f1]">{t.detail}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/india-pre-selection/announcement" className="kc-button kc-button-primary w-full whitespace-nowrap sm:w-auto">{t.announcements}<ArrowRight className="h-4 w-4" /></Link>
              <a href="#festival-story" className="kc-button kc-button-secondary w-full whitespace-nowrap sm:w-auto">{t.explore}<ArrowRight className="h-4 w-4" /></a>
            </div>
            <a href="#official-india-representation" className="mt-5 inline-flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#d7e7ff] underline decoration-[#d29b24] underline-offset-4 hover:text-white">{t.representation}<ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </article>
        <figure className="relative min-h-[360px] overflow-hidden bg-[#101b36] lg:min-h-[500px]">
          <Image src="/assets/itaewon-logo.png" alt={t.alt} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover object-center" priority />
        </figure>
      </div>
    </section>
  );
}
