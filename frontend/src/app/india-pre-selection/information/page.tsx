import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import IndiaPreSelectionInformationHero from '@/components/home/IndiaPreSelectionInformationHero';

export const metadata = {
  title: 'Information | ITAEWON World Music Spirit Festival 2026',
  description: 'Festival overview, purpose, India pre-selection context, and the journey visitors should understand before applying.',
};

const processSteps = [
  '1. Understand the event story and the reason it exists.',
  '2. Read Announcement for the latest dates, notices and status.',
  '3. Follow the official updates for the next stage.',
];

const bottomLinks = [
  {
    label: 'Information',
    href: '/india-pre-selection/information',
    description: 'Use this page as the starting point for the festival journey.',
  },
  {
    label: 'Announcement',
    href: '/india-pre-selection/announcement',
    description: 'Open the latest notices, deadline updates and process changes.',
  },
  {
    label: 'Apply',
    href: '/india-pre-selection/apply',
    description: 'The completed India Pre-Selection application window is closed. Follow official updates for the next stage.',
  },
];

export default function InformationPage() {
  return (
    <main className="kc-india-page min-h-screen bg-[#eef4f8] text-[#102a43]">
      <IndiaPreSelectionInformationHero />

      <section className="px-3 pb-8 sm:px-4 sm:pb-10 lg:px-10">
        <div className="mx-auto max-w-[1320px] rounded-xl border border-[#dce6f0] bg-white px-5 py-5 shadow-[0_4px_18px_rgba(15,55,95,0.05)] sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Festival story</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">What the event means</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              This section gives the festival context before visitors move to official updates and historical application information.
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Festival overview',
                text: 'A remembrance-led music event with a larger cultural and community purpose.',
              },
              {
                title: 'Purpose',
                text: 'To use performance and culture as a bridge toward healing, unity, and compassion.',
              },
              {
                title: 'India context',
                text: 'The India pre-selection is the first public step before the official festival rounds.',
              },
              {
                title: 'Next move',
                text: 'Read this page first, then open Announcement for updates. The completed application stage is preserved for reference.',
              },
            ].map((item) => (
              <article key={item.title} className="rounded-[22px] border border-[#d5d9d9] bg-[#f7fafa] p-4 sm:p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">{item.title}</p>
                <p className="mt-2.5 text-sm leading-7 text-[#565959]">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-[28px] border border-[#d8e1ee] bg-[#f8fbff] p-4 text-[#0f172a] shadow-sm sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2457d6]">Process overview</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {processSteps.map((step) => (
                <div key={step} className="flex items-center rounded-[22px] border border-[#d8e1ee] bg-white px-4 py-3 text-sm leading-6 text-[#475569]">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-10 sm:px-4 sm:pb-12 lg:px-10">
        <div className="mx-auto max-w-[1320px] rounded-xl border border-[#dce6f0] bg-white px-5 py-5 shadow-[0_4px_18px_rgba(15,55,95,0.05)] sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Page path</p>
              <h2 className="mt-2 text-2xl font-black text-[#111827] sm:text-3xl">Move through the journey in order</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#565959]">
              Start with Information, then check Announcement for live updates and the next official stage.
            </p>
          </div>

          <div className="mt-5 grid gap-3 overflow-hidden rounded-[24px] border border-[#d5d9d9] bg-[#f7fafa] lg:grid-cols-3 lg:gap-0">
            {bottomLinks.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className="group border border-[#dce6f0] bg-white p-4 transition hover:bg-[#eaf3ff] lg:border-y-0 lg:border-l-0 lg:border-r lg:last:border-r-0 lg:bg-transparent lg:p-5"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b12704]">0{index + 1}</p>
                <p className="mt-2.5 text-base font-bold text-[#111827]">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-[#565959]">{item.description}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#b12704]">
                  Open page
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
