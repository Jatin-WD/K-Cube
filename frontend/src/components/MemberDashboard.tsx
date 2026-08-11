"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Clapperboard, Copy, Gift, Plane, Trophy, UploadCloud, Utensils } from 'lucide-react';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

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

  if (!user) {
    return (
      <main className="min-h-screen bg-[#070708] px-5 py-16 text-white lg:px-10">
        <section className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-[#111113] p-8 text-center">
          <Gift className="mx-auto h-12 w-12 text-[#ffc400]" />
          <h1 className="mt-5 text-3xl font-black">Member dashboard locked</h1>
          <p className="mt-3 text-sm leading-7 text-[#aab5c6]">Register or sign in to earn welcome points, learning points, K-Food points and Korea trip ranking.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/signup" className="rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]">Create account</Link>
            <Link href="/signin" className="rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-white">Sign in</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070708] text-white">
      <section className="px-4 py-8 sm:px-5 sm:py-10 lg:px-10">
        <div className="mx-auto grid max-w-[1480px] gap-6 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111113]">
            <div className="grid min-h-[420px] gap-0 lg:grid-cols-[1fr_0.9fr]">
              <div className="p-8 lg:p-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffc400]">Member command center</p>
                <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-6xl">Earn points from culture, learning, food and purchases.</h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#aab5c6]">K-CUBE tracks every meaningful action toward the Korea trip leaderboard. Upload your Korean culture content, complete daily learning, refer friends, and claim K-Food purchases.</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-[#ffc400]/25 bg-[#ffc400]/10 p-4">
                    <Trophy className="h-5 w-5 text-[#ffc400]" />
                    <p className="mt-3 text-3xl font-black text-[#ffc400]">{points}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d4dbe7]">Total points</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <Plane className="h-5 w-5 text-[#ffc400]" />
                    <p className="mt-3 text-3xl font-black">{Math.min(Math.round(points / 20), 100)}%</p>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#aab5c6]">Trip meter</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <Gift className="h-5 w-5 text-[#ffc400]" />
                    <p className="mt-3 text-sm font-black text-[#ffc400]">Signup rewards only</p>
                    <p className="mt-2 text-xs leading-5 text-[#aab5c6]">Welcome points are credited automatically after successful account creation.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-rows-3">
                {heroImages.map((image) => (
                  <div key={image.title} className="relative min-h-[140px] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,7,8,0.08), rgba(7,7,8,0.52)), url(${image.src})` }}>
                    <p className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">{image.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-xl border border-white/10 bg-[#111113] p-6">
            <h2 className="text-2xl font-black">Korea trip ranking</h2>
            <p className="mt-3 text-sm leading-7 text-[#aab5c6]">Winner announce hone se pehle admin all point sources verify karega: uploads, learning, K-Food and manual adjustments.</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#ffc400]" style={{ width: `${Math.min(points / 20, 100)}%` }} />
            </div>
            <button type="button" onClick={visitKFood} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
              Visit K-CUBE Shop
            </button>

            <div className="mt-6 rounded-xl border border-[#ffc400]/20 bg-[#ffc400]/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffc400]">Invite friends</p>
              <h3 className="mt-2 text-xl font-black text-white">Earn 30 points per join</h3>
              <p className="mt-2 text-sm leading-6 text-[#d4dbe7]">
                Share your referral code. When a new user joins with it and completes signup, you get 30 points automatically.
              </p>
              <div className="mt-4 rounded-lg border border-white/10 bg-[#070708] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#aab5c6]">Your referral code</p>
                <p className="mt-1 break-all text-lg font-black text-white">{user.referralCode ?? 'Loading...'}</p>
              </div>
              <button type="button" onClick={copyReferralLink} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#ffc400]/40 bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
                <Copy className="h-4 w-4" />
                Copy invite link
              </button>
              {referralMessage ? <p className="mt-3 text-sm leading-6 text-[#d4dbe7]">{referralMessage}</p> : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-5 lg:px-10">
        <div className="mx-auto grid max-w-[1480px] gap-6 xl:grid-cols-3">
          <form onSubmit={submitUpload} className="rounded-xl border border-white/10 bg-[#111113] p-6">
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

          <section className="rounded-xl border border-white/10 bg-[#111113] p-6">
            <BookOpen className="h-7 w-7 text-[#ffc400]" />
            <h2 className="mt-4 text-2xl font-black">Daily Korean learning</h2>
            <p className="mt-2 text-sm leading-6 text-[#aab5c6]">First login se learning journey start hoti hai. Har completed chapter points ledger me save hota hai.</p>
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
                    <CheckCircle2 className="h-4 w-4" /> Complete chapter
                  </button>
                </article>
              ))}
            </div>
          </section>

          <form onSubmit={submitPurchaseClaim} className="rounded-xl border border-white/10 bg-[#111113] p-6">
            <Utensils className="h-7 w-7 text-[#ffc400]" />
            <h2 className="mt-4 text-2xl font-black">Claim K-Food purchase points</h2>
            <p className="mt-2 text-sm leading-6 text-[#aab5c6]">WordPress side theek hone tak order ID/coupon based manual review flow use kar sakte hain.</p>
            <div className="mt-5 grid gap-3">
              <input value={purchase.order_id} onChange={(event) => setPurchase((current) => ({ ...current, order_id: event.target.value }))} placeholder="K-Food order ID" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <input value={purchase.order_total} onChange={(event) => setPurchase((current) => ({ ...current, order_total: event.target.value }))} placeholder="Order total" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
              <input value={purchase.coupon_code} onChange={(event) => setPurchase((current) => ({ ...current, coupon_code: event.target.value.toUpperCase() }))} placeholder="Coupon code" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
              <Gift className="h-4 w-4" /> Submit claim
            </button>
          </form>
        </div>

        <div className="mx-auto mt-6 max-w-[1480px] rounded-xl border border-white/10 bg-[#111113] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffc400]">Saved learning progress</p>
              <h2 className="mt-2 text-2xl font-black">Streaks and recent history</h2>
              <p className="mt-2 text-sm leading-6 text-[#aab5c6]">Ye data `user_learning_progress` aur `learning_sessions` se load hota hai, so refresh ke baad bhi persist rahega.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-[#d4dbe7]">
              {learningLoading ? 'Loading saved progress...' : `${learningProgress.length} tracked paths`}
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
                      <p className="text-xs font-bold text-[#aab5c6]">Current</p>
                      <p className="mt-1 text-2xl font-black" style={{ color: track.accent }}>{track.currentStreak}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-[#0a0a0b] p-3">
                      <p className="text-xs font-bold text-[#aab5c6]">Best</p>
                      <p className="mt-1 text-2xl font-black">{track.bestStreak}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-[#0a0a0b] p-3">
                      <p className="text-xs font-bold text-[#aab5c6]">Sessions</p>
                      <p className="mt-1 text-2xl font-black">{track.totalSessions}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-[#d4dbe7]">
                    <p className="flex justify-between gap-4"><span>Total correct</span><span className="font-black">{track.totalCorrect}</span></p>
                    <p className="flex justify-between gap-4"><span>Total points</span><span className="font-black">{track.totalPoints}</span></p>
                    <p className="flex justify-between gap-4"><span>Last completed</span><span className="font-black">{track.lastCompletedAt ? new Date(track.lastCompletedAt).toLocaleString() : 'Not yet'}</span></p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-[#aab5c6] lg:col-span-3">
                No saved learning progress yet. Complete a few Korean lessons and your streak history will appear here.
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ffc400]">Recent sessions</p>
                <h3 className="mt-2 text-xl font-black">Latest completions</h3>
              </div>
              <span className="text-sm text-[#aab5c6]">{learningSessions.length} records</span>
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
                  Recent session history will appear here after you finish a learning track.
                </div>
              )}
            </div>
          </div>
        </div>

        {message ? <p className="mx-auto mt-6 max-w-[1480px] rounded-xl border border-white/10 bg-[#111113] px-5 py-4 text-sm font-bold text-[#d4dbe7]">{message}</p> : null}
      </section>
    </main>
  );
};

export default MemberDashboard;
