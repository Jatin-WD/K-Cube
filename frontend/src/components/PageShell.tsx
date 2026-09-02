import { ReactNode } from 'react';
import Link from 'next/link';

interface PageShellProps {
  title: string;
  subtitle: string;
  description: string;
  children: ReactNode;
  badge?: string;
}

const PageShell = ({ title, subtitle, description, children, badge }: PageShellProps) => {
  return (
    <section className="min-h-screen bg-[#eef4f8] py-7 text-[#102a43] sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="mb-7 border border-[#d8e4f0] bg-white p-5 shadow-[0_6px_20px_rgba(15,55,95,0.07)] sm:mb-10 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-3xl">
              {badge ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b4eae]">{badge}</p> : null}
              <h1 className="mt-3 text-3xl font-bold leading-tight text-[#102a43] sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base leading-7 text-[#486581]">{subtitle}</p>
              <p className="mt-3 text-sm leading-6 text-[#6b7c93]">{description}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link href="/" className="inline-flex justify-center rounded-md border border-[#0b4eae] bg-white px-4 py-2.5 text-sm font-semibold text-[#0b4eae] transition hover:bg-[#eaf3ff]">
                Back to home
              </Link>
              <Link href="/rewards" className="inline-flex justify-center rounded-md bg-[#0b4eae] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#073a82]">
                View rewards
              </Link>
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
};

export default PageShell;
