"use client";

import Link from 'next/link';
import { CalendarDays, CheckCircle2, Clock3, MapPin, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

type EventRow = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  timezone: string;
  location_name: string | null;
  location_address: string | null;
  status: string;
};

const sessions = ['22 September 2026', '29 September 2026', '6 October 2026', '13 October 2026'];

const KoreanLanguageClassEvent = () => {
  const user = useAppStore((state) => state.user);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [registered, setRegistered] = useState<Record<number, boolean>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then((response) => {
      const data = response.data?.data ?? response.data;
      setEvents(Array.isArray(data) ? data.filter((event: EventRow) => event.slug.startsWith('korean-language-culture-class-')) : []);
    }).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  const rsvp = async (eventId: number) => {
    setMessage('');
    try {
      await api.post(`/events/${eventId}/rsvp`);
      setRegistered((current) => ({ ...current, [eventId]: true }));
      setMessage('Your seat is reserved. You can manage your event participation from your member dashboard.');
    } catch {
      setMessage('RSVP could not be completed. Please sign in and try again.');
    }
  };

  return <main className="min-h-screen bg-[#eef4f8] text-[#102a43]">
    <section className="bg-[linear-gradient(135deg,#062b63_0%,#0b4eae_58%,#123b78_100%)] px-4 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em]"><SparkleIcon /> Featured event</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Free Korean Language &amp; Culture Class</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#dbeafe] sm:text-lg">A free four-week community class to learn practical Korean and explore Korean culture together.</p>
        <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-[#e0ecff]"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><CalendarDays className="h-4 w-4" />Every Tuesday for 4 weeks</span><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><Clock3 className="h-4 w-4" />3:00–4:00 PM IST</span><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><MapPin className="h-4 w-4" />Gurugram</span></div>
      </div>
    </section>
    <section className="px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-[#d8e1ee] bg-white p-6 shadow-[0_18px_50px_rgba(15,55,95,0.07)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2457d6]">Class schedule</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">Four Tuesdays. One welcoming classroom.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{sessions.map((date, index) => <div key={date} className="rounded-2xl border border-[#d8e1ee] bg-[#f8fbff] p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#2457d6]">Week {index + 1}</p><p className="mt-2 text-lg font-black">{date}</p><p className="mt-1 text-sm text-[#64748b]">3:00–4:00 PM · Asia/Kolkata</p></div>)}</div>
          <div className="mt-6 rounded-2xl border border-[#b9d9d0] bg-[#effaf6] p-5"><p className="flex items-center gap-2 text-sm font-black text-[#087f52]"><MapPin className="h-4 w-4" />Korea Edge Cube - Gr</p><p className="mt-2 text-sm leading-6 text-[#486581]">Plot 149, Sector 44 Rd, Gurugram, Haryana 122023</p></div>
        </article>
        <aside className="rounded-[28px] border border-[#d8e1ee] bg-[#102a43] p-6 text-white shadow-[0_18px_50px_rgba(15,55,95,0.12)] sm:p-8"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#f3c969]">How to join</p><h2 className="mt-2 text-2xl font-black">Reserve your place</h2><p className="mt-4 text-sm leading-7 text-[#c3d8f1]">Sign in to RSVP for the sessions. Your participation will appear in your member dashboard for easy tracking.</p>{!user ? <Link href="/signin" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827]">Sign in to RSVP</Link> : <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm font-bold text-[#e0ecff]">Choose a session below to reserve your place.</p>}<Link href="/dashboard?view=events" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white">Open member dashboard</Link></aside>
      </div>
      <div className="mx-auto mt-6 max-w-[1200px] rounded-[28px] border border-[#d8e1ee] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#2457d6]">Live registrations</p><h2 className="mt-2 text-2xl font-black">Choose your class session</h2></div><UsersRound className="h-7 w-7 text-[#12a66a]" /></div>{loading ? <p className="mt-6 text-sm text-[#64748b]">Loading sessions…</p> : <div className="mt-6 grid gap-3 md:grid-cols-2">{events.map((event) => <div key={event.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#d8e1ee] bg-[#f8fbff] p-5 sm:flex-row sm:items-center"><div><p className="text-lg font-black">{event.title.replace('Free Korean Language & Culture Class — ', '')}</p><p className="mt-1 text-sm text-[#64748b]">{new Date(event.starts_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · 3:00–4:00 PM</p></div>{user ? <button type="button" onClick={() => rsvp(event.id)} disabled={registered[event.id]} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2457d6] px-4 py-2.5 text-sm font-black text-white disabled:bg-[#d9efe7] disabled:text-[#087f52]">{registered[event.id] ? <><CheckCircle2 className="h-4 w-4" />RSVP confirmed</> : 'Reserve session'}</button> : <Link href="/signin" className="inline-flex items-center justify-center rounded-full border border-[#2457d6] px-4 py-2.5 text-sm font-black text-[#2457d6]">Sign in to RSVP</Link>}</div>)}</div>}{!loading && !events.length ? <p className="mt-6 rounded-2xl bg-[#fff8df] p-4 text-sm text-[#7a5b00]">Sessions are being published. Please check back shortly.</p> : null}{message ? <p className="mt-5 rounded-2xl border border-[#b9d9d0] bg-[#effaf6] p-4 text-sm font-bold text-[#087f52]">{message}</p> : null}</div>
    </section>
  </main>;
};

const SparkleIcon = () => <span className="h-2 w-2 rounded-full bg-[#ffd814]" aria-hidden="true" />;

export default KoreanLanguageClassEvent;
