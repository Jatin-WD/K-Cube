'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, MapPin } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { festival2026, maskedIndiaSecondRoundParticipants } from '@/lib/festival2026';

export const festivalArchiveCopy = {
  en: {
    badge: 'Past event · Completed', title: 'ITAEWON World Music Spirit Festival 2026',
    intro: 'The festival took place on 4–6 October 2026 in Itaewon, Seoul and has now concluded. Thank you to everyone who was part of the 2026 journey.',
    archive: '2026 festival archive', information: 'View festival archive', announcements: 'Archived announcements',
    closed: 'The 2026 participation cycle has ended. Applications are closed; this information is retained as an archive.',
    timeline: 'The 2026 timeline', stages: ['India Pre-Selection', 'Official Second Round', 'Festival in Seoul'],
    dates: ['30 August 2026', '30 September 2026', '4–6 October 2026'], complete: 'Completed',
    participants: 'Archived India second-round selection notice', privacy: 'Names remain partially masked to protect participant privacy. This is a historical selection notice, not an active application round.',
    future: 'Future participation', futureText: 'Dates and applications for the next edition have not been announced here. Follow K-CUBE for officially confirmed opportunities.', events: 'Explore other events',
  },
  hi: {
    badge: 'पिछला इवेंट · संपन्न', title: 'ITAEWON World Music Spirit Festival 2026',
    intro: '4–6 अक्टूबर 2026 को इटावॉन, सियोल में हुआ फ़ेस्टिवल अब संपन्न हो चुका है। 2026 की यात्रा में शामिल सभी लोगों का धन्यवाद।',
    archive: '2026 फ़ेस्टिवल आर्काइव', information: 'फ़ेस्टिवल आर्काइव देखें', announcements: 'पुरानी घोषणाएँ',
    closed: '2026 भागीदारी चक्र समाप्त हो चुका है। आवेदन बंद हैं; यह जानकारी ऐतिहासिक रिकॉर्ड के लिए रखी गई है।',
    timeline: '2026 की समयरेखा', stages: ['इंडिया प्री-सेलेक्शन', 'आधिकारिक दूसरा राउंड', 'सियोल में फ़ेस्टिवल'],
    dates: ['30 अगस्त 2026', '30 सितंबर 2026', '4–6 अक्टूबर 2026'], complete: 'संपन्न',
    participants: 'भारत के दूसरे राउंड की पुरानी चयन सूचना', privacy: 'गोपनीयता के लिए नाम आंशिक रूप से छिपाए गए हैं। यह पुरानी चयन सूचना है; आवेदन अभी खुले नहीं हैं।',
    future: 'अगली भागीदारी', futureText: 'अगले संस्करण की तारीखें और आवेदन यहाँ घोषित नहीं किए गए हैं। आधिकारिक अवसरों के लिए K-CUBE से जुड़े रहें।', events: 'अन्य इवेंट्स देखें',
  },
  ko: {
    badge: '지난 행사 · 종료', title: 'ITAEWON World Music Spirit Festival 2026',
    intro: '2026년 10월 4–6일 서울 이태원에서 열린 페스티벌이 종료되었습니다. 2026년 여정에 함께해 주신 모든 분께 감사드립니다.',
    archive: '2026 페스티벌 아카이브', information: '페스티벌 아카이브 보기', announcements: '지난 공지',
    closed: '2026년 참가 일정이 종료되어 신청을 받지 않습니다. 이 정보는 기록으로 보관됩니다.',
    timeline: '2026년 일정 기록', stages: ['인도 프리셀렉션', '공식 2차 라운드', '서울 페스티벌'],
    dates: ['2026년 8월 30일', '2026년 9월 30일', '2026년 10월 4–6일'], complete: '종료',
    participants: '인도 2차 라운드 선발 공지 기록', privacy: '참가자의 개인정보 보호를 위해 이름 일부를 가렸습니다. 현재 모집이 아닌 과거 선발 공지입니다.',
    future: '향후 참가 안내', futureText: '다음 행사의 일정과 신청은 아직 이곳에 공지되지 않았습니다. 공식 소식은 K-CUBE에서 확인하세요.', events: '다른 이벤트 보기',
  },
};

export default function FestivalArchive({ compact = false, announcements = false }: { compact?: boolean; announcements?: boolean }) {
  const language = useAppStore((state) => state.language);
  const t = festivalArchiveCopy[language];
  const Heading = compact ? 'h2' : 'h1';
  return <section className="kc-festival-archive bg-[var(--kc-bg)] px-4 py-8 text-[var(--kc-text)] sm:py-10 lg:px-8">
    <div className="mx-auto kc-content overflow-hidden rounded-xl border border-[var(--kc-border)] bg-white">
      <div className="p-6 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--kc-border)] bg-[var(--kc-surface-soft)] px-3 py-1.5 text-xs font-bold kc-festival-status"><CheckCircle2 size={15} />{t.badge}</p>
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[var(--kc-text-muted)]">{announcements ? t.announcements : t.archive}</p>
        <Heading className="mt-2 max-w-4xl text-2xl font-extrabold leading-tight sm:text-4xl">{t.title}</Heading>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--kc-text-secondary)]">{t.intro}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[var(--kc-text-secondary)]"><MapPin size={14} />{festival2026.mainFestival.location}</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--kc-text-secondary)]">{t.closed}</p>
        <div className="mt-5 flex flex-wrap gap-3"><Link href="/india-pre-selection/information" className="kc-button kc-button-primary">{t.information}<ArrowRight size={16} /></Link><Link href={announcements ? '/events' : '/india-pre-selection/announcement'} className="kc-button kc-button-secondary">{announcements ? t.events : t.announcements}<ArrowRight size={16} /></Link></div>
      </div>
      <div className="border-t border-[var(--kc-border)] bg-[var(--kc-surface-soft)] p-6 sm:p-8"><h2 className="text-sm font-bold">{t.timeline}</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{t.stages.map((stage, index) => <article key={stage} className="rounded-lg border border-[var(--kc-border)] bg-white p-4"><p className="flex items-center gap-2 text-xs font-bold text-[var(--kc-blue-700)]"><CalendarDays className="kc-brand-icon" size={14} />{t.dates[index]}</p><h3 className="mt-3 text-sm font-bold">{stage}</h3><p className="mt-2 flex items-center gap-1 text-xs text-[var(--kc-text-secondary)]"><CheckCircle2 size={13} />{t.complete}</p></article>)}</div></div>
      {!compact && <div className="p-6 sm:p-8">{announcements && <div className="mb-7"><h2 className="text-lg font-bold">{t.participants}</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--kc-text-secondary)]">{t.privacy}</p><div className="mt-3 flex flex-wrap gap-2">{maskedIndiaSecondRoundParticipants.map((name) => <span key={name} className="rounded-full border border-[var(--kc-border)] px-3 py-2 text-sm font-semibold">{name}</span>)}</div></div>}<h2 className="text-lg font-bold">{t.future}</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--kc-text-secondary)]">{t.futureText}</p><Link href="/events" className="kc-link mt-4">{t.events}<ArrowRight size={16} /></Link></div>}
    </div>
  </section>;
}
