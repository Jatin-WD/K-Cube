import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, GraduationCap, Mail, MessagesSquare, Music2, Phone } from 'lucide-react';
import { contact } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Contact K-CUBE | Let’s connect',
  description: `Get in touch with K-CUBE for support, events, partnerships and study abroad inquiries. Call ${contact.phone} or email ${contact.email}.`,
  alternates: { canonical: '/contact' },
};

const topics = [
  { icon: MessagesSquare, title: 'Community & support', description: 'Questions about your account, learning, shopping or rewards? Start here.', subject: 'Community and support inquiry', label: 'Get support' },
  { icon: Music2, title: 'Events & culture', description: 'Connect with us about festivals, participation and Korean culture experiences.', subject: 'Events and culture inquiry', label: 'Talk events' },
  { icon: BriefcaseBusiness, title: 'Partnerships', description: 'Bring your brand, institution or next collaboration into the K-CUBE community.', subject: 'Partnership inquiry', label: 'Work with us' },
  { icon: GraduationCap, title: 'Study & opportunities', description: 'Explore study abroad, Korean learning and manpower opportunities.', subject: 'Study and opportunities inquiry', label: 'Ask the team' },
];

export default function ContactPage() {
  return (
    <div className="bg-[var(--kc-bg)] text-[var(--kc-text)]">
      <section className="relative overflow-hidden bg-[var(--kc-surface-soft)] text-[var(--kc-text)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-48 h-[640px] w-[640px] rounded-full border border-[var(--kc-border)] p-20"><div className="h-full w-full rounded-full border border-[var(--kc-border)] p-20"><div className="h-full w-full rounded-full bg-[var(--kc-surface-blue)]" /></div></div>
        <div className="relative mx-auto kc-shell px-5 pb-28 pt-10 sm:px-8 sm:pb-32 lg:px-10 lg:pt-14">
          <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-3 text-xs text-[var(--kc-text-muted)]"><Link href="/" className="hover:text-[var(--kc-blue-700)]">Home</Link><span aria-hidden="true">/</span><span className="text-[var(--kc-text)]">Contact</span></nav>
          <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--kc-blue-700)]"><span className="h-px w-9 bg-[var(--kc-blue-700)]" /> Get in touch</p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Great connections<br />start with <span className="text-[var(--kc-blue-700)]">hello.</span></h1>
            </div>
            <div className="max-w-md lg:pb-2">
              <p className="text-base leading-8 text-[var(--kc-text-secondary)] sm:text-lg">A question, a new idea, or your next Korean culture experience. We’re here to help you take the next step.</p>
              <a href="#connect" className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-[var(--kc-blue-700)] underline decoration-[var(--kc-border)] underline-offset-8">Find your way to connect <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto kc-shell px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
        <section id="connect" aria-label="Contact details" className="-mt-14 grid scroll-mt-28 gap-4 md:grid-cols-2">
          <a href={contact.phoneHref} className="group rounded-2xl border border-[var(--kc-border)] bg-white p-7 shadow-[0_12px_40px_rgba(81,33,55,0.06)] transition hover:-translate-y-1 hover:border-[var(--kc-blue-500)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--kc-blue-700)] sm:p-9">
            <div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--kc-surface-blue)] text-[var(--kc-blue-700)]"><Phone size={22} aria-hidden="true" /></span><ArrowUpRight className="text-[var(--kc-text-muted)] transition group-hover:text-[var(--kc-blue-700)]" size={22} aria-hidden="true" /></div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--kc-text-secondary)]">Call K-CUBE</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{contact.phone}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--kc-text-secondary)]">Prefer a conversation? Reach our team directly.</p>
          </a>
          <a href={`mailto:${contact.email}`} className="group rounded-2xl border border-[var(--kc-border)] bg-white p-7 shadow-[0_12px_40px_rgba(81,33,55,0.06)] transition hover:-translate-y-1 hover:border-[var(--kc-blue-500)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--kc-blue-700)] sm:p-9">
            <div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--kc-surface-blue)] text-[var(--kc-blue-700)]"><Mail size={22} aria-hidden="true" /></span><ArrowUpRight className="text-[var(--kc-text-muted)] transition group-hover:text-[var(--kc-blue-700)]" size={22} aria-hidden="true" /></div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--kc-text-secondary)]">Write to us</p>
            <h2 className="mt-3 break-all text-2xl font-semibold tracking-tight sm:text-3xl">{contact.email}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--kc-text-secondary)]">Share your question or idea. Let’s take it from there.</p>
          </a>
        </section>

        <section aria-labelledby="inquiry-heading" className="py-16 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--kc-blue-700)]">A place for every conversation</p><h2 id="inquiry-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">How can we help?</h2></div>
            <p className="max-w-sm text-sm leading-7 text-[var(--kc-text-secondary)]">Choose a topic to open an email with the right subject, ready for your message.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(({ icon: Icon, title, description, subject, label }, index) => (
              <a key={title} href={`mailto:${contact.email}?subject=${encodeURIComponent(subject)}`} className="group flex flex-col rounded-2xl border border-[var(--kc-border)] bg-white p-6 transition hover:border-[var(--kc-blue-500)] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--kc-blue-700)]">
                <div className="flex items-center justify-between"><Icon className="text-[var(--kc-blue-700)]" size={25} aria-hidden="true" /><span className="text-xs font-medium text-[var(--kc-text-muted)]">0{index + 1}</span></div>
                <h3 className="mt-8 text-lg font-semibold">{title}</h3><p className="mb-7 mt-3 text-sm leading-7 text-[var(--kc-text-secondary)]">{description}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--kc-blue-700)]">{label}<ArrowUpRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" /></span>
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="faq-heading" className="grid gap-8 border-t border-[var(--kc-border)] pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--kc-blue-700)]">Before you reach out</p><h2 id="faq-heading" className="mt-3 text-3xl font-semibold tracking-tight">A little help<br />to get started.</h2><p className="mt-4 max-w-sm text-sm leading-7 text-[var(--kc-text-secondary)]">Give us a little context so we can better understand what you need.</p></div>
          <div className="divide-y divide-[var(--kc-border)]">
            {[
              ['What should I include in my message?', 'Include your name, the topic of your inquiry and any relevant details. For a shopping question, include your order reference. Never send passwords or payment card details.'],
              ['How do I ask about an event?', 'Choose Events & culture above and include the event name in your email. You can also visit our Events page for event information.'],
              ['Can I contact K-CUBE about a collaboration?', 'Yes. Choose Partnerships above and tell us about your organisation, your idea and how you would like to work with K-CUBE.'],
            ].map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer text-base font-semibold leading-7 marker:text-[var(--kc-blue-700)]">{question}</summary><p className="mt-3 max-w-xl text-sm leading-7 text-[var(--kc-text-secondary)]">{answer}</p></details>)}
          </div>
        </section>
      </div>
    </div>
  );
}
