"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Flame,
  Heart,
  Lock,
  Mic,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
} from 'lucide-react';
import { getSessionQuestions, getTrackBySlug, shuffleSeeded, type LearningTrackConfig, type QuizRound } from '@/lib/koreanLearningBank';
import { useAppStore } from '@/store/useAppStore';
import api from '@/lib/api';

interface SessionAttempt {
  questionKey: string;
  userAnswer: string;
  expectedAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
}

const visualIcons: Record<string, string> = {
  hand: '👋',
  heart: '💛',
  spark: '✨',
  cup: '☕',
  water: '💧',
  tea: '🍵',
  rice: '🍚',
  bread: '🍞',
  book: '📘',
  map: '🗺️',
  coin: '🪙',
  star: '⭐',
  badge: '🎖️',
  shield: '🛡️',
  repeat: '🔁',
  clock: '⏰',
  sun: '☀️',
  calendar: '📅',
  flag: '🇰🇷',
  family: '👨‍👩‍👧‍👦',
  train: '🚆',
  basket: '🧺',
  camera: '📷',
  phone: '📱',
  mic: '🎤',
  pen: '✍️',
  ear: '👂',
  arrow: '➡️',
  snow: '❄️',
  box: '📦',
};

const formatTitle = (question: QuizRound) => `${question.tag} · ${question.points} pts`;

const LearningPreview = ({ title, intro, accent, overview, loginCopy, bankSize, rewardPoints, slug }: LearningTrackConfig) => (
  <article className="overflow-hidden rounded-xl border border-[#dce6f0] bg-white p-6 shadow-[0_6px_20px_rgba(15,55,95,0.07)]">
    <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: accent }}>{title}</p>
    <h2 className="mt-3 text-2xl font-bold text-[#102a43]">{title}</h2>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-[#486581]">{intro}</p>
    <div className="mt-6 flex flex-wrap gap-3">
      {overview.map((item) => (
        <span key={item} className="rounded-md border border-[#dce6f0] bg-[#f7fafd] px-4 py-2 text-sm font-semibold text-[#486581]">
          {item}
        </span>
      ))}
    </div>
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9fb2bd]">Question bank</p>
        <p className="mt-2 text-2xl font-bold text-[#0b4eae]">{bankSize}</p>
      </div>
      <div className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9fb2bd]">Session size</p>
        <p className="mt-2 text-2xl font-bold text-[#0b4eae]">10 questions</p>
      </div>
      <div className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9fb2bd]">Reward</p>
        <p className="mt-2 text-2xl font-bold text-[#b77900]">+{rewardPoints} pts</p>
      </div>
    </div>
    <div className="mt-6 grid gap-3 md:grid-cols-2">
      {loginCopy.map((line) => (
        <div key={line} className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4 text-sm leading-7 text-[#486581]">
          {line}
        </div>
      ))}
    </div>
    <div className="mt-7 flex flex-wrap gap-3">
      <Link href={`/signin?returnTo=/learning/${slug}`} className="kc-button kc-button-primary">
        <Lock className="h-4 w-4" /> Sign in to learn
      </Link>
      <Link href={`/signup?returnTo=/learning/${slug}`} className="kc-button kc-button-secondary">
        Create account
      </Link>
    </div>
  </article>
);

const LearningTrackPage = ({ slug }: { slug: string }) => {
  const staticTrack = getTrackBySlug(slug);
  const [remoteTrack, setRemoteTrack] = useState<LearningTrackConfig | null>(null);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const sessionSeed = useAppStore((state) => state.sessionSeed);
  const awardPoints = useAppStore((state) => state.awardPoints);

  const track = remoteTrack ?? staticTrack;
  const sessionTrack = remoteTrack?.questionPool?.length ? remoteTrack : staticTrack ?? remoteTrack;

  useEffect(() => {
    let cancelled = false;

    const loadTrack = async () => {
      try {
        const response = await api.get(`/learning/tracks/${slug}`);
        const payload = response.data?.data || response.data;
        if (!payload || cancelled) return;

        const mappedTrack: LearningTrackConfig = {
          slug: payload.slug,
          title: payload.title,
          eyebrow: payload.eyebrow,
          intro: payload.intro,
          accent: payload.accent,
          rewardPoints: Number(payload.rewardPoints ?? payload.reward_points ?? 0),
          bankSize: Number(payload.bankSize ?? payload.bank_size ?? payload.questionPool?.length ?? 0),
          stepSize: Number(payload.stepSize ?? payload.step_size ?? 10),
          overview: Array.isArray(payload.overview) ? payload.overview : [],
          loginCopy: Array.isArray(payload.loginCopy) ? payload.loginCopy : [],
          questionPool: Array.isArray(payload.questionPool)
            ? payload.questionPool.map((question: {
                questionKey?: string | number;
                id?: string | number;
                type?: QuizRound['type'];
                tag?: string;
                prompt?: string;
                korean?: string;
                answer?: string;
                options?: unknown[];
                words?: unknown[];
                cards?: unknown[];
                pairs?: unknown[];
                hint?: string;
                points?: number;
              }) => ({
                id: String(question.questionKey ?? question.id),
                type: question.type,
                tag: question.tag,
                prompt: question.prompt,
                korean: question.korean,
                answer: question.answer,
                options: Array.isArray(question.options) ? question.options : [],
                words: Array.isArray(question.words) ? question.words : [],
                cards: Array.isArray(question.cards) ? question.cards : [],
                pairs: Array.isArray(question.pairs) ? question.pairs : [],
                hint: question.hint,
                points: Number(question.points ?? 0),
              }))
            : [],
        };

        setRemoteTrack(mappedTrack);
      } catch {
        if (!cancelled) setRemoteTrack(null);
      }
    };

    loadTrack();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const signedIn = Boolean(user);
  const activeSeed = sessionSeed || user?.id || 'guest';
  const sessionQuestions = useMemo(
    () => (sessionTrack ? getSessionQuestions(sessionTrack, activeSeed, sessionTrack.stepSize) : []),
    [activeSeed, sessionTrack],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [attempts, setAttempts] = useState<SessionAttempt[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveIndex(0);
      setSelected('');
      setBuiltWords([]);
      setMatched([]);
      setHearts(5);
      setXp(0);
      setStreak(0);
      setSessionPoints(0);
      setCompleted(false);
      setNotice('');
      setStatus('idle');
      setAttempts([]);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [track?.slug, activeSeed]);

  useEffect(() => {
    if (!signedIn || !track) return;

    let cancelled = false;
    const loadProgress = async () => {
      try {
        const response = await api.get('/learning/me/progress');
        const payload = response.data?.data || response.data;
        const progressRow = Array.isArray(payload?.progress)
          ? payload.progress.find((item: { trackSlug?: string }) => item.trackSlug === track.slug)
          : null;
        if (!cancelled && progressRow) {
          setStreak(Number(progressRow.currentStreak || 0));
        }
      } catch {
        // Progress is optional; local session state still works.
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [signedIn, track, track?.slug]);

  if (!track || !sessionTrack) return null;

  const question = sessionQuestions[activeIndex];
  const progress = ((activeIndex + (status === 'correct' || completed ? 1 : 0)) / sessionQuestions.length) * 100;
  const currentWalletPoints = signedIn ? points : 0;
  const remainingQuestions = Math.max(sessionQuestions.length - activeIndex, 0);

  const resetQuestion = () => {
    setSelected('');
    setBuiltWords([]);
    setMatched([]);
    setStatus('idle');
    setNotice('');
  };

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(question.korean);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const currentAnswer = () => {
    if (!question) return '';
    if (question.type === 'arrange') return builtWords.join(' ');
    if (question.type === 'match') return matched.length === (question.pairs?.length || 0) ? 'complete' : '';
    return selected;
  };

  const awardQuestion = () => {
    if (!signedIn || !question) return;
    awardPoints(question.id, question.points);
    setSessionPoints((value) => value + question.points);
  };

  const finishSession = async () => {
    if (completed) {
      setNotice('Session already completed. You can restart or switch tracks.');
      return;
    }

    const totalQuestionPoints = attempts.reduce((sum, attempt) => sum + (attempt.isCorrect ? attempt.pointsAwarded : 0), 0);
    const totalSessionPoints = totalQuestionPoints + track.rewardPoints;

    awardPoints(`learning-track-${track.slug}`, track.rewardPoints);
    setSessionPoints((value) => value + track.rewardPoints);
    setCompleted(true);
    setStreak((value) => value + 1);
    setXp((value) => value + 100);
    setNotice(`Track complete. +${track.rewardPoints} completion points added.`);

    try {
      const response = await api.post('/engagement/lessons/complete', {
        track_slug: track.slug,
        session_seed: activeSeed,
        attempts,
        total_questions: sessionQuestions.length,
        correct_answers: attempts.filter((attempt) => attempt.isCorrect).length,
        session_points: totalSessionPoints,
        metadata: {
          track: track.slug,
          trackTitle: track.title,
          trackEyebrow: track.eyebrow,
          trackIntro: track.intro,
          trackAccent: track.accent,
          trackRewardPoints: track.rewardPoints,
          trackBankSize: track.bankSize,
          trackStepSize: track.stepSize,
          trackOverview: track.overview,
          trackLoginCopy: track.loginCopy,
          sessionSeed: activeSeed,
          sessionQuestions: sessionQuestions.map((item) => item.id),
        },
      });
      const payload = response.data?.data || response.data;
      if (payload?.streak) {
        setStreak(Number(payload.streak));
      }
      if (typeof payload?.balance === 'number') {
        setNotice(`Track complete. Backend saved your streak at ${payload.streak} and synced points.`);
      }
    } catch {
      setNotice(`Track complete locally. The server sync can happen after the API is reachable.`);
    }
  };

  const checkQuestion = () => {
    if (!question) return;
    const answer = currentAnswer();
    const isCorrect = answer === question.answer;

    if (!isCorrect) {
      setStatus('wrong');
      setHearts((value) => Math.max(0, value - 1));
      setNotice(question.hint);
      setAttempts((current) => [
        ...current,
        {
          questionKey: question.id,
          userAnswer: answer,
          expectedAnswer: question.answer,
          isCorrect: false,
          pointsAwarded: 0,
        },
      ]);
      return;
    }

    setStatus('correct');
    setNotice(`Correct. +${question.points} points.`);
    awardQuestion();
    setAttempts((current) => [
      ...current,
      {
        questionKey: question.id,
        userAnswer: answer,
        expectedAnswer: question.answer,
        isCorrect: true,
        pointsAwarded: question.points,
      },
    ]);
    setXp((value) => value + 12);
  };

  const nextQuestion = () => {
    if (activeIndex >= sessionQuestions.length - 1) {
      finishSession();
      return;
    }
    setActiveIndex((value) => value + 1);
    resetQuestion();
  };

  const renderQuestion = () => {
    if (!question) return null;

    if (question.type === 'cards') {
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          {question.cards?.map((card, index) => (
            <button
              key={`${question.id}-${card.korean}`}
              type="button"
              onClick={() => setSelected(card.korean)}
              className={`min-h-56 rounded-3xl border-2 p-5 text-left transition ${selected === card.korean ? 'border-[#ffcf86] bg-[#1b2b30]' : 'border-[#2c4049] bg-[#0f1d22] hover:bg-[#13242a]'}`}
            >
              <span className="flex h-24 items-center justify-center text-6xl">{visualIcons[card.visual] || '📘'}</span>
              <span className="mt-5 flex items-end justify-between">
                <span>
                  <span className="block text-3xl font-black">{card.korean}</span>
                  <span className="mt-1 block text-sm font-bold text-[#9fb2bd]">{card.label}</span>
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-[#9fb2bd]">{index + 1}</span>
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (question.type === 'choice' || question.type === 'listen') {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {question.options?.map((option) => (
            <button
              key={`${question.id}-${option}`}
              type="button"
              onClick={() => setSelected(option)}
              className={`min-h-16 rounded-2xl border-2 px-5 py-4 text-left text-lg font-black transition ${selected === option ? 'border-[#ffcf86] bg-[#1b2b30]' : 'border-[#2c4049] bg-[#0f1d22] hover:bg-[#13242a]'}`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    if (question.type === 'arrange') {
      return (
        <div className="grid gap-5">
          <div className="min-h-24 rounded-2xl border-2 border-dashed border-[#2c4049] bg-[#0f1d22] p-4">
            {builtWords.length ? (
              <div className="flex flex-wrap gap-3">
                {builtWords.map((word, index) => (
                  <button
                    key={`${word}-${index}`}
                    type="button"
                    onClick={() => setBuiltWords((words) => words.filter((_, wordIndex) => wordIndex !== index))}
                    className="rounded-xl bg-[#ffcf86] px-4 py-3 text-lg font-black text-[#111827]"
                  >
                    {word}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-[#708995]">Tap the words to build the sentence.</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {shuffleSeeded(question.words || [], `${question.id}-words`).map((word) => (
              <button
                key={`${question.id}-${word}`}
                type="button"
                disabled={builtWords.includes(word)}
                onClick={() => setBuiltWords((words) => [...words, word])}
                className="rounded-xl border-2 border-[#2c4049] bg-[#12232a] px-4 py-3 text-lg font-black disabled:opacity-35"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === 'match') {
      return (
        <div className="grid gap-3">
          {question.pairs?.map((pair) => {
            const token = `${pair.korean}:${pair.label}`;
            const active = matched.includes(token);
            return (
              <button
                key={token}
                type="button"
                onClick={() =>
                  setMatched((items) => (active ? items.filter((item) => item !== token) : [...items, token]))
                }
                className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-lg font-black ${active ? 'border-[#19c37d] bg-[#123c31] text-[#7cf0b6]' : 'border-[#2c4049] bg-[#0f1d22]'}`}
              >
                <span className="text-2xl">{pair.korean}</span>
                <span>{pair.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setSelected('spoken')}
        className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#2c4049] bg-[#0f1d22] px-5 py-6 text-lg font-black"
      >
        <Mic className="h-7 w-7 text-[#ffcf86]" /> I completed the speaking attempt
      </button>
    );
  };

  if (!signedIn) {
    return (
      <main className="kc-learning-surface min-h-screen bg-[#eef4f8] text-[#102a43]">
        <section className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between">
            <Link href="/learning" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-[#d8e5eb]">
              <ArrowLeft className="h-4 w-4" /> Back to learning
            </Link>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#ffcf86]">
              Locked preview
            </span>
          </div>
        </section>
        <section className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1500px]">
            <LearningPreview {...track} />
          </div>
        </section>
      </main>
    );
  }

  if (!question) return null;

  return (
    <main className="kc-learning-surface min-h-screen bg-[#eef4f8] text-[#102a43]">
      <section className="bg-[#101f24] px-4 py-5 text-white sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3">
          <Link href="/learning" className="inline-flex items-center gap-2 rounded-xl border border-[#35505d] px-3 py-2 text-sm font-black text-[#9fb2bd] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Korean Learning
          </Link>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffcf86]">{track.eyebrow}</p>
            <h1 className="text-lg font-black leading-tight sm:text-2xl">{track.title}</h1>
          </div>
          <div className="ml-auto flex flex-wrap gap-2 text-sm font-black">
            <span className="inline-flex items-center gap-1 rounded-xl bg-[#142f36] px-3 py-2 text-[#ff4b4b]"><Heart className="h-4 w-4 fill-current" /> {hearts}</span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-[#142f36] px-3 py-2 text-[#1cb0f6]"><Zap className="h-4 w-4" /> {xp}</span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-[#142f36] px-3 py-2 text-[#ff9600]"><Flame className="h-4 w-4" /> {streak}</span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-[#142f36] px-3 py-2 text-[#ffcf86]"><Trophy className="h-4 w-4" /> {currentWalletPoints}</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-[28px] bg-[#101f24] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(0);
                  setSelected('');
                  setBuiltWords([]);
                  setMatched([]);
                  setStatus('idle');
                  setNotice('');
                  setAttempts([]);
                }}
                className="text-[#708995]"
                aria-label="Restart track"
              >
                <RotateCcw className="h-6 w-6" />
              </button>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#35505d]">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: track.accent }} />
              </div>
              <span className="inline-flex items-center gap-2 text-lg font-black text-[#ff4b4b]"><Heart className="h-6 w-6 fill-current" /> {hearts}</span>
            </div>

            <div className="mx-auto max-w-4xl py-8">
              <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#ce82ff]">
                <Sparkles className="h-5 w-5 fill-current" /> {formatTitle(question)}
              </div>
              <h2 className="mt-4 text-2xl font-black leading-tight sm:text-4xl lg:text-5xl">{question.prompt}</h2>
              <div className="mt-7 rounded-3xl bg-[#142a31] p-5 text-center">
                <p className="text-4xl font-black sm:text-6xl lg:text-7xl">{question.korean}</p>
                {(question.type === 'listen' || question.type === 'speak') ? (
                  <button type="button" onClick={speak} className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-[#35505d] px-4 py-3 text-sm font-black text-[#ffcf86]">
                    <Volume2 className="h-5 w-5" /> Play Korean audio
                  </button>
                ) : null}
              </div>
              <div className="mt-7">{renderQuestion()}</div>
              {notice ? (
                <div className={`mt-7 rounded-2xl border-2 p-4 ${status === 'wrong' ? 'border-[#ff4b4b] bg-[#3a1d24] text-[#ffb4b4]' : 'border-[#19c37d] bg-[#123c31] text-[#7cf0b6]'}`}>
                  <p className="font-black">{notice}</p>
                </div>
              ) : null}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#35505d] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setHearts((value) => Math.max(0, value - 1));
                    nextQuestion();
                  }}
                  className="rounded-xl border-2 border-[#35505d] px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#708995]"
                >
                  Skip
                </button>
                {status === 'correct' ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="rounded-xl px-8 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#06251a] shadow-[0_5px_0_rgba(0,0,0,0.28)]"
                    style={{ backgroundColor: track.accent }}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={checkQuestion}
                    disabled={!currentAnswer()}
                    className="rounded-xl bg-[#1cb0f6] px-8 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#06232f] shadow-[0_5px_0_#0b75a5] disabled:bg-[#354b58] disabled:text-[#708995] disabled:shadow-none"
                  >
                    Check
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className="grid gap-5 self-start">
            <div className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-[#ff9600]" />
                <h2 className="text-xl font-black">Points system</h2>
              </div>
              <div className="mt-4 grid gap-3 text-sm font-bold text-[#565959]">
                <p className="flex justify-between rounded-xl bg-[#f7fafa] p-3"><span>Question solve</span><span>+{question.points}</span></p>
                <p className="flex justify-between rounded-xl bg-[#f7fafa] p-3"><span>Track completion</span><span>+{track.rewardPoints}</span></p>
                <p className="flex justify-between rounded-xl bg-[#f7fafa] p-3"><span>Session length</span><span>{sessionQuestions.length} questions</span></p>
                <p className="flex justify-between rounded-xl bg-[#f7fafa] p-3"><span>Remaining</span><span>{remainingQuestions}</span></p>
              </div>
            </div>
            <div className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-[#007185]" />
                <h2 className="text-xl font-black">Track summary</h2>
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-[#565959]">{track.intro}</p>
              <div className="mt-4 grid gap-2">
                {track.overview.map((item) => (
                  <div key={item} className="rounded-xl bg-[#f7fafa] p-3 text-sm font-bold text-[#374151]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-[#d5d9d9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <ChevronRight className="h-6 w-6 text-[#b12704]" />
                <h2 className="text-xl font-black">Session state</h2>
              </div>
              <p className="mt-3 text-sm font-bold text-[#565959]">{completed ? 'Completed' : 'In progress'}</p>
              <p className="mt-2 text-sm font-bold text-[#565959]">Points earned this session: {sessionPoints}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default LearningTrackPage;
