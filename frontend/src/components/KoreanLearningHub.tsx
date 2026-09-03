"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Lock, Sparkles, Trophy } from 'lucide-react';
import { learningTracks } from '@/lib/koreanLearningBank';
import { useAppStore } from '@/store/useAppStore';
import api from '@/lib/api';
import { memberCopy } from '@/lib/memberContent';

const KoreanLearningHub = () => {
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const language = useAppStore((state) => state.language);
  const t = memberCopy[language];
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
              rewardPoints: 0,
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
            <p className="kc-eyebrow">{language === 'en' ? 'Learning Gateway' : language === 'ko' ? '학습 게이트웨이' : 'लर्निंग गेटवे'}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{language === 'en' ? 'Korean learning, points, and login-gated progress' : language === 'ko' ? '한국어 학습, 포인트 및 로그인 기반 진행' : 'Korean learning, पॉइंट्स और लॉगिन आधारित प्रोग्रेस'}</h1>
          </div>
          <div className="hidden rounded-md border border-[#dce6f0] bg-white px-4 py-2 text-sm font-semibold text-[#486581]">
            {user ? `${t.points}: ${points}` : `${t.signIn} ${language === 'ko' ? '전 미리보기' : language === 'hi' ? 'से पहले प्रीव्यू' : 'to preview'}`}
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
                  <h2 className="mt-5 text-3xl font-bold leading-tight text-[#102a43] sm:text-4xl">{language === 'en' ? 'Beginner to class-content learning, all inside a protected points system.' : language === 'ko' ? '초급부터 수업 콘텐츠까지, 안전한 포인트 시스템 안에서 학습하세요.' : 'शुरुआत से class-content learning तक, सुरक्षित पॉइंट्स सिस्टम में।'}</h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#486581] sm:text-lg">
                  {language === 'en' ? 'Guests can read the overview, but the actual practice flow is locked until login. Once signed in, the app shuffles a fresh learning set from 100+ questions in each track.' : language === 'ko' ? '게스트는 개요를 볼 수 있지만 실제 학습은 로그인 후 이용할 수 있습니다. 로그인하면 각 트랙의 100개 이상의 문제에서 새로운 세트가 제공됩니다.' : 'Guest overview देख सकते हैं, लेकिन असली practice login के बाद खुलती है। Login करने पर हर track के 100+ questions में से नया set मिलता है।'}
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
                    Sign in to access the full lesson practice, question shuffle, and saved progress. Before that, users see basic service information and track summaries.
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
                    { title: 'Rewards', value: 'None', detail: 'This is a focused Korean practice experience.' },
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
                <li>Learning progress is saved for practice and revision.</li>
                <li>Guests can inspect the structure, but not the playable quiz content.</li>
                <li>The class-content track is original, book-inspired practice and not copied textbook text.</li>
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#0b4eae]/20 bg-[#eaf3ff] px-4 py-2 text-sm font-bold text-[#0b4eae]">
                Adaptive practice sessions
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default KoreanLearningHub;
