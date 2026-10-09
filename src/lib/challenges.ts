import shamefulData from "@/data/shameful-acts.json";
import publicData from "@/data/public-acts.json";

export interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  category: "shameful_acts" | "public_acts";
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  duration: string;
  embarrassment_level: number;
  social_intensity: number;
  location: "Home" | "Private" | "Public" | "Event" | "Online";
  requires_consent: boolean;
  requires_permission: boolean;
  safety_note: string;
  reel_potential: number;
  tags: string[];
}

export interface ChallengeFilters {
  difficulty?: string;
  location?: string;
  duration?: string;
  minReelPotential?: number;
  maxEmbarrassment?: number;
}

const SHAMEFUL_TASKS: ChallengeTask[] = shamefulData as ChallengeTask[];
const PUBLIC_TASKS: ChallengeTask[] = publicData as ChallengeTask[];

const TASK_MAP = new Map<string, ChallengeTask>();
[...SHAMEFUL_TASKS, ...PUBLIC_TASKS].forEach((t) => TASK_MAP.set(t.id, t));

export function getChallengesByCategory(
  category: "shameful_acts" | "public_acts"
): ChallengeTask[] {
  return category === "shameful_acts" ? SHAMEFUL_TASKS : PUBLIC_TASKS;
}

export function getChallengeById(id: string): ChallengeTask | undefined {
  return TASK_MAP.get(id);
}

export function getCategoryStats(category: "shameful_acts" | "public_acts") {
  const pool = getChallengesByCategory(category);
  const total = pool.length;

  const difficultyCounts = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Extreme: 0,
  };

  let totalEmbarrassment = 0;
  let totalSocial = 0;
  let totalReel = 0;

  for (const t of pool) {
    if (t.difficulty in difficultyCounts) {
      difficultyCounts[t.difficulty]++;
    }
    totalEmbarrassment += t.embarrassment_level;
    totalSocial += t.social_intensity;
    totalReel += t.reel_potential;
  }

  return {
    total,
    difficultyCounts,
    avgEmbarrassment: Number((totalEmbarrassment / total).toFixed(1)),
    avgSocialIntensity: Number((totalSocial / total).toFixed(1)),
    avgReelPotential: Number((totalReel / total).toFixed(1)),
  };
}

export function getRandomChallenge(
  category: "shameful_acts" | "public_acts",
  excludeIds: string[] = [],
  filters?: ChallengeFilters
): { challenge: ChallengeTask; remainingInPool: number; totalCategoryTasks: number } {
  const allCategoryTasks = getChallengesByCategory(category);
  const excludeSet = new Set(excludeIds);

  // Filter pool
  let eligible = allCategoryTasks.filter((task) => {
    if (excludeSet.has(task.id)) return false;

    if (filters?.difficulty && filters.difficulty !== "all") {
      if (task.difficulty.toLowerCase() !== filters.difficulty.toLowerCase()) return false;
    }

    if (filters?.location && filters.location !== "all") {
      if (task.location.toLowerCase() !== filters.location.toLowerCase()) return false;
    }

    if (filters?.minReelPotential && filters.minReelPotential > 0) {
      if (task.reel_potential < filters.minReelPotential) return false;
    }

    if (filters?.maxEmbarrassment && filters.maxEmbarrassment > 0) {
      if (task.embarrassment_level > filters.maxEmbarrassment) return false;
    }

    if (filters?.duration && filters.duration !== "all") {
      const dur = task.duration.toLowerCase();
      if (filters.duration === "quick" && !dur.includes("second") && !dur.includes("1 minute")) {
        return false;
      }
      if (filters.duration === "medium" && (!dur.includes("2 minute") && !dur.includes("3 minute") && !dur.includes("5 minute"))) {
        return false;
      }
      if (filters.duration === "long" && !dur.includes("10 minute") && !dur.includes("15 minute") && !dur.includes("20 minute") && !dur.includes("30 minute")) {
        return false;
      }
    }

    return true;
  });

  // If pool exhausted due to excludeIds, reset excludeIds for this filter
  if (eligible.length === 0) {
    eligible = allCategoryTasks.filter((task) => {
      if (filters?.difficulty && filters.difficulty !== "all") {
        if (task.difficulty.toLowerCase() !== filters.difficulty.toLowerCase()) return false;
      }
      if (filters?.location && filters.location !== "all") {
        if (task.location.toLowerCase() !== filters.location.toLowerCase()) return false;
      }
      if (filters?.minReelPotential && filters.minReelPotential > 0) {
        if (task.reel_potential < filters.minReelPotential) return false;
      }
      return true;
    });
  }

  // Fallback to full category if still empty
  if (eligible.length === 0) {
    eligible = allCategoryTasks;
  }

  const selected = eligible[Math.floor(Math.random() * eligible.length)];
  const remainingInPool = eligible.length - 1;

  return {
    challenge: selected,
    remainingInPool,
    totalCategoryTasks: allCategoryTasks.length,
  };
}
