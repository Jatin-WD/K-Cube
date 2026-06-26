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
    <section className="min-h-screen bg-transparent py-8 text-white sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8 rounded-2xl border border-white/10 bg-slate-950/85 p-5 shadow-2xl shadow-slate-950/40 sm:mb-12 sm:p-8 lg:rounded-[2rem] lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-3xl">
              {badge ? <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{badge}</p> : null}
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base leading-8 text-slate-300">{subtitle}</p>
              <p className="mt-4 text-sm leading-7 text-slate-400">{description}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link href="/" className="inline-flex justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Back to home
              </Link>
              <Link href="/rewards" className="inline-flex justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:brightness-110">
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
