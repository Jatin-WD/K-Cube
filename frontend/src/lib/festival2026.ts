export type FestivalStageStatus = 'completed' | 'upcoming' | 'main-festival';

export type FestivalStage = {
  id: 'india-pre-selection' | 'official-second-round' | 'main-festival';
  title: string;
  date: string;
  dateTime: string;
  location?: string;
  status: FestivalStageStatus;
  description: string;
};

export const festival2026 = {
  title: 'ITAEWON World Music Spirit Festival 2026',
  indiaPreSelection: {
    id: 'india-pre-selection',
    title: 'India Pre-Selection',
    date: 'August 30, 2026',
    dateTime: '2026-08-30',
    status: 'completed',
    description: 'The India pre-selection stage has been completed. Historical submissions remain available to the K-CUBE team.',
  } satisfies FestivalStage,
  officialSecondRound: {
    id: 'official-second-round',
    title: 'Official Second Round',
    date: 'September 30, 2026',
    dateTime: '2026-09-30',
    status: 'upcoming',
    description: 'The next official stage before the main festival.',
  } satisfies FestivalStage,
  mainFestival: {
    id: 'main-festival',
    title: 'ITAEWON World Music Spirit Festival',
    date: 'October 4-6, 2026',
    dateTime: '2026-10-04',
    location: 'Itaewon, Seoul, Korea',
    status: 'main-festival',
    description: 'The main festival program in Itaewon, Seoul.',
  } satisfies FestivalStage,
} as const;

export const festivalJourney: FestivalStage[] = [
  festival2026.indiaPreSelection,
  festival2026.officialSecondRound,
  festival2026.mainFestival,
];

export const festivalStatusLabel: Record<FestivalStageStatus, string> = {
  completed: 'Completed',
  upcoming: 'Upcoming',
  'main-festival': 'Main festival',
};
