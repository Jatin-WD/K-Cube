"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Flame,
  Heart,
  Layers,
  Mic,
  Play,
  ShoppingCart,
  Sparkles,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import api from '@/lib/api';
import { startRazorpayCheckout } from '@/lib/razorpay';
import { useAppStore } from '@/store/useAppStore';

type GameType = 'choice' | 'cards' | 'arrange' | 'listen' | 'speak' | 'match';

interface GameRound {
  type: GameType;
  tag: string;
  prompt: string;
  korean: string;
  answer: string;
  options?: string[];
  words?: string[];
  cards?: Array<{ korean: string; label: string; visual: string }>;
  pairs?: Array<{ korean: string; label: string }>;
  hint: string;
}

interface CourseProduct {
  id: string;
  badge: string;
  title: string;
  teacher: string;
  schedule: string;
  lessons: number;
  duration: string;
  oldPrice: number;
  price: number;
  discount: number;
  points: number;
  trial?: boolean;
  materials: string[];
}

interface GuideBook {
  id: string;
  title: string;
  level: string;
  pages: number;
  format: string;
  summary: string;
  chapters: string[];
  outcomes: string[];
}

interface LearningTrack {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  accent: string;
  rewardPoints: number;
  startXp: number;
  outcomes: string[];
  rounds: GameRound[];
  guideBooks: GuideBook[];
  products: CourseProduct[];
}

const tracks: Record<string, LearningTrack> = {
  'beginner-korean': {
    slug: 'beginner-korean',
    title: 'Beginner Korean Learning',
    eyebrow: 'Hangul starter path',
    intro: 'Start from zero with Hangul, greetings, numbers, and survival phrases. Every lesson gives XP, K-CUBE points, and a clear next action.',
    accent: '#19c37d',
    rewardPoints: 60,
    startXp: 0,
    outcomes: ['Read first Hangul vowels', 'Use polite greetings', 'Build simple request sentences', 'Unlock beginner certificate points'],
    rounds: [
      {
        type: 'cards',
        tag: 'New word',
        prompt: 'Which one of these is coffee?',
        korean: '커피',
        answer: '커피',
        cards: [
          { korean: '차', label: 'tea', visual: 'cup' },
          { korean: '커피', label: 'coffee', visual: 'coffee' },
          { korean: '빵', label: 'bread', visual: 'bread' },
        ],
        hint: 'Coffee sounds like keopi in Korean.',
      },
      {
        type: 'choice',
        tag: 'Meaning',
        prompt: 'What does 안녕하세요 mean?',
        korean: '안녕하세요',
        answer: 'Hello',
        options: ['Hello', 'Water', 'Thank you', 'Bread'],
        hint: 'This is the most common polite greeting.',
      },
      {
        type: 'arrange',
        tag: 'Sentence',
        prompt: 'Build: Please give me coffee.',
        korean: '커피 주세요',
        answer: '커피 주세요',
        words: ['주세요', '커피', '안녕', '물'],
        hint: '주세요 means please give me.',
      },
      {
        type: 'listen',
        tag: 'Listening',
        prompt: 'Listen and choose thank you.',
        korean: '감사합니다',
        answer: '감사합니다',
        options: ['감사합니다', '안녕하세요', '커피 주세요', '물 주세요'],
        hint: '감사합니다 is the polite way to say thank you.',
      },
      {
        type: 'match',
        tag: 'Review',
        prompt: 'Match the starter phrases.',
        korean: '안녕하세요 감사합니다 물',
        answer: 'complete',
        pairs: [
          { korean: '안녕하세요', label: 'hello' },
          { korean: '감사합니다', label: 'thank you' },
          { korean: '물', label: 'water' },
        ],
        hint: 'Tap every Korean phrase with its meaning.',
      },
    ],
    guideBooks: [
      {
        id: 'hangul-cafe-starter',
        title: 'Hangul Cafe Starter Guide',
        level: 'Absolute beginner',
        pages: 28,
        format: 'PDF + mobile cards',
        summary: 'A polished starter book for Hangul sounds, cafe words, polite requests, and first-day speaking confidence.',
        chapters: ['Vowels and consonant blocks', 'Cafe words with pronunciation', 'Please give me sentence pattern', '5-minute daily review plan'],
        outcomes: ['Read 12 starter syllables', 'Order coffee or tea politely', 'Complete the first lesson quiz'],
      },
      {
        id: 'survival-korean-pocketbook',
        title: 'Korean Survival Pocketbook',
        level: 'Starter phrases',
        pages: 18,
        format: 'Pocket PDF',
        summary: 'Quick greetings, thank-you phrases, classroom expressions, and travel basics for new learners.',
        chapters: ['Hello and goodbye', 'Thanks and apology', 'Classroom phrases', 'Mini self-introduction'],
        outcomes: ['Use 10 polite phrases', 'Practice one intro script', 'Review with flashcards'],
      },
    ],
    products: [
      {
        id: 'beginner-live',
        badge: 'BEST',
        title: 'K-CUBE Live Class Korean Starter Level 1',
        teacher: 'K-CUBE Korean Coach',
        schedule: 'Mon/Wed, 7:00 PM',
        lessons: 8,
        duration: '4 weeks',
        oldPrice: 3000,
        price: 1499,
        discount: 50,
        points: 300,
        materials: ['Hangul workbook PDF', 'Cafe phrase cards', 'Beginner quiz set'],
      },
      {
        id: 'beginner-trial',
        badge: 'TRIAL',
        title: 'Free Beginner Korean Trial Class',
        teacher: 'K-CUBE Korean Coach',
        schedule: 'Saturday, 5:00 PM',
        lessons: 1,
        duration: '45 minutes',
        oldPrice: 499,
        price: 0,
        discount: 100,
        points: 40,
        trial: true,
        materials: ['Trial worksheet', 'Level placement quiz'],
      },
    ],
  },
  'vocabulary-streaks': {
    slug: 'vocabulary-streaks',
    title: 'Korean Vocabulary Streaks',
    eyebrow: 'Daily word retention',
    intro: 'Practice themed Korean words every day. Streaks reward consistency and make vocabulary useful for K-Food, events, and Korean culture tasks.',
    accent: '#1cb0f6',
    rewardPoints: 45,
    startXp: 0,
    outcomes: ['Daily word streaks', 'K-Food vocabulary', 'Memory review loops', 'Bonus points for streak milestones'],
    rounds: [
      {
        type: 'listen',
        tag: 'Listen',
        prompt: 'Listen and choose the word you hear.',
        korean: '물',
        answer: '물',
        options: ['물', '밥', '차', '빵'],
        hint: '물 means water.',
      },
      {
        type: 'match',
        tag: 'Match',
        prompt: 'Match each Korean word with meaning.',
        korean: '밥 김치 라면',
        answer: 'complete',
        pairs: [
          { korean: '밥', label: 'rice' },
          { korean: '김치', label: 'kimchi' },
          { korean: '라면', label: 'ramyeon' },
        ],
        hint: 'Tap all pairs to complete the match.',
      },
      {
        type: 'choice',
        tag: 'Review',
        prompt: 'What does 라면 mean?',
        korean: '라면',
        answer: 'Ramyeon',
        options: ['Ramyeon', 'Coffee', 'Teacher', 'Hello'],
        hint: 'Think Korean noodles.',
      },
      {
        type: 'cards',
        tag: 'Food card',
        prompt: 'Which card is kimchi?',
        korean: '김치',
        answer: '김치',
        cards: [
          { korean: '밥', label: 'rice', visual: 'rice' },
          { korean: '김치', label: 'kimchi', visual: 'kimchi' },
          { korean: '차', label: 'tea', visual: 'cup' },
        ],
        hint: 'Kimchi is the fermented side dish.',
      },
      {
        type: 'arrange',
        tag: 'Order phrase',
        prompt: 'Build: Please give me water.',
        korean: '물 주세요',
        answer: '물 주세요',
        words: ['주세요', '물', '라면', '밥'],
        hint: 'Put the item first, then 주세요.',
      },
    ],
    guideBooks: [
      {
        id: 'daily-word-deck-guide',
        title: '30-Day Korean Word Deck Guide',
        level: 'Beginner vocabulary',
        pages: 42,
        format: 'PDF + flashcard sheet',
        summary: 'A daily guide with themed word lists, romanization support, recall prompts, and streak checkboxes.',
        chapters: ['Food and drinks', 'People and classroom words', 'Travel essentials', 'Weekly review games'],
        outcomes: ['Learn 150 core words', 'Build a 30-day streak', 'Review weak words weekly'],
      },
      {
        id: 'kfood-wordbook',
        title: 'K-Food Wordbook',
        level: 'Food missions',
        pages: 24,
        format: 'Printable workbook',
        summary: 'Food vocabulary, menu-reading practice, ordering phrases, and K-Food mission prompts.',
        chapters: ['Rice, noodles, and sides', 'Spice levels and taste words', 'Ordering at a counter', 'K-Food mission checklist'],
        outcomes: ['Read common menu words', 'Order one dish politely', 'Complete food vocabulary quiz'],
      },
    ],
    products: [
      {
        id: 'vocab-pack',
        badge: 'EVENT',
        title: '30-Day Korean Vocabulary Streak Pack',
        teacher: 'Self-paced + weekly review',
        schedule: 'Daily unlock',
        lessons: 30,
        duration: '30 days',
        oldPrice: 1999,
        price: 899,
        discount: 55,
        points: 220,
        materials: ['500-word deck', 'Daily streak sheet', 'K-Food word pack'],
      },
      {
        id: 'vocab-trial',
        badge: 'FREE',
        title: '7-Day Vocabulary Trial',
        teacher: 'Self-paced',
        schedule: 'Instant access',
        lessons: 7,
        duration: '7 days',
        oldPrice: 399,
        price: 0,
        discount: 100,
        points: 35,
        trial: true,
        materials: ['Starter word deck', 'Mini review quiz'],
      },
    ],
  },
  'speaking-practice': {
    slug: 'speaking-practice',
    title: 'Korean Speaking Practice',
    eyebrow: 'Pronunciation and conversation',
    intro: 'Practice short speaking prompts, repeat after native-style audio, and submit attempts for review workflows. Speaking actions carry higher points.',
    accent: '#ce82ff',
    rewardPoints: 70,
    startXp: 0,
    outcomes: ['Pronunciation drills', 'Conversation prompts', 'Speaking confidence meter', 'Review-ready speaking submissions'],
    rounds: [
      {
        type: 'speak',
        tag: 'Speak',
        prompt: 'Say this greeting out loud.',
        korean: '반갑습니다',
        answer: 'spoken',
        hint: 'It means nice to meet you.',
      },
      {
        type: 'listen',
        tag: 'Shadowing',
        prompt: 'Listen and choose the phrase.',
        korean: '감사합니다',
        answer: '감사합니다',
        options: ['감사합니다', '안녕하세요', '커피 주세요', '물 주세요'],
        hint: 'This phrase means thank you.',
      },
      {
        type: 'arrange',
        tag: 'Conversation',
        prompt: 'Build: Nice to meet you.',
        korean: '반갑습니다',
        answer: '반갑습니다',
        words: ['반갑', '습니다', '커피', '주세요'],
        hint: 'Use the two parts that form 반갑습니다.',
      },
      {
        type: 'choice',
        tag: 'Meaning',
        prompt: 'What does 선생님 mean?',
        korean: '선생님',
        answer: 'Teacher',
        options: ['Teacher', 'Student', 'Coffee', 'Water'],
        hint: 'You will hear this in class.',
      },
      {
        type: 'match',
        tag: 'Speaking prep',
        prompt: 'Match the speaking prompts.',
        korean: '이름 선생님 학생',
        answer: 'complete',
        pairs: [
          { korean: '이름', label: 'name' },
          { korean: '선생님', label: 'teacher' },
          { korean: '학생', label: 'student' },
        ],
        hint: 'These words help with a short self-introduction.',
      },
    ],
    guideBooks: [
      {
        id: 'pronunciation-lab-guide',
        title: 'Korean Pronunciation Lab Guide',
        level: 'Speaking foundation',
        pages: 32,
        format: 'PDF + voice checklist',
        summary: 'A speaking guide with mouth-position tips, shadowing drills, and self-review scoring for Hindi/English speakers.',
        chapters: ['Vowel clarity drills', 'Batchim final sounds', 'Shadowing short phrases', 'Voice review rubric'],
        outcomes: ['Record 6 speaking drills', 'Improve greeting clarity', 'Submit review-ready audio'],
      },
      {
        id: 'conversation-scripts-guide',
        title: 'Mini Conversation Scripts',
        level: 'Short exchanges',
        pages: 26,
        format: 'Script book',
        summary: 'Ready-to-practice scripts for introductions, class, cafe, event check-in, and polite follow-up lines.',
        chapters: ['Self-introduction', 'Cafe order', 'Classroom help', 'Event check-in'],
        outcomes: ['Practice 4 conversations', 'Use polite sentence endings', 'Build a speaking streak'],
      },
    ],
    products: [
      {
        id: 'speaking-live',
        badge: 'LIVE',
        title: 'Korean Speaking Practice Live Batch',
        teacher: 'Speaking Coach',
        schedule: 'Tue/Thu, 8:00 PM',
        lessons: 8,
        duration: '4 weeks',
        oldPrice: 4200,
        price: 2199,
        discount: 48,
        points: 420,
        materials: ['Pronunciation checklist', 'Conversation scripts', 'Voice review rubric'],
      },
      {
        id: 'speaking-trial',
        badge: 'TRIAL',
        title: 'Speaking Trial and Level Check',
        teacher: 'Speaking Coach',
        schedule: 'Sunday, 4:00 PM',
        lessons: 1,
        duration: '30 minutes',
        oldPrice: 699,
        price: 0,
        discount: 100,
        points: 50,
        trial: true,
        materials: ['Speaking prompt sheet', 'Pronunciation scorecard'],
      },
    ],
  },
  'class-content': {
    slug: 'class-content',
    title: 'Korean Class Content',
    eyebrow: 'Structured course library',
    intro: 'Access organized lessons, class recordings, worksheets, quizzes, and culture modules. Each module has study, quiz, review, and completion points.',
    accent: '#ff9600',
    rewardPoints: 65,
    startXp: 0,
    outcomes: ['Structured class modules', 'Worksheets and recordings', 'Module completion points', 'Certificate-style progress'],
    rounds: [
      {
        type: 'choice',
        tag: 'Class quiz',
        prompt: 'Which phrase is polite hello?',
        korean: 'Choose one',
        answer: '안녕하세요',
        options: ['안녕하세요', '라면', '김치', '밥'],
        hint: 'The greeting ends with 세요.',
      },
      {
        type: 'cards',
        tag: 'Culture',
        prompt: 'Which card shows Korean class material?',
        korean: '수업',
        answer: '수업',
        cards: [
          { korean: '수업', label: 'class', visual: 'book' },
          { korean: '물', label: 'water', visual: 'water' },
          { korean: '빵', label: 'bread', visual: 'bread' },
        ],
        hint: '수업 means class or lesson.',
      },
      {
        type: 'match',
        tag: 'Review',
        prompt: 'Match class words.',
        korean: '선생님 학생 수업',
        answer: 'complete',
        pairs: [
          { korean: '선생님', label: 'teacher' },
          { korean: '학생', label: 'student' },
          { korean: '수업', label: 'class' },
        ],
        hint: 'Tap all correct study pairs.',
      },
      {
        type: 'listen',
        tag: 'Class audio',
        prompt: 'Listen and choose class.',
        korean: '수업',
        answer: '수업',
        options: ['수업', '물', '라면', '밥'],
        hint: '수업 means class or lesson.',
      },
      {
        type: 'arrange',
        tag: 'Class sentence',
        prompt: 'Build: I am a student.',
        korean: '저는 학생입니다',
        answer: '저는 학생입니다',
        words: ['학생입니다', '저는', '선생님', '수업'],
        hint: '저는 starts the sentence, 학생입니다 completes it.',
      },
    ],
    guideBooks: [
      {
        id: 'level-one-classbook',
        title: 'K-CUBE Level 1 Classbook',
        level: 'Structured class',
        pages: 64,
        format: 'Class PDF',
        summary: 'A full class book with module goals, examples, homework prompts, quizzes, and teacher notes.',
        chapters: ['Hangul foundations', 'Greetings and etiquette', 'Food and daily life', 'Culture notes and quizzes'],
        outcomes: ['Follow 8 class modules', 'Complete homework prompts', 'Prepare for certificate review'],
      },
      {
        id: 'worksheet-pack',
        title: 'Worksheet and Quiz Pack',
        level: 'Review library',
        pages: 36,
        format: 'Worksheets',
        summary: 'Printable worksheets and answer checks for learners who want structured revision after each class.',
        chapters: ['Writing practice', 'Vocabulary recall', 'Sentence building', 'Culture quiz review'],
        outcomes: ['Finish weekly worksheets', 'Track quiz scores', 'Identify revision gaps'],
      },
    ],
    products: [
      {
        id: 'class-library',
        badge: 'PACKAGE',
        title: 'K-CUBE Korean Class Content Library',
        teacher: 'K-CUBE Faculty',
        schedule: 'Instant access',
        lessons: 24,
        duration: '90 days',
        oldPrice: 5999,
        price: 2999,
        discount: 50,
        points: 550,
        materials: ['Recorded lessons', 'Worksheets', 'Culture quizzes', 'Certificate tasks'],
      },
      {
        id: 'class-demo',
        badge: 'DEMO',
        title: 'Free Class Content Demo',
        teacher: 'K-CUBE Faculty',
        schedule: 'Instant access',
        lessons: 2,
        duration: '2 days',
        oldPrice: 799,
        price: 0,
        discount: 100,
        points: 45,
        trial: true,
        materials: ['Demo worksheet', 'Sample recording'],
      },
    ],
  },
};

const visualIcons: Record<string, string> = {
  cup: '🍵',
  coffee: '☕',
  bread: '🍞',
  book: '📘',
  water: '💧',
  rice: '🍚',
  kimchi: '🥬',
};

const formatPrice = (value: number) => (value === 0 ? 'Free' : `₹${value.toLocaleString('en-IN')}`);

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const LearningTrackPage = ({ slug }: { slug: string }) => {
  const track = tracks[slug] || tracks['beginner-korean'];
  const user = useAppStore((state) => state.user);
  const walletPoints = useAppStore((state) => state.points);
  const awardPoints = useAppStore((state) => state.awardPoints);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(track.startXp);
  const [streak, setStreak] = useState(0);
  const [guestPoints, setGuestPoints] = useState(0);
  const [guestActions, setGuestActions] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [trackCompleted, setTrackCompleted] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const round = track.rounds[roundIndex];
  const progress = ((roundIndex + (feedback === 'correct' || trackCompleted ? 1 : 0)) / track.rounds.length) * 100;
  const wordBank = useMemo(() => shuffle(round.words || []), [round]);
  const displayedWalletPoints = user ? walletPoints : guestPoints;

  const awardLearningPoints = (actionId: string, points: number) => {
    if (user) {
      awardPoints(actionId, points);
      return;
    }
    if (guestActions.includes(actionId)) return;
    setGuestActions((items) => [...items, actionId]);
    setGuestPoints((value) => value + points);
  };

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(round.korean);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const resetRound = () => {
    setSelected('');
    setBuiltWords([]);
    setMatched([]);
    setFeedback('idle');
    setNotice('');
  };

  const restartTrack = () => {
    setRoundIndex(0);
    setHearts(5);
    setTrackCompleted(false);
    resetRound();
  };

  const currentAnswer = () => {
    if (round.type === 'arrange') return builtWords.join(' ');
    if (round.type === 'match') return matched.length === round.pairs?.length ? 'complete' : '';
    if (round.type === 'speak') return selected;
    return selected;
  };

  const completeTrack = async () => {
    if (trackCompleted) {
      setNotice('Track already completed in this session. Pick a guide book or course package for the next step.');
      return;
    }
    setXp((value) => value + 80);
    setStreak((value) => value + 1);
    awardLearningPoints(`learning-track-${track.slug}`, track.rewardPoints);
    setTrackCompleted(true);
    setNotice(`Track complete. +80 XP and +${track.rewardPoints} K-CUBE points added.`);
    try {
      await api.post('/engagement/lessons/complete', { lesson_id: Math.max(1, roundIndex + 1), accuracy: 100 });
    } catch {
      setNotice(`Track complete locally. Login/API connection ke baad server points sync honge. +${track.rewardPoints} points ready.`);
    }
  };

  const checkRound = () => {
    if (currentAnswer() === round.answer) {
      setFeedback('correct');
      setNotice('Correct. Continue to the next game.');
      return;
    }
    setFeedback('wrong');
    setHearts((value) => Math.max(0, value - 1));
    setNotice(round.hint);
  };

  const nextRound = () => {
    if (roundIndex >= track.rounds.length - 1) {
      completeTrack();
      return;
    }
    setRoundIndex((value) => value + 1);
    resetRound();
  };

  const logCourseAction = async (product: CourseProduct, action: 'cart' | 'trial' | 'purchase', points: number) => {
    try {
      const response = await api.post('/engagement/learning/course-action', {
        course_id: product.id,
        course_title: product.title,
        track_slug: track.slug,
        action,
        price: product.price,
        points_reward: points,
        metadata: { schedule: product.schedule, lessons: product.lessons, teacher: product.teacher },
      });
      return response.data?.data ?? response.data;
    } catch {
      return false;
    }
  };

  const addToCart = async (product: CourseProduct) => {
    setCart((items) => (items.includes(product.id) ? items : [...items, product.id]));
    const synced = await logCourseAction(product, 'cart', 10);
    if (synced) {
      awardLearningPoints(`course-cart-${product.id}`, Number(synced.pointsReward || 10));
    } else {
      awardLearningPoints(`course-cart-${product.id}`, 10);
    }
    setNotice(`${product.title} added to cart. +10 cart action points${synced ? ' synced' : ' locally saved'}.`);
  };

  const buyNow = async (product: CourseProduct) => {
    if (!user) {
      setNotice('Please sign in to complete course checkout.');
      return;
    }

    if (isPurchasing) {
      return;
    }

    if (product.trial || product.price <= 0) {
      const synced = await logCourseAction(product, 'trial', product.points);
      if (synced) {
        awardLearningPoints(`course-buy-${product.id}`, Number(synced.pointsReward || product.points));
      } else {
        awardLearningPoints(`course-buy-${product.id}`, product.points);
      }
      setNotice(`${product.title} enrolled. +${product.points} trial points ${synced ? 'synced' : 'locally saved'}.`);
      return;
    }

    setIsPurchasing(true);
    setNotice('');

    try {
      const payment = await startRazorpayCheckout({
        amount: product.price,
        contextType: 'course',
        contextRef: product.id,
        description: product.title,
        customerEmail: user.email ?? null,
        customerPhone: user.phone ?? null,
        notes: {
          courseTitle: product.title,
          trackSlug: track.slug,
          pointsReward: product.points,
          price: product.price,
        },
        course: {
          courseId: product.id,
          courseTitle: product.title,
          trackSlug: track.slug,
          price: product.price,
          pointsReward: product.points,
          teacher: product.teacher,
          schedule: product.schedule,
          lessons: product.lessons,
        },
      });

      awardLearningPoints(`razorpay-payment-${payment.paymentOrderId}`, payment.pointsAwarded || product.points);
      setNotice(`${product.title} payment successful. +${payment.pointsAwarded || product.points} points synced.`);
    } catch (error: any) {
      setNotice(error?.message || 'Payment could not be completed.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const previewGuideBook = (guideBook: GuideBook) => {
    awardLearningPoints(`guide-preview-${guideBook.id}`, 5);
    setNotice(`${guideBook.title} preview opened. ${guideBook.pages} pages, ${guideBook.format}. +5 guide preview points.`);
  };

  const renderGameBody = () => {
    if (round.type === 'cards') {
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          {round.cards?.map((card, index) => (
            <button
              key={card.korean}
              onClick={() => setSelected(card.korean)}
              className={`min-h-64 rounded-lg border-2 p-5 text-left transition ${selected === card.korean ? 'border-[#1cb0f6] bg-[#203d46]' : 'border-[#35505d] bg-[#101f24] hover:bg-[#142a31]'}`}
            >
              <span className="flex h-28 items-center justify-center text-7xl">{visualIcons[card.visual] || '📘'}</span>
              <span className="mt-5 flex items-end justify-between">
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

    if (round.type === 'choice' || round.type === 'listen') {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {round.options?.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`min-h-16 rounded-lg border-2 px-5 py-4 text-left text-lg font-black transition ${selected === option ? 'border-[#1cb0f6] bg-[#203d46]' : 'border-[#35505d] bg-[#101f24] hover:bg-[#142a31]'}`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    if (round.type === 'arrange') {
      return (
        <div className="grid gap-5">
          <div className="min-h-24 rounded-lg border-2 border-dashed border-[#35505d] bg-[#101f24] p-4">
            {builtWords.length ? (
              <div className="flex flex-wrap gap-3">
                {builtWords.map((word, index) => (
                  <button key={`${word}-${index}`} onClick={() => setBuiltWords((words) => words.filter((_, wordIndex) => wordIndex !== index))} className="rounded-lg bg-[#1cb0f6] px-4 py-3 text-lg font-black text-[#06232f]">
                    {word}
                  </button>
                ))}
              </div>
            ) : <p className="text-sm font-bold text-[#708995]">Tap words to build the answer.</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {wordBank.map((word) => (
              <button key={word} disabled={builtWords.includes(word)} onClick={() => setBuiltWords((words) => [...words, word])} className="rounded-lg border-2 border-[#35505d] bg-[#142a31] px-4 py-3 text-lg font-black disabled:opacity-35">
                {word}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (round.type === 'match') {
      return (
        <div className="grid gap-3">
          {round.pairs?.map((pair) => {
            const token = `${pair.korean}:${pair.label}`;
            const active = matched.includes(token);
            return (
              <button key={token} onClick={() => setMatched((items) => active ? items.filter((item) => item !== token) : [...items, token])} className={`flex items-center justify-between rounded-lg border-2 px-5 py-4 text-lg font-black ${active ? 'border-[#19c37d] bg-[#123c31] text-[#7cf0b6]' : 'border-[#35505d] bg-[#101f24]'}`}>
                <span className="text-2xl">{pair.korean}</span>
                <span>{pair.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <button onClick={() => setSelected('spoken')} className="inline-flex w-full items-center justify-center gap-3 rounded-lg border-2 border-[#35505d] bg-[#101f24] px-5 py-6 text-lg font-black">
        <Mic className="h-7 w-7 text-[#1cb0f6]" /> I completed the speaking attempt
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#111827]">
      <section className="bg-[#101f24] px-4 py-8 text-white sm:px-5 lg:px-10">
        <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <Link href="/learning" className="inline-flex items-center gap-2 text-sm font-black text-[#9fb2bd] hover:text-white">
              <ChevronRight className="h-4 w-4 rotate-180" /> Korean Learning
            </Link>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.22em]" style={{ color: track.accent }}>{track.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">{track.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#d8e5eb] sm:text-lg sm:leading-8">{track.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {track.outcomes.map((outcome) => (
                <span key={outcome} className="rounded-full border border-[#35505d] bg-[#142a31] px-4 py-2 text-sm font-bold text-[#d8e5eb]">
                  {outcome}
                </span>
              ))}
            </div>
          </div>
          <aside className="rounded-lg border border-[#35505d] bg-[#142a31] p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-[#101f24] p-3">
                <Heart className="mx-auto h-5 w-5 fill-[#ff4b4b] text-[#ff4b4b]" />
                <p className="mt-1 text-2xl font-black">{hearts}</p>
              </div>
              <div className="rounded-lg bg-[#101f24] p-3">
                <Zap className="mx-auto h-5 w-5 text-[#1cb0f6]" />
                <p className="mt-1 text-2xl font-black">{xp}</p>
              </div>
              <div className="rounded-lg bg-[#101f24] p-3">
                <Flame className="mx-auto h-5 w-5 text-[#ff9600]" />
                <p className="mt-1 text-2xl font-black">{streak}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-[#101f24] p-4">
              <p className="text-sm font-bold text-[#9fb2bd]">Wallet points</p>
              <p className="text-4xl font-black text-[#ffd900]">{displayedWalletPoints}</p>
              <p className="mt-2 text-xs font-bold text-[#9fb2bd]">{user ? 'Backend ledger se synced points.' : 'Guest session points. Login ke baad server ledger sync hoga.'}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-5 lg:px-10">
        <div className="mx-auto grid max-w-[1480px] gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-lg bg-[#101f24] p-5 text-white">
            <div className="flex items-center gap-5">
              <button onClick={restartTrack} className="text-[#708995]" aria-label="Restart track">
                <X className="h-7 w-7" />
              </button>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#35505d]">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: track.accent }} />
              </div>
              <span className="inline-flex items-center gap-2 text-lg font-black text-[#ff4b4b]"><Heart className="h-6 w-6 fill-current" /> {hearts}</span>
            </div>

            <div className="mx-auto max-w-4xl py-8">
              <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#ce82ff]">
                <Sparkles className="h-5 w-5 fill-current" /> {round.tag}
              </div>
              <h2 className="mt-4 text-2xl font-black leading-tight sm:text-4xl lg:text-5xl">{round.prompt}</h2>
              <div className="mt-7 rounded-lg bg-[#142a31] p-5 text-center">
                <p className="text-4xl font-black sm:text-6xl lg:text-7xl">{round.korean}</p>
                {(round.type === 'listen' || round.type === 'speak') ? (
                  <button onClick={speak} className="mt-5 inline-flex items-center gap-2 rounded-lg border-2 border-[#35505d] px-4 py-3 text-sm font-black text-[#1cb0f6]">
                    <Volume2 className="h-5 w-5" /> Play Korean audio
                  </button>
                ) : null}
              </div>
              <div className="mt-7">{renderGameBody()}</div>
              {notice ? (
                <div className={`mt-7 rounded-lg border-2 p-4 ${feedback === 'wrong' ? 'border-[#ff4b4b] bg-[#3a1d24] text-[#ffb4b4]' : 'border-[#19c37d] bg-[#123c31] text-[#7cf0b6]'}`}>
                  <p className="font-black">{notice}</p>
                </div>
              ) : null}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#35505d] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={() => { setHearts((value) => Math.max(0, value - 1)); nextRound(); }} className="rounded-lg border-2 border-[#35505d] px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#708995]">
                  Skip
                </button>
                {feedback === 'correct' ? (
                  <button onClick={nextRound} className="rounded-lg px-8 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#06251a] shadow-[0_5px_0_rgba(0,0,0,0.28)]" style={{ backgroundColor: track.accent }}>
                    Continue
                  </button>
                ) : (
                  <button onClick={checkRound} disabled={!currentAnswer()} className="rounded-lg bg-[#1cb0f6] px-8 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#06232f] shadow-[0_5px_0_#0b75a5] disabled:bg-[#354b58] disabled:text-[#708995] disabled:shadow-none">
                    Check
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className="grid gap-5 self-start">
            <div className="rounded-lg border border-[#d5d9d9] bg-white p-5">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-[#ff9600]" />
                <h2 className="text-xl font-black">Points system</h2>
              </div>
              <div className="mt-4 grid gap-3 text-sm font-bold text-[#565959]">
                <p className="flex justify-between rounded-lg bg-[#f7fafa] p-3"><span>Track completion</span><span>+{track.rewardPoints}</span></p>
                <p className="flex justify-between rounded-lg bg-[#f7fafa] p-3"><span>Add course to cart</span><span>+10</span></p>
                <p className="flex justify-between rounded-lg bg-[#f7fafa] p-3"><span>Trial booking</span><span>+35 to +50</span></p>
                <p className="flex justify-between rounded-lg bg-[#f7fafa] p-3"><span>Paid course purchase</span><span>+220 to +550</span></p>
              </div>
            </div>
            <div className="rounded-lg border border-[#d5d9d9] bg-white p-5">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-[#b12704]" />
                <h2 className="text-xl font-black">Cart</h2>
              </div>
              <p className="mt-3 text-sm font-bold text-[#565959]">{cart.length ? `${cart.length} course selected` : 'No course selected yet.'}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-5 lg:px-10">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#007185]">Guide books</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Download-ready learning guides</h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-[#565959]">
                Each option now has a real study book, chapter plan, practice outcome, and next action instead of an empty material label.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#d5d9d9] bg-white px-4 py-3 text-sm font-black text-[#111827]">
              <Layers className="h-4 w-4 text-[#007185]" /> {track.guideBooks.length} curated guides
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {track.guideBooks.map((guideBook) => (
              <article key={guideBook.id} className="rounded-lg border border-[#d5d9d9] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-sm bg-[#e8f3ff] px-2 py-1 text-xs font-black text-[#007185]">
                      <FileText className="h-3.5 w-3.5" /> {guideBook.format}
                    </div>
                    <h3 className="mt-4 text-2xl font-black">{guideBook.title}</h3>
                    <p className="mt-2 text-sm font-bold text-[#565959]">{guideBook.summary}</p>
                  </div>
                  <div className="rounded-lg bg-[#f7fafa] px-4 py-3 text-right">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#565959]">{guideBook.level}</p>
                    <p className="mt-1 text-2xl font-black text-[#b12704]">{guideBook.pages} pages</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-[#d5d9d9] bg-[#f7fafa] p-4">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#565959]">Chapters</p>
                    <div className="mt-3 grid gap-2">
                      {guideBook.chapters.map((chapter) => (
                        <p key={chapter} className="flex items-center gap-2 text-sm font-bold text-[#374151]">
                          <Check className="h-4 w-4 text-[#15803d]" /> {chapter}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#d5d9d9] bg-[#f7fafa] p-4">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#565959]">Outcomes</p>
                    <div className="mt-3 grid gap-2">
                      {guideBook.outcomes.map((outcome) => (
                        <p key={outcome} className="flex items-center gap-2 text-sm font-bold text-[#374151]">
                          <Sparkles className="h-4 w-4 text-[#ce82ff]" /> {outcome}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => previewGuideBook(guideBook)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827]">
                    <Download className="h-4 w-4" /> Preview guide
                  </button>
                  <button onClick={() => setNotice(`${guideBook.title} added to your learning plan.`)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d5d9d9] px-4 py-3 text-sm font-black text-[#111827]">
                    <BookOpen className="h-4 w-4" /> Add to plan
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-5 lg:px-10">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b12704]">Buy a course</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Course packages and trial classes</h2>
            </div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg border border-[#d5d9d9] bg-white px-4 py-3 text-sm font-black text-[#111827]">
              My page <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {track.products.map((product) => (
              <article key={product.id} className="rounded-lg border border-[#d5d9d9] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-sm bg-[#fff4cc] px-2 py-1 text-xs font-black text-[#b12704]">{product.badge}</span>
                      {product.trial ? <span className="rounded-sm bg-[#e9f8ef] px-2 py-1 text-xs font-black text-[#15803d]">TRIAL CLASS</span> : <span className="rounded-sm bg-[#e8f3ff] px-2 py-1 text-xs font-black text-[#007185]">PACKAGE COURSE</span>}
                    </div>
                    <h3 className="mt-4 text-2xl font-black">{product.title}</h3>
                    <p className="mt-2 text-sm font-bold text-[#565959]">{product.teacher}</p>
                  </div>
                  <span className="rounded-lg bg-[#fff4cc] px-3 py-2 text-sm font-black text-[#b12704]">+{product.points} pts</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <p className="rounded-lg bg-[#f7fafa] p-3 text-sm font-bold text-[#565959]"><BookOpen className="mb-2 h-5 w-5 text-[#007185]" /> {product.lessons} lessons</p>
                  <p className="rounded-lg bg-[#f7fafa] p-3 text-sm font-bold text-[#565959]"><Clock3 className="mb-2 h-5 w-5 text-[#007185]" /> {product.duration}</p>
                  <p className="rounded-lg bg-[#f7fafa] p-3 text-sm font-bold text-[#565959]"><CalendarDays className="mb-2 h-5 w-5 text-[#007185]" /> {product.schedule}</p>
                </div>
                <div className="mt-5 rounded-lg border border-[#d5d9d9] bg-[#f7fafa] p-4">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#565959]">Study materials</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.materials.map((material) => (
                      <span key={material} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#565959]">{material}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm font-bold text-[#565959]">Price</p>
                    <p className="mt-1 text-sm text-[#8f95a3] line-through">{formatPrice(product.oldPrice)}</p>
                    <p className="text-3xl font-black text-[#b12704]">{formatPrice(product.price)} <span className="text-sm text-[#15803d]">({product.discount}% off)</span></p>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                    <button onClick={() => addToCart(product)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d5d9d9] px-4 py-3 text-sm font-black text-[#111827]">
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </button>
                    <button disabled={isPurchasing} onClick={() => buyNow(product)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827] disabled:cursor-not-allowed disabled:bg-[#c9b64d]">
                      <Play className="h-4 w-4" /> {isPurchasing ? 'Processing...' : product.trial ? 'Book Trial' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LearningTrackPage;
