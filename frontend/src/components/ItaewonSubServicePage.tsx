import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, Mail, Sparkles } from 'lucide-react';

type SubLink = {
  label: string;
  href: string;
  description: string;
};

type ItaewonSubServicePageProps = {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  notes?: string[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryLinks: SubLink[];
  contact?: {
    title: string;
    body: string;
    email?: string;
    emailHref?: string;
    emailLabel?: string;
    extra?: string;
  };
  children?: ReactNode;
};

const isExternalOrMailto = (href: string) =>
  href.startsWith('mailto:') || href.startsWith('http://') || href.startsWith('https://');

const ItaewonSubServicePage = ({
  badge,
  title,
  description,
  highlights,
  notes,
  primaryCta,
  secondaryLinks,
  contact,
  children,
}: ItaewonSubServicePageProps) => {
  return (
    <main className="min-h-screen bg-[#e7e7e7] text-[#111827]">
      <section className="px-3 py-8 sm:px-4 sm:py-10 lg:px-10 lg:py-12">
        <div className="mx-auto grid max-w-[1760px] gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[30px] border border-[#d5d9d9] bg-[linear-gradient(180deg,#111827_0%,#0b1220_100%)] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-sm border border-[#f3a847]/30 bg-[#f3a847]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f3a847]">
              <Sparkles className="h-4 w-4" />
              {badge}
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d5d9d9] sm:text-base sm:leading-8">{description}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {isExternalOrMailto(primaryCta.href) ? (
                <a
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827] transition hover:bg-[#f7ca00]"
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/india-pre-selection"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-[#ffd814] hover:text-[#ffd814]"
              >
                Back to main page
              </Link>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="flex items-start gap-3 text-sm leading-6 text-[#e5e7eb]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd814]" />
                    <span>{item}</span>
                  </p>
                </div>
              ))}
            </div>

            {notes?.length ? (
              <div className="mt-7 rounded-[24px] border border-[#f3a847]/30 bg-[#f3a847]/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f3a847]">Note</p>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[#f8fafc]">
                  {notes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {children}
          </article>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">Quick links</p>
              <div className="mt-4 space-y-3">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-start justify-between gap-4 rounded-[20px] border border-[#d5d9d9] bg-[#f7fafa] px-4 py-4 transition hover:border-[#f3a847] hover:bg-[#fff8df]"
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

            <div className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">{contact?.title || 'Contact'}</p>
              <div className="mt-4 rounded-[22px] border border-[#f3a847]/40 bg-[#fff8df] p-4">
                {contact?.email ? (
                  <p className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                    <Mail className="h-4 w-4 text-[#b12704]" />
                    {contact.emailLabel || contact.email}
                  </p>
                ) : null}
                <p className="mt-2 text-sm leading-7 text-[#565959]">{contact?.body || 'Use email for official coordination, questions, and submission follow-up.'}</p>
                {contact?.emailHref ? (
                  <a href={contact.emailHref} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#b12704]">
                    {contact.emailLabel || contact.email}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
                {contact?.extra ? <p className="mt-2 text-sm leading-7 text-[#565959]">{contact.extra}</p> : null}
              </div>

              <div className="mt-4 rounded-[22px] border border-[#d5d9d9] bg-[#f7fafa] p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                  <CalendarDays className="h-4 w-4 text-[#b12704]" />
                  ITAEWON World Music Spirit Festival 2026
                </p>
                <p className="mt-2 text-sm leading-7 text-[#565959]">Keep the Information, Announcement, and Apply pages connected so visitors can move through the service flow without confusion.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ItaewonSubServicePage;
