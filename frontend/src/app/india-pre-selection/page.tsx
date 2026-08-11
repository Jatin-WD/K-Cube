import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Globe2, MapPinned, Mic2, ShieldCheck, Sparkles, Users } from 'lucide-react';

export const metadata = {
  title: 'K-CUBE India Pre-Selection | ITAEWON World Music Spirit Festival 2026',
  description:
    'Official K-CUBE India pre-selection page with festival dates, submission details, values, support, and the poster for the ITAEWON World Music Spirit Festival 2026.',
};

const values = [
  {
    title: 'Tribute',
    description: 'We remember and honor the young lives lost in the 2022 Itaewon tragedy, and we remember other lives lost in unexpected disasters around the world.',
  },
  {
    title: 'Healing',
    description: 'Music and culture are used as a way to comfort people who carry grief, loss, and emotional pain.',
  },
  {
    title: 'Unity & Peace',
    description: 'The festival brings people together across nationality, language, and culture to encourage mutual respect and peace.',
  },
  {
    title: 'Vision',
    description: 'The long-term goal is a future built with compassion, hope, and shared humanity.',
  },
];

const whoCanApply = [
  'Open to all nationalities, races, and ages',
  'Amateur and professional artists are both welcome',
  'Solo and group performances are both welcome',
  'No restriction on musical genre or language',
];

const submissionFields = [
  'Full name',
  'Nationality',
  'Country and current city of residence',
  'Date of birth',
  'Email address',
  'Phone or WhatsApp',
  'Short biography',
  'Performance video file or link',
];

const supportBenefits = [
  'Airfare support, subject to selection criteria',
  'Complimentary hotel accommodation during the festival',
  'Seoul cultural and sightseeing program',
  'K-Beauty and K-Food VIP package',
  'International stage performance and networking opportunities',
];

const expectations = [
  'Selection is not based only on singing ability.',
  'Artists should understand the festival values and sincerely share them through their performance.',
  'Selected participants are expected to show mutual respect, responsibility, and professional conduct during the event.',
];

export default function IndiaPreSelectionPage() {
  return (
    <main className="min-h-screen bg-[#e7e7e7] text-[#111827]">
      <section className="border-b border-[#d5d9d9] bg-[linear-gradient(180deg,#111827_0%,#0b1220_100%)] px-3 py-6 text-white sm:px-4 sm:py-8 lg:px-10 lg:py-12">
        <div className="mx-auto grid max-w-[1760px] gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#111827_0%,#0b1220_100%)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:p-7 lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">
              <Sparkles className="h-4 w-4" />
              Dedicated submission page
            </p>

            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.34em] text-[#f3a847]">Share your voice. Share a message of hope.</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              K-CUBE India Pre-Selection
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d5d9d9] sm:text-base sm:leading-8">
              This page brings together the India pre-selection overview, the festival timeline, the submission details, and the support information for the ITAEWON World Music Spirit Festival 2026.
            </p>

            <div className="mt-6 rounded-[24px] border border-[#f3a847]/50 bg-[#f3a847]/10 p-4 sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#f3a847]">Main announcement</p>
              <p className="mt-3 text-sm leading-7 text-[#f8fafc] sm:text-base">
                On <span className="font-black text-[#ffd814]">25 August 2026</span>, K-CUBE will conduct the <span className="font-black text-[#ffd814]">1st audition</span> through this website on behalf of the Indian organiser of the ITAEWON World Music Spirit Festival 2026. We have been specifically asked to select participants from India for this Music Spirit journey.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#d5d9d9]">
                All applications for this page are submitted through the internal Apply page inside K-CUBE. No email submission is needed.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/india-pre-selection/apply"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
              >
                Open apply form
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/activities/k-pop-missions"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:border-[#f3a847] hover:text-[#f3a847]"
              >
                Continue to K-Pop Missions
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
              >
                Back to home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f3a847]">Festival story</p>
                <p className="mt-3 text-sm leading-7 text-[#d5d9d9]">
                  The festival was created to honor the lives lost in the October 29, 2022 Itaewon tragedy and to offer comfort to families, friends, witnesses, and rescue workers who were affected by it.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#d5d9d9]">
                  It also extends that message beyond Itaewon, using music and culture to comfort grief, connect communities, and encourage peace and compassion around the world.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#f3a847]/30 bg-[#f3a847]/10 p-4 sm:p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f3a847]">Submission note</p>
                <p className="mt-3 text-sm leading-7 text-[#f8fafc]">
                  Applications are submitted through the Apply page inside K-CUBE, and points are added after the first successful submission.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <figure className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0f172a] shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
              <div className="relative aspect-square w-full">
                <Image
                  src="/assets/kcube-india-preselection-cube.png"
                  alt="K-CUBE India event image"
                  fill
                  priority
                  className="object-contain object-center"
                />
              </div>
              <figcaption className="border-t border-white/10 bg-[#101827] px-5 py-4 text-sm leading-7 text-[#d5d9d9]">
                Official festival artwork for the October 4-6, 2026 event in Itaewon, Seoul, Korea.
                <span className="mt-1 block font-bold text-[#ffd814]">Main performance: October 6, 7:00-9:30 PM</span>
              </figcaption>
            </figure>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f3a847]">What to prepare</p>
              <div className="mt-4 space-y-3">
                {[
                  'Singer or musical artist from India',
                  'A short performance video ready to share',
                  'Name, city, contact number, and performance category',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <Mic2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd814]" />
                    <p className="text-sm leading-6 text-[#e5e7eb]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-10 sm:px-4 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-[1760px] rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Sub services</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Choose the page you need</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              The main festival hub now connects to three direct sub pages so visitors can read information, check announcements, or jump into the application flow.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                label: 'Information',
                href: '/india-pre-selection/information',
                description: 'Festival background, participation overview, and the main purpose of the event.',
              },
              {
                label: 'Announcement',
                href: '/india-pre-selection/announcement',
                description: 'Official notices, timeline reminders, and updates for applicants and visitors.',
              },
              {
                label: 'Apply',
                href: '/india-pre-selection/apply',
                description: 'Direct application route for the India pre-selection inside K-CUBE.',
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-[24px] border border-[#d5d9d9] bg-[#f7fafa] p-5 transition hover:border-[#f3a847] hover:bg-[#fff8df]"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">{item.label}</p>
                <p className="mt-3 text-base font-bold text-[#111827]">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-[#565959]">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#b12704]">
                  Open page
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 py-10 sm:px-4 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-[1760px] rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Festival values</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Why this festival exists</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              The festival uses music and culture as a bridge for remembrance, comfort, unity, and a shared vision of a more compassionate future.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <article key={value.title} className="rounded-[22px] border border-[#d5d9d9] bg-[#f7fafa] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b12704]">{value.title}</p>
                <p className="mt-3 text-sm leading-7 text-[#565959]">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-10 sm:px-4 sm:pb-14 lg:px-10">
        <div className="mx-auto grid max-w-[1760px] gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Artist participation</p>
            <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Who can apply</h2>
            <div className="mt-5 space-y-3">
              {whoCanApply.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[18px] border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#b12704]" />
                  <p className="text-sm leading-6 text-[#565959]">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[20px] border border-[#f3a847]/50 bg-[#fff8df] p-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b12704]">Important note</p>
              <p className="mt-2 text-sm leading-7 text-[#111827]">
                There is no application fee or video screening fee.
              </p>
            </div>
          </article>

          <article className="rounded-[28px] border border-[#d5d9d9] bg-[#111827] p-5 text-white shadow-sm sm:p-6 lg:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a847]">Timeline</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Application and festival schedule</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5d9d9]">
              The event path is shown in one sequence: India pre-selection, the official rounds, and the October festival in Seoul.
            </p>

            <div className="mt-6 space-y-4">
              {[
                {
                  title: 'India pre-selection deadline',
                  date: 'August 25, 2026',
                  note: 'Submit your application and performance video by this date.',
                  accent: true,
                },
                {
                  title: 'Official second round',
                  date: 'September 15, 2026',
                  note: 'Final official round before the festival stage path.',
                },
                {
                  title: 'Main festival dates',
                  date: 'October 4-6, 2026',
                  note: 'Itaewon World Food Street and Hamilton Hotel area, Itaewon, Seoul.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-[22px] border p-5 ${item.accent ? 'border-[#f3a847]/60 bg-[#151d2d]' : 'border-white/10 bg-white/[0.03]'}`}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f3a847]">{item.title}</p>
                  <p className="mt-3 text-2xl font-black leading-tight text-white">{item.date}</p>
                  <p className="mt-2 text-sm leading-7 text-[#d5d9d9]">{item.note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="px-3 pb-10 sm:px-4 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-[1760px] rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Submission details</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">What to send</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              Submit your application through the Apply page. The festival team requests one singing video plus the information below.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[22px] border border-[#d5d9d9] bg-[#f7fafa] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b12704]">Submission fields</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {submissionFields.map((field) => (
                  <div key={field} className="rounded-2xl border border-[#d5d9d9] bg-white px-4 py-3 text-sm font-semibold text-[#111827]">
                    {field}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[22px] border border-[#d5d9d9] bg-[#111827] p-5 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f3a847]">Submission rules</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd814]" />
                  <p className="text-sm leading-7 text-[#d5d9d9]">Applications should generally be submitted directly by the participating artist.</p>
                </div>
                <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd814]" />
                  <p className="text-sm leading-7 text-[#d5d9d9]">There is no restriction on nationality, genre, or language.</p>
                </div>
                <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd814]" />
                  <p className="text-sm leading-7 text-[#d5d9d9]">No application or video screening fee is charged.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-3 pb-10 sm:px-4 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-[1760px] rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Benefits and support</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">What selected artists may receive</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              The festival team says support is based on selection criteria and is designed to help international artists participate in Seoul.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {supportBenefits.map((item) => (
              <article key={item} className="rounded-[22px] border border-[#d5d9d9] bg-[#f7fafa] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b12704]">Support item</p>
                <p className="mt-3 text-sm leading-7 text-[#565959]">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-12 sm:px-4 sm:pb-16 lg:px-10">
        <div className="mx-auto grid max-w-[1760px] gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[28px] border border-[#d5d9d9] bg-[#111827] p-5 text-white shadow-sm sm:p-6 lg:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a847]">What we expect</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">More than just a singing contest</h2>
            <div className="mt-5 space-y-3">
              {expectations.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd814]" />
                  <p className="text-sm leading-7 text-[#d5d9d9]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Need help</p>
            <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Contact and next steps</h2>
            <p className="mt-4 text-sm leading-7 text-[#565959]">
              If you are ready to participate, submit your application through the Apply page and keep your performance video ready. For additional K-CUBE India coordination, the team can follow up from the saved record below.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-[18px] border border-[#f3a847]/40 bg-[#fff8df] px-4 py-4">
                <p className="text-sm font-black text-[#111827]">Festival location</p>
                <p className="mt-2 text-sm leading-7 text-[#565959]">
                  Itaewon World Food Street and Hamilton Hotel area, Itaewon, Seoul, Korea.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
