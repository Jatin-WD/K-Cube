import Link from 'next/link';
import { ArrowRight, BellRing, Info, ShieldAlert } from 'lucide-react';
import { festival2026 } from '@/lib/festival2026';

export const metadata = {
  title: 'Announcement | ITAEWON World Music Spirit Festival 2026',
  description: 'Latest official updates, notices, deadlines, and process changes for the ITAEWON World Music Spirit Festival 2026.',
};

const noticeCards = [
  {
    title: 'Application status',
    tag: 'Status',
    text: 'The India pre-selection application window is closed. Check this page for official updates.',
    accent: true,
  },
  {
    title: 'Next official stage',
    tag: 'Upcoming',
    text: `The ${festival2026.officialSecondRound.title} is scheduled for ${festival2026.officialSecondRound.date}.`,
  },
  {
    title: 'Process note',
    tag: 'Action item',
    text: 'The India Pre-Selection application window is closed. Existing submission records remain preserved for review.',
  },
  {
    title: 'Notice board purpose',
    tag: 'Notice board',
    text: 'Use this page for deadline reminders, process updates and official notices.',
  },
];

const dateRows = [
  {
    label: 'Completed',
    value: festival2026.indiaPreSelection.title,
    note: festival2026.indiaPreSelection.date,
    accent: true,
  },
  {
    label: 'Upcoming',
    value: festival2026.officialSecondRound.date,
    note: festival2026.officialSecondRound.title,
  },
  {
    label: 'Festival',
    value: festival2026.mainFestival.date,
    note: `${festival2026.mainFestival.title}. ${festival2026.mainFestival.location}.`,
  },
];

export default function AnnouncementPage() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#111827]">
      <section className="px-3 py-7 sm:px-4 sm:py-9 lg:px-10 lg:py-11">
        <div className="mx-auto grid max-w-[1760px] gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <article className="overflow-hidden rounded-[32px] border border-[#d8e1ee] bg-white p-6 text-[#0f172a] shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-7 lg:p-8">
            <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">
              <BellRing className="h-4 w-4" />
              Live notice board
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              ITAEWON World Music Spirit 2026 - Announcement
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#64748b] sm:text-base sm:leading-8">
              Check the latest official notices, deadlines, process updates, and applicant instructions.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/india-pre-selection/information"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
              >
                View festival information
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/india-pre-selection/information"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e1ee] bg-[#f8fbff] px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:border-[#2457d6] hover:text-[#2457d6]"
              >
                Back to information
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 md:items-stretch">
              <article className="flex h-full flex-col rounded-[24px] border border-[#f3a847]/60 bg-[#fff8df] p-5 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ffd814]">Application deadline</p>
                <p className="mt-3 text-lg font-black text-[#0f172a]">K-CUBE India Pre-Selection</p>
                <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-[#ffd814] sm:text-[2.25rem]">Applications closed</p>
              </article>
              <article className="flex h-full flex-col rounded-[24px] border border-[#d8e1ee] bg-[#f8fbff] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f3a847]">Current status</p>
                <p className="mt-3 text-lg font-black text-[#0f172a]">Application status</p>
                <p className="mt-2 text-sm leading-7 text-[#64748b]">
                  New applications are closed for the completed India Pre-Selection stage. Follow this board for the next official update.
                </p>
              </article>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Quick links</p>
              <div className="mt-4 grid gap-3">
                {[
                  {
                    label: 'Information',
                    href: '/india-pre-selection/information',
                    description: 'Read the festival overview and the India context first.',
                  },
                  {
                    label: 'Apply',
                    href: '/india-pre-selection/apply',
                    description: 'Move to the submission flow after checking the notices.',
                  },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex h-full items-start justify-between gap-4 rounded-[20px] border border-[#d5d9d9] bg-[#f7fafa] px-4 py-4 transition hover:border-[#b12704] hover:bg-[#fff8df]"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-[#111827]">{link.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#5d646d]">{link.description}</span>
                    </span>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#b12704]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d5d9d9] bg-[#fff8df] p-5 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Notice rules</p>
              <div className="mt-4 grid gap-3">
                {[
                  'Keep notices short, current, and action-focused.',
                  'Only surface updates that applicants need to know now.',
                  'Use Information for the bigger story and Apply for submission.',
                ].map((item, index) => (
                  <div key={item} className="rounded-[20px] border border-[#f3a847]/40 bg-white px-4 py-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b12704]">Rule 0{index + 1}</p>
                    <p className="mt-2 text-sm leading-6 text-[#565959]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-3 pb-10 sm:px-4 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-[1760px] rounded-[30px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Latest notices</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">What applicants should check right now</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              This page is the live notice board. It should stay separate from the Information page and only carry the latest updates that matter right now.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-4">
              {noticeCards.map((notice, index) => (
                <article
                    key={`${notice.title}-${notice.tag}-${index}`}
                  className={`rounded-[24px] border p-5 ${notice.accent ? 'border-[#f3a847]/60 bg-[#fff8df]' : 'border-[#d5d9d9] bg-[#f7fafa]'}`}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">{notice.tag}</p>
                  <p className="mt-3 text-lg font-black text-[#111827]">{notice.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[#565959]">{notice.text}</p>
                </article>
              ))}

              <div className="rounded-[24px] border border-[#d5d9d9] bg-[#f7fafa] p-5">
                <p className="flex items-center gap-2 text-sm font-black text-[#111827]">
                  <Info className="h-4 w-4 text-[#b12704]" />
                  What this page is for
                </p>
                <p className="mt-2 text-sm leading-7 text-[#565959]">
                  Use this page for deadline reminders, process updates and official notices.
                </p>
                <div className="mt-4 rounded-[18px] border border-[#d5d9d9] bg-white px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#565959]">Need to apply now?</p>
                  <Link href="/india-pre-selection/apply" className="mt-1 inline-flex items-center gap-2 text-sm font-black text-[#b12704]">
                    Open Apply
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-[#d8e1ee] bg-white p-5 text-[#0f172a]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2457d6]">Important dates</p>
                <div className="mt-4 space-y-3">
                  {dateRows.map((row) => (
                    <div
                      key={row.label}
                      className={`rounded-[20px] border p-4 ${row.accent ? 'border-[#2457d6]/30 bg-[#e8f0ff]' : 'border-[#d8e1ee] bg-[#f8fbff]'}`}
                    >
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2457d6]">{row.label}</p>
                      <p className="mt-2 text-2xl font-black leading-tight text-[#0f172a]">{row.value}</p>
                      <p className="mt-2 text-sm leading-7 text-[#64748b]">{row.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#d5d9d9] bg-[#fff8df] p-5">
                <p className="flex items-center gap-2 text-sm font-black text-[#111827]">
                  <ShieldAlert className="h-4 w-4 text-[#b12704]" />
                  Keep it current
                </p>
                <p className="mt-2 text-sm leading-7 text-[#565959]">
                  If a note starts to read like an overview, move it back to Information and keep Announcement focused on the newest action item.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
