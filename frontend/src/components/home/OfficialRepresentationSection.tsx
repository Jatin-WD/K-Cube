"use client";

import Image from 'next/image';
import { Award, CalendarDays, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const certificateSrc = '/assets/itaewon-international-director-india-taewhan-lim-2026.png';
const certificateAlt = 'Certificate appointing Mr. Taewhan Lim as International Director representing India for the ITAEWON World Music Spirit Festival, dated August 1, 2026.';

const representationLabels = {
  en: { eyebrow: 'Official India representation', heading: 'Officially Appointed to Represent India', certificate: 'View full certificate', open: 'Open full appointment certificate', dialog: 'Official appointment certificate', close: 'Close certificate' },
  ko: { eyebrow: '인도 공식 대표 안내', heading: '인도를 대표하도록 공식 임명', certificate: '임명 인증서 보기', open: '임명 인증서 전체 보기', dialog: '공식 임명 인증서', close: '인증서 닫기' },
  hi: { eyebrow: 'भारत का आधिकारिक प्रतिनिधित्व', heading: 'भारत का प्रतिनिधित्व करने के लिए आधिकारिक नियुक्ति', certificate: 'पूरा प्रमाणपत्र देखें', open: 'पूरा नियुक्ति प्रमाणपत्र खोलें', dialog: 'आधिकारिक नियुक्ति प्रमाणपत्र', close: 'प्रमाणपत्र बंद करें' },
} as const;

export default function OfficialRepresentationSection() {
  const [open, setOpen] = useState(false);
  const language = useAppStore((state) => state.language);
  const labels = representationLabels[language];

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <section id="official-india-representation" className="px-3 pb-7 sm:px-4 sm:pb-9 lg:px-10" aria-labelledby="representation-heading">
      <div className="mx-auto grid max-w-[1320px] gap-8 rounded-[24px] border border-[#cbd9ea] bg-white p-5 shadow-[0_12px_35px_rgba(15,55,95,0.07)] sm:p-7 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:p-9">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b77900]">{labels.eyebrow}</p>
          <h2 id="representation-heading" className="mt-2 max-w-xl text-3xl font-black leading-tight tracking-tight text-[#102a43] sm:text-4xl">{labels.heading}</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#526f8f]">Mr. Taewhan Lim has been appointed as the International Director representing India for the ITAEWON World Music Spirit Festival.</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#526f8f]">The appointment recognizes leadership and commitment to cultural exchange, music, global harmony, and the festival&apos;s core values of Tribute, Healing, Unity and Vision.</p>
          <div className="mt-7 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="border-l-2 border-[#2457d6] pl-4"><p className="text-lg font-black text-[#102a43]">Mr. Taewhan Lim</p><p className="mt-1 text-sm text-[#526f8f]">International Director<br />Representing India</p></div>
            <div className="border-l-2 border-[#d29b24] pl-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#b77900]">ITAEWON World Music Spirit Festival</p><p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#102a43]"><CalendarDays className="h-4 w-4 text-[#2457d6]" />Appointment date: 01 August 2026</p></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#8d4f00]"><span>Tribute</span><span aria-hidden="true">·</span><span>Healing</span><span aria-hidden="true">·</span><span>Unity</span><span aria-hidden="true">·</span><span>Vision</span></div>
          <button type="button" onClick={() => setOpen(true)} className="kc-button kc-button-primary mt-7"><Award className="h-4 w-4" />{labels.certificate}</button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#e3e8ef] bg-[#faf9f5] p-4 sm:p-6">
          <button type="button" onClick={() => setOpen(true)} className="group block w-full max-w-[410px] cursor-zoom-in rounded-[10px] border border-[#d8d0c2] bg-white p-2 shadow-[0_16px_32px_rgba(15,55,95,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457d6] focus-visible:ring-offset-2" aria-label={labels.open}>
            <Image src={certificateSrc} alt={certificateAlt} width={1060} height={1500} sizes="(min-width: 1024px) 410px, 85vw" className="h-auto w-full transition group-hover:opacity-90" priority={false} />
          </button>
          <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#8290a3]">Official appointment · India · 2026</p>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#07101b]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="certificate-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div className="relative flex max-h-[95vh] w-full max-w-3xl flex-col items-center overflow-auto rounded-[14px] bg-[#faf9f5] p-3 shadow-2xl sm:p-5">
            <div className="flex w-full items-center justify-between gap-4 border-b border-[#d8e1ee] pb-3"><h2 id="certificate-dialog-title" className="text-sm font-black text-[#102a43] sm:text-base">{labels.dialog}</h2><button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-[#102a43] hover:bg-[#eaf3ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457d6]" aria-label={labels.close}><X className="h-5 w-5" /></button></div>
            <Image src={certificateSrc} alt={certificateAlt} width={1060} height={1500} sizes="(min-width: 768px) 700px, 92vw" className="mt-4 h-auto max-h-[calc(95vh-90px)] w-auto max-w-full object-contain" />
            <p className="sr-only">Press Escape or use the close button to close this certificate preview.</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
