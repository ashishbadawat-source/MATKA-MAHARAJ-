export type MarketStatus = 'upcoming' | 'open_declared' | 'closed';

export interface ChartRecord {
  date: string;       // YYYY-MM-DD
  day: string;        // Mon, Tue, etc.
  openPana: string;   // e.g. "389"
  jodi: string;       // e.g. "08"
  closePana: string;  // e.g. "369"
}

export interface MatkaMarket {
  id: string;
  name: string;
  hindiName?: string;
  openTime: string;   // e.g. "03:45 PM"
  closeTime: string;  // e.g. "05:45 PM"
  days: string[];     // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  openPana: string;   // "389" or "***"
  jodi: string;       // "08" or "**" or "0*"
  closePana: string;  // "369" or "***"
  status: MarketStatus;
  isPopular?: boolean;
  isCustom?: boolean;
  lastUpdated: string;
  autoUpdateEnabled?: boolean;
  chartHistory: ChartRecord[];
}

export interface UserGuess {
  id: string;
  gameId: string;
  gameName: string;
  type: 'single' | 'jodi' | 'patti';
  number: string;
  points: number;
  date: string;
  status: 'pending' | 'won' | 'lost';
  payout?: number;
}

export interface UserProfile {
  name: string;
  phone: string;
  avatar: string;
  balance: number;
  soundEnabled: boolean;
  favoriteMarketIds: string[];
  luckyNumbers: {
    single: string[];
    jodi: string[];
    patti: string[];
  };
  guesses: UserGuess[];
}

export interface GuessPost {
  id: string;
  author: string;
  badge?: string;
  marketName: string;
  otc: string[];      // Open To Close single numbers
  jodi: string[];     // Jodis
  patti: string[];    // Patti/Panas
  date: string;
  likes: number;
  liked?: boolean;
}
