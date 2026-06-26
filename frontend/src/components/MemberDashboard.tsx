"use client";

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Clapperboard, Copy, ExternalLink, Gift, Plane, Trophy, UploadCloud, Utensils } from 'lucide-react';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

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

  const copyReferral = async () => {
    if (!user?.referralCode) return;
    await navigator.clipboard.writeText(user.referralCode);
    setMessage('Referral code copied.');
  };

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
      window.open(data.redirectUrl || 'https://k-food.in', '_blank', 'noopener,noreferrer');
    } catch {
      window.open('https://k-food.in', '_blank', 'noopener,noreferrer');
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

  if (!user) {
    return (
      <main className="min-h-screen bg-[#070708] px-5 py-16 text-white lg:px-10">
        <section className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-[#111113] p-8 text-center">
          <Gift className="mx-auto h-12 w-12 text-[#ffc400]" />
          <h1 className="mt-5 text-3xl font-black">Member dashboard locked</h1>
          <p className="mt-3 text-sm leading-7 text-[#aab5c6]">Register or sign in to earn welcome points, referral rewards, learning points, K-Food points and Korea trip ranking.</p>
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
                <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-6xl">Earn points from culture, learning, food and referrals.</h1>
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
                    <p className="mt-3 text-xl font-black">{user.referralCode || 'KC-CODE'}</p>
                    <button type="button" onClick={copyReferral} className="mt-2 inline-flex items-center gap-2 text-xs font-black text-[#ffc400]">
                      <Copy className="h-3.5 w-3.5" /> Copy referral
                    </button>
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
            <p className="mt-3 text-sm leading-7 text-[#aab5c6]">Winner announce hone se pehle admin all point sources verify karega: referrals, uploads, learning, K-Food and manual adjustments.</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#ffc400]" style={{ width: `${Math.min(points / 20, 100)}%` }} />
            </div>
            <button type="button" onClick={visitKFood} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
              Visit K-Food.in <ExternalLink className="h-4 w-4" />
            </button>
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
              <input value={purchase.coupon_code} onChange={(event) => setPurchase((current) => ({ ...current, coupon_code: event.target.value.toUpperCase() }))} placeholder="Coupon / referral code" className="rounded-lg border border-white/10 bg-[#070708] px-4 py-3 text-white outline-none focus:border-[#ffc400]" />
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#090909]">
              <Gift className="h-4 w-4" /> Submit claim
            </button>
          </form>
        </div>

        {message ? <p className="mx-auto mt-6 max-w-[1480px] rounded-xl border border-white/10 bg-[#111113] px-5 py-4 text-sm font-bold text-[#d4dbe7]">{message}</p> : null}
      </section>
    </main>
  );
};

export default MemberDashboard;
