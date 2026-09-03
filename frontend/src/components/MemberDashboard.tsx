"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Clapperboard, Copy, Gift, KeyRound, Plane, Trophy, UploadCloud, UserRound, Utensils } from 'lucide-react';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { memberCopy } from '@/lib/memberContent';
import { memberUiCopy } from '@/lib/memberUiContent';
import PasswordInput from '@/components/PasswordInput';

interface LearningProgressRow {
  trackSlug: string;
  trackTitle: string;
  eyebrow: string;
  accent: string;
  currentStreak: number;
  bestStreak: number;
  lastCompletedAt?: string | null;
  totalSessions: number;
  totalCorrect: number;
  totalPoints: number;
}

interface LearningSessionRow {
  id: number;
  trackSlug: string;
  trackTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  sessionPoints: number;
  accuracy: number;
  streakBefore: number;
  streakAfter: number;
  completedAt: string;
}

type DashboardView = 'overview' | 'profile' | 'actions' | 'submissions' | 'submissionHistory' | 'learning' | 'referrals' | 'events';

interface MemberEventRow {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  location_name: string | null;
  location_address: string | null;
  online_meeting_url: string | null;
  capacity: number | null;
  points_reward: number;
  status: string;
}

interface IndiaApplicationSummary {
  id: number;
  performance_category: string;
  status: string;
  points_awarded: number;
  submitted_at: string | null;
  updated_at: string | null;
  review_note: string | null;
  reviewed_by_name: string | null;
  reviewed_at: string | null;
}

interface MyContentSubmission {
  id: number;
  category: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  status: string;
  review_note?: string | null;
  points_reward?: number;
  created_at: string;
  updated_at?: string;
}

const heroImages = [
  {
    title: 'Culture uploads',
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Korean learning',
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'K-Food rewards',
    src: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
  },
];

const lessons = [
  { id: 1, title: 'Day 1: Hangul vowels', detail: 'Recognize the first Korean vowel sounds.', points: 40 },
  { id: 2, title: 'Day 2: Hangul consonants', detail: 'Practice common consonants and sounds.', points: 45 },
  { id: 3, title: 'Day 3: Korean greetings', detail: 'Use greetings in simple conversation.', points: 50 },
];

const uploadCategories = [
  { value: 'k_dance', label: 'Korean dance' },
  { value: 'k_song', label: 'Korean song' },
  { value: 'k_drama', label: 'K-Drama / culture' },
  { value: 'k_food', label: 'K-Food story' },
];

const MemberDashboard = () => {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const language = useAppStore((state) => state.language);
  const t = memberCopy[language];
  const ui = memberUiCopy[language];
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [message, setMessage] = useState('');
  const [upload, setUpload] = useState({
    category: 'k_dance',
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
  });
  const [purchase, setPurchase] = useState({ order_id: '', order_total: '', coupon_code: '' });
  const [learningProgress, setLearningProgress] = useState<LearningProgressRow[]>([]);
  const [learningSessions, setLearningSessions] = useState<LearningSessionRow[]>([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [referralMessage, setReferralMessage] = useState('');
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', city: '', state: '', country: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [events, setEvents] = useState<MemberEventRow[]>([]);
  const [rsvpStatus, setRsvpStatus] = useState<Record<number, string>>({});
  const [eventMessage, setEventMessage] = useState('');
  const [indiaApplication, setIndiaApplication] = useState<IndiaApplicationSummary | null>(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<MyContentSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const submissionsPerPage = 10;

  const submitUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    try {
      await api.post('/engagement/uploads', upload);
      setMessage('Upload submitted. Admin review ke baad points award honge.');
      setUpload({ category: 'k_dance', title: '', description: '', video_url: '', thumbnail_url: '' });
    } catch {
      setMessage('Upload submit nahi ho paya. Please login aur fields check karein.');
    }
  };

  const completeLesson = async (lessonId: number) => {
    setMessage('');
    try {
      const response = await api.post('/engagement/lessons/complete', { lesson_id: lessonId, accuracy: 100 });
      const data = response.data?.data ?? response.data;
      setMessage(`Lesson complete. Points awarded: ${data.pointsAwarded ?? 0}.`);
    } catch {
      setMessage('Lesson completion save nahi ho paya. Shayad ye lesson already complete hai ya login required hai.');
    }
  };

  const visitKFood = async () => {
    try {
      const response = await api.post('/engagement/kfood/click', { item_slug: 'korean-food-store', source: 'dashboard' });
      const data = response.data?.data ?? response.data;
      router.push(typeof data.redirectUrl === 'string' ? data.redirectUrl : '/shop');
    } catch {
      router.push('/shop');
    }
  };

  const copyReferralLink = async () => {
    if (!user?.referralCode) {
      setReferralMessage('Referral code unavailable yet.');
      return;
    }

    const referralLink = `${window.location.origin}/signup?ref=${encodeURIComponent(user.referralCode)}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setReferralMessage('Referral link copied to clipboard.');
    } catch {
      setReferralMessage(`Copy this link: ${referralLink}`);
    }
  };

  const submitPurchaseClaim = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await api.post('/engagement/kfood/purchase-claim', {
        order_id: purchase.order_id,
        order_total: Number(purchase.order_total || 0),
        coupon_code: purchase.coupon_code || undefined,
      });
      const data = response.data?.data ?? response.data;
      setMessage(`K-Food purchase claim submitted. Estimated points: ${data.estimatedPoints}.`);
      setPurchase({ order_id: '', order_total: '', coupon_code: '' });
    } catch {
      setMessage('Purchase claim submit nahi ho paya. Order ID already claimed ho sakta hai.');
    }
  };

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const loadLearningProgress = async () => {
      setLearningLoading(true);
      try {
        const response = await api.get('/learning/me/progress');
        const payload = response.data?.data ?? response.data;
        if (cancelled) return;
        setLearningProgress(Array.isArray(payload?.progress) ? payload.progress : []);
        setLearningSessions(Array.isArray(payload?.sessions) ? payload.sessions : []);
      } catch {
        if (!cancelled) {
          setLearningProgress([]);
          setLearningSessions([]);
        }
      } finally {
        if (!cancelled) {
          setLearningLoading(false);
        }
      }
    };

    loadLearningProgress();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user || activeView !== 'profile') return;
    api.get('/users/profile').then((response) => {
      const data = response.data?.data ?? response.data;
      setProfileForm({ full_name: data.full_name || user.fullName, phone: data.phone || '', city: data.city || '', state: data.state || '', country: data.country || '' });
    }).catch(() => setProfileMessage('Profile load nahi ho paya.'));
  }, [activeView, user]);

  useEffect(() => {
    if (!user || activeView !== 'submissionHistory') return;
    let cancelled = false;
    setSubmissionsLoading(true);
    api.get('/engagement/uploads/me').then((response) => {
      const payload = response.data?.data ?? response.data;
      const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.uploads) ? payload.uploads : [];
      if (!cancelled) {
        setMySubmissions(rows);
        setSubmissionsPage(1);
      }
    }).catch(() => {
      if (!cancelled) setMySubmissions([]);
    }).finally(() => {
      if (!cancelled) setSubmissionsLoading(false);
    });
    return () => { cancelled = true; };
  }, [activeView, user]);

  useEffect(() => {
    if (!user) return;
    api.get('/events').then((response) => {
      const data = response.data?.data ?? response.data;
      setEvents(Array.isArray(data) ? data : []);
    }).catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (!user || activeView !== 'events') return;
    setApplicationLoading(true);
    api.get('/india-pre-selection/applications/me').then((response) => {
      const data = response.data?.data ?? response.data;
      setIndiaApplication(data?.application || null);
    }).catch(() => setIndiaApplication(null)).finally(() => setApplicationLoading(false));
  }, [activeView, user]);

  const rsvpToEvent = async (eventId: number) => {
    setEventMessage('');
    try {
      await api.post(`/events/${eventId}/rsvp`);
      setRsvpStatus((current) => ({ ...current, [eventId]: 'registered' }));
      setEventMessage('RSVP confirmed. Event participation will be verified for points.');
    } catch {
      setEventMessage('RSVP complete nahi ho paya. Event full ya temporarily unavailable ho sakta hai.');
    }
  };

  const saveDashboardProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    try {
      const response = await api.patch('/users/profile', profileForm);
      const data = response.data?.data ?? response.data;
      useAppStore.getState().updateUser({ fullName: data.full_name, phone: data.phone || undefined, city: data.city, state: data.state, country: data.country });
      setProfileMessage('Profile updated successfully.');
    } catch {
      setProfileMessage('Profile save nahi ho paya. Details check karein.');
    } finally {
      setProfileSaving(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage('');
    setPasswordError('');
    try {
      await api.patch('/users/profile/password', passwordForm);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setPasswordMessage('Password changed successfully.');
    } catch (error: any) {
      setPasswordError(error?.response?.data?.error?.message || error?.response?.data?.message || 'Password change nahi ho paya. Details check karein.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="bg-[#eef4f8] px-4 py-10 text-[#102a43] sm:px-6 sm:py-14 lg:px-10 lg:py-20">
        <section className="mx-auto max-w-[1080px] overflow-hidden rounded-2xl border border-[#d8e4f0] bg-white shadow-[0_18px_50px_rgba(15,55,95,0.08)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 sm:p-10 lg:p-14">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf3ff] text-[#0b4eae]"><Gift className="h-6 w-6" aria-hidden="true" /></div>
              <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-[#b36a00]">Member area</p>
              <h1 className="mt-3 max-w-xl text-4xl font-black leading-tight text-[#102a43] sm:text-5xl">Your K-CUBE workspace starts here.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#486581]">Create an account or sign in to access your points, learning progress, submissions, referrals and festival participation.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="rounded-lg bg-[#0b4eae] px-5 py-3 text-sm font-black text-white transition hover:bg-[#073a82]">Create account</Link>
                <Link href="/signin" className="rounded-lg border border-[#b8cce3] bg-white px-5 py-3 text-sm font-bold text-[#102a43] transition hover:border-[#0b4eae] hover:text-[#0b4eae]">Sign in</Link>
              </div>
            </div>
            <div className="border-t border-[#e3ebf3] bg-[#f7fafd] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0b4eae]">Inside your workspace</p>
              <div className="mt-6 space-y-3">
                {[
                  ['Points & rewards', 'Track verified activity and reward progress.'],
                  ['Learning & culture', 'Practice Korean and explore K-CUBE content.'],
                  ['Submissions & events', 'Manage participation and follow updates.'],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-xl border border-[#d8e4f0] bg-white p-4">
                    <p className="font-black text-[#102a43]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#486581]">{description}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-5 text-[#6c8298]">Your personal dashboard is available after secure sign-in.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="member-area-shell min-h-screen bg-[#eef4f8] text-[#102a43]">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-5 px-3 py-5 sm:px-5 sm:py-7 lg:flex-row lg:gap-6 lg:px-8">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-xl border border-white/10 bg-[#111113] p-3 lg:sticky lg:top-24">
            <div className="hidden border-b border-white/10 px-3 pb-4 lg:block"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffc400]">{t.memberArea}</p><p className="mt-2 text-lg font-black">{t.workspace}</p><p className="mt-1 text-xs leading-5 text-[#aab5c6]">{t.workspaceDesc}</p></div>
            <nav className="flex gap-2 overflow-x-auto lg:grid lg:gap-1.5 lg:overflow-visible lg:pt-3" aria-label="Member dashboard">
              {[
                ['overview', t.overview],
                ['actions', t.earnPoints],
                ['submissionHistory', language === 'en' ? 'View submissions' : language === 'ko' ? '제출 내역 보기' : 'सबमिशन देखें'],
                ['submissions', t.newSubmission],
                ['learning', t.learningProgress],
                ['events', t.events],
                ['referrals', t.referrals],
              ].map(([href, label]) => (
                <button key={href} type="button" onClick={() => setActiveView(href as DashboardView)} className={`flex shrink-0 items-center rounded-lg border px-3 py-2.5 text-left text-sm font-bold transition lg:w-full ${activeView === href ? 'border-[#0b4eae]/25 bg-[#eaf3ff] text-[#0b4eae]' : 'border-transparent text-[#486581] hover:border-[#d8e4f0] hover:bg-[#f5f9fe] hover:text-[#102a43]'}`}>{label}</button>
              ))}
              <button type="button" onClick={() => setActiveView('profile')} className={`flex shrink-0 items-center rounded-lg border px-3 py-2.5 text-left text-sm font-black transition lg:w-full ${activeView === 'profile' ? 'border-[#0b4eae]/25 bg-[#eaf3ff] text-[#0b4eae]' : 'border-transparent text-[#486581] hover:border-[#d8e4f0] hover:bg-[#f5f9fe] hover:text-[#102a43]'}`}>{t.editProfile}</button>
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
        {activeView === 'profile' ? <section className="rounded-xl border border-white/10 bg-[#111113] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffc400]">My profile</p>
          <h1 className="mt-2 text-3xl font-black">{ui.accountDetails}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#aab5c6]">{ui.profileDesc}</p>
          <form onSubmit={saveDashboardProfile} className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Full name</span><input required value={profileForm.full_name} onChange={(event) => setProfileForm((current) => ({ ...current, full_name: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label>
            <label><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Phone</span><input value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label>
            <label><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Country</span><input value={profileForm.country} onChange={(event) => setProfileForm((current) => ({ ...current, country: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label>
            <label><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">City</span><input value={profileForm.city} onChange={(event) => setProfileForm((current) => ({ ...current, city: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label>
            <label><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">State</span><input value={profileForm.state} onChange={(event) => setProfileForm((current) => ({ ...current, state: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" /></label>
            <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2"><div><p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#98a4b1]">Email</p><p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#aab5c6]">{user.email || user.phone}</p></div><div><p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#98a4b1]">Referral code</p><p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-black text-[#aab5c6]">{user.referralCode || 'Not available'}</p></div></div>
            {profileMessage ? <p className="sm:col-span-2 text-sm font-bold text-[#9be7c2]">{profileMessage}</p> : null}
            <div className="sm:col-span-2 flex flex-wrap gap-3"><button disabled={profileSaving} className="rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909] disabled:opacity-60">{profileSaving ? ui.saving : ui.saveChanges}</button><Link href="/profile" className="rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-white">{ui.openProfile}</Link></div>
          </form>
          <section className="mt-6 rounded-xl border border-white/10 bg-[#111113] p-6 sm:p-8">
            <div className="flex items-center gap-3"><KeyRound className="h-6 w-6 text-[#ffc400]" /><div><h2 className="text-2xl font-black">{ui.changePassword}</h2><p className="mt-1 text-sm text-[#aab5c6]">{ui.passwordDesc}</p></div></div>
            <form onSubmit={changePassword} className="mt-6 grid gap-4 sm:grid-cols-3">
              <PasswordInput required minLength={8} value={passwordForm.current_password} onChange={(event) => setPasswordForm((current) => ({ ...current, current_password: event.target.value }))} placeholder={ui.currentPassword} aria-label={ui.currentPassword} label={ui.currentPassword} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <PasswordInput required minLength={8} value={passwordForm.new_password} onChange={(event) => setPasswordForm((current) => ({ ...current, new_password: event.target.value }))} placeholder={ui.newPassword} aria-label={ui.newPassword} label={ui.newPassword} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <PasswordInput required minLength={8} value={passwordForm.confirm_password} onChange={(event) => setPasswordForm((current) => ({ ...current, confirm_password: event.target.value }))} placeholder={ui.confirmPassword} aria-label={ui.confirmPassword} label={ui.confirmPassword} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <div className="flex flex-wrap items-center gap-3 sm:col-span-3"><button disabled={passwordSaving} className="inline-flex items-center gap-2 rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909] disabled:opacity-60"><KeyRound className="h-4 w-4" />{passwordSaving ? ui.updating : ui.updatePassword}</button>{passwordMessage ? <span className="text-sm font-bold text-[#9be7c2]">{passwordMessage}</span> : null}{passwordError ? <span className="text-sm font-bold text-red-300">{passwordError}</span> : null}</div>
            </form>
          </section>
        </section> : null}
        {activeView === 'submissions' || activeView === 'submissionHistory' ? <section className="mx-auto max-w-4xl space-y-5">
          {activeView === 'submissionHistory' ? <div className="rounded-xl border border-[#d8e4f0] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#0b4eae]">My submissions</p><h1 className="mt-2 text-3xl font-black text-[#102a43]">Your submitted content</h1><p className="mt-3 text-sm leading-7 text-[#486581]">Review your submitted videos, their current status and any feedback from the K-CUBE team.</p></div><span className="rounded-full bg-[#eaf3ff] px-3 py-2 text-xs font-black text-[#0b4eae]">{mySubmissions.length} {mySubmissions.length === 1 ? 'submission' : 'submissions'}</span></div>
            {submissionsLoading ? <p className="mt-6 rounded-lg bg-[#f7fafd] p-4 text-sm font-semibold text-[#486581]">Loading your submissions...</p> : mySubmissions.length ? <div className="mt-6 space-y-3">{mySubmissions.slice((submissionsPage - 1) * submissionsPerPage, submissionsPage * submissionsPerPage).map((submission) => <article key={submission.id} className="rounded-lg border border-[#d8e4f0] bg-[#f8fbff] p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#0b4eae]">{submission.category.replace(/_/g, ' ')}</p><h2 className="mt-1 truncate text-lg font-black text-[#102a43]">{submission.title}</h2></div><span className="rounded-full border border-[#d8e4f0] bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#486581]">{submission.status}</span></div><p className="mt-3 text-sm leading-6 text-[#486581]">{submission.description || 'No description provided.'}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-[#6c8298]"><span>Submitted {new Date(submission.created_at).toLocaleDateString()}</span><a href={submission.video_url} target="_blank" rel="noreferrer" className="font-black text-[#0b4eae] underline underline-offset-2">View submission</a></div>{submission.review_note ? <p className="mt-3 border-l-2 border-[#0b4eae] pl-3 text-sm text-[#486581]"><span className="font-black">Review note:</span> {submission.review_note}</p> : null}</article>)}</div> : <div className="mt-6 rounded-lg border border-dashed border-[#cbd9ea] bg-[#f8fbff] p-5 text-sm leading-7 text-[#486581]">You have not submitted any content yet. Your submitted videos will appear here after you send them for review.</div>}
            {mySubmissions.length > submissionsPerPage ? <div className="mt-5 flex items-center justify-between border-t border-[#d8e4f0] pt-4"><span className="text-xs font-semibold text-[#6c8298]">Page {submissionsPage} of {Math.ceil(mySubmissions.length / submissionsPerPage)}</span><div className="flex gap-2"><button type="button" onClick={() => setSubmissionsPage((page) => Math.max(1, page - 1))} disabled={submissionsPage === 1} className="rounded-lg border border-[#cbd9ea] px-3 py-2 text-xs font-bold text-[#486581] disabled:opacity-40">Previous</button><button type="button" onClick={() => setSubmissionsPage((page) => Math.min(Math.ceil(mySubmissions.length / submissionsPerPage), page + 1))} disabled={submissionsPage >= Math.ceil(mySubmissions.length / submissionsPerPage)} className="rounded-lg border border-[#cbd9ea] px-3 py-2 text-xs font-bold text-[#486581] disabled:opacity-40">Next</button></div></div> : null}
          </div> : null}
          {activeView === 'submissions' ? <>
          <div className="rounded-xl border border-[#d8e4f0] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0b4eae]">New submission</p>
            <h1 className="mt-2 text-3xl font-black text-[#102a43]">{ui.submitVideo}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#486581]">{ui.submitVideoDesc}</p>
          </div>
          <form onSubmit={submitUpload} className="rounded-xl border border-[#d8e4f0] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3"><div className="rounded-lg bg-[#eaf3ff] p-3"><Clapperboard className="h-6 w-6 text-[#0b4eae]" /></div><div><h2 className="text-xl font-black text-[#102a43]">{t.submissionDetails}</h2><p className="text-sm text-[#486581]">{t.reviewTeam}</p></div></div>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-[#102a43]">{ui.contentCategory}<select value={upload.category} onChange={(event) => setUpload((current) => ({ ...current, category: event.target.value }))} className="rounded-lg border border-[#ccd9e6] bg-white px-4 py-3 text-[#102a43] outline-none focus:border-[#0b4eae]">{uploadCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold text-[#102a43]">{ui.videoTitle}<input required value={upload.title} onChange={(event) => setUpload((current) => ({ ...current, title: event.target.value }))} placeholder="Give your submission a clear title" className="rounded-lg border border-[#ccd9e6] bg-white px-4 py-3 text-[#102a43] outline-none placeholder:text-[#829ab1] focus:border-[#0b4eae]" /></label>
              <label className="grid gap-2 text-sm font-bold text-[#102a43]">{ui.videoUrl}<input required type="url" value={upload.video_url} onChange={(event) => setUpload((current) => ({ ...current, video_url: event.target.value }))} placeholder="YouTube / Drive video URL" className="rounded-lg border border-[#ccd9e6] bg-white px-4 py-3 text-[#102a43] outline-none placeholder:text-[#829ab1] focus:border-[#0b4eae]" /></label>
              <label className="grid gap-2 text-sm font-bold text-[#102a43]">{ui.thumbnailUrl}<input type="url" value={upload.thumbnail_url} onChange={(event) => setUpload((current) => ({ ...current, thumbnail_url: event.target.value }))} placeholder="Optional thumbnail image URL" className="rounded-lg border border-[#ccd9e6] bg-white px-4 py-3 text-[#102a43] outline-none placeholder:text-[#829ab1] focus:border-[#0b4eae]" /></label>
              <label className="grid gap-2 text-sm font-bold text-[#102a43]">{ui.shortDescription}<textarea required value={upload.description} onChange={(event) => setUpload((current) => ({ ...current, description: event.target.value }))} placeholder="Tell us briefly about your content" className="min-h-32 rounded-lg border border-[#ccd9e6] bg-white px-4 py-3 text-[#102a43] outline-none placeholder:text-[#829ab1] focus:border-[#0b4eae]" /></label>
            </div>
            <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b4eae] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#073a82]"><UploadCloud className="h-4 w-4" /> Submit for review</button>
          </form>
          </> : null}
        </section> : null}
        {activeView === 'events' ? <section className="space-y-5">
          <div className="rounded-xl border border-[#ffc400]/20 bg-[linear-gradient(110deg,rgba(255,196,0,0.12),rgba(17,17,19,1)_62%)] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffc400]">{ui.memberEvents}</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">{ui.eventsTitle}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#aab5c6]">{ui.eventsDesc}</p>
          </div>
          <article className="rounded-xl border border-[#ffc400]/30 bg-[#111113] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffc400]">Featured event</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">Itaewon World Music Spirit Festival 2026</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-[#aab5c6]">A music and culture festival journey for Indian singers and musical artists, connected to the K-CUBE India pre-selection.</p></div><span className="shrink-0 rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-2 text-xs font-black text-[#ffc400]">Featured</span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-bold text-[#98a4b1]">Festival dates</p><p className="mt-2 font-black">October 4-6, 2026</p></div><div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-bold text-[#98a4b1]">Location</p><p className="mt-2 font-black">Itaewon, Seoul, Korea</p></div><div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-bold text-[#98a4b1]">Main performance</p><p className="mt-2 font-black">October 6 · 7:00-9:30 PM</p></div></div>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><div className="rounded-lg border border-white/10 bg-white/[0.03] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">What to expect</p><ul className="mt-3 space-y-3 text-sm leading-6 text-[#d4dbe7]"><li>- Festival music and cultural programming in Seoul.</li><li>- A dedicated India pre-selection route for eligible performers.</li><li>- Application review and follow-up communication from the K-CUBE team.</li></ul></div><div className="rounded-lg border border-white/10 bg-[#ffc400]/[0.06] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Your next step</p><ol className="mt-3 space-y-3 text-sm leading-6 text-[#d4dbe7]"><li><span className="font-black text-[#ffc400]">01</span> Read the festival information.</li><li><span className="font-black text-[#ffc400]">02</span> Submit your pre-selection application.</li><li><span className="font-black text-[#ffc400]">03</span> Wait for review and official updates.</li></ol></div></div>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">Your application</p><h3 className="mt-2 text-lg font-black">{applicationLoading ? 'Checking submission status...' : indiaApplication ? 'India pre-selection submission found' : 'No submission yet'}</h3></div>{indiaApplication ? <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#ffc400]">{indiaApplication.status}</span> : null}</div>{indiaApplication ? <><div className="mt-4 grid gap-3 sm:grid-cols-3"><div><p className="text-xs font-bold text-[#98a4b1]">Performance category</p><p className="mt-1 font-black">{indiaApplication.performance_category}</p></div><div><p className="text-xs font-bold text-[#98a4b1]">Submitted</p><p className="mt-1 font-black">{indiaApplication.submitted_at ? new Date(indiaApplication.submitted_at).toLocaleDateString() : 'Not available'}</p></div><div><p className="text-xs font-bold text-[#98a4b1]">Points awarded</p><p className="mt-1 font-black text-[#ffc400]">{indiaApplication.points_awarded || 0}</p></div></div>{indiaApplication.review_note ? <p className="mt-4 border-l-2 border-[#ffc400] pl-3 text-sm leading-6 text-[#d4dbe7]"><span className="font-black">Review note:</span> {indiaApplication.review_note}</p> : <p className="mt-4 text-sm text-[#aab5c6]">Your application is saved. The K-CUBE team will update the status after review.</p>}</> : <p className="mt-3 text-sm leading-6 text-[#aab5c6]">Submit once to enter the review queue. Your status and any review note will appear here after submission.</p>}</div>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/india-pre-selection" className="rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]">View full event brief</Link><Link href="/india-pre-selection/apply" className="rounded-lg border border-[#ffc400]/40 px-5 py-3 text-sm font-black text-[#ffc400]">{indiaApplication ? 'View my application' : 'Apply for pre-selection'}</Link></div>
          </article>
          <div className="grid gap-5 md:grid-cols-2">{events.length ? events.map((event) => (
            <article key={event.id} className="rounded-xl border border-white/10 bg-[#111113] p-6">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">{event.category.replace(/_/g, ' ')}</p><h2 className="mt-2 text-xl font-black">{event.title}</h2></div>{event.points_reward ? <span className="rounded-full bg-[#ffc400]/10 px-3 py-1 text-xs font-black text-[#ffc400]">+{event.points_reward} pts</span> : null}</div>
              <p className="mt-3 text-sm leading-6 text-[#aab5c6]">{event.description || 'Join this K-CUBE community event and participate in a verified experience.'}</p>
              <div className="mt-4 space-y-2 text-sm text-[#d4dbe7]"><p><span className="font-bold text-[#98a4b1]">When:</span> {new Date(event.starts_at).toLocaleString()} - {new Date(event.ends_at).toLocaleString()}</p><p><span className="font-bold text-[#98a4b1]">Where:</span> {event.location_name || event.online_meeting_url || 'Details to be announced'}{event.location_address ? `, ${event.location_address}` : ''}</p>{event.capacity ? <p><span className="font-bold text-[#98a4b1]">Capacity:</span> {event.capacity} participants</p> : null}</div>
              <button type="button" onClick={() => rsvpToEvent(event.id)} disabled={rsvpStatus[event.id] === 'registered'} className="mt-5 w-full rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909] disabled:cursor-not-allowed disabled:bg-[#4b431f] disabled:text-[#d4be55]">{rsvpStatus[event.id] === 'registered' ? 'RSVP confirmed' : 'RSVP to this event'}</button>
            </article>
          )) : <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-[#aab5c6] md:col-span-2">No additional published events are available right now. Check back here when the admin publishes the next event.</div>}</div>
          {eventMessage ? <p className="rounded-xl border border-white/10 bg-[#111113] px-5 py-4 text-sm font-bold text-[#d4dbe7]">{eventMessage}</p> : null}
        </section> : null}
        {activeView === 'overview' ? <section id="overview" className="px-0 py-0 sm:py-1">
        <div className="mx-auto grid max-w-[1480px] gap-6 lg:grid-cols-[1fr_360px]">
          <div id="profile" className="col-span-full flex scroll-mt-24 flex-col gap-4 rounded-xl border border-white/10 bg-[#111113] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#ffc400] text-lg font-black text-[#111]">{(user.fullName || 'K').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div>
              <div className="min-w-0"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffc400]">{t.account}</p><p className="truncate text-lg font-black">{user.fullName}</p><p className="truncate text-sm text-[#aab5c6]">{user.email || user.phone || t.workspace}</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-[#d4dbe7]">{user.referralCode ? `${t.referral}: ${user.referralCode}` : t.locationPrompt}</span><button type="button" onClick={() => setActiveView('profile')} className="inline-flex items-center gap-2 rounded-lg border border-[#ffc400]/40 px-4 py-2.5 text-sm font-black text-[#ffc400] transition hover:bg-[#ffc400] hover:text-[#111]"><UserRound className="h-4 w-4" /> {t.viewEditProfile}</button></div>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111113]">
            <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffc400]">{ui.memberCommand}</p>
                <h1 className="mt-4 max-w-4xl text-3xl font-black leading-[1.08] sm:text-4xl lg:text-5xl">{ui.dashboardHeading}</h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#aab5c6]">{ui.dashboardIntro}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-[#ffc400]/25 bg-[#ffc400]/10 p-4">
                    <Trophy className="h-5 w-5 text-[#ffc400]" />
                    <p className="mt-3 text-3xl font-black text-[#ffc400]">{points}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d4dbe7]">{t.totalPoints}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <Plane className="h-5 w-5 text-[#ffc400]" />
                    <p className="mt-3 text-3xl font-black">{Math.min(Math.round(points / 20), 100)}%</p>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#aab5c6]">{t.tripMeter}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <Gift className="h-5 w-5 text-[#ffc400]" />
                    <p className="mt-3 text-sm font-black text-[#ffc400]">{t.signupRewards}</p>
                    <p className="mt-2 text-xs leading-5 text-[#aab5c6]">{t.welcomePoints}</p>
                  </div>
                </div>
            </div>
            <div className="grid gap-2 border-t border-white/10 p-2 sm:grid-cols-3 sm:gap-3 sm:p-3">
                {heroImages.map((image) => (
                  <div key={image.title} className="relative min-h-[150px] overflow-hidden rounded-lg bg-cover bg-center sm:min-h-[180px]" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,7,8,0.08), rgba(7,7,8,0.52)), url(${image.src})` }}>
                    <p className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">{image.title}</p>
                  </div>
                ))}
            </div>
          </div>

          <aside className="rounded-xl border border-white/10 bg-[#111113] p-6">
            <h2 className="text-2xl font-black">{ui.ranking}</h2>
            <p className="mt-3 text-sm leading-7 text-[#aab5c6]">{ui.rankingDesc}</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#ffc400]" style={{ width: `${Math.min(points / 20, 100)}%` }} />
            </div>
            <button type="button" onClick={visitKFood} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
              {ui.visitShop}
            </button>

            <div id="referrals" className="mt-6 scroll-mt-24 rounded-xl border border-[#ffc400]/20 bg-[#ffc400]/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffc400]">{ui.invite}</p>
              <h3 className="mt-2 text-xl font-black text-white">{ui.earn30}</h3>
              <p className="mt-2 text-sm leading-6 text-[#d4dbe7]">{ui.referralDesc}</p>
              <div className="mt-4 rounded-lg border border-white/10 bg-[#070708] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#aab5c6]">{ui.referralCode}</p>
                <p className="mt-1 break-all text-lg font-black text-white">{user.referralCode ?? 'Loading...'}</p>
              </div>
              <button type="button" onClick={copyReferralLink} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#ffc400]/40 bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
                <Copy className="h-4 w-4" />
                {ui.copyInvite}
              </button>
              {referralMessage ? <p className="mt-3 text-sm leading-6 text-[#d4dbe7]">{referralMessage}</p> : null}
            </div>
          </aside>
        </div>
      </section> : null}

      {activeView === 'actions' ? <section id="actions" className="px-0 pb-12 sm:pb-5">
        <div className="mx-auto grid max-w-[1480px] gap-6 xl:grid-cols-3">
          <form id="submissions" onSubmit={submitUpload} className="scroll-mt-24 rounded-xl border border-white/10 bg-[#111113] p-6">
            <Clapperboard className="h-7 w-7 text-[#ffc400]" />
            <h2 className="mt-4 text-2xl font-black">Submit Korean culture video</h2>
            <p className="mt-2 text-sm leading-6 text-[#aab5c6]">Dance, song, drama review or culture content submit karein. Admin approve karke points assign karega.</p>
            <div className="mt-5 grid gap-3">
              <select value={upload.category} onChange={(event) => setUpload((current) => ({ ...current, category: event.target.value }))} className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white">
                {uploadCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
              <input value={upload.title} onChange={(event) => setUpload((current) => ({ ...current, title: event.target.value }))} placeholder="Video title" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <input value={upload.video_url} onChange={(event) => setUpload((current) => ({ ...current, video_url: event.target.value }))} placeholder="YouTube / Drive video URL" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <input value={upload.thumbnail_url} onChange={(event) => setUpload((current) => ({ ...current, thumbnail_url: event.target.value }))} placeholder="Thumbnail image URL" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <textarea value={upload.description} onChange={(event) => setUpload((current) => ({ ...current, description: event.target.value }))} placeholder="Short description" className="min-h-24 rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
              <UploadCloud className="h-4 w-4" /> Submit for review
            </button>
          </form>

          <section id="learning" className="scroll-mt-24 rounded-xl border border-white/10 bg-[#111113] p-6">
            <BookOpen className="h-7 w-7 text-[#ffc400]" />
            <h2 className="mt-4 text-2xl font-black">{ui.dailyLearning}</h2>
            <p className="mt-2 text-sm leading-6 text-[#aab5c6]">{ui.dailyDesc}</p>
            <div className="mt-5 grid gap-3">
              {lessons.map((lesson) => (
                <article key={lesson.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black">{lesson.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#aab5c6]">{lesson.detail}</p>
                    </div>
                    <span className="rounded-full bg-[#ffc400]/10 px-3 py-1 text-sm font-black text-[#ffc400]">+{lesson.points}</span>
                  </div>
                    <button type="button" onClick={() => completeLesson(lesson.id)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#ffc400]/35 px-4 py-2 text-sm font-black text-[#ffc400]">
                    <CheckCircle2 className="h-4 w-4" /> {ui.completeChapter}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <form id="kfood" onSubmit={submitPurchaseClaim} className="scroll-mt-24 rounded-xl border border-white/10 bg-[#111113] p-6">
            <Utensils className="h-7 w-7 text-[#ffc400]" />
            <h2 className="mt-4 text-2xl font-black">{ui.claimFood}</h2>
            <p className="mt-2 text-sm leading-6 text-[#aab5c6]">{ui.claimFoodDesc}</p>
            <div className="mt-5 grid gap-3">
              <input value={purchase.order_id} onChange={(event) => setPurchase((current) => ({ ...current, order_id: event.target.value }))} placeholder="K-Food order ID" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <input value={purchase.order_total} onChange={(event) => setPurchase((current) => ({ ...current, order_total: event.target.value }))} placeholder="Order total" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <input value={purchase.coupon_code} onChange={(event) => setPurchase((current) => ({ ...current, coupon_code: event.target.value.toUpperCase() }))} placeholder="Coupon code" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
              <Gift className="h-4 w-4" /> {ui.submitClaim}
            </button>
          </form>
        </div>
      </section> : null}

      {activeView === 'learning' ? <section id="learning-history" className="px-0 pb-12 sm:pb-5">
        <div className="mx-auto max-w-[1480px] rounded-xl border border-white/10 bg-[#111113] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffc400]">{ui.savedProgress}</p>
              <h2 className="mt-2 text-2xl font-black">{ui.history}</h2>
              <p className="mt-2 text-sm leading-6 text-[#aab5c6]">{ui.persistence}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-[#d4dbe7]">
              {learningLoading ? ui.loadingProgress : `${learningProgress.length} ${ui.trackedPaths}`}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {learningProgress.length ? (
              learningProgress.map((track) => (
                <article key={track.trackSlug} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">{track.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-black">{track.trackTitle}</h3>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg border border-white/10 bg-[#0a0a0b] p-3">
                      <p className="text-xs font-bold text-[#aab5c6]">{ui.current}</p>
                      <p className="mt-1 text-2xl font-black" style={{ color: track.accent }}>{track.currentStreak}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-[#0a0a0b] p-3">
                      <p className="text-xs font-bold text-[#aab5c6]">{ui.best}</p>
                      <p className="mt-1 text-2xl font-black">{track.bestStreak}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-[#0a0a0b] p-3">
                      <p className="text-xs font-bold text-[#aab5c6]">{ui.sessions}</p>
                      <p className="mt-1 text-2xl font-black">{track.totalSessions}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-[#d4dbe7]">
                    <p className="flex justify-between gap-4"><span>{ui.totalCorrect}</span><span className="font-black">{track.totalCorrect}</span></p>
                    <p className="flex justify-between gap-4"><span>{ui.totalPoints}</span><span className="font-black">{track.totalPoints}</span></p>
                    <p className="flex justify-between gap-4"><span>{ui.lastCompleted}</span><span className="font-black">{track.lastCompletedAt ? new Date(track.lastCompletedAt).toLocaleString() : ui.notYet}</span></p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-[#aab5c6] lg:col-span-3">
                {ui.noProgress}
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ffc400]">{ui.recentSessions}</p>
                <h3 className="mt-2 text-xl font-black">{ui.latestCompletions}</h3>
              </div>
              <span className="text-sm text-[#aab5c6]">{learningSessions.length} {ui.records}</span>
            </div>
            <div className="mt-4 grid gap-3">
              {learningSessions.length ? (
                learningSessions.slice(0, 5).map((session) => (
                  <article key={session.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-black text-white">{session.trackTitle}</p>
                      <p className="mt-1 text-sm text-[#aab5c6]">{session.totalQuestions} questions · {session.correctAnswers} correct · {session.accuracy}% accuracy</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em]">
                      <span className="rounded-full bg-[#ffc400]/10 px-3 py-1 text-[#ffc400]">+{session.sessionPoints} pts</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-white">Streak {session.streakBefore} → {session.streakAfter}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-white">{new Date(session.completedAt).toLocaleDateString()}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-[#aab5c6]">
                  {ui.noSessions}
                </div>
              )}
            </div>
          </div>
        </div>

      </section> : null}

      {activeView === 'referrals' ? <section className="px-0 pb-12 sm:pb-5">
        <div className="mx-auto max-w-3xl rounded-xl border border-[#ffc400]/20 bg-[#ffc400]/10 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffc400]">{ui.invite}</p>
          <h2 className="mt-3 text-3xl font-black">{ui.earn30}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d4dbe7]">{ui.referralDesc}</p>
          <div className="mt-6 rounded-lg border border-white/10 bg-[#070708] px-4 py-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#aab5c6]">{ui.referralCode}</p><p className="mt-2 text-2xl font-black tracking-[0.12em]">{user.referralCode ?? 'Loading...'}</p></div>
          <button type="button" onClick={copyReferralLink} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]"><Copy className="h-4 w-4" /> {ui.copyInvite}</button>
          {referralMessage ? <p className="mt-3 text-sm font-bold text-[#d4dbe7]">{referralMessage}</p> : null}
        </div>
      </section> : null}

      {message ? <p className="mx-auto mt-6 max-w-[1480px] rounded-xl border border-white/10 bg-[#111113] px-5 py-4 text-sm font-bold text-[#d4dbe7]">{message}</p> : null}
        </div>
      </div>
    </main>
  );
};

export default MemberDashboard;
