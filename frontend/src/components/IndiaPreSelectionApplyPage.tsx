"use client";

import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, History, MapPin } from 'lucide-react';
import { festival2026 } from '@/lib/festival2026';
import { useAppStore } from '@/store/useAppStore';

const applyCopy = {
  en: { eyebrow: 'India Pre-Selection', heading: 'Applications are closed', intro: 'The India Pre-Selection stage took place on', status: 'India Pre-Selection: Completed', preserved: 'Historical submissions and review data remain preserved for the K-CUBE team.', updates: 'View official updates', information: 'Festival information', next: 'What happens next', upcoming: 'Upcoming', main: 'Main festival', records: 'Existing application records remain available through member and admin areas.' },
  ko: { eyebrow: '인도 프리셀렉션', heading: '신청이 종료되었습니다', intro: '인도 프리셀렉션은 다음 날짜에 진행되었습니다:', status: '인도 프리셀렉션: 완료', preserved: '과거 제출 자료와 검토 데이터는 K-CUBE 팀을 위해 보존됩니다.', updates: '공식 업데이트 보기', information: '축제 정보', next: '다음 단계', upcoming: '예정', main: '메인 축제', records: '기존 신청 기록은 회원 및 관리자 영역에서 확인할 수 있습니다.' },
  hi: { eyebrow: 'इंडिया प्री-सेलेक्शन', heading: 'आवेदन बंद हैं', intro: 'इंडिया प्री-सेलेक्शन चरण इस तारीख को आयोजित हुआ:', status: 'इंडिया प्री-सेलेक्शन: पूरा हुआ', preserved: 'ऐतिहासिक सबमिशन और समीक्षा डेटा K-CUBE टीम के लिए सुरक्षित हैं।', updates: 'आधिकारिक अपडेट देखें', information: 'फेस्टिवल की जानकारी', next: 'अगला चरण', upcoming: 'आगामी', main: 'मुख्य फेस्टिवल', records: 'मौजूदा आवेदन रिकॉर्ड सदस्य और एडमिन क्षेत्रों में उपलब्ध हैं।' },
} as const;

export default function IndiaPreSelectionApplyPage() {
  const language = useAppStore((state) => state.language);
  const t = applyCopy[language];
  return (
    <main className="min-h-screen bg-[#eef4f8] px-4 py-8 text-[#102a43] sm:px-6 lg:px-10 lg:py-12">
      <section className="mx-auto max-w-[1320px] rounded-xl border border-[#dce6f0] bg-white p-6 shadow-[0_4px_18px_rgba(15,55,95,0.05)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="kc-eyebrow">{t.eyebrow}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">{t.heading}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#486581]">{t.intro} {festival2026.indiaPreSelection.date}. {language === 'en' ? 'New applications for this completed stage are no longer being accepted.' : language === 'ko' ? '완료된 단계에 대한 신규 신청은 더 이상 받지 않습니다.' : 'इस पूर्ण चरण के लिए नए आवेदन अब स्वीकार नहीं किए जा रहे हैं।'}</p>
            <div className="mt-6 rounded-lg border border-[#12a66a]/25 bg-[#effbf6] p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-[#087f52]"><CheckCircle2 className="h-4 w-4" /> {t.status}</p>
              <p className="mt-2 text-sm leading-6 text-[#486581]">{t.preserved}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/india-pre-selection/announcement" className="kc-button kc-button-primary">{t.updates} <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/india-pre-selection/information" className="kc-button kc-button-secondary">{t.information}</Link>
            </div>
          </div>
          <aside className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-5">
            <p className="kc-eyebrow">{t.next}</p>
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
