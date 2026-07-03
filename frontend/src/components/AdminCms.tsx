"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Clapperboard,
  FilePenLine,
  Gift,
  ShieldCheck,
  ShoppingBag,
  Trophy,
  Users,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import api from '@/lib/api';
import { detailItems } from '@/lib/kcubeContent';
import { useAppStore } from '@/store/useAppStore';

type LearningTrackRow = {
  id: number;
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  accent: string;
  rewardPoints: number;
  bankSize: number;
  stepSize: number;
  overview: string[];
  loginCopy: string[];
  active: boolean;
  sortOrder: number;
};

type LearningQuestionRow = {
  id: number;
  trackId: number;
  trackSlug: string;
  trackTitle: string;
  questionKey: string;
  type: string;
  tag: string;
  prompt: string;
  korean: string;
  answer: string;
  options: string[];
  words: string[];
  cards: Array<{ korean: string; label: string; visual: string }>;
  pairs: Array<{ korean: string; label: string }>;
  hint: string;
  points: number;
  sortOrder: number;
  active: boolean;
};

type CmsPageRow = {
  id: number;
  slug: string;
  pageType: string;
  titleEn: string;
  titleKo: string | null;
  titleHi: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  publishedAt: string | null;
};

const cmsModules = [
  { title: 'Content CMS', description: 'Manage SEO pages, homepage sections, detail pages and banners.', icon: FilePenLine },
  { title: 'Users', description: 'Review users, roles, status, login methods and account history.', icon: Users },
  { title: 'Points Ledger', description: 'Approve, audit, adjust and export point transactions.', icon: BarChart3 },
  { title: 'Culture Upload Review', description: 'Approve dance, song, drama and culture uploads, then award verified points.', icon: Clapperboard },
  { title: 'Korean Lessons', description: 'Manage daily Hangul chapters, tasks, streaks and learning rewards.', icon: BookOpen },
  { title: 'K-Food Claims', description: 'Review internal shop order claims, coupons, click attribution and purchase points.', icon: ShoppingBag },
  { title: 'Korea Trip Winner', description: 'Audit leaderboard totals and announce the verified Korea trip winner.', icon: Trophy },
  { title: 'Events & Rewards', description: 'Publish events, rewards, Korea trip rules and redemption offers.', icon: Gift },
];

const emptyTrackForm = {
  id: '',
  slug: '',
  title: '',
  eyebrow: '',
  intro: '',
  accent: '#19c37d',
  rewardPoints: 0,
  stepSize: 10,
  overview: '[]',
  loginCopy: '[]',
  active: true,
  sortOrder: 0,
};

const emptyQuestionForm = {
  id: '',
  trackId: '',
  questionKey: '',
  type: 'choice',
  tag: '',
  prompt: '',
  korean: '',
  answer: '',
  options: '[]',
  words: '[]',
  cards: '[]',
  pairs: '[]',
  hint: '',
  points: 0,
  sortOrder: 0,
  active: true,
};

const emptyPageForm = {
  id: '',
  slug: '',
  pageType: 'learning',
  titleEn: '',
  titleKo: '',
  titleHi: '',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
};

const safeJson = (value: string, fallback: unknown[]) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const AdminCms = () => {
  const user = useAppStore((state) => state.user);
  const [tracks, setTracks] = useState<LearningTrackRow[]>([]);
  const [questions, setQuestions] = useState<LearningQuestionRow[]>([]);
  const [pages, setPages] = useState<CmsPageRow[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [trackForm, setTrackForm] = useState(emptyTrackForm);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [pageForm, setPageForm] = useState(emptyPageForm);
  const [notice, setNotice] = useState('');

  const selectedTrack = useMemo(
    () => tracks.find((track) => track.id === selectedTrackId) || null,
    [selectedTrackId, tracks],
  );
  const visibleQuestions = useMemo(
    () => questions.filter((question) => question.trackId === selectedTrackId),
    [questions, selectedTrackId],
  );

  const loadAdminData = async () => {
    const [trackRes, questionRes, pageRes] = await Promise.all([
      api.get('/learning/admin/tracks'),
      api.get('/learning/admin/questions'),
      api.get('/learning/cms/pages'),
    ]);

    const trackPayload = trackRes.data?.data || trackRes.data || [];
    const questionPayload = questionRes.data?.data || questionRes.data || [];
    const pagePayload = pageRes.data?.data || pageRes.data || [];

    setTracks(trackPayload);
    setQuestions(questionPayload);
    setPages(pagePayload);

    if (!selectedTrackId && trackPayload.length) {
      setSelectedTrackId(trackPayload[0].id);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadAdminData().catch(() => setNotice('Failed to load admin data.'));
  }, [user]);

  useEffect(() => {
    if (!selectedTrack) return;
    setTrackForm({
      id: String(selectedTrack.id),
      slug: selectedTrack.slug,
      title: selectedTrack.title,
      eyebrow: selectedTrack.eyebrow,
      intro: selectedTrack.intro,
      accent: selectedTrack.accent,
      rewardPoints: selectedTrack.rewardPoints,
      stepSize: selectedTrack.stepSize,
      overview: JSON.stringify(selectedTrack.overview, null, 2),
      loginCopy: JSON.stringify(selectedTrack.loginCopy, null, 2),
      active: selectedTrack.active,
      sortOrder: selectedTrack.sortOrder,
    });
    setQuestionForm((current) => ({ ...current, trackId: String(selectedTrack.id) }));
  }, [selectedTrack]);

  if (!user || user.role !== 'admin') {
    return (
      <main className="min-h-screen bg-[#070708] px-5 py-16 text-white lg:px-10">
        <section className="mx-auto max-w-[760px] rounded-xl border border-white/10 bg-[#111113] p-8 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-[#ffc400]" />
          <h1 className="mt-5 text-3xl font-black">Admin access required</h1>
          <p className="mt-3 text-sm leading-7 text-[#aab5c6]">
            Please sign in with an admin account to manage K-CUBE content, users, points, events and rewards.
          </p>
          <Link href="/admin/login" className="mt-6 inline-flex rounded-lg bg-[#ffc400] px-5 py-3 text-sm font-black text-[#090909]">
            Admin login
          </Link>
        </section>
      </main>
    );
  }

  const saveTrack = async () => {
    const payload = {
      id: trackForm.id ? Number(trackForm.id) : undefined,
      slug: trackForm.slug,
      title: trackForm.title,
      eyebrow: trackForm.eyebrow,
      intro: trackForm.intro,
      accent: trackForm.accent,
      rewardPoints: Number(trackForm.rewardPoints || 0),
      stepSize: Number(trackForm.stepSize || 10),
      overview: safeJson(trackForm.overview, []),
      loginCopy: safeJson(trackForm.loginCopy, []),
      active: trackForm.active,
      sortOrder: Number(trackForm.sortOrder || 0),
    };

    if (trackForm.id) {
      await api.patch(`/learning/admin/tracks/${trackForm.id}`, payload);
    } else {
      await api.post('/learning/admin/tracks', payload);
    }

    setNotice('Learning track saved.');
    await loadAdminData();
  };

  const deleteTrack = async (id: number) => {
    await api.delete(`/learning/admin/tracks/${id}`);
    setNotice('Learning track deleted.');
    setTrackForm(emptyTrackForm);
    setSelectedTrackId(null);
    await loadAdminData();
  };

  const saveQuestion = async () => {
    if (!questionForm.trackId) {
      setNotice('Pick a track first.');
      return;
    }

    const payload = {
      id: questionForm.id ? Number(questionForm.id) : undefined,
      trackId: Number(questionForm.trackId),
      questionKey: questionForm.questionKey,
      type: questionForm.type,
      tag: questionForm.tag,
      prompt: questionForm.prompt,
      korean: questionForm.korean,
      answer: questionForm.answer,
      options: safeJson(questionForm.options, []),
      words: safeJson(questionForm.words, []),
      cards: safeJson(questionForm.cards, []),
      pairs: safeJson(questionForm.pairs, []),
      hint: questionForm.hint,
      points: Number(questionForm.points || 0),
      sortOrder: Number(questionForm.sortOrder || 0),
      active: questionForm.active,
    };

    if (questionForm.id) {
      await api.patch(`/learning/admin/questions/${questionForm.id}`, payload);
    } else {
      await api.post('/learning/admin/questions', payload);
    }

    setNotice('Learning question saved.');
    setQuestionForm({ ...emptyQuestionForm, trackId: questionForm.trackId });
    await loadAdminData();
  };

  const deleteQuestion = async (id: number) => {
    await api.delete(`/learning/admin/questions/${id}`);
    setNotice('Learning question deleted.');
    await loadAdminData();
  };

  const savePage = async () => {
    const payload = {
      id: pageForm.id ? Number(pageForm.id) : undefined,
      slug: pageForm.slug,
      pageType: pageForm.pageType,
      titleEn: pageForm.titleEn,
      titleKo: pageForm.titleKo || null,
      titleHi: pageForm.titleHi || null,
      seoTitle: pageForm.seoTitle || null,
      seoDescription: pageForm.seoDescription || null,
      status: pageForm.status,
    };

    if (pageForm.id) {
      await api.patch(`/learning/cms/pages/${pageForm.id}`, payload);
    } else {
      await api.post('/learning/cms/pages', payload);
    }

    setNotice('CMS page saved.');
    setPageForm(emptyPageForm);
    await loadAdminData();
  };

  return (
    <main className="min-h-screen bg-[#070708] px-5 py-12 text-white lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ffc400]">Admin CMS</p>
            <h1 className="mt-3 text-4xl font-black">K-CUBE control center</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#aab5c6]">
              Foundation dashboard for managing website content, users, points ledger, activities, Korean lessons, K-Food content, events and Korea trip rewards.
            </p>
            {notice ? <p className="mt-4 text-sm font-bold text-[#ffcf86]">{notice}</p> : null}
          </div>
          <Link href="/admin/login" className="rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white hover:border-[#ffc400] hover:text-[#ffc400]">
            Switch admin
          </Link>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cmsModules.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.title} className="rounded-xl border border-white/10 bg-[#111113] p-6">
                <Icon className="h-7 w-7 text-[#ffc400]" />
                <h2 className="mt-4 text-2xl font-black">{module.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#aab5c6]">{module.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-xl border border-white/10 bg-[#111113] p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-[#ffc400]" />
            <h2 className="text-2xl font-black">CMS content inventory</h2>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-[#ffc400]">
                <tr>
                  <th className="border-b border-white/10 py-3">Type</th>
                  <th className="border-b border-white/10 py-3">Slug</th>
                  <th className="border-b border-white/10 py-3">Title</th>
                  <th className="border-b border-white/10 py-3">Points</th>
                  <th className="border-b border-white/10 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-[#d4dbe7]">
                {detailItems.map((item) => (
                  <tr key={`${item.category}-${item.slug}`}>
                    <td className="border-b border-white/10 py-3 capitalize">{item.category}</td>
                    <td className="border-b border-white/10 py-3">{item.slug}</td>
                    <td className="border-b border-white/10 py-3">{item.title.en}</td>
                    <td className="border-b border-white/10 py-3">{item.points ?? '-'}</td>
                    <td className="border-b border-white/10 py-3">Published</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <article className="rounded-xl border border-white/10 bg-[#111113] p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-[#ffc400]" />
              <h2 className="text-2xl font-black">Learning track editor</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`rounded-xl border px-4 py-4 text-left transition ${selectedTrackId === track.id ? 'border-[#ffc400] bg-[#1a1a1d]' : 'border-white/10 bg-[#0d0d10]'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black">{track.title}</span>
                    <span className="text-xs font-black text-[#ffc400]">{track.bankSize} questions</span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#98a4b1]">{track.slug}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-[#0d0d10] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black">{trackForm.id ? 'Edit track' : 'Create track'}</h3>
                <button type="button" onClick={() => setTrackForm(emptyTrackForm)} className="text-sm font-bold text-[#ffc400]">
                  Reset
                </button>
              </div>
              <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="slug" value={trackForm.slug} onChange={(event) => setTrackForm((state) => ({ ...state, slug: event.target.value }))} />
              <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="title" value={trackForm.title} onChange={(event) => setTrackForm((state) => ({ ...state, title: event.target.value }))} />
              <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="eyebrow" value={trackForm.eyebrow} onChange={(event) => setTrackForm((state) => ({ ...state, eyebrow: event.target.value }))} />
              <textarea className="min-h-24 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="intro" value={trackForm.intro} onChange={(event) => setTrackForm((state) => ({ ...state, intro: event.target.value }))} />
              <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="accent" value={trackForm.accent} onChange={(event) => setTrackForm((state) => ({ ...state, accent: event.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" type="number" placeholder="reward points" value={trackForm.rewardPoints} onChange={(event) => setTrackForm((state) => ({ ...state, rewardPoints: Number(event.target.value) }))} />
                <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" type="number" placeholder="step size" value={trackForm.stepSize} onChange={(event) => setTrackForm((state) => ({ ...state, stepSize: Number(event.target.value) }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" type="number" placeholder="sort order" value={trackForm.sortOrder} onChange={(event) => setTrackForm((state) => ({ ...state, sortOrder: Number(event.target.value) }))} />
                <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">
                  <input type="checkbox" checked={trackForm.active} onChange={(event) => setTrackForm((state) => ({ ...state, active: event.target.checked }))} />
                  Active
                </label>
              </div>
              <textarea className="min-h-24 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="overview JSON array" value={trackForm.overview} onChange={(event) => setTrackForm((state) => ({ ...state, overview: event.target.value }))} />
              <textarea className="min-h-24 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="loginCopy JSON array" value={trackForm.loginCopy} onChange={(event) => setTrackForm((state) => ({ ...state, loginCopy: event.target.value }))} />
              <div className="flex gap-3">
                <button type="button" onClick={saveTrack} className="inline-flex items-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                  <Save className="h-4 w-4" /> Save track
                </button>
                {trackForm.id ? (
                  <button type="button" onClick={() => deleteTrack(Number(trackForm.id))} className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                ) : null}
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-white/10 bg-[#111113] p-6">
            <div className="flex items-center gap-3">
              <Plus className="h-6 w-6 text-[#ffc400]" />
              <h2 className="text-2xl font-black">Question bank editor</h2>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
              <div className="space-y-3">
                {visibleQuestions.map((question) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() =>
                      setQuestionForm({
                        id: String(question.id),
                        trackId: String(question.trackId),
                        questionKey: question.questionKey,
                        type: question.type,
                        tag: question.tag,
                        prompt: question.prompt,
                        korean: question.korean,
                        answer: question.answer,
                        options: JSON.stringify(question.options, null, 2),
                        words: JSON.stringify(question.words, null, 2),
                        cards: JSON.stringify(question.cards, null, 2),
                        pairs: JSON.stringify(question.pairs, null, 2),
                        hint: question.hint,
                        points: question.points,
                        sortOrder: question.sortOrder,
                        active: question.active,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-left"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-[#98a4b1]">{question.type} / {question.tag}</p>
                    <p className="mt-2 font-black">{question.questionKey}</p>
                    <p className="mt-1 text-sm text-[#aab5c6]">{question.prompt}</p>
                  </button>
                ))}
                {!visibleQuestions.length ? <p className="text-sm text-[#aab5c6]">Select a track and start creating questions.</p> : null}
              </div>

              <div className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d10] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black">{questionForm.id ? 'Edit question' : 'Create question'}</h3>
                  <button type="button" onClick={() => setQuestionForm({ ...emptyQuestionForm, trackId: questionForm.trackId })} className="text-sm font-bold text-[#ffc400]">
                    Reset
                  </button>
                </div>
                <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="track id" value={questionForm.trackId} onChange={(event) => setQuestionForm((state) => ({ ...state, trackId: event.target.value }))} />
                <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="question key" value={questionForm.questionKey} onChange={(event) => setQuestionForm((state) => ({ ...state, questionKey: event.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="type" value={questionForm.type} onChange={(event) => setQuestionForm((state) => ({ ...state, type: event.target.value }))} />
                  <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="tag" value={questionForm.tag} onChange={(event) => setQuestionForm((state) => ({ ...state, tag: event.target.value }))} />
                </div>
                <textarea className="min-h-20 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="prompt" value={questionForm.prompt} onChange={(event) => setQuestionForm((state) => ({ ...state, prompt: event.target.value }))} />
                <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="korean" value={questionForm.korean} onChange={(event) => setQuestionForm((state) => ({ ...state, korean: event.target.value }))} />
                <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="answer" value={questionForm.answer} onChange={(event) => setQuestionForm((state) => ({ ...state, answer: event.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" type="number" placeholder="points" value={questionForm.points} onChange={(event) => setQuestionForm((state) => ({ ...state, points: Number(event.target.value) }))} />
                  <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" type="number" placeholder="sort order" value={questionForm.sortOrder} onChange={(event) => setQuestionForm((state) => ({ ...state, sortOrder: Number(event.target.value) }))} />
                </div>
                <textarea className="min-h-20 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="options JSON" value={questionForm.options} onChange={(event) => setQuestionForm((state) => ({ ...state, options: event.target.value }))} />
                <textarea className="min-h-20 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="words JSON" value={questionForm.words} onChange={(event) => setQuestionForm((state) => ({ ...state, words: event.target.value }))} />
                <textarea className="min-h-20 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="cards JSON" value={questionForm.cards} onChange={(event) => setQuestionForm((state) => ({ ...state, cards: event.target.value }))} />
                <textarea className="min-h-20 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="pairs JSON" value={questionForm.pairs} onChange={(event) => setQuestionForm((state) => ({ ...state, pairs: event.target.value }))} />
                <textarea className="min-h-20 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="hint" value={questionForm.hint} onChange={(event) => setQuestionForm((state) => ({ ...state, hint: event.target.value }))} />
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={questionForm.active} onChange={(event) => setQuestionForm((state) => ({ ...state, active: event.target.checked }))} />
                    Active
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={saveQuestion} className="inline-flex items-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                      <Save className="h-4 w-4" /> Save question
                    </button>
                    {questionForm.id ? (
                      <button type="button" onClick={() => deleteQuestion(Number(questionForm.id))} className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-3 text-sm font-black text-red-300">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-xl border border-white/10 bg-[#111113] p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-[#ffc400]" />
            <h2 className="text-2xl font-black">CMS page editor</h2>
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="space-y-3">
              {pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() =>
                    setPageForm({
                      id: String(page.id),
                      slug: page.slug,
                      pageType: page.pageType,
                      titleEn: page.titleEn,
                      titleKo: page.titleKo || '',
                      titleHi: page.titleHi || '',
                      seoTitle: page.seoTitle || '',
                      seoDescription: page.seoDescription || '',
                      status: page.status,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-left"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-[#98a4b1]">{page.pageType}</p>
                  <p className="mt-2 font-black">{page.titleEn}</p>
                  <p className="mt-1 text-sm text-[#aab5c6]">{page.slug}</p>
                </button>
              ))}
            </div>

            <div className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d10] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black">{pageForm.id ? 'Edit page' : 'Create page'}</h3>
                <button type="button" onClick={() => setPageForm(emptyPageForm)} className="text-sm font-bold text-[#ffc400]">
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="slug" value={pageForm.slug} onChange={(event) => setPageForm((state) => ({ ...state, slug: event.target.value }))} />
                <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="page type" value={pageForm.pageType} onChange={(event) => setPageForm((state) => ({ ...state, pageType: event.target.value }))} />
              </div>
              <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="title EN" value={pageForm.titleEn} onChange={(event) => setPageForm((state) => ({ ...state, titleEn: event.target.value }))} />
              <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="title KO" value={pageForm.titleKo} onChange={(event) => setPageForm((state) => ({ ...state, titleKo: event.target.value }))} />
              <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="title HI" value={pageForm.titleHi} onChange={(event) => setPageForm((state) => ({ ...state, titleHi: event.target.value }))} />
              <input className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="SEO title" value={pageForm.seoTitle} onChange={(event) => setPageForm((state) => ({ ...state, seoTitle: event.target.value }))} />
              <textarea className="min-h-24 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" placeholder="SEO description" value={pageForm.seoDescription} onChange={(event) => setPageForm((state) => ({ ...state, seoDescription: event.target.value }))} />
              <div className="flex items-center justify-between gap-3">
                <select className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" value={pageForm.status} onChange={(event) => setPageForm((state) => ({ ...state, status: event.target.value }))}>
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
                <button type="button" onClick={savePage} className="inline-flex items-center gap-2 rounded-lg bg-[#ffc400] px-4 py-3 text-sm font-black text-[#111]">
                  <Save className="h-4 w-4" /> Save page
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminCms;
