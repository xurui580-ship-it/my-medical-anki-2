export interface User {
  id: string;
  username: string;
  passwordHash?: string; // Not used on client
  createdAt: string;
  lastLoginAt: string;
  todayStats: {
    learned: number;
    reviewed: number;
    dateISO: string;
  };
}

export interface Card {
  id: string;
  q: string;
  a: string;
  media?: string;
  isNew: boolean;
  ease: number;
  intervalDays: number;
  repetitions: number;
  dueAt: string;
  lastReviewedAt?: string;
  history: { rating: number; time: string }[];
}

export interface Deck {
  id: string;
  name: string;
  source: 'manual' | 'system' | 'doc';
  createdAt: string;
  dailyNewLearned: number;
  reviewModeToday: boolean;
  cards: Card[];
}

    