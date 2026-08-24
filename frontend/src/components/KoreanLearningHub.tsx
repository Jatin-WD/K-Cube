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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#162b33_0%,_#0b1418_46%,_#060b0d_100%)] text-white">
      <section className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#ffb54a]">Learning Gateway</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Korean learning, points, and login-gated progress</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-[#d8e5eb]">
            {user ? `Wallet: ${points} points` : 'Preview only until sign in'}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb54a]/30 bg-[#ffb54a]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#ffcf86]">
                  <Sparkles className="h-4 w-4" /> Adaptive Korean academy
                </div>
                <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">Beginner to class-content learning, all inside a protected points system.</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#d2dde3] sm:text-lg">
                  Guests can read the overview, but the actual practice flow is locked until login. Once signed in, the app shuffles a fresh learning set from 100+ questions in each track.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9fb2bd]">System</p>
                <p className="mt-2 text-2xl font-black text-[#ffcf86]">{remoteTracks.length} tracks</p>
                <p className="mt-1 text-sm text-[#c9d7de]">Adaptive sessions</p>
              </div>
            </div>

            {!user ? (
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-[#ffb54a]" />
                    <h3 className="text-xl font-black">Login required</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#c9d7de]">
                    Every real lesson, question shuffle, and point reward is available only after sign in. Before that, users see only basic service info and track summaries.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/signin?returnTo=/learning" className="inline-flex items-center gap-2 rounded-full bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827]">
                      Sign in <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/signup?returnTo=/learning" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white">
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
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9fb2bd]">{item.title}</p>
                      <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-[#c9d7de]">{item.detail}</p>
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
                    className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-[#ffb54a]/40 hover:bg-white/8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: track.accent }}>{track.eyebrow}</p>
                        <h3 className="mt-2 text-2xl font-black">{track.title}</h3>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black text-[#ffcf86]">
                        +{track.rewardPoints} pts
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#c9d7de]">{track.intro}</p>
                    <div className="mt-5 flex items-center justify-between text-sm font-bold text-[#d8e5eb]">
                      <span>{track.bankSize} questions</span>
                      <span className="inline-flex items-center gap-2 text-[#ffcf86]">
                        Open track <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </article>

          <aside className="grid gap-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-[#ffcf86]" />
                <h2 className="text-2xl font-black">What unlocked users get</h2>
              </div>
              <div className="mt-5 grid gap-4">
                {[
                  ...remoteTracks.slice(0, 4).map((track) => `${track.title}: ${track.bankSize}+ adaptive questions`),
                ].map((line) => (
                  <div key={line} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-[#d2dde3]">
                    {line}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#192f37] to-[#0c1215] p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-[#ffb54a]" />
                <h2 className="text-2xl font-black">Learning design notes</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[#d2dde3]">
                <li>Fresh session order is derived from the login seed, so every sign-in can feel different.</li>
                <li>Points are awarded for learning completion after authentication.</li>
                <li>Guests can inspect the structure, but not the playable quiz content.</li>
                <li>The class-content track is original, book-inspired practice and not copied textbook text.</li>
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#ffb54a]/30 bg-[#ffb54a]/10 px-4 py-2 text-sm font-bold text-[#ffcf86]">
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
