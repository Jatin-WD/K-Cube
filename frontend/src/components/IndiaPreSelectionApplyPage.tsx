"use client";

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, LockKeyhole, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import IndiaPreSelectionApplicationForm from '@/components/IndiaPreSelectionApplicationForm';

const quickChecklist = [
  {
    title: 'Eligibility',
    icon: Users,
    items: [
      'India-based singers and musical artists can apply here.',
      'Solo or group performances are both welcome.',
      'Use Information if you want the festival context first.',
    ],
  },
  {
    title: 'Prepare now',
    icon: FileText,
    items: [
      'Full name, nationality, city, email, and phone or WhatsApp.',
      'Short biography, performance category, and a video link or file.',
      'Keep everything ready before you open the form.',
    ],
  },
  {
    title: 'How it works',
    icon: ShieldCheck,
    items: [
      'Sign in or create an account to unlock the submission form.',
      'Your application stays saved inside K-CUBE.',
      'The first successful submission can earn points automatically.',
    ],
  },
  {
    title: 'Stay updated',
    icon: Sparkles,
    items: [
      'Check Announcement for deadline reminders or changes.',
      'If anything changes, the notice board updates first.',
      'After sign-in, the page switches to the form experience.',
    ],
  },
] as const;

export default function IndiaPreSelectionApplyPage() {
  const user = useAppStore((state) => state.user);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <main className="min-h-screen bg-[#ece8dc]" />;
  }

  if (user) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,216,20,0.16),_transparent_28%),_linear-gradient(180deg,#f4f1ea_0%,#ece8dc_100%)] text-[#111827]">
        <section className="hidden">
          <div className="mx-auto grid max-w-[1760px] gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <article className="overflow-hidden rounded-[32px] border border-[#d5d9d9] bg-[linear-gradient(180deg,#111827_0%,#0b1220_100%)] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:p-8 lg:p-10">
              <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">
                <ShieldCheck className="h-4 w-4" />
                Application access
              </p>

              <p className="mt-5 text-[11px] font-black uppercase tracking-[0.34em] text-[#f3a847]">Submit for Itaewon event</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Submit your India pre-selection application
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d5d9d9] sm:text-base sm:leading-8">
                You are signed in, so the submission stays attached to your account and can be tracked in one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#f3a847]/40 bg-[#fff8df] px-3 py-1 text-xs font-black text-[#111827]">
                  Saved to your account
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-white">
                  Internal application
                </span>
              </div>
            </article>

            <aside className="flex h-full flex-col justify-between gap-4">
              <div className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">What happens here</p>
                <div className="mt-4 space-y-3">
                  {[
                    'The form is tied to your account, not email.',
                    'Your first successful submission can earn points automatically.',
                    'After submission, the page will show your saved application instead of the form.',
                  ].map((item, index) => (
                    <div key={item} className="rounded-[20px] border border-[#d5d9d9] bg-[#f7fafa] px-4 py-4 text-sm leading-7 text-[#565959]">
                      0{index + 1}. {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#d5d9d9] bg-[linear-gradient(180deg,#111827_0%,#0b1220_100%)] p-5 text-white shadow-sm sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a847]">Fast path</p>
                <p className="mt-3 text-sm leading-7 text-[#d5d9d9]">
                  Keep your video link public and valid. Google Drive links are fine as long as the file or preview can be opened by the team.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="px-3 pb-12 sm:px-4 sm:pb-16 lg:px-10">
          <div className="mx-auto max-w-[1760px] rounded-[30px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Application access</p>
                <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Submit for Itaewon event</h2>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-[#565959]">
                Once you sign in, the page keeps the process focused on the form and hides the extra guidance for a cleaner submission flow.
              </p>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#d5d9d9] bg-[#f7fafa] p-5">
              <IndiaPreSelectionApplicationForm compact />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,216,20,0.18),_transparent_26%),_linear-gradient(180deg,#ece8dc_0%,#e7e7e7_100%)] text-[#111827]">
      <section className="px-3 py-8 sm:px-4 sm:py-10 lg:px-10 lg:py-12">
        <div className="mx-auto grid max-w-[1760px] gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <article className="h-full overflow-hidden rounded-[32px] border border-[#d5d9d9] bg-[linear-gradient(180deg,#111827_0%,#0b1220_100%)] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:p-8 lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">
              <LockKeyhole className="h-4 w-4" />
              Apply
            </p>

            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.34em] text-[#f3a847]">
              K-CUBE India Pre-Selection
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Apply for ITAEWON World Music Spirit 2026
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d5d9d9] sm:text-base sm:leading-8">
              Sign in to unlock the application form, keep your submission saved in your account, and complete the India Pre-Selection in one focused flow.
            </p>

            <div className="mt-6 rounded-[28px] border border-[#f3a847]/40 bg-[#f3a847]/10 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">Application deadline</p>
              <p className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">August 30, 2026</p>
              <p className="mt-2 text-sm leading-7 text-[#d5d9d9]">
                Submit your India Pre-Selection application before this date.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/signin?returnTo=/india-pre-selection/apply"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
              >
                Sign in to apply
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup?returnTo=/india-pre-selection/apply"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </article>

          <aside className="flex h-full flex-col gap-4">
            <div className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Application status</p>
              <div className="mt-4 rounded-[24px] border border-[#d5d9d9] bg-[#f7fafa] p-5">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b12704]">Current state</p>
                <p className="mt-3 text-sm leading-7 text-[#565959]">
                  The form is locked until you sign in. Once you are inside your account, the page switches to the direct application experience.
                </p>
              </div>

              <div className="mt-4 rounded-[24px] border border-[#f3a847]/40 bg-[#fff8df] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">Need help?</p>
                <p className="mt-3 text-sm leading-7 text-[#565959]">
                  Read Information for context and Announcement for the latest notices before you submit.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d5d9d9] bg-[linear-gradient(180deg,#111827_0%,#0b1220_100%)] p-5 text-white shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3a847]">Fast path</p>
              <div className="mt-4 space-y-3">
                {[
                  'Check Information for the festival overview.',
                  'Review Announcement for the latest deadline.',
                  'Sign in here and complete the form inside K-CUBE.',
                ].map((item, index) => (
                  <div key={item} className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-[#e5e7eb]">
                    0{index + 1}. {item}
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Before you apply</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Quick checklist</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              Keep this section compact so the page stays focused on one outcome: getting you into the application form as quickly as possible.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {quickChecklist.map((block) => {
              const Icon = block.icon;
              return (
                <article key={block.title} className="rounded-[24px] border border-[#d5d9d9] bg-[#f7fafa] p-5">
                  <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">
                    <Icon className="h-4 w-4" />
                    {block.title}
                  </p>
                  <div className="mt-4 space-y-3">
                    {block.items.map((item) => (
                      <p key={item} className="flex items-start gap-3 text-sm leading-7 text-[#565959]">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#b12704]" />
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-3 pb-12 sm:px-4 sm:pb-16 lg:px-10">
        <div className="mx-auto max-w-[1760px] rounded-[30px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Application access</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Submit for Itaewon event</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              Once you sign in, the page keeps the process focused on the form and hides the extra guidance for a cleaner submission flow.
            </p>
          </div>

          <div className="mt-6 rounded-[28px] border border-[#d5d9d9] bg-[#f7fafa] p-5">
            <IndiaPreSelectionApplicationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
