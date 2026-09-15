"use client";

import Link from 'next/link';
import { CalendarDays, CheckCircle2, Clock3, MapPin, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAppStore, type Language } from '@/store/useAppStore';
import RepairText from '@/components/RepairText';

type EventRow = {
  id: number;
  title: string;
  slug: string;
  category: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  location_name: string | null;
  location_address: string | null;
  points_reward: number;
  registration_status?: string;
};

type Copy = {
  featured: string;
  title: string;
  description: string;
  reward: string;
  everyTuesday: string;
  locationSoon: string;
  schedule: string;
  scheduleTitle: string;
  rewardShort: string;
  week: string;
  verified: string;
  howToJoin: string;
  reserve: string;
  signInDescription: string;
  choose: string;
  signIn: string;
  dashboard: string;
  registrations: string;
  chooseSession: string;
  loading: string;
  published: string;
  confirmed: string;
  reserveSession: string;
  success: string;
  error: string;
  retry: string;
  venueSoon: string;
};

const copy: Record<Language, Copy> = {
  en: {
    featured: 'Featured event', title: 'Free Korean Language & Culture Class', description: 'A free four-week community class to learn practical Korean and explore Korean culture together.', reward: 'Earn 100 points for every attended session · Complete all 4 sessions and earn a 100-point bonus · Total possible: 500 points.', everyTuesday: 'Every Tuesday for 4 weeks', locationSoon: 'Location details coming soon', schedule: 'Class schedule', scheduleTitle: 'Four Tuesdays. One welcoming classroom.', rewardShort: 'Attendance reward: +100 points per session. Attend all four sessions for an extra +100 bonus (500 points total).', week: 'Week', verified: 'points on verified attendance', howToJoin: 'How to join', reserve: 'Reserve your place', signInDescription: 'Sign in to RSVP for the sessions. Your participation will appear in your member dashboard for easy tracking.', choose: 'Choose a session below to reserve your place.', signIn: 'Sign in to RSVP', dashboard: 'Open member dashboard', registrations: 'Live registrations', chooseSession: 'Choose your class session', loading: 'Loading sessions…', published: 'Sessions are being published. Please check back shortly.', confirmed: 'RSVP confirmed', reserveSession: 'Reserve session', success: 'Your seat is reserved. You can manage your event participation from your member dashboard.', error: 'RSVP could not be completed. Please sign in and try again.', retry: 'Retry', venueSoon: 'The venue will be shared when event details are confirmed.',
  },
  ko: {
    featured: '추천 이벤트', title: '무료 한국어·문화 클래스', description: '실용적인 한국어를 배우고 한국 문화를 함께 알아가는 4주 무료 커뮤니티 클래스입니다.', reward: '참여한 세션마다 100포인트를 받고, 4회 모두 참여하면 100포인트 보너스를 받아 최대 500포인트를 얻을 수 있습니다.', everyTuesday: '4주 동안 매주 화요일', locationSoon: '장소 정보 준비 중', schedule: '수업 일정', scheduleTitle: '네 번의 화요일, 따뜻한 교실.', rewardShort: '출석 보상: 세션마다 +100포인트. 네 세션에 모두 참석하면 +100포인트 보너스(총 500포인트)를 받습니다.', week: '주차', verified: '확인된 출석 포인트', howToJoin: '참여 방법', reserve: '자리 예약', signInDescription: '로그인 후 세션을 RSVP하세요. 참여 내역은 회원 대시보드에서 확인할 수 있습니다.', choose: '아래에서 세션을 선택해 자리를 예약하세요.', signIn: '로그인하고 RSVP', dashboard: '회원 대시보드 열기', registrations: '실시간 등록', chooseSession: '수업 세션 선택', loading: '세션을 불러오는 중…', published: '세션이 곧 공개됩니다. 잠시 후 다시 확인해 주세요.', confirmed: 'RSVP 완료', reserveSession: '세션 예약', success: '자리가 예약되었습니다. 회원 대시보드에서 참여 내역을 관리할 수 있습니다.', error: 'RSVP를 완료할 수 없습니다. 로그인 후 다시 시도해 주세요.', retry: '다시 시도', venueSoon: '장소가 확정되면 안내해 드립니다.',
  },
  hi: {
    featured: 'विशेष कार्यक्रम', title: 'मुफ़्त Korean Language & Culture Class', description: 'व्यावहारिक Korean सीखने और Korean culture को साथ में समझने के लिए चार सप्ताह की मुफ़्त community class.', reward: 'हर attended session पर 100 points मिलेंगे। चारों sessions पूरे करने पर 100 bonus points—कुल 500 points तक।', everyTuesday: 'चार हफ्तों तक हर मंगलवार', locationSoon: 'स्थान की जानकारी जल्द आएगी', schedule: 'क्लास शेड्यूल', scheduleTitle: 'चार मंगलवार, एक स्वागतपूर्ण classroom.', rewardShort: 'Attendance reward: हर session पर +100 points। चारों sessions attend करने पर +100 bonus (कुल 500 points)।', week: 'सप्ताह', verified: 'verified attendance points', howToJoin: 'कैसे जुड़ें', reserve: 'अपनी जगह reserve करें', signInDescription: 'Sessions के लिए RSVP करने हेतु sign in करें। आपकी participation member dashboard में दिखेगी।', choose: 'नीचे से session चुनकर अपनी जगह reserve करें।', signIn: 'Sign in करके RSVP करें', dashboard: 'Member dashboard खोलें', registrations: 'Live registrations', chooseSession: 'अपना class session चुनें', loading: 'Sessions लोड हो रहे हैं…', published: 'Sessions जल्द publish होंगे। कृपया थोड़ी देर बाद फिर देखें।', confirmed: 'RSVP confirmed', reserveSession: 'Session reserve करें', success: 'आपकी seat reserve हो गई है। Event participation member dashboard से manage करें।', error: 'RSVP पूरा नहीं हो सका। Sign in करके फिर कोशिश करें।', retry: 'फिर कोशिश करें', venueSoon: 'Venue confirm होने पर details share की जाएंगी।',
  },
};

const localeFor = (language: Language) => language === 'ko' ? 'ko-KR' : language === 'hi' ? 'hi-IN' : 'en-IN';
const formatDate = (value: string, language: Language) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(localeFor(language), { day: 'numeric', month: 'long', year: 'numeric' });
};
const formatTime = (value: string, language: Language) => {
  const [hour, minute] = value.slice(11, 16).split(':').map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString(localeFor(language), { hour: 'numeric', minute: '2-digit', hour12: true });
};
const statusLabel = (status: string, language: Language) => {
  if (status === 'full') return language === 'ko' ? '마감' : language === 'hi' ? 'सीटें भर गईं' : 'Full';
  return language === 'ko' ? '종료됨' : language === 'hi' ? 'पूरा हो चुका' : 'Completed';
};

const SparkleIcon = () => <span className="h-2 w-2 rounded-full bg-[#ffd814]" aria-hidden="true" />;

const KoreanLanguageClassEventClean = () => {
  const user = useAppStore((state) => state.user);
  const language = useAppStore((state) => state.language);
  const t = copy[language];
  const [events, setEvents] = useState<EventRow[]>([]);
  const [registered, setRegistered] = useState<Record<number, boolean>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventsError, setEventsError] = useState(false);
  const [eventsRetry, setEventsRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api.get('/events').then((response) => {
      if (cancelled) return;
      const data = response.data?.data ?? response.data;
      const rows = Array.isArray(data) ? data : [];
      const classEvents = rows.filter((event): event is EventRow => event?.category === 'korean_language' || (typeof event?.slug === 'string' && event.slug.startsWith('korean-language-culture-class-')));
      setEvents(classEvents);
      setEventsError(false);
      try { window.sessionStorage.setItem('kcube-korean-class-events', JSON.stringify(classEvents)); } catch { /* Optional browser cache. */ }
    }).catch(() => {
      if (cancelled) return;
      setEventsError(true);
      try {
        const cached = JSON.parse(window.sessionStorage.getItem('kcube-korean-class-events') || '[]');
        if (Array.isArray(cached) && cached.length) setEvents(cached);
      } catch { /* Keep the retry state visible. */ }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [eventsRetry]);

  useEffect(() => {
    let cancelled = false;
    if (!user) return () => { cancelled = true; };
    api.get('/events/mine').then((response) => {
      if (cancelled) return;
      const rows = response.data?.data ?? response.data ?? [];
      setRegistered(Array.isArray(rows) ? Object.fromEntries(rows.map((rsvp: { event_id: number; status: string }) => [rsvp.event_id, ['registered', 'checked_in'].includes(rsvp.status)])) : {});
    }).catch(() => { if (!cancelled) setRegistered({}); });
    return () => { cancelled = true; };
  }, [user]);

  const rsvp = async (eventId: number) => {
    setMessage('');
    try {
      await api.post(`/events/${eventId}/rsvp`);
      setRegistered((current) => ({ ...current, [eventId]: true }));
      setMessage(t.success);
    } catch {
      setMessage(t.error);
    }
  };

  const firstEvent = events[0];
  return <RepairText><main className="min-h-screen bg-[#eef4f8] text-[#102a43]">
    <section className="bg-[linear-gradient(135deg,#062b63_0%,#0b4eae_58%,#123b78_100%)] px-4 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em]"><SparkleIcon />{t.featured}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{t.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#dbeafe] sm:text-lg">{t.description}</p>
        <p className="mt-4 max-w-3xl text-sm font-bold text-[#fff3b0]">{t.reward}</p>
        <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-[#e0ecff]"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><CalendarDays className="h-4 w-4" />{t.everyTuesday}</span><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><Clock3 className="h-4 w-4" />{firstEvent ? `${formatTime(firstEvent.starts_at, language)}–${formatTime(firstEvent.ends_at, language)} ${firstEvent.timezone}` : '3:00–4:00 PM Asia/Kolkata'}</span><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><MapPin className="h-4 w-4" />{firstEvent?.location_name || t.locationSoon}</span></div>
      </div>
    </section>
    <section className="px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
      {eventsError ? <div role="alert" className="mx-auto mb-6 flex max-w-[1200px] flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f1d98a] bg-[#fff9e5] p-4 text-sm font-bold text-[#806000]"><span>{t.error}</span><button type="button" onClick={() => { setEventsError(false); setLoading(true); setEventsRetry((value) => value + 1); }} className="rounded-full border border-[#806000] px-4 py-2">{t.retry}</button></div> : null}
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-[#d8e1ee] bg-white p-6 shadow-[0_18px_50px_rgba(15,55,95,0.07)] sm:p-8"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#2457d6]">{t.schedule}</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">{t.scheduleTitle}</h2><p className="mt-3 rounded-xl border border-[#f1d98a] bg-[#fff9e5] p-3 text-sm font-bold text-[#806000]">{t.rewardShort}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{loading ? <p className="text-sm text-[#64748b]">{t.loading}</p> : events.map((event, index) => <div key={event.id} className="rounded-2xl border border-[#d8e1ee] bg-[#f8fbff] p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#2457d6]">{t.week} {index + 1}</p><p className="mt-2 text-lg font-black">{formatDate(event.starts_at, language)}</p><p className="mt-1 text-sm text-[#64748b]">{formatTime(event.starts_at, language)}–{formatTime(event.ends_at, language)} · {event.timezone}</p><p className="mt-2 text-xs font-bold text-[#087f52]">+{event.points_reward || 100} {t.verified}</p></div>)}</div><div className="mt-6 rounded-2xl border border-[#b9d9d0] bg-[#effaf6] p-5"><p className="flex items-center gap-2 text-sm font-black text-[#087f52]"><MapPin className="h-4 w-4" />{firstEvent?.location_name || t.locationSoon}</p><p className="mt-2 text-sm leading-6 text-[#486581]">{firstEvent?.location_address || t.venueSoon}</p></div></article>
        <aside className="rounded-[28px] border border-[#d8e1ee] bg-[#102a43] p-6 text-white shadow-[0_18px_50px_rgba(15,55,95,0.12)] sm:p-8"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#f3c969]">{t.howToJoin}</p><h2 className="mt-2 text-2xl font-black">{t.reserve}</h2><p className="mt-4 text-sm leading-7 text-[#c3d8f1]">{t.signInDescription}</p>{!user ? <Link href="/signin" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827]">{t.signIn}</Link> : <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm font-bold text-[#e0ecff]">{t.choose}</p>}<Link href="/dashboard?view=events" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white">{t.dashboard}</Link></aside>
      </div>
      <div className="mx-auto mt-6 max-w-[1200px] rounded-[28px] border border-[#d8e1ee] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#2457d6]">{t.registrations}</p><h2 className="mt-2 text-2xl font-black">{t.chooseSession}</h2></div><UsersRound className="h-7 w-7 text-[#12a66a]" /></div>{loading ? <p className="mt-6 text-sm text-[#64748b]">{t.loading}</p> : <div className="mt-6 grid gap-3 md:grid-cols-2">{events.map((event, index) => { const unavailable = event.registration_status === 'completed' || event.registration_status === 'full'; return <div key={event.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#d8e1ee] bg-[#f8fbff] p-5 sm:flex-row sm:items-center"><div><p className="text-lg font-black">{language === 'en' ? event.title.split(' - Week ')[0] : `${t.title} · ${t.week} ${index + 1}`}</p><p className="mt-1 text-sm text-[#64748b]">{formatDate(event.starts_at, language)} · {formatTime(event.starts_at, language)}–{formatTime(event.ends_at, language)}</p></div>{user ? <button type="button" onClick={() => rsvp(event.id)} disabled={Boolean(registered[event.id]) || unavailable} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2457d6] px-4 py-2.5 text-sm font-black text-white disabled:bg-[#d9efe7] disabled:text-[#087f52]">{registered[event.id] ? <><CheckCircle2 className="h-4 w-4" />{t.confirmed}</> : unavailable ? statusLabel(event.registration_status || 'completed', language) : t.reserveSession}</button> : <Link href="/signin" className="inline-flex items-center justify-center rounded-full border border-[#2457d6] px-4 py-2.5 text-sm font-black text-[#2457d6]">{t.signIn}</Link>}</div>; })}</div>}{!loading && !events.length ? <p className="mt-6 rounded-2xl bg-[#fff8df] p-4 text-sm text-[#7a5b00]">{t.published}</p> : null}{message ? <p role="status" className="mt-5 rounded-2xl border border-[#b9d9d0] bg-[#effaf6] p-4 text-sm font-bold text-[#087f52]">{message}</p> : null}</div>
    </section>
  </main></RepairText>;
};

export default KoreanLanguageClassEventClean;
