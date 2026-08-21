import Link from 'next/link';
import { ArrowRight, BellRing, Info, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Announcement | ITAEWON World Music Spirit Festival 2026',
  description: 'Latest official updates, notices, deadlines, and process changes for the ITAEWON World Music Spirit Festival 2026.',
};

const noticeCards = [
  {
    title: 'Application deadline',
    tag: 'Deadline',
    text: 'India pre-selection closes August 30, 2026.',
    accent: true,
  },
  {
    title: 'Application status',
    tag: 'Status',
    text: 'Applications are currently open.',
  },
  {
    title: 'Process note',
    tag: 'Action item',
    text: 'Applicants should sign in to Apply and complete the submission inside K-CUBE.',
  },
  {
    title: 'Notice board purpose',
    tag: 'Notice board',
    text: 'Use this page for deadline reminders, process updates and official notices.',
  },
];

const dateRows = [
  {
    label: 'Current',
    value: 'K-CUBE India Pre-Selection',
    note: 'India pre-selection application deadline.',
    accent: true,
  },
  {
    label: 'Next',
    value: 'August 30, 2026',
    note: 'KR Official 1st Round.',
  },
  {
    label: 'Upcoming',
    value: 'September 30, 2026',
    note: 'KR Official 2nd Round.',
  },
  {
    label: 'Festival',
    value: 'October 4-6, 2026',
    note: 'Itaewon World Music Spirit Festival. Seoul, South Korea.',
  },
];

export default function AnnouncementPage() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#111827]">
      <section className="px-3 py-7 sm:px-4 sm:py-9 lg:px-10 lg:py-11">
        <div className="mx-auto grid max-w-[1760px] gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <article className="overflow-hidden rounded-[32px] border border-[#d5d9d9] bg-[linear-gradient(180deg,#191f2c_0%,#0b1120_100%)] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:p-7 lg:p-8">
            <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">
              <BellRing className="h-4 w-4" />
              Live notice board
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              ITAEWON World Music Spirit 2026 - Announcement
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d5d9d9] sm:text-base sm:leading-8">
              Check the latest official notices, deadlines, process updates, and applicant instructions.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/india-pre-selection/apply"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
              >
                Apply now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/india-pre-selection/information"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
              >
                Back to information
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 md:items-stretch">
              <article className="flex h-full flex-col rounded-[24px] border border-[#f3a847]/60 bg-[linear-gradient(180deg,#151d2d_0%,#101826_100%)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ffd814]">Application deadline</p>
                <p className="mt-3 text-lg font-black text-white">K-CUBE India Pre-Selection</p>
                <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-[#ffd814] sm:text-[2.25rem]">August 30, 2026</p>
              </article>
              <article className="flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f3a847]">Current status</p>
                <p className="mt-3 text-lg font-black text-white">Application open</p>
                <p className="mt-2 text-sm leading-7 text-[#d5d9d9]">
                  Sign in on Apply to unlock the form and keep the submission inside your K-CUBE account.
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
              {noticeCards.map((notice) => (
                <article
                  key={notice.title}
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
              <div className="rounded-[24px] border border-[#d5d9d9] bg-[#111827] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a847]">Important dates</p>
                <div className="mt-4 space-y-3">
                  {dateRows.map((row) => (
                    <div
                      key={row.label}
                      className={`rounded-[20px] border p-4 ${row.accent ? 'border-[#f3a847]/60 bg-[#151d2d]' : 'border-white/10 bg-white/[0.03]'}`}
                    >
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3a847]">{row.label}</p>
                      <p className="mt-2 text-2xl font-black leading-tight text-white">{row.value}</p>
                      <p className="mt-2 text-sm leading-7 text-[#d5d9d9]">{row.note}</p>
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
