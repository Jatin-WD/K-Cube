import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  BellRing,
  Camera,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Official Announcements | ITAEWON World Music Spirit Festival 2026 | K-CUBE',
  description: 'Official live notices, selection status, participant instructions and important dates for the K-CUBE India Pre-Selection.',
};

const participantActions = [
  ['01', 'Stay Active on K-CUBE', 'Continue using your K-CUBE account and follow your participant progress.'],
  ['02', 'Earn & Maintain Your Points', 'Participants progressing through the selection process should continue earning points on K-CUBE.'],
  ['03', 'Watch Official Announcements', 'Selection-related updates and instructions will be published on this Announcement page.'],
] as const;

const dates = [
  ['30 AUG 2026', 'India Pre-Selection', 'Completed', 'completed'],
  ['30 SEP 2026', 'Official Second Round', 'Upcoming', 'upcoming'],
  ['4-6 OCT 2026', 'ITAEWON World Music Spirit Festival', 'Seoul, South Korea', 'festival'],
] as const;

const progressStages = [
  ['01', 'Applications', 'CLOSED', 'Applications are no longer being accepted.', 'closed'],
  ['02', 'India Pre-Selection', 'COMPLETED', '30 August 2026', 'completed'],
  ['03', 'Selection / Review Process', 'CURRENT STAGE', 'Existing participant submissions remain relevant.', 'current'],
  ['04', 'Official Second Round', 'UPCOMING', '30 September 2026', 'upcoming'],
  ['05', 'Festival Stage', '4-6 OCTOBER 2026', 'Seoul, Korea', 'festival'],
] as const;

const notices = [
  ['NOTICE 01', '2 September 2026', 'India Pre-Selection Applications Closed', 'The 2026 India Pre-Selection application period has concluded. New submissions are no longer being accepted.', 'CLOSED', 'closed'],
  ['NOTICE 02', '30 August 2026', 'India Pre-Selection Completed', 'The K-CUBE India Pre-Selection stage was conducted on 30 August 2026.', 'COMPLETED', 'completed'],
  ['NOTICE 03', 'Upcoming', 'Official Second Round - 30 September 2026', 'Participants should continue checking official K-CUBE announcements for instructions related to the upcoming stage.', 'UPCOMING', 'upcoming'],
] as const;

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b77900]">{children}</p>;
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div><Eyebrow>{eyebrow}</Eyebrow><h2 className="mt-2 text-2xl font-black leading-tight text-[#102a43] sm:text-3xl">{title}</h2>{description && <p className="mt-3 max-w-3xl text-sm leading-7 text-[#526f8f]">{description}</p>}</div>;
}

function StatusChip({ children, tone }: { children: ReactNode; tone: string }) {
  const styles = tone === 'current' ? 'border-[#2457d6]/30 bg-[#e8f0ff] text-[#2457d6]' : tone === 'completed' ? 'border-[#b9d9d0] bg-[#effaf6] text-[#19745d]' : tone === 'festival' ? 'border-[#e5c56b] bg-[#fff8df] text-[#9a6800]' : 'border-[#d8e1ee] bg-[#f8fbff] text-[#526f8f]';
  return <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${styles}`}>{children}</span>;
}

export default function AnnouncementPage() {
  return (
    <main className="min-h-screen bg-[#eef4f8] text-[#102a43]">
      <section className="px-3 py-6 sm:px-4 sm:py-8 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-5 lg:grid-cols-[1fr_280px] lg:items-stretch">
          <article className="rounded-[24px] border border-[#cbd9ea] bg-white p-6 shadow-[0_14px_35px_rgba(15,55,95,0.08)] sm:p-8 lg:p-9">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e5c56b] bg-[#fff8df] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#9a6800]"><BellRing className="h-4 w-4" />Official notice board • 2026</p>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-[#102a43] sm:text-4xl lg:text-5xl">ITAEWON World Music Spirit 2026<br />Official Announcements</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#526f8f] sm:text-base">Official updates for K-CUBE India participants, selection stages, important dates and festival-related notices.</p>
            <div className="mt-5 flex flex-wrap items-center gap-3"><StatusChip tone="completed"><CheckCircle2 className="mr-2 h-4 w-4" />India pre-selection • Closed</StatusChip><span className="text-sm font-semibold text-[#526f8f]">Selection process continues for existing participants.</span></div>
            <p className="mt-3 text-sm leading-6 text-[#526f8f]">India Pre-Selection concluded on 30 August 2026. This board carries the next official updates.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row"><a href="#latest-update" className="kc-button kc-button-primary">View latest update<ArrowDown className="h-4 w-4" /></a><Link href="/india-pre-selection/information" className="kc-button kc-button-secondary">Festival information<ArrowRight className="h-4 w-4" /></Link></div>
          </article>
          <aside className="flex flex-col justify-between rounded-[24px] border border-[#cbd9ea] bg-[#102a43] p-6 text-white shadow-[0_14px_35px_rgba(15,55,95,0.1)] sm:p-7">
            <div><Eyebrow>Current status</Eyebrow><p className="mt-3 text-3xl font-black leading-tight">Selection process ongoing</p><p className="mt-3 text-sm leading-6 text-[#c3d8f1]">Existing participant submissions remain part of the current review process.</p></div>
            <div className="mt-8 border-t border-white/15 pt-4 text-xs font-bold text-[#bcd7ff]">Last updated<br /><span className="mt-1 inline-block text-sm text-white">2 September 2026</span></div>
          </aside>
        </div>
      </section>

      <section id="latest-update" className="px-3 pb-6 sm:px-4 sm:pb-8 lg:px-10">
        <div className="mx-auto max-w-[1240px] rounded-[24px] border border-[#cbd9ea] bg-white p-6 shadow-[0_14px_35px_rgba(15,55,95,0.07)] sm:p-8 lg:p-9"><SectionTitle eyebrow="Latest announcement" title="India Pre-Selection Completed - Selection Process Continues" /><div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[#526f8f]"><span>2 September 2026</span><span>• K-CUBE India</span><span>• Participant Update</span></div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start"><div className="max-w-3xl space-y-4 text-sm leading-7 text-[#526f8f]"><p>The 2026 K-CUBE India Pre-Selection held on 30 August 2026 has now concluded.</p><p>Thank you to everyone who participated and submitted their performances.</p><p>Applications for the India Pre-Selection are now closed. Existing participant submissions remain part of the ongoing selection process.</p><p>Participants are requested to continue following official K-CUBE announcements for selection updates and upcoming stages.</p></div><div className="rounded-[18px] border border-[#2457d6]/25 bg-[#e8f0ff] p-5"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2457d6]">Current status</p><p className="mt-3 text-xl font-black text-[#102a43]">Selection process ongoing</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full w-2/3 rounded-full bg-[#2457d6]" /></div></div></div></div>
      </section>

      <section className="px-3 pb-6 sm:px-4 sm:pb-8 lg:px-10"><div className="mx-auto max-w-[1240px] rounded-[24px] border border-[#cbd9ea] bg-white p-6 sm:p-8 lg:p-9"><SectionTitle eyebrow="For existing participants" title="What Should I Do Now?" description="The application window is closed, but current participants should keep their account active and follow the operational updates below." /><div className="mt-6 grid gap-4 lg:grid-cols-3">{participantActions.map(([number, title, text], index) => <article key={title} className={`rounded-[18px] border p-5 ${index === 1 ? 'border-[#e5c56b] bg-[#fffdf5]' : 'border-[#d8e1ee] bg-[#f8fbff]'}`}><div className="flex items-center justify-between"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0ff] text-xs font-black text-[#2457d6]">{number}</span>{index === 1 && <span className="text-xs font-black text-[#b77900]">Target: 1,000+ points</span>}</div><h3 className="mt-5 text-lg font-black text-[#102a43]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#526f8f]">{text}</p>{index === 1 && <p className="mt-3 text-xs leading-5 text-[#526f8f]">Points can be earned through eligible K-CUBE activities and referral participation available on the platform. This target does not guarantee final selection.</p>}{index === 2 && <Link href="/rewards" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#2457d6]">Explore ways to earn points<ArrowRight className="h-4 w-4" /></Link>}</article>)}</div></div></section>

      <section className="px-3 pb-6 sm:px-4 sm:pb-8 lg:px-10"><div className="mx-auto max-w-[1240px] rounded-[24px] border border-[#cbd9ea] bg-white p-6 sm:p-8 lg:p-9"><SectionTitle eyebrow="Important dates" title="The next moments in the 2026 cycle" /><div className="mt-6 grid gap-4 lg:grid-cols-3">{dates.map(([date, title, note, tone], index) => <article key={date} className="relative rounded-[18px] border border-[#d8e1ee] bg-[#f8fbff] p-5"><StatusChip tone={tone}>{note}</StatusChip><p className="mt-4 text-2xl font-black text-[#102a43]">{date}</p><h3 className="mt-2 text-base font-black text-[#102a43]">{title}</h3>{index < dates.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 rounded-full bg-white text-[#b77900] lg:block" />}</article>)}</div></div></section>

      <section className="px-3 pb-6 sm:px-4 sm:pb-8 lg:px-10"><div className="mx-auto max-w-[1240px] rounded-[24px] border border-[#cbd9ea] bg-white p-6 sm:p-8 lg:p-9"><SectionTitle eyebrow="Selection status" title="2026 Selection Progress" description="The current stage shows where the existing participant process stands. No individual selection result is implied here." /><div className="mt-7 grid gap-3 md:grid-cols-5">{progressStages.map(([number, title, status, detail, tone], index) => <div key={number} className={`relative rounded-[18px] border p-4 ${tone === 'current' ? 'border-[#2457d6] bg-[#e8f0ff] shadow-[0_8px_22px_rgba(36,87,214,0.12)]' : tone === 'completed' ? 'border-[#b9d9d0] bg-[#effaf6]' : tone === 'festival' ? 'border-[#e5c56b] bg-[#fff8df]' : 'border-[#d8e1ee] bg-[#f8fbff]'}`}><span className="text-xs font-black text-[#2457d6]">{number}</span><h3 className="mt-4 text-sm font-black leading-5 text-[#102a43]">{title}</h3><p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#b77900]">{status}</p><p className="mt-2 text-xs leading-5 text-[#526f8f]">{detail}</p>{index < progressStages.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 rounded-full bg-white text-[#b77900] md:block" />}</div>)}</div></div></section>

      <section className="px-3 pb-6 sm:px-4 sm:pb-8 lg:px-10"><div className="mx-auto flex max-w-[1240px] items-start gap-4 rounded-[20px] border border-[#d8e1ee] bg-[#f8fbff] p-5 sm:p-6"><ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#2457d6]" /><div><h2 className="text-lg font-black text-[#102a43]">Please Follow Official K-CUBE Updates</h2><p className="mt-2 max-w-4xl text-sm leading-7 text-[#526f8f]">Selection-related information may be updated as the festival process progresses. Participants should rely on the official K-CUBE Announcement page for India-specific notices and instructions.</p><p className="mt-3 text-xs font-bold text-[#526f8f]">Last updated: 2 September 2026</p></div></div></section>

      <section className="px-3 pb-6 sm:px-4 sm:pb-8 lg:px-10"><div className="mx-auto max-w-[1240px] rounded-[24px] border border-[#cbd9ea] bg-white p-6 sm:p-8 lg:p-9"><SectionTitle eyebrow="Latest notices" title="Official notice feed" description="New notices can be added above older entries while keeping the operational history easy to scan." /><div className="mt-6 divide-y divide-[#d8e1ee] rounded-[18px] border border-[#d8e1ee]">{notices.map(([label, date, title, text, status, tone]) => <article key={label} className="grid gap-4 p-5 sm:grid-cols-[150px_1fr_auto] sm:items-start"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#2457d6]">{label}</p><p className="mt-2 text-xs font-bold text-[#526f8f]">{date}</p></div><div><h3 className="text-base font-black text-[#102a43]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#526f8f]">{text}</p></div><StatusChip tone={tone}>{status}</StatusChip></article>)}</div></div></section>

      <section className="px-3 pb-6 sm:px-4 sm:pb-8 lg:px-10"><div className="mx-auto grid max-w-[1240px] gap-5 rounded-[24px] border border-[#d9c4f0] bg-[#f7f1ff] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-9"><div><Eyebrow>Next participation cycle</Eyebrow><h2 className="mt-2 text-2xl font-black text-[#102a43] sm:text-3xl">Interested in Participating Next Time?</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#526f8f]">The 2026 India participation window has closed. K-CUBE plans to open participation opportunities again for the next ITAEWON World Music Festival cycle in 2027. Registration dates, eligibility requirements and participation details will be announced after official confirmation.</p></div><Link href="/india-pre-selection/information" className="kc-button kc-button-primary whitespace-nowrap">Follow 2027 updates<ArrowRight className="h-4 w-4" /></Link></div></section>

      <section className="px-3 pb-10 sm:px-4 sm:pb-12 lg:px-10"><div className="mx-auto grid max-w-[1240px] gap-5 rounded-[24px] bg-[#082f68] p-6 text-white shadow-[0_18px_45px_rgba(15,55,95,0.14)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-9"><div><Eyebrow>Stay informed</Eyebrow><h2 className="mt-2 text-2xl font-black sm:text-3xl">Follow the Official Festival Journey</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#d5e5fb]">Keep checking K-CUBE for selection updates, participant instructions and official festival announcements.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/india-pre-selection/information" className="kc-button kc-button-primary whitespace-nowrap">View festival information<ArrowRight className="h-4 w-4" /></Link><a href="https://www.instagram.com/k_cube_store/" target="_blank" rel="noreferrer" className="kc-button kc-button-secondary whitespace-nowrap"><Camera className="h-4 w-4" />Follow K-CUBE updates</a></div></div></section>
    </main>
  );
}
