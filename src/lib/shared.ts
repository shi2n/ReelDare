// Shared client-safe types + label metadata (no server imports here)

export interface ExperienceDTO {
  id: number;
  title: string;
  description: string;
  category: string;
  mood: string;
  difficulty: number;
  budget: number;
  time: string;
  energy: string;
  location: string;
  social: string;
  safety: string;
  reel: number;
  completions: number;
  tags: string;
}

export type CategoryKey =
  | "travel"
  | "physical"
  | "create"
  | "fun"
  | "crazy"
  | "growth"
  | "family"
  | "kindness"
  | "money"
  | "spiritual"
  | "weird"
  | "shameful_acts"
  | "public_acts";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  tagline: string;
  color: string; // accent
  bg: string; // soft tint
  examples: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "travel",
    label: "Travel & Adventure",
    tagline: "Go somewhere that rearranges you",
    color: "#3f7fbf",
    bg: "#eaf2fb",
    examples: [
      "Travel alone to a city you've never visited",
      "Take a train to a random destination",
      "Sleep under the stars",
      "Watch the sunrise somewhere new",
    ],
  },
  {
    key: "physical",
    label: "Physical Challenges",
    tagline: "Prove something to your body",
    color: "#d05b3a",
    bg: "#fdf0ec",
    examples: [
      "Run a half marathon",
      "Walk 30,000 steps in one day",
      "Learn swimming, finally",
      "Complete a 30-day fitness challenge",
    ],
  },
  {
    key: "create",
    label: "Create Something",
    tagline: "Make the thing only you can make",
    color: "#8b5fbf",
    bg: "#f4effb",
    examples: [
      "Make a short film this weekend",
      "Write a song about your city",
      "Paint something and hang it",
      "Make your first Reel",
    ],
  },
  {
    key: "fun",
    label: "Random & Fun",
    tagline: "Zero reason. Pure joy.",
    color: "#d4a843",
    bg: "#faf3e3",
    examples: [
      "Eat breakfast for dinner",
      "Wear something ridiculous for one day",
      "Order something you've never eaten",
      "Let a friend choose your entire day",
    ],
  },
  {
    key: "crazy",
    label: "Crazy & Uncomfortable",
    tagline: "Comfort zones are overrated",
    color: "#c94f7c",
    bg: "#fceef3",
    examples: [
      "Talk to 10 strangers in one day",
      "Perform something on a stage",
      "Spend a whole day without social media",
      "Try the thing you've been scared to try",
    ],
  },
  {
    key: "growth",
    label: "Personal Growth",
    tagline: "One percent better, on purpose",
    color: "#3f9e6d",
    bg: "#ebf6f0",
    examples: [
      "Learn a new language for 30 days",
      "Read 10 books this year",
      "Spend 24 hours without your phone",
      "Take a public-speaking class",
    ],
  },
  {
    key: "family",
    label: "Family & Meaning",
    tagline: "The memories that matter most",
    color: "#e08a3c",
    bg: "#fcf3e9",
    examples: [
      "Take your parents on a trip",
      "Interview your grandparents",
      "Recreate an old family photo",
      "Record your parents' life stories",
    ],
  },
  {
    key: "kindness",
    label: "Kindness & Giving",
    tagline: "Leave people better than you found them",
    color: "#c2453e",
    bg: "#fdeeed",
    examples: [
      "Feed 100 people",
      "Pay for a stranger's meal",
      "Volunteer for a full day",
      "Perform 10 anonymous acts of kindness",
    ],
  },
  {
    key: "money",
    label: "Money & Business",
    tagline: "Build something that earns",
    color: "#2e7d5b",
    bg: "#e9f4ef",
    examples: [
      "Make your first ₹1,000 online",
      "Launch a tiny product",
      "Sell something you created",
      "Interview an entrepreneur",
    ],
  },
  {
    key: "spiritual",
    label: "Spiritual & Quiet",
    tagline: "Slow down to hear your own life",
    color: "#6b6fc0",
    bg: "#eef0fa",
    examples: [
      "Spend a day in silence",
      "Write everything you're grateful for",
      "Write a letter to your future self",
      "Volunteer anonymously",
    ],
  },
  {
    key: "weird",
    label: "Truly Weird",
    tagline: "Why would you do that? Exactly.",
    color: "#7f9c3a",
    bg: "#f2f6e6",
    examples: [
      "Eat only foods of one colour for a day",
      "Create a fake museum in your room",
      "Have a conversation using only questions",
      "Name a day after yourself",
    ],
  },
  {
    key: "shameful_acts",
    label: "😳 Shameful Acts",
    tagline: "Can You Handle the Embarrassment?",
    color: "#a855f7",
    bg: "#f3e8ff",
    examples: [
      "Give a 30s Oscar acceptance speech to your bathroom mirror",
      "Read your grocery list like an emotional breakup letter",
      "Perform your worst dance move and proudly give it a name",
      "Narrate your morning routine like a David Attenborough nature documentary",
    ],
  },
  {
    key: "public_acts",
    label: "🔥 Public Acts",
    tagline: "Do It in Public. If You Dare.",
    color: "#f97316",
    bg: "#ffedd5",
    examples: [
      "Stand in a park and deliver a 30s motivational speech to friends",
      "Give a genuine, respectful compliment to 3 people on their style",
      "Film a cinematic luxury product review for a common banana in a park",
      "Synchronize an epic goofy walk across an open square with friends",
    ],
  },
];

export const BUDGET_LABELS = [
  { value: 0, label: "₹0", hint: "Free" },
  { value: 1, label: "Under ₹500", hint: "Low" },
  { value: 2, label: "Under ₹1,000", hint: "Mid" },
  { value: 3, label: "Under ₹5,000", hint: "High" },
  { value: 4, label: "₹10,000+", hint: "Big" },
];

export const TIME_LABELS: Record<string, string> = {
  "10min": "10 minutes",
  "30min": "30 minutes",
  "1hour": "1 hour",
  "3hours": "3 hours",
  halfday: "Half day",
  day: "Full day",
  weekend: "Weekend",
  multi: "Multiple days",
};

export const MOOD_LABELS: Record<string, string> = {
  bored: "Bored",
  fun: "Fun",
  crazy: "Crazy",
  growth: "Growth",
  meaningful: "Meaningful",
  adventure: "Adventure",
  create: "Creative",
  kindness: "Kindness",
};

export const ENERGY_LABELS: Record<string, string> = {
  lazy: "Lazy",
  low: "Low energy",
  normal: "Normal",
  active: "Active",
  extreme: "Extreme",
};

export const SOCIAL_LABELS: Record<string, string> = {
  alone: "Alone",
  one: "With one person",
  friends: "Friends",
  family: "Family",
  strangers: "Strangers",
  any: "Any",
};

export const LOCATION_LABELS: Record<string, string> = {
  home: "At home",
  outdoor: "Outdoors",
  city: "In your city",
  anywhere: "Anywhere",
  travel: "Travel needed",
};

export function categoryMeta(key: string): CategoryMeta {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

export function budgetLabel(b: number): string {
  return BUDGET_LABELS[Math.min(Math.max(b, 0), 4)].label;
}

export function timeLabel(t: string): string {
  return TIME_LABELS[t] ?? "1 hour";
}

/**
 * Calculates dynamic XP based on difficulty (1-5) and duration.
 * Quick/easy tasks award 80-120 XP, while deep/intense weekend quests award 250-400 XP.
 */
export function calculateTaskXP(difficulty: number = 1, time: string = "1hour"): number {
  // Difficulty multiplier: diff 1 -> 50, diff 2 -> 80, diff 3 -> 120, diff 4 -> 170, diff 5 -> 240
  const difficultyBase: Record<number, number> = {
    1: 50,
    2: 80,
    3: 120,
    4: 170,
    5: 240,
  };
  const base = difficultyBase[Math.min(Math.max(difficulty, 1), 5)] ?? 80;

  // Time weight
  const timeBonus: Record<string, number> = {
    "10min": 30,
    "15min": 35,
    "30min": 45,
    "45min": 55,
    "1hour": 70,
    "2hours": 90,
    "3hours": 110,
    halfday: 130,
    day: 160,
    weekend: 220,
    multi: 280,
  };
  const bonus = timeBonus[time] ?? 70;

  // Return clean round figure
  return base + bonus;
}

// Slot-machine ticker titles for the spin animation (mirrors real DB content)
export const SPIN_TITLES = [
  "Sleep under the stars",
  "Talk to 10 strangers",
  "Take a train to a random destination",
  "Make your first Reel",
  "Feed 100 people",
  "Watch the sunrise somewhere new",
  "Write a letter to your future self",
  "Eat breakfast for dinner",
  "Run a half marathon",
  "Recreate an old family photo",
  "Learn a magic trick in 30 minutes",
  "Spend a day in silence",
  "Create a fake museum in your room",
  "Order something you've never eaten",
  "Pay for a stranger's meal",
  "Walk 30,000 steps in one day",
  "Visit the weirdest shop in your city",
  "Cook a dish from scratch",
  "Have a conversation using only questions",
  "Learn 10 words in another language",
  "Paint something and hang it up",
  "Go somewhere alone",
  "Take your parents on a trip",
  "Spend 24 hours without your phone",
  "Make something from things at home",
  "Try a sport you've never played",
  "Name a day after yourself",
  "Sit outside and watch the world",
  "Start a tiny business from zero",
  "Read a whole book in one day",
];

export interface RankTier {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  color: string;
  badge: string;
  perk: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    level: 1,
    name: "Novice Dreamer",
    minXp: 0,
    maxXp: 300,
    color: "#94a3b8",
    badge: "🧭",
    perk: "Unlocked Wish Engine & Local Saving",
  },
  {
    level: 2,
    name: "Curious Wanderer",
    minXp: 300,
    maxXp: 700,
    color: "#10b981",
    badge: "🌿",
    perk: "Personal Bucket List & Custom Wishes",
  },
  {
    level: 3,
    name: "Pathfinder",
    minXp: 700,
    maxXp: 1400,
    color: "#3b82f6",
    badge: "⚡",
    perk: "Reel Mode Storyboards & Shot Lists",
  },
  {
    level: 4,
    name: "Fearless Nomad",
    minXp: 1400,
    maxXp: 2500,
    color: "#8b5cf6",
    badge: "🔥",
    perk: "Community Hall of Fame & Verified Badge",
  },
  {
    level: 5,
    name: "Memory Architect",
    minXp: 2500,
    maxXp: 4000,
    color: "#f43f5e",
    badge: "👑",
    perk: "VIP Status & Priority Challenge Voting",
  },
  {
    level: 6,
    name: "Legendary Soul",
    minXp: 4000,
    maxXp: 10000,
    color: "#d4a843",
    badge: "⭐",
    perk: "Eternal Legend status on Global Leaderboard",
  },
];

export function getRankForXp(xp: number): RankTier {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (xp >= RANK_TIERS[i].minXp) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  socialLink: string;
  avatar: string;
  xp: number;
  level: number;
  rankName: string;
  completedTasks: number;
  isCurrentUser?: boolean;
}

export const COMMUNITY_LEADERBOARD: Omit<LeaderboardEntry, "rank">[] = [
  {
    username: "wanderlust_aarav",
    socialLink: "https://instagram.com/aarav_travels",
    avatar: "https://images.pexels.com/photos/34207481/pexels-photo-34207481.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
    xp: 3850,
    level: 5,
    rankName: "Memory Architect",
    completedTasks: 34,
  },
  {
    username: "meera_experiments",
    socialLink: "https://instagram.com/meera_cooks",
    avatar: "https://images.pexels.com/photos/8902226/pexels-photo-8902226.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
    xp: 2950,
    level: 5,
    rankName: "Memory Architect",
    completedTasks: 27,
  },
  {
    username: "dinesh_frontrow",
    socialLink: "https://x.com/dinesh_live",
    avatar: "https://images.pexels.com/photos/2990835/pexels-photo-2990835.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
    xp: 2180,
    level: 4,
    rankName: "Fearless Nomad",
    completedTasks: 19,
  },
  {
    username: "sara_ooty",
    socialLink: "https://instagram.com/sara_horizons",
    avatar: "https://images.pexels.com/photos/30271173/pexels-photo-30271173.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
    xp: 1640,
    level: 4,
    rankName: "Fearless Nomad",
    completedTasks: 15,
  },
  {
    username: "kabir_midnight",
    socialLink: "https://tiktok.com/@kabir_shots",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
    xp: 980,
    level: 3,
    rankName: "Pathfinder",
    completedTasks: 9,
  },
  {
    username: "ananya_skies",
    socialLink: "https://instagram.com/ananya_creates",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
    xp: 520,
    level: 2,
    rankName: "Curious Wanderer",
    completedTasks: 5,
  },
];
