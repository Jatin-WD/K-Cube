"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Lock, Sparkles, Trophy, Zap } from 'lucide-react';
import { learningTracks } from '@/lib/koreanLearningBank';
import { useAppStore } from '@/store/useAppStore';
import api from '@/lib/api';

const KoreanLearningHub = () => {
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const [remoteTracks, setRemoteTracks] = useState(learningTracks);

  useEffect(() => {
    let cancelled = false;
    const loadTracks = async () => {
      try {
        const response = await api.get('/learning/tracks');
        const payload = response.data?.data || response.data;
        if (!cancelled && Array.isArray(payload) && payload.length) {
          setRemoteTracks(
            payload.map((track: {
              slug: string;
              title: string;
              eyebrow: string;
              intro: string;
              accent: string;
              rewardPoints?: number;
              reward_points?: number;
              bankSize?: number;
              bank_size?: number;
              stepSize?: number;
              step_size?: number;
              overview?: string[];
              loginCopy?: string[];
            }) => ({
              slug: track.slug,
              title: track.title,
              eyebrow: track.eyebrow,
              intro: track.intro,
              accent: track.accent,
              rewardPoints: Number(track.rewardPoints ?? track.reward_points ?? 0),
              bankSize: Number(track.bankSize ?? track.bank_size ?? 0),
              stepSize: Number(track.stepSize ?? track.step_size ?? 10),
              overview: Array.isArray(track.overview) ? track.overview : [],
              loginCopy: Array.isArray(track.loginCopy) ? track.loginCopy : [],
              questionPool: [],
            })),
          );
        }
      } catch {
        if (!cancelled) setRemoteTracks(learningTracks);
      }
    };

    loadTracks();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="kc-learning-surface min-h-screen bg-[#eef4f8] text-[#102a43]">
      <section className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="kc-eyebrow">Learning Gateway</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Korean learning, points, and login-gated progress</h1>
          </div>
          <div className="rounded-md border border-[#dce6f0] bg-white px-4 py-2 text-sm font-semibold text-[#486581]">
            {user ? `Wallet: ${points} points` : 'Preview only until sign in'}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1320px] gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="overflow-hidden rounded-xl border border-[#dce6f0] bg-white p-6 shadow-[0_6px_20px_rgba(15,55,95,0.07)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-md border border-[#0b4eae]/20 bg-[#eaf3ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0b4eae]">
                  <Sparkles className="h-4 w-4" /> Adaptive Korean academy
                </div>
                <h2 className="mt-5 text-3xl font-bold leading-tight text-[#102a43] sm:text-4xl">Beginner to class-content learning, all inside a protected points system.</h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#486581] sm:text-lg">
                  Guests can read the overview, but the actual practice flow is locked until login. Once signed in, the app shuffles a fresh learning set from 100+ questions in each track.
                </p>
              </div>
              <div className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] px-5 py-4 text-right">
                <p className="kc-eyebrow">System</p>
                <p className="mt-2 text-2xl font-bold text-[#0b4eae]">{remoteTracks.length} tracks</p>
                <p className="mt-1 text-sm text-[#486581]">Adaptive sessions</p>
              </div>
            </div>

            {!user ? (
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-5">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-[#0b4eae]" />
                    <h3 className="text-xl font-bold text-[#102a43]">Login required</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#486581]">
                    Every real lesson, question shuffle, and point reward is available only after sign in. Before that, users see only basic service info and track summaries.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/signin?returnTo=/learning" className="kc-button kc-button-primary">
                      Sign in <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/signup?returnTo=/learning" className="kc-button kc-button-secondary">
                      Create account
                    </Link>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { title: 'Session shuffle', value: 'Per login', detail: 'A new seed changes the quiz order each time.' },
                    { title: 'Points', value: 'Yes', detail: 'Correct answers and completion both reward points.' },
                    { title: 'Guest mode', value: 'Preview', detail: 'Only high-level learning info is visible.' },
                    { title: 'Pool size', value: '100+', detail: 'Each track has a large question bank.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-lg border border-[#dce6f0] bg-white p-4">
                      <p className="kc-eyebrow">{item.title}</p>
                      <p className="mt-2 text-2xl font-bold text-[#0b4eae]">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-[#486581]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {remoteTracks.map((track) => (
                  <Link
                    key={track.slug}
                    href={`/learning/${track.slug}`}
                    className="group rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-5 transition hover:-translate-y-0.5 hover:border-[#0b4eae]/40 hover:bg-[#eaf3ff]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: track.accent }}>{track.eyebrow}</p>
                        <h3 className="mt-2 text-2xl font-black">{track.title}</h3>
                      </div>
                      <span className="rounded-md border border-[#dce6f0] bg-white px-3 py-1 text-xs font-bold text-[#0b4eae]">
                        +{track.rewardPoints} pts
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#486581]">{track.intro}</p>
                    <div className="mt-5 flex items-center justify-between text-sm font-bold text-[#486581]">
                      <span>{track.bankSize} questions</span>
                      <span className="inline-flex items-center gap-2 text-[#0b4eae]">
                        Open track <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </article>

          <aside className="grid gap-6">
            <div className="rounded-xl border border-[#dce6f0] bg-white p-6 shadow-[0_6px_20px_rgba(15,55,95,0.07)]">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-[#0b4eae]" />
                <h2 className="text-2xl font-bold text-[#102a43]">What unlocked users get</h2>
              </div>
              <div className="mt-5 grid gap-4">
                {[
                  ...remoteTracks.slice(0, 4).map((track) => `${track.title}: ${track.bankSize}+ adaptive questions`),
                ].map((line) => (
                  <div key={line} className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4 text-sm leading-7 text-[#486581]">
                    {line}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[#dce6f0] bg-white p-6 shadow-[0_6px_20px_rgba(15,55,95,0.07)]">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-[#0b4eae]" />
                <h2 className="text-2xl font-bold text-[#102a43]">Learning design notes</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[#486581]">
                <li>Fresh session order is derived from the login seed, so every sign-in can feel different.</li>
                <li>Points are awarded for learning completion after authentication.</li>
                <li>Guests can inspect the structure, but not the playable quiz content.</li>
                <li>The class-content track is original, book-inspired practice and not copied textbook text.</li>
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#0b4eae]/20 bg-[#eaf3ff] px-4 py-2 text-sm font-bold text-[#0b4eae]">
                <Zap className="h-4 w-4" /> Adaptive + points-based
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default KoreanLearningHub;
