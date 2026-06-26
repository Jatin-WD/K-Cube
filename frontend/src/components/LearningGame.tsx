"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Heart,
  Keyboard,
  Lock,
  Medal,
  Mic,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

type Stage = 'onboarding-level' | 'onboarding-start' | 'path' | 'lesson' | 'complete';
type ExerciseType = 'image-choice' | 'choice' | 'arrange' | 'match' | 'listen' | 'speak';

interface Exercise {
  id: string;
  type: ExerciseType;
  tag: string;
  prompt: string;
  korean: string;
  answer: string;
  options?: string[];
  cards?: Array<{ label: string; korean: string; visual: string }>;
  pairs?: Array<{ ko: string; en: string }>;
  words?: string[];
  hint: string;
}

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  unit: string;
  points: number;
  xp: number;
  color: string;
  locked?: boolean;
  exercises: Exercise[];
}

const levels = [
  { title: "I'm new to Korean", detail: 'Start with Hangul sounds and daily phrases.', bars: 1 },
  { title: 'I know common words', detail: 'Practice greetings, food and simple choices.', bars: 2 },
  { title: 'I can have basic conversations', detail: 'Jump into sentence building.', bars: 3 },
  { title: 'I can talk about various topics', detail: 'Unlock culture and event missions.', bars: 4 },
];

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Cafe Basics',
    subtitle: 'Coffee, tea and polite requests',
    unit: 'Unit 1',
    points: 40,
    xp: 60,
    color: '#19c37d',
    exercises: [
      {
        id: 'coffee-card',
        type: 'image-choice',
        tag: 'New word',
        prompt: 'Which one of these is "coffee"?',
        korean: '커피',
        answer: '커피',
        cards: [
          { label: 'tea', korean: '차', visual: '🍵' },
          { label: 'coffee', korean: '커피', visual: '☕' },
          { label: 'bread', korean: '빵', visual: '🍞' },
        ],
        hint: 'Coffee in Korean sounds very close to "keopi".',
      },
      {
        id: 'tea-choice',
        type: 'choice',
        tag: 'Meaning',
        prompt: 'What does this word mean?',
        korean: '차',
        answer: 'Tea',
        options: ['Tea', 'Water', 'Rice', 'Hello'],
        hint: 'This is the drink, not a car, in this cafe context.',
      },
      {
        id: 'please-arrange',
        type: 'arrange',
        tag: 'Sentence',
        prompt: 'Build: Please give me coffee.',
        korean: '커피 주세요',
        answer: '커피 주세요',
        words: ['주세요', '커피', '차', '안녕'],
        hint: '주세요 means "please give me".',
      },
      {
        id: 'cafe-listen',
        type: 'listen',
        tag: 'Listen',
        prompt: 'Listen and choose what you hear.',
        korean: '커피',
        answer: '커피',
        options: ['커피', '차', '물', '밥'],
        hint: 'The first sound is close to "keo".',
      },
    ],
  },
  {
    id: 2,
    title: 'First Greetings',
    subtitle: 'Hello, thanks and nice to meet you',
    unit: 'Unit 1',
    points: 50,
    xp: 75,
    color: '#1cb0f6',
    exercises: [
      {
        id: 'hello-choice',
        type: 'choice',
        tag: 'Phrase',
        prompt: 'Choose the meaning of this phrase.',
        korean: '안녕하세요',
        answer: 'Hello',
        options: ['Hello', 'Goodbye', 'Coffee', 'Please'],
        hint: 'This is the polite greeting you will use the most.',
      },
      {
        id: 'thanks-arrange',
        type: 'arrange',
        tag: 'Sentence',
        prompt: 'Build: Thank you.',
        korean: '감사합니다',
        answer: '감사합니다',
        words: ['합니다', '감사', '주세요', '안녕'],
        hint: '감사 means thanks.',
      },
      {
        id: 'greet-speak',
        type: 'speak',
        tag: 'Speak',
        prompt: 'Say this greeting out loud.',
        korean: '반갑습니다',
        answer: '반갑습니다',
        hint: 'It means nice to meet you.',
      },
    ],
  },
  {
    id: 3,
    title: 'K-Food Words',
    subtitle: 'Kimchi, rice and ramyeon',
    unit: 'Unit 2',
    points: 60,
    xp: 90,
    color: '#ff9600',
    exercises: [
      {
        id: 'food-card',
        type: 'image-choice',
        tag: 'K-Food',
        prompt: 'Which one of these is "kimchi"?',
        korean: '김치',
        answer: '김치',
        cards: [
          { label: 'rice', korean: '밥', visual: '🍚' },
          { label: 'kimchi', korean: '김치', visual: '🥬' },
          { label: 'ramyeon', korean: '라면', visual: '🍜' },
        ],
        hint: 'Kimchi is the spicy fermented side dish.',
      },
      {
        id: 'food-match',
        type: 'match',
        tag: 'Match',
        prompt: 'Match the K-Food words.',
        korean: '밥 김치 라면',
        answer: '밥=rice, 김치=kimchi, 라면=ramyeon',
        pairs: [
          { ko: '밥', en: 'rice' },
          { ko: '김치', en: 'kimchi' },
          { ko: '라면', en: 'ramyeon' },
        ],
        hint: 'Tap every correct pair to mark it complete.',
      },
      {
        id: 'food-arrange',
        type: 'arrange',
        tag: 'Order',
        prompt: 'Build: Please give me water.',
        korean: '물 주세요',
        answer: '물 주세요',
        words: ['물', '주세요', '김치', '커피'],
        hint: '물 means water.',
      },
    ],
  },
  {
    id: 4,
    title: 'Culture Mission',
    subtitle: 'Drama, music and event phrases',
    unit: 'Unit 3',
    points: 80,
    xp: 120,
    color: '#ce82ff',
    exercises: [
      {
        id: 'culture-card',
        type: 'image-choice',
        tag: 'Culture',
        prompt: 'Which card means music?',
        korean: '음악',
        answer: '음악',
        cards: [
          { label: 'drama', korean: '드라마', visual: '🎬' },
          { label: 'music', korean: '음악', visual: '🎧' },
          { label: 'event', korean: '행사', visual: '🎟️' },
        ],
        hint: '음악 is music, the word you will see in K-Pop missions.',
      },
      {
        id: 'event-choice',
        type: 'choice',
        tag: 'Meaning',
        prompt: 'What does 행사 mean?',
        korean: '행사',
        answer: 'Event',
        options: ['Event', 'Teacher', 'Water', 'Rice'],
        hint: 'K-CUBE events and workshops use this word.',
      },
      {
        id: 'culture-match',
        type: 'match',
        tag: 'Match',
        prompt: 'Match culture words.',
        korean: '드라마 음악 행사',
        answer: '드라마=drama, 음악=music, 행사=event',
        pairs: [
          { ko: '드라마', en: 'drama' },
          { ko: '음악', en: 'music' },
          { ko: '행사', en: 'event' },
        ],
        hint: 'Tap every culture pair to complete the mission.',
      },
      {
        id: 'culture-arrange',
        type: 'arrange',
        tag: 'Sentence',
        prompt: 'Build: I like music.',
        korean: '음악 좋아해요',
        answer: '음악 좋아해요',
        words: ['좋아해요', '음악', '커피', '행사'],
        hint: '좋아해요 means like.',
      },
    ],
  },
];

const league = [
  { name: 'Aarav', xp: 1280 },
  { name: 'Meera', xp: 1160 },
  { name: 'You', xp: 980 },
  { name: 'Riya', xp: 910 },
  { name: 'Kabir', xp: 840 },
];

const quests = [
  { label: 'Complete one lesson', progress: 0.66, reward: '+20 XP' },
  { label: 'Answer three in a row', progress: 0.33, reward: 'Streak boost' },
  { label: 'Practice K-Food words', progress: 0.5, reward: '+15 pts' },
];

const skills = [
  { label: 'Hangul', value: 72, color: '#19c37d' },
  { label: 'Listening', value: 48, color: '#1cb0f6' },
  { label: 'Speaking', value: 35, color: '#ce82ff' },
  { label: 'K-Food', value: 56, color: '#ff9600' },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const LevelBars = ({ bars }: { bars: number }) => (
  <span className="inline-flex h-8 items-end gap-1">
    {[1, 2, 3, 4].map((bar) => (
      <span
        key={bar}
        className={`w-2 rounded-sm ${bar <= bars ? 'bg-[#1cb0f6]' : 'bg-[#234354]'}`}
        style={{ height: `${10 + bar * 4}px` }}
      />
    ))}
  </span>
);

const Mascot = () => (
  <div className="relative h-28 w-28 shrink-0">
    <div className="absolute left-3 top-2 h-24 w-24 rounded-[32px] bg-[#19c37d] shadow-[0_10px_0_#0f8d5a]" />
    <div className="absolute left-3 top-0 h-11 w-24 rounded-t-[36px] bg-[#46d600]" />
    <div className="absolute left-10 top-9 h-8 w-7 rounded-full bg-white">
      <div className="ml-2 mt-2 h-4 w-3 rounded-full bg-[#24313d]" />
    </div>
    <div className="absolute right-5 top-9 h-8 w-7 rounded-full bg-white">
      <div className="ml-2 mt-2 h-4 w-3 rounded-full bg-[#24313d]" />
    </div>
    <div className="absolute left-[52px] top-[68px] h-4 w-5 rounded-full bg-[#ffb020]" />
    <div className="absolute bottom-4 left-5 h-8 w-8 rotate-12 rounded-lg bg-[#a16207]" />
    <div className="absolute bottom-4 right-4 h-8 w-8 -rotate-12 rounded-lg bg-[#fde047]" />
  </div>
);

const GameTopBar = ({ hearts, xp, streak, points }: { hearts: number; xp: number; streak: number; points: number }) => (
  <div className="sticky top-0 z-30 border-b border-[#28434f] bg-[#101f24]/95 px-4 py-3 text-white backdrop-blur">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
      <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-[#35505d] px-3 py-2 text-sm font-black text-[#9fb2bd] hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        K-CUBE
      </Link>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#1cb0f6]">Adaptive Korean Academy</p>
        <h1 className="text-lg font-black leading-tight sm:text-2xl">Game-based Korean learning</h1>
      </div>
      <div className="ml-auto flex flex-wrap gap-2 text-sm font-black">
        <span className="inline-flex items-center gap-1 rounded-xl bg-[#142f36] px-3 py-2 text-[#ff4b4b]"><Heart className="h-4 w-4 fill-current" /> {hearts}</span>
        <span className="inline-flex items-center gap-1 rounded-xl bg-[#142f36] px-3 py-2 text-[#1cb0f6]"><Zap className="h-4 w-4" /> {xp}</span>
        <span className="inline-flex items-center gap-1 rounded-xl bg-[#142f36] px-3 py-2 text-[#ff9600]"><Flame className="h-4 w-4" /> {streak}</span>
        <span className="inline-flex items-center gap-1 rounded-xl bg-[#142f36] px-3 py-2 text-[#ffd900]"><Trophy className="h-4 w-4" /> {points}</span>
      </div>
    </div>
  </div>
);

const LearningGame = () => {
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const awardPoints = useAppStore((state) => state.awardPoints);
  const [stage, setStage] = useState<Stage>('onboarding-level');
  const [level, setLevel] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [guestPoints, setGuestPoints] = useState(0);
  const [guestActions, setGuestActions] = useState<string[]>([]);
  const [correctRun, setCorrectRun] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.body.classList.add('learning-game-mode');
    return () => document.body.classList.remove('learning-game-mode');
  }, []);

  const exercise = selectedLesson.exercises[exerciseIndex];
  const progress = selectedLesson.exercises.length ? (exerciseIndex / selectedLesson.exercises.length) * 100 : 0;
  const wordBank = useMemo(() => shuffle(exercise?.words || []), [exercise]);
  const displayedPoints = user ? points : guestPoints;

  const awardLessonPoints = (actionId: string, lessonPoints: number) => {
    if (user) {
      awardPoints(actionId, lessonPoints);
      return;
    }
    if (guestActions.includes(actionId)) return;
    setGuestActions((items) => [...items, actionId]);
    setGuestPoints((value) => value + lessonPoints);
  };

  const resetExerciseState = () => {
    setSelected('');
    setBuiltWords([]);
    setMatched([]);
    setFeedback('idle');
    setMessage('');
  };

  const startLesson = (lesson: Lesson) => {
    if (lesson.locked) return;
    setSelectedLesson(lesson);
    setExerciseIndex(0);
    resetExerciseState();
    setStage('lesson');
  };

  const speak = () => {
    if (typeof window === 'undefined' || !exercise || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(exercise.korean);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const currentAnswer = () => {
    if (!exercise) return '';
    if (exercise.type === 'arrange') return builtWords.join(' ');
    if (exercise.type === 'match') return matched.join(', ');
    if (exercise.type === 'speak') return selected;
    return selected;
  };

  const isCorrect = () => {
    if (!exercise) return false;
    if (exercise.type === 'match') return matched.length === exercise.pairs?.length;
    return currentAnswer() === exercise.answer;
  };

  const finishLesson = async () => {
    setXp((value) => value + selectedLesson.xp);
    setStreak((value) => value + 1);
    awardLessonPoints(`korean-game-${selectedLesson.id}`, selectedLesson.points);
    setStage('complete');
    try {
      await api.post('/engagement/lessons/complete', { lesson_id: selectedLesson.id, accuracy: Math.max(70, Math.round((correctRun / selectedLesson.exercises.length) * 100)) });
    } catch {
      setMessage(user ? 'Progress local wallet mein saved hai; API online hote hi backend sync hoga.' : 'Guest session mein points add ho gaye hain. Login ke baad backend ledger sync hoga.');
    }
  };

  const checkAnswer = () => {
    if (!exercise) return;
    if (isCorrect()) {
      const nextRun = correctRun + 1;
      setCorrectRun(nextRun);
      setFeedback('correct');
      setMessage(nextRun >= 3 ? 'Perfect run. Streak boost ready.' : 'Correct. Nice work.');
      return;
    }
    setCorrectRun(0);
    setHearts((value) => Math.max(value - 1, 0));
    setFeedback('wrong');
    setMessage(exercise.hint);
  };

  const nextExercise = () => {
    if (exerciseIndex >= selectedLesson.exercises.length - 1) {
      finishLesson();
      return;
    }
    setExerciseIndex((value) => value + 1);
    resetExerciseState();
  };

  const skipExercise = () => {
    setHearts((value) => Math.max(value - 1, 0));
    nextExercise();
  };

  const restart = () => {
    setExerciseIndex(0);
    setHearts(5);
    setCorrectRun(0);
    resetExerciseState();
    setStage('lesson');
  };

  const renderOnboardingLevel = () => (
    <section className="min-h-screen bg-[#07181c] text-white">
      <GameTopBar hearts={hearts} xp={xp} streak={streak} points={displayedPoints} />
      <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <aside className="rounded-3xl border-2 border-[#28434f] bg-[#0d242a] p-5 shadow-[0_18px_0_rgba(0,0,0,0.18)] sm:p-7">
          <div className="flex items-start gap-5">
            <Mascot />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#19c37d]">Placement test</p>
              <h2 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">Start at the right level.</h2>
              <p className="mt-4 text-sm font-bold leading-7 text-[#c9d7de]">
                K-CUBE checks your comfort level first, then opens a lesson path with XP, hearts, streaks, K-CUBE points and review loops.
              </p>
            </div>
          </div>
          <div className="mt-7 grid gap-3">
            {skills.map((skill) => (
              <div key={skill.label} className="rounded-2xl bg-[#101f24] p-4">
                <div className="flex justify-between text-sm font-black">
                  <span>{skill.label}</span>
                  <span style={{ color: skill.color }}>{skill.value}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#28434f]">
                  <div className="h-full rounded-full" style={{ width: `${skill.value}%`, backgroundColor: skill.color }} />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="relative inline-flex max-w-full rounded-2xl border-2 border-[#35505d] bg-[#101f24] px-4 py-4 text-xl font-black sm:px-5 sm:text-2xl">
            How much Korean do you know?
          </div>
          <div className="mt-6 grid gap-4">
              {levels.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => setLevel(index)}
                  className={`flex min-h-20 items-center gap-5 rounded-2xl border-2 px-5 py-4 text-left transition ${level === index ? 'border-[#1cb0f6] bg-[#173241] shadow-[0_8px_0_rgba(28,176,246,0.18)]' : 'border-[#35505d] bg-[#101f24] hover:bg-[#142a31]'}`}
                >
                  <LevelBars bars={item.bars} />
                  <span>
                    <span className="block text-xl font-black">{item.title}</span>
                    <span className="mt-1 block text-sm font-bold text-[#9fb2bd]">{item.detail}</span>
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-[#35505d] bg-[#101f24]/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl justify-end">
          <button onClick={() => setStage('onboarding-start')} className="w-full rounded-2xl bg-[#1cb0f6] px-10 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#06232f] shadow-[0_5px_0_#0b75a5] sm:w-auto">
            Continue
          </button>
        </div>
      </div>
    </section>
  );

  const renderOnboardingStart = () => (
    <section className="min-h-screen bg-[#07181c] text-white">
      <GameTopBar hearts={hearts} xp={xp} streak={streak} points={displayedPoints} />
      <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <Mascot />
          <div className="min-w-0 flex-1">
            <button className="mb-5 inline-flex items-center gap-2 text-sm font-black text-[#9fb2bd]" onClick={() => setStage('onboarding-level')} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
              Back to placement
            </button>
            <div className="relative inline-flex max-w-full rounded-2xl border-2 border-[#35505d] bg-[#101f24] px-4 py-4 text-xl font-black sm:px-5 sm:text-2xl">
              Now let&apos;s find the best place to start!
            </div>
            <p className="mt-4 max-w-xl text-sm font-bold leading-7 text-[#c9d7de]">
              Your first mission is tuned to your selected level. The game combines placement, speaking, listening, streaks and reward points.
            </p>
            <div className="mt-8 grid gap-5">
              <button onClick={() => setStage('path')} className="flex min-h-36 items-center gap-4 rounded-xl border-2 border-[#35505d] bg-[#101f24] px-5 py-6 text-left hover:bg-[#142a31] sm:gap-8 sm:px-8">
                <span className="text-7xl">📒</span>
                <span>
                  <span className="block text-2xl font-black">Start from scratch</span>
                  <span className="mt-2 block text-xl font-bold text-[#c9d7de]">Take the easiest lesson of the Korean course</span>
                </span>
              </button>
              <button onClick={() => startLesson(lessons[Math.min(level, lessons.length - 1)])} className="flex min-h-36 items-center gap-4 rounded-xl border-2 border-[#35505d] bg-[#101f24] px-5 py-6 text-left hover:bg-[#142a31] sm:gap-8 sm:px-8">
                <span className="text-7xl">🧭</span>
                <span>
                  <span className="block text-2xl font-black">Find my level</span>
                  <span className="mt-2 block text-xl font-bold text-[#c9d7de]">Start with a short placement-style lesson</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderPath = () => (
    <main className="min-h-screen bg-[#07181c] text-white">
      <GameTopBar hearts={hearts} xp={xp} streak={streak} points={displayedPoints} />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="rounded-3xl bg-[#19c37d] p-6 text-[#06251a] shadow-[0_8px_0_#0f8d5a]">
            <p className="text-sm font-black uppercase tracking-[0.14em]">Unit 1 - Foundation Sprint</p>
            <h2 className="mt-1 text-3xl font-black sm:text-4xl">Start speaking Korean in tiny wins</h2>
            <p className="mt-3 max-w-2xl text-sm font-black leading-6 text-[#073820]">
              Tap a lesson node. Each mission trains one skill and adds XP, streak progress and K-CUBE reward points.
            </p>
          </div>
          <div className="relative mx-auto mt-8 grid max-w-2xl gap-7 rounded-3xl border-2 border-[#28434f] bg-[#0d242a] p-6">
            {lessons.map((lesson, index) => (
              <div key={lesson.title} className={`flex ${index % 2 ? 'justify-end' : 'justify-start'}`}>
                <button
                  onClick={() => startLesson(lesson)}
                  className={`group flex h-24 w-24 items-center justify-center rounded-full border-4 text-white shadow-[0_8px_0_rgba(0,0,0,0.28)] transition active:translate-y-1 active:shadow-none ${lesson.locked ? 'border-[#415763] bg-[#263b45]' : 'border-white/20'}`}
                  style={{ backgroundColor: lesson.locked ? undefined : lesson.color }}
                >
                  {lesson.locked ? <Lock className="h-9 w-9 text-[#8aa0ab]" /> : index === 0 ? <Star className="h-11 w-11 fill-current" /> : <BookOpen className="h-10 w-10" />}
                </button>
                <div className="ml-4 mt-3 max-w-[250px] rounded-2xl bg-[#101f24] p-3">
                  <p className="font-black">{lesson.title}</p>
                  <p className="mt-1 text-sm font-bold text-[#9fb2bd]">{lesson.subtitle}</p>
                  <p className="mt-2 text-xs font-black text-[#ffd900]">+{lesson.xp} XP · +{lesson.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid gap-4 self-start">
          <div className="rounded-2xl border-2 border-[#28434f] bg-[#142a31] p-5">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-[#ff9600]" />
              <h2 className="text-xl font-black">Launch-ready points</h2>
            </div>
            <p className="mt-3 text-sm font-bold leading-6 text-[#c9d7de]">
              New users start at 0 XP, 0 streak, 5 hearts. Lessons add K-CUBE points and can sync to the backend after login.
            </p>
            <div className="mt-4 rounded-xl bg-[#101f24] p-4">
              <p className="text-sm text-[#9fb2bd]">Your wallet</p>
              <p className="text-4xl font-black text-[#ffd900]">{displayedPoints}</p>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-[#28434f] bg-[#142a31] p-5">
            <div className="flex items-center gap-3">
              <Medal className="h-6 w-6 text-[#ffd900]" />
              <h2 className="text-xl font-black">Weekly league</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {league.map((row, index) => (
                <div key={row.name} className={`flex justify-between rounded-xl px-3 py-2 text-sm font-black ${row.name === 'You' ? 'bg-[#203d46] text-[#1cb0f6]' : 'bg-[#101f24] text-[#c9d7de]'}`}>
                  <span>{index + 1}. {row.name}</span>
                  <span>{row.name === 'You' ? xp : row.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-[#28434f] bg-[#142a31] p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-[#ce82ff]" />
              <h2 className="text-xl font-black">Daily quests</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {quests.map((quest) => (
                <div key={quest.label}>
                  <div className="flex justify-between gap-3 text-sm font-bold">
                    <span>{quest.label}</span>
                    <span className="text-[#ffd900]">{quest.reward}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#28434f]">
                    <div className="h-full rounded-full bg-[#19c37d]" style={{ width: `${quest.progress * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );

  const renderExerciseBody = () => {
    if (!exercise) return null;
    if (exercise.type === 'image-choice') {
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          {exercise.cards?.map((card, index) => (
            <button
              key={card.korean}
              onClick={() => setSelected(card.korean)}
              className={`min-h-72 rounded-2xl border-2 p-5 text-left transition ${selected === card.korean ? 'border-[#1cb0f6] bg-[#203d46]' : 'border-[#35505d] bg-[#101f24] hover:bg-[#142a31]'}`}
            >
              <span className="flex h-36 items-center justify-center text-8xl">{card.visual}</span>
              <span className="mt-4 flex items-end justify-between">
                <span>
                  <span className="block text-3xl">{card.korean}</span>
                  <span className="mt-1 block text-sm font-bold capitalize text-[#9fb2bd]">{card.label}</span>
                </span>
                <span className="rounded-lg border-2 border-[#35505d] px-3 py-1 text-[#708995]">{index + 1}</span>
              </span>
            </button>
          ))}
        </div>
      );
    }
    if (exercise.type === 'choice' || exercise.type === 'listen') {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {exercise.options?.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`min-h-20 rounded-2xl border-2 px-5 py-4 text-left text-xl font-black transition ${selected === option ? 'border-[#1cb0f6] bg-[#203d46]' : 'border-[#35505d] bg-[#101f24] hover:bg-[#142a31]'}`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }
    if (exercise.type === 'arrange') {
      return (
        <div className="grid gap-5">
          <div className="min-h-24 rounded-2xl border-2 border-dashed border-[#35505d] bg-[#101f24] p-4">
            {builtWords.length ? (
              <div className="flex flex-wrap gap-3">
                {builtWords.map((word, index) => (
                  <button key={`${word}-${index}`} onClick={() => setBuiltWords((words) => words.filter((_, wordIndex) => wordIndex !== index))} className="rounded-xl bg-[#1cb0f6] px-4 py-3 text-xl font-black text-[#06232f]">
                    {word}
                  </button>
                ))}
              </div>
            ) : <p className="text-lg font-bold text-[#708995]">Tap words to build the answer.</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {wordBank.map((word) => (
              <button key={word} disabled={builtWords.includes(word)} onClick={() => setBuiltWords((words) => [...words, word])} className="rounded-xl border-2 border-[#35505d] bg-[#142a31] px-4 py-3 text-xl font-black disabled:opacity-35">
                {word}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (exercise.type === 'match') {
      return (
        <div className="grid gap-3">
          {exercise.pairs?.map((pair) => {
            const token = `${pair.ko}=${pair.en}`;
            const active = matched.includes(token);
            return (
              <button key={token} onClick={() => setMatched((items) => active ? items.filter((item) => item !== token) : [...items, token])} className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-xl font-black ${active ? 'border-[#19c37d] bg-[#123c31] text-[#7cf0b6]' : 'border-[#35505d] bg-[#101f24]'}`}>
                <span className="text-3xl">{pair.ko}</span>
                <span>{pair.en}</span>
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <button onClick={() => setSelected(exercise.answer)} className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#35505d] bg-[#101f24] px-5 py-6 text-xl font-black">
        <Mic className="h-7 w-7 text-[#1cb0f6]" /> I said it clearly
      </button>
    );
  };

  const renderLesson = () => (
    <main className="min-h-screen bg-[#07181c] text-white">
      <header className="sticky top-0 z-30 border-b border-[#28434f] bg-[#101f24]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-5">
        <button onClick={() => setStage('path')} className="text-[#708995]" aria-label="Exit lesson"><X className="h-8 w-8" /></button>
        <div className="h-5 flex-1 overflow-hidden rounded-full bg-[#35505d]">
          <div className="h-full rounded-full bg-[#19c37d] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="inline-flex items-center gap-2 text-xl font-black text-[#ff4b4b]"><Heart className="h-7 w-7 fill-current" /> {hearts}</span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-40 pt-8">
        <div className="inline-flex items-center gap-3 text-lg font-black uppercase tracking-[0.08em] text-[#ce82ff]">
          <Sparkles className="h-7 w-7 fill-current" /> {exercise?.tag}
        </div>
        <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">{exercise?.prompt}</h1>
        <div className="mt-8 rounded-3xl border-2 border-[#28434f] bg-[#0d242a] p-6 text-center shadow-[0_16px_0_rgba(0,0,0,0.18)]">
          <p className="text-4xl font-black sm:text-7xl">{exercise?.korean}</p>
          {(exercise?.type === 'listen' || exercise?.type === 'speak') ? (
            <button onClick={speak} className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-[#35505d] px-4 py-3 text-sm font-black text-[#1cb0f6]">
              <Volume2 className="h-5 w-5" /> Play audio
            </button>
          ) : null}
        </div>
        <div className="mt-8">{renderExerciseBody()}</div>
        {feedback !== 'idle' ? (
          <div className={`mt-8 rounded-2xl border-2 p-5 ${feedback === 'correct' ? 'border-[#19c37d] bg-[#123c31] text-[#7cf0b6]' : 'border-[#ff4b4b] bg-[#3a1d24] text-[#ffb4b4]'}`}>
            <div className="flex items-start gap-3">
              {feedback === 'correct' ? <Check className="mt-1 h-6 w-6" /> : <X className="mt-1 h-6 w-6" />}
              <div>
                <p className="text-xl font-black">{feedback === 'correct' ? 'Correct' : 'Not quite'}</p>
                <p className="mt-1 font-bold">{message}</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-[#35505d] bg-[#101f24]/95 px-5 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={skipExercise} className="w-full rounded-2xl border-2 border-[#35505d] px-8 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#708995] sm:w-auto">
            Skip
          </button>
          {feedback === 'correct' ? (
            <button onClick={nextExercise} className="w-full rounded-2xl bg-[#19c37d] px-10 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#06251a] shadow-[0_5px_0_#0f8d5a] sm:w-auto">
              Continue
            </button>
          ) : (
            <button onClick={checkAnswer} disabled={hearts === 0 || !currentAnswer()} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1cb0f6] px-10 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#06232f] shadow-[0_5px_0_#0b75a5] disabled:bg-[#354b58] disabled:text-[#708995] disabled:shadow-none sm:w-auto">
              Check <Keyboard className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </main>
  );

  const renderComplete = () => (
    <main className="flex min-h-screen items-center justify-center bg-[#07181c] px-5 py-10 text-white">
      <section className="w-full max-w-3xl rounded-3xl border-2 border-[#35505d] bg-[#0d242a] p-8 text-center shadow-[0_18px_0_rgba(0,0,0,0.18)]">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#19c37d] text-[#06251a] shadow-[0_8px_0_#0f8d5a]">
          <BadgeCheck className="h-14 w-14" />
        </div>
        <h1 className="mt-8 text-5xl font-black">Lesson complete</h1>
        <p className="mt-4 text-lg font-bold leading-8 text-[#c9d7de]">
          You earned {selectedLesson.xp} XP and {selectedLesson.points} K-CUBE points. Fresh users can start from zero and understand the full game without training.
        </p>
        {message ? <p className="mt-4 rounded-xl bg-[#101f24] p-3 text-sm font-bold text-[#ffd900]">{message}</p> : null}
        <div className="mt-8 grid gap-3 rounded-2xl bg-[#101f24] p-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white/[0.04] p-4">
            <p className="text-sm font-bold text-[#9fb2bd]">Accuracy floor</p>
            <p className="mt-1 text-2xl font-black text-[#19c37d]">70%+</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-4">
            <p className="text-sm font-bold text-[#9fb2bd]">XP earned</p>
            <p className="mt-1 text-2xl font-black text-[#1cb0f6]">+{selectedLesson.xp}</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-4">
            <p className="text-sm font-bold text-[#9fb2bd]">K-CUBE points</p>
            <p className="mt-1 text-2xl font-black text-[#ffd900]">+{selectedLesson.points}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button onClick={restart} className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#35505d] px-5 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#c9d7de]">
            <RotateCcw className="h-4 w-4" /> Practice again
          </button>
          <button onClick={() => setStage('path')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#19c37d] px-5 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#06251a] shadow-[0_5px_0_#0f8d5a]">
            Lesson path <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );

  if (stage === 'onboarding-level') return renderOnboardingLevel();
  if (stage === 'onboarding-start') return renderOnboardingStart();
  if (stage === 'path') return renderPath();
  if (stage === 'lesson') return renderLesson();
  return renderComplete();
};

export default LearningGame;
