export type QuizType = 'choice' | 'cards' | 'arrange' | 'listen' | 'speak' | 'match';

export interface QuizCard {
  korean: string;
  label: string;
  visual: string;
}

export interface QuizPair {
  korean: string;
  label: string;
}

export interface QuizRound {
  id: string;
  type: QuizType;
  tag: string;
  prompt: string;
  korean: string;
  answer: string;
  options?: string[];
  words?: string[];
  cards?: QuizCard[];
  pairs?: QuizPair[];
  hint: string;
  points: number;
}

interface BaseItem {
  id: string;
  korean: string;
  meaning: string;
  hint: string;
  visual: string;
  speakAnswer?: string;
  arrangeWords?: string[];
  pairs?: QuizPair[];
  cardLabel?: string;
}

export interface LearningTrackConfig {
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
  questionPool: QuizRound[];
}

const hashSeed = (input: string) => {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const shuffleSeeded = <T,>(items: T[], seedInput: string) => {
  const copy = [...items];
  const random = mulberry32(hashSeed(seedInput));
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const pickOptions = (items: BaseItem[], currentIndex: number) => {
  const result = [items[currentIndex].meaning];
  let offset = 1;
  while (result.length < 4 && items.length > 1) {
    const candidate = items[(currentIndex + offset) % items.length].meaning;
    if (!result.includes(candidate)) result.push(candidate);
    offset += 1;
  }
  return result;
};

const buildChoice = (item: BaseItem, index: number, items: BaseItem[], tag: string, prefix: string, points: number): QuizRound => ({
  id: `${prefix}-${item.id}-choice`,
  type: 'choice',
  tag,
  prompt: `What does ${item.korean} mean?`,
  korean: item.korean,
  answer: item.meaning,
  options: shuffleSeeded(pickOptions(items, index), `${prefix}-${item.id}-choice`),
  hint: item.hint,
  points,
});

const buildListen = (item: BaseItem, index: number, items: BaseItem[], tag: string, prefix: string, points: number): QuizRound => ({
  id: `${prefix}-${item.id}-listen`,
  type: 'listen',
  tag,
  prompt: `Listen and choose the word you hear.`,
  korean: item.korean,
  answer: item.meaning,
  options: shuffleSeeded(pickOptions(items, index), `${prefix}-${item.id}-listen`),
  hint: item.hint,
  points,
});

const buildCards = (item: BaseItem, items: BaseItem[], index: number, tag: string, prefix: string, points: number): QuizRound => {
  const distractors = items
    .filter((candidate) => candidate.id !== item.id)
    .slice(index + 1)
    .concat(items.slice(0, index))
    .slice(0, 2);

  return {
    id: `${prefix}-${item.id}-cards`,
    type: 'cards',
    tag,
    prompt: `Pick the matching card for ${item.meaning}.`,
    korean: item.korean,
    answer: item.korean,
    cards: shuffleSeeded(
      [
        { korean: item.korean, label: item.cardLabel || item.meaning, visual: item.visual },
        ...distractors.map((candidate) => ({
          korean: candidate.korean,
          label: candidate.cardLabel || candidate.meaning,
          visual: candidate.visual,
        })),
      ],
      `${prefix}-${item.id}-cards`,
    ),
    hint: item.hint,
    points,
  };
};

const buildSpeak = (item: BaseItem, tag: string, prefix: string, points: number): QuizRound => ({
  id: `${prefix}-${item.id}-speak`,
  type: 'speak',
  tag,
  prompt: `Say this phrase out loud.`,
  korean: item.korean,
  answer: item.speakAnswer || 'spoken',
  hint: item.hint,
  points,
});

const buildArrange = (item: BaseItem, tag: string, prefix: string, points: number): QuizRound => ({
  id: `${prefix}-${item.id}-arrange`,
  type: 'arrange',
  tag,
  prompt: item.meaning,
  korean: item.korean,
  answer: item.korean,
  words: item.arrangeWords || item.korean.split(' '),
  hint: item.hint,
  points,
});

const buildMatch = (items: BaseItem[], tag: string, prefix: string, points: number): QuizRound => ({
  id: `${prefix}-${items[0].id}-match`,
  type: 'match',
  tag,
  prompt: 'Match the words with their meanings.',
  korean: items.map((item) => item.korean).join(' '),
  answer: 'complete',
  pairs: items.map((item) => ({ korean: item.korean, label: item.meaning })),
  hint: 'Tap every correct pair to complete the match.',
  points,
});

const standardPool = (items: BaseItem[], prefix: string, tag: string, points: number) => {
  const pool: QuizRound[] = [];
  items.forEach((item, index) => {
    pool.push(buildChoice(item, index, items, tag, prefix, points));
    pool.push(buildListen(item, index, items, tag, prefix, points));
    pool.push(buildCards(item, items, index, tag, prefix, points));
    pool.push(buildSpeak(item, tag, prefix, points));
  });
  return pool;
};

const speakingPool = (items: BaseItem[], prefix: string, tag: string, points: number) => {
  const pool: QuizRound[] = [];
  items.forEach((item, index) => {
    pool.push(buildChoice(item, index, items, tag, prefix, points));
    pool.push(buildListen(item, index, items, tag, prefix, points));
    pool.push(buildSpeak(item, tag, prefix, points));
    pool.push(buildArrange(item, tag, prefix, points));
    pool.push(buildCards(item, items, index, tag, prefix, points));
  });
  const groups = [
    items.slice(0, 3),
    items.slice(3, 6),
    items.slice(6, 9),
    items.slice(9, 12),
    items.slice(12, 15),
    items.slice(15, 18),
    items.slice(18, 21),
    items.slice(21, 24),
    items.slice(24, 27),
    items.slice(27, 30),
  ];
  groups.forEach((group, index) => {
    if (group.length === 3) pool.push(buildMatch(group, tag, `${prefix}-group-${index + 1}`, points));
  });
  return pool;
};

const beginnerItems: BaseItem[] = [
  { id: 'hello', korean: '안녕하세요', meaning: 'Hello', hint: 'Polite greeting used in most situations.', visual: 'hand', cardLabel: 'hello' },
  { id: 'thank-you', korean: '감사합니다', meaning: 'Thank you', hint: 'Polite thanks in formal situations.', visual: 'heart', cardLabel: 'thanks' },
  { id: 'sorry', korean: '죄송합니다', meaning: 'Sorry', hint: 'Use this for an apology or polite excuse.', visual: 'spark', cardLabel: 'sorry' },
  { id: 'please-give', korean: '주세요', meaning: 'Please give me', hint: 'Helpful when ordering or asking for something.', visual: 'cup', cardLabel: 'please' },
  { id: 'water', korean: '물', meaning: 'Water', hint: 'The basic drink word you will see everywhere.', visual: 'water', cardLabel: 'water' },
  { id: 'tea', korean: '차', meaning: 'Tea', hint: 'Short and common cafe vocabulary.', visual: 'tea', cardLabel: 'tea' },
  { id: 'coffee', korean: '커피', meaning: 'Coffee', hint: 'Sounds close to the English word.', visual: 'cup', cardLabel: 'coffee' },
  { id: 'rice', korean: '밥', meaning: 'Rice / meal', hint: 'This word can mean both rice and a meal.', visual: 'rice', cardLabel: 'rice' },
  { id: 'bread', korean: '빵', meaning: 'Bread', hint: 'A simple snack and bakery word.', visual: 'bread', cardLabel: 'bread' },
  { id: 'restroom', korean: '화장실', meaning: 'Restroom', hint: 'Important for travel and public spaces.', visual: 'book', cardLabel: 'restroom' },
  { id: 'where', korean: '어디예요', meaning: 'Where is it?', hint: 'Useful for directions and simple questions.', visual: 'map', cardLabel: 'where' },
  { id: 'how-much', korean: '얼마예요', meaning: 'How much is it?', hint: 'A shopping and cafe survival phrase.', visual: 'coin', cardLabel: 'price' },
  { id: 'i-am', korean: '저는 ...예요', meaning: 'I am ...', hint: 'A basic self-introduction pattern.', visual: 'star', cardLabel: 'intro' },
  { id: 'name', korean: '제 이름은 ...이에요', meaning: 'My name is ...', hint: 'A polite way to introduce yourself.', visual: 'badge', cardLabel: 'name' },
  { id: 'help', korean: '도와주세요', meaning: 'Please help me', hint: 'Use this when you need help quickly.', visual: 'shield', cardLabel: 'help' },
  { id: 'again', korean: '다시 말해 주세요', meaning: 'Please say it again', hint: 'Useful when you miss something.', visual: 'repeat', cardLabel: 'again' },
  { id: 'slowly', korean: '천천히 해 주세요', meaning: 'Please speak slowly', hint: 'Great for classroom and practice settings.', visual: 'clock', cardLabel: 'slowly' },
  { id: 'today', korean: '오늘', meaning: 'Today', hint: 'A common time word for plans and schedules.', visual: 'sun', cardLabel: 'today' },
  { id: 'tomorrow', korean: '내일', meaning: 'Tomorrow', hint: 'Future plans and calendar practice.', visual: 'calendar', cardLabel: 'tomorrow' },
  { id: 'now', korean: '지금', meaning: 'Now', hint: 'A time adverb for the present moment.', visual: 'clock', cardLabel: 'now' },
  { id: 'school', korean: '학교', meaning: 'School', hint: 'Useful in student and class content.', visual: 'book', cardLabel: 'school' },
  { id: 'student', korean: '학생', meaning: 'Student', hint: 'A person who studies in class.', visual: 'badge', cardLabel: 'student' },
  { id: 'teacher', korean: '선생님', meaning: 'Teacher', hint: 'A respectful way to address a teacher.', visual: 'badge', cardLabel: 'teacher' },
  { id: 'korea', korean: '한국', meaning: 'Korea', hint: 'Country name used often in lessons.', visual: 'flag', cardLabel: 'korea' },
  { id: 'seoul', korean: '서울', meaning: 'Seoul', hint: 'The capital city and a common location word.', visual: 'map', cardLabel: 'seoul' },
];

const vocabularyItems: BaseItem[] = [
  { id: 'family', korean: '가족', meaning: 'Family', hint: 'A common daily-life noun.', visual: 'family', cardLabel: 'family' },
  { id: 'friend', korean: '친구', meaning: 'Friend', hint: 'Used in social introductions and chats.', visual: 'heart', cardLabel: 'friend' },
  { id: 'time', korean: '시간', meaning: 'Time', hint: 'A core word for schedules and routines.', visual: 'clock', cardLabel: 'time' },
  { id: 'day', korean: '하루', meaning: 'Day', hint: 'Useful in streak and routine practice.', visual: 'sun', cardLabel: 'day' },
  { id: 'week', korean: '주', meaning: 'Week', hint: 'A planning word for calendars.', visual: 'calendar', cardLabel: 'week' },
  { id: 'month', korean: '달', meaning: 'Month', hint: 'A unit used in schedules and plans.', visual: 'calendar', cardLabel: 'month' },
  { id: 'happy', korean: '행복해요', meaning: 'Happy', hint: 'An emotion word for simple conversation.', visual: 'spark', cardLabel: 'happy' },
  { id: 'hungry', korean: '배고파요', meaning: 'Hungry', hint: 'Useful before meals and food missions.', visual: 'rice', cardLabel: 'hungry' },
  { id: 'thirsty', korean: '목말라요', meaning: 'Thirsty', hint: 'A simple survival vocabulary item.', visual: 'water', cardLabel: 'thirsty' },
  { id: 'hot', korean: '더워요', meaning: 'Hot', hint: 'Weather and comfort vocabulary.', visual: 'sun', cardLabel: 'hot' },
  { id: 'cold', korean: '추워요', meaning: 'Cold', hint: 'Weather and clothing conversations.', visual: 'snow', cardLabel: 'cold' },
  { id: 'small', korean: '작아요', meaning: 'Small', hint: 'A simple adjective for comparisons.', visual: 'spark', cardLabel: 'small' },
  { id: 'big', korean: '커요', meaning: 'Big', hint: 'Opposite of small and useful in shopping.', visual: 'box', cardLabel: 'big' },
  { id: 'fast', korean: '빨라요', meaning: 'Fast', hint: 'Can describe speaking or transport.', visual: 'train', cardLabel: 'fast' },
  { id: 'slow', korean: '느려요', meaning: 'Slow', hint: 'Useful when asking someone to slow down.', visual: 'clock', cardLabel: 'slow' },
  { id: 'left', korean: '왼쪽', meaning: 'Left', hint: 'Travel and direction vocabulary.', visual: 'arrow', cardLabel: 'left' },
  { id: 'right', korean: '오른쪽', meaning: 'Right', hint: 'Travel and direction vocabulary.', visual: 'arrow', cardLabel: 'right' },
  { id: 'up', korean: '위', meaning: 'Up', hint: 'Used for directions and location.', visual: 'arrow', cardLabel: 'up' },
  { id: 'down', korean: '아래', meaning: 'Down', hint: 'Used for directions and location.', visual: 'arrow', cardLabel: 'down' },
  { id: 'bus', korean: '버스', meaning: 'Bus', hint: 'Transportation word for city travel.', visual: 'train', cardLabel: 'bus' },
  { id: 'subway', korean: '지하철', meaning: 'Subway', hint: 'A must-know commute word.', visual: 'train', cardLabel: 'subway' },
  { id: 'market', korean: '시장', meaning: 'Market', hint: 'Shopping and food language often starts here.', visual: 'basket', cardLabel: 'market' },
  { id: 'cafe', korean: '카페', meaning: 'Cafe', hint: 'Useful in ordering practice.', visual: 'cup', cardLabel: 'cafe' },
  { id: 'hospital', korean: '병원', meaning: 'Hospital', hint: 'An important safety and daily-life word.', visual: 'shield', cardLabel: 'hospital' },
  { id: 'photo', korean: '사진', meaning: 'Photo', hint: 'Used in social media and memory tasks.', visual: 'camera', cardLabel: 'photo' },
];

const speakingItems: BaseItem[] = [
  { id: 'name-intro', korean: '제 이름은 민지예요', meaning: 'My name is Minji.', hint: 'Use a polite self-introduction.', visual: 'badge', speakAnswer: 'spoken', arrangeWords: ['제', '이름은', '민지예요'], cardLabel: 'intro' },
  { id: 'slowly-please', korean: '천천히 말해 주세요', meaning: 'Please speak slowly.', hint: 'A useful classroom request.', visual: 'clock', speakAnswer: 'spoken', arrangeWords: ['천천히', '말해', '주세요'], cardLabel: 'slowly' },
  { id: 'help-me', korean: '도와주세요', meaning: 'Please help me.', hint: 'A short survival sentence.', visual: 'shield', speakAnswer: 'spoken', arrangeWords: ['도와주세요'], cardLabel: 'help' },
  { id: 'again-please', korean: '다시 말해 주세요', meaning: 'Please say it again.', hint: 'Very common in real conversation.', visual: 'repeat', speakAnswer: 'spoken', arrangeWords: ['다시', '말해', '주세요'], cardLabel: 'again' },
  { id: 'what-time', korean: '지금 몇 시예요?', meaning: 'What time is it now?', hint: 'Ask for the current time politely.', visual: 'clock', speakAnswer: 'spoken', arrangeWords: ['지금', '몇', '시예요'], cardLabel: 'time' },
  { id: 'where-school', korean: '학교는 어디예요?', meaning: 'Where is the school?', hint: 'A directions practice sentence.', visual: 'map', speakAnswer: 'spoken', arrangeWords: ['학교는', '어디예요'], cardLabel: 'school' },
  { id: 'i-am-student', korean: '저는 학생이에요', meaning: 'I am a student.', hint: 'A common grammar pattern.', visual: 'badge', speakAnswer: 'spoken', arrangeWords: ['저는', '학생이에요'], cardLabel: 'student' },
  { id: 'i-like-korea', korean: '한국을 좋아해요', meaning: 'I like Korea.', hint: 'Use a polite sentence ending.', visual: 'flag', speakAnswer: 'spoken', arrangeWords: ['한국을', '좋아해요'], cardLabel: 'korea' },
  { id: 'coffee-please', korean: '커피 주세요', meaning: 'Please give me coffee.', hint: 'A cafe-style ordering line.', visual: 'cup', speakAnswer: 'spoken', arrangeWords: ['커피', '주세요'], cardLabel: 'coffee' },
  { id: 'water-please', korean: '물 주세요', meaning: 'Please give me water.', hint: 'A survival phrase for everyday use.', visual: 'water', speakAnswer: 'spoken', arrangeWords: ['물', '주세요'], cardLabel: 'water' },
  { id: 'thank-you', korean: '감사합니다', meaning: 'Thank you.', hint: 'Polite gratitude in a formal tone.', visual: 'heart', speakAnswer: 'spoken', arrangeWords: ['감사합니다'], cardLabel: 'thanks' },
  { id: 'nice-to-meet', korean: '반갑습니다', meaning: 'Nice to meet you.', hint: 'A warm introduction phrase.', visual: 'spark', speakAnswer: 'spoken', arrangeWords: ['반갑습니다'], cardLabel: 'nice' },
  { id: 'what-is-this', korean: '이게 뭐예요?', meaning: 'What is this?', hint: 'Ask about objects around you.', visual: 'book', speakAnswer: 'spoken', arrangeWords: ['이게', '뭐예요'], cardLabel: 'question' },
  { id: 'how-much-friend', korean: '이거 얼마예요?', meaning: 'How much is this?', hint: 'A shopping question.', visual: 'coin', speakAnswer: 'spoken', arrangeWords: ['이거', '얼마예요'], cardLabel: 'price' },
  { id: 'please-wait', korean: '잠시만 기다려 주세요', meaning: 'Please wait a moment.', hint: 'Useful in class and service settings.', visual: 'clock', speakAnswer: 'spoken', arrangeWords: ['잠시만', '기다려', '주세요'], cardLabel: 'wait' },
  { id: 'i-am-fine', korean: '저는 괜찮아요', meaning: 'I am okay.', hint: 'Simple response to a check-in question.', visual: 'heart', speakAnswer: 'spoken', arrangeWords: ['저는', '괜찮아요'], cardLabel: 'okay' },
  { id: 'i-study-korean', korean: '한국어를 공부해요', meaning: 'I study Korean.', hint: 'A useful learning-status sentence.', visual: 'book', speakAnswer: 'spoken', arrangeWords: ['한국어를', '공부해요'], cardLabel: 'study' },
  { id: 'see-you-tomorrow', korean: '내일 봐요', meaning: 'See you tomorrow.', hint: 'A friendly closing line.', visual: 'calendar', speakAnswer: 'spoken', arrangeWords: ['내일', '봐요'], cardLabel: 'see-you' },
  { id: 'today-busy', korean: '오늘은 바빠요', meaning: 'I am busy today.', hint: 'A real-life schedule phrase.', visual: 'calendar', speakAnswer: 'spoken', arrangeWords: ['오늘은', '바빠요'], cardLabel: 'busy' },
  { id: 'call-me', korean: '저에게 연락해 주세요', meaning: 'Please contact me.', hint: 'Useful for follow-up messages.', visual: 'phone', speakAnswer: 'spoken', arrangeWords: ['저에게', '연락해', '주세요'], cardLabel: 'contact' },
  { id: 'please-call-again', korean: '다시 전화해 주세요', meaning: 'Please call again.', hint: 'Another polite request line.', visual: 'phone', speakAnswer: 'spoken', arrangeWords: ['다시', '전화해', '주세요'], cardLabel: 'call' },
  { id: 'i-am-hungry', korean: '저는 배고파요', meaning: 'I am hungry.', hint: 'A very useful real-life expression.', visual: 'rice', speakAnswer: 'spoken', arrangeWords: ['저는', '배고파요'], cardLabel: 'hungry' },
  { id: 'i-am-thirsty', korean: '저는 목말라요', meaning: 'I am thirsty.', hint: 'A survival expression.', visual: 'water', speakAnswer: 'spoken', arrangeWords: ['저는', '목말라요'], cardLabel: 'thirsty' },
  { id: 'please-repeat-slowly', korean: '천천히 다시 말해 주세요', meaning: 'Please say it again slowly.', hint: 'Mixes two polite request patterns.', visual: 'repeat', speakAnswer: 'spoken', arrangeWords: ['천천히', '다시', '말해', '주세요'], cardLabel: 'repeat' },
  { id: 'i-live-seoul', korean: '서울에 살아요', meaning: 'I live in Seoul.', hint: 'A location sentence for introductions.', visual: 'map', speakAnswer: 'spoken', arrangeWords: ['서울에', '살아요'], cardLabel: 'seoul' },
  { id: 'please-show-me', korean: '보여 주세요', meaning: 'Please show me.', hint: 'Useful in shops and classes.', visual: 'camera', speakAnswer: 'spoken', arrangeWords: ['보여', '주세요'], cardLabel: 'show' },
  { id: 'what-is-your-name', korean: '이름이 뭐예요?', meaning: 'What is your name?', hint: 'A basic conversation question.', visual: 'badge', speakAnswer: 'spoken', arrangeWords: ['이름이', '뭐예요'], cardLabel: 'name' },
  { id: 'i-come-from-india', korean: '인도에서 왔어요', meaning: 'I came from India.', hint: 'A simple origin sentence.', visual: 'flag', speakAnswer: 'spoken', arrangeWords: ['인도에서', '왔어요'], cardLabel: 'india' },
  { id: 'nice-weather', korean: '날씨가 좋아요', meaning: 'The weather is nice.', hint: 'A daily conversation sentence.', visual: 'sun', speakAnswer: 'spoken', arrangeWords: ['날씨가', '좋아요'], cardLabel: 'weather' },
];

const classItems: BaseItem[] = [
  { id: 'hangul', korean: '한글', meaning: 'Hangul script', hint: 'The core writing system of Korean.', visual: 'book', cardLabel: 'hangul' },
  { id: 'vowels', korean: '모음', meaning: 'Vowels', hint: 'Building blocks for reading Korean syllables.', visual: 'spark', cardLabel: 'vowels' },
  { id: 'consonants', korean: '자음', meaning: 'Consonants', hint: 'Needed to form Korean syllable blocks.', visual: 'spark', cardLabel: 'consonants' },
  { id: 'polite-ending', korean: '요체', meaning: 'Polite ending', hint: 'Used in beginner class speech.', visual: 'heart', cardLabel: 'polite' },
  { id: 'subject-marker', korean: '이/가', meaning: 'Subject marker', hint: 'A common grammar point in class books.', visual: 'badge', cardLabel: 'grammar' },
  { id: 'topic-marker', korean: '은/는', meaning: 'Topic marker', hint: 'A key introductory grammar point.', visual: 'badge', cardLabel: 'grammar' },
  { id: 'object-marker', korean: '을/를', meaning: 'Object marker', hint: 'Marks the object of a sentence.', visual: 'badge', cardLabel: 'grammar' },
  { id: 'present-tense', korean: '현재형', meaning: 'Present tense', hint: 'Useful for daily routines and study notes.', visual: 'clock', cardLabel: 'tense' },
  { id: 'past-tense', korean: '과거형', meaning: 'Past tense', hint: 'Helps tell class stories and homework answers.', visual: 'clock', cardLabel: 'tense' },
  { id: 'future-tense', korean: '미래형', meaning: 'Future tense', hint: 'Used for plans and intentions.', visual: 'calendar', cardLabel: 'tense' },
  { id: 'numbers', korean: '숫자', meaning: 'Numbers', hint: 'A class chapter must-have.', visual: 'coin', cardLabel: 'numbers' },
  { id: 'time', korean: '시간 표현', meaning: 'Time expressions', hint: 'Used for class schedules and practice.', visual: 'clock', cardLabel: 'time' },
  { id: 'days', korean: '요일', meaning: 'Days of the week', hint: 'A planning and timetable topic.', visual: 'calendar', cardLabel: 'days' },
  { id: 'family-class', korean: '가족 표현', meaning: 'Family expressions', hint: 'Common in self-introduction units.', visual: 'family', cardLabel: 'family' },
  { id: 'food-class', korean: '음식 표현', meaning: 'Food expressions', hint: 'Used in beginner chapter drills.', visual: 'rice', cardLabel: 'food' },
  { id: 'travel-class', korean: '여행 표현', meaning: 'Travel expressions', hint: 'A practical classroom unit.', visual: 'map', cardLabel: 'travel' },
  { id: 'shopping-class', korean: '쇼핑 표현', meaning: 'Shopping expressions', hint: 'Useful for role-play and quizzes.', visual: 'basket', cardLabel: 'shopping' },
  { id: 'classroom', korean: '교실 표현', meaning: 'Classroom expressions', hint: 'Teacher and student language.', visual: 'book', cardLabel: 'classroom' },
  { id: 'reading', korean: '읽기', meaning: 'Reading', hint: 'A skill focus in book-based lessons.', visual: 'book', cardLabel: 'reading' },
  { id: 'writing', korean: '쓰기', meaning: 'Writing', hint: 'Helps with worksheets and homework.', visual: 'pen', cardLabel: 'writing' },
  { id: 'listening', korean: '듣기', meaning: 'Listening', hint: 'Used for class audio drills.', visual: 'ear', cardLabel: 'listening' },
  { id: 'speaking-class', korean: '말하기', meaning: 'Speaking', hint: 'The conversation practice block.', visual: 'mic', cardLabel: 'speaking' },
  { id: 'review', korean: '복습', meaning: 'Review', hint: 'The book chapter that keeps you sharp.', visual: 'repeat', cardLabel: 'review' },
  { id: 'quiz', korean: '퀴즈', meaning: 'Quiz', hint: 'A short check before moving ahead.', visual: 'spark', cardLabel: 'quiz' },
  { id: 'certificate', korean: '수료', meaning: 'Completion', hint: 'Marks progress in a class program.', visual: 'badge', cardLabel: 'completion' },
];

const beginnerPool = standardPool(beginnerItems, 'beginner', 'beginner-core', 8);
const vocabularyPool = standardPool(vocabularyItems, 'vocabulary', 'vocabulary-core', 7);
const speakingPoolItems = speakingPool(speakingItems, 'speaking', 'speaking-core', 10);
const classPool = standardPool(classItems, 'class', 'class-core', 9);

const tracks: LearningTrackConfig[] = [
  {
    slug: 'beginner-korean',
    title: 'Beginner Korean Learning',
    eyebrow: 'Hangul starter path',
    intro: 'Start from zero with Hangul, greetings, numbers, and survival phrases. Every login gets a fresh 10-question session drawn from a 100+ item bank.',
    accent: '#19c37d',
    rewardPoints: 60,
    bankSize: beginnerPool.length,
    stepSize: 10,
    overview: ['Read Hangul basics', 'Use polite greetings', 'Practice survival phrases', 'Earn beginner points'],
    loginCopy: ['Adaptive question order per login', '10-question session from 100+ content items', 'Points only after login', 'Guest mode shows only the learning preview'],
    questionPool: beginnerPool,
  },
  {
    slug: 'vocabulary-streaks',
    title: 'Korean Vocabulary Streaks',
    eyebrow: 'Daily word retention',
    intro: 'Practice themed Korean words every day. The bank includes 100+ vocabulary questions and rotates by session seed so each login feels different.',
    accent: '#1cb0f6',
    rewardPoints: 45,
    bankSize: vocabularyPool.length,
    stepSize: 10,
    overview: ['Theme-based word recall', 'Daily review loops', 'K-Food and travel vocabulary', 'Streak-driven progress'],
    loginCopy: ['100+ vocabulary questions', 'Fresh shuffle per login', 'Points for accuracy and completion', 'Locked preview for guests'],
    questionPool: vocabularyPool,
  },
  {
    slug: 'speaking-practice',
    title: 'Korean Speaking Practice',
    eyebrow: 'Pronunciation and conversation',
    intro: 'Practice spoken prompts, shadowing, and sentence building. This bank includes 150+ questions for repeatable conversation drills.',
    accent: '#ce82ff',
    rewardPoints: 70,
    bankSize: speakingPoolItems.length,
    stepSize: 10,
    overview: ['Shadowing drills', 'Polite conversation patterns', 'Sentence building', 'Higher speaking points'],
    loginCopy: ['150+ speaking questions', 'Session order changes on login', 'All progress is points-based', 'Preview mode only before authentication'],
    questionPool: speakingPoolItems,
  },
  {
    slug: 'class-content',
    title: 'Korean Class Content',
    eyebrow: 'Structured course library',
    intro: 'Book-style class content with grammar, reading, writing, listening, and review blocks. The pool includes 100+ original study questions inspired by beginner course structure.',
    accent: '#ff9600',
    rewardPoints: 65,
    bankSize: classPool.length,
    stepSize: 10,
    overview: ['Grammar and reading blocks', 'Worksheet-style practice', 'Classroom language', 'Quiz and review points'],
    loginCopy: ['100+ class content questions', 'Fresh session per login', 'Book-style lessons without copying book text', 'Guest users see only the overview'],
    questionPool: classPool,
  },
];

export const getTrackBySlug = (slug: string) => tracks.find((track) => track.slug === slug);

export const getSessionQuestions = (track: LearningTrackConfig, sessionSeed: string, limit = 10) =>
  shuffleSeeded(track.questionPool, `${track.slug}:${sessionSeed}`).slice(0, limit);

export const learningTracks = tracks;
