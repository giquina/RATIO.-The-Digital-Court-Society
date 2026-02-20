import { create } from "zustand";

type ContributionCategory =
  | "debate_participation"
  | "motion_proposals"
  | "judicial_submissions"
  | "governance_voting"
  | "peer_citations"
  | "constructive_moderation"
  | "moot_completion"
  | "law_book_contribution"
  | "law_book_review";

interface ContributionEntry {
  category: ContributionCategory;
  points: number;
  description: string;
  date: string;
}

type GovernanceTier = "Member" | "Accredited" | "Voting" | "Constitutional" | "Judicial";

interface ContributionState {
  // Contribution tracking
  contributions: ContributionEntry[];
  totalPoints: number;
  tier: GovernanceTier;

  // Points per category
  categoryPoints: Record<ContributionCategory, number>;

  // Actions — will be replaced with Convex when backend connected
  addContribution: (category: ContributionCategory, points: number, description: string) => void;
  getTier: () => GovernanceTier;
  getCategoryBreakdown: () => Array<{ category: string; points: number; percentage: number }>;
}

const POINT_VALUES: Record<ContributionCategory, number> = {
  debate_participation: 5,
  motion_proposals: 15,
  judicial_submissions: 10,
  governance_voting: 2,
  peer_citations: 1,
  constructive_moderation: 8,
  moot_completion: 10,
  law_book_contribution: 10,
  law_book_review: 3,
};

function calculateTier(points: number): GovernanceTier {
  if (points >= 200) return "Judicial";
  if (points >= 150) return "Constitutional";
  if (points >= 75) return "Voting";
  if (points >= 25) return "Accredited";
  return "Member";
}

// Demo seed data
const DEMO_CONTRIBUTIONS: ContributionEntry[] = [
  { category: "moot_completion", points: 10, description: "Completed: R v Adams [2024]", date: "2026-02-18" },
  { category: "moot_completion", points: 10, description: "Completed: Contract Dispute Mock", date: "2026-02-15" },
  { category: "governance_voting", points: 2, description: "Voted on Motion #12", date: "2026-02-14" },
  { category: "peer_citations", points: 1, description: "Cited by Sarah K.", date: "2026-02-13" },
  { category: "debate_participation", points: 5, description: "Parliamentary Debate: AI in Law", date: "2026-02-10" },
];

const DEMO_TOTAL = DEMO_CONTRIBUTIONS.reduce((sum, c) => sum + c.points, 0);

export const useContributionStore = create<ContributionState>((set, get) => ({
  contributions: DEMO_CONTRIBUTIONS,
  totalPoints: DEMO_TOTAL,
  tier: calculateTier(DEMO_TOTAL),

  categoryPoints: {
    debate_participation: 5,
    motion_proposals: 0,
    judicial_submissions: 0,
    governance_voting: 2,
    peer_citations: 1,
    constructive_moderation: 0,
    moot_completion: 20,
    law_book_contribution: 0,
    law_book_review: 0,
  },

  addContribution: (category, points, description) => {
    const state = get();
    const entry: ContributionEntry = {
      category,
      points,
      description,
      date: new Date().toISOString().split("T")[0],
    };
    const newTotal = state.totalPoints + points;
    set({
      contributions: [entry, ...state.contributions],
      totalPoints: newTotal,
      tier: calculateTier(newTotal),
      categoryPoints: {
        ...state.categoryPoints,
        [category]: (state.categoryPoints[category] ?? 0) + points,
      },
    });
    // TODO: Replace with Convex mutation
  },

  getTier: () => get().tier,

  getCategoryBreakdown: () => {
    const state = get();
    const total = state.totalPoints || 1;
    return Object.entries(state.categoryPoints)
      .filter(([, points]) => points > 0)
      .map(([category, points]) => ({
        category: category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        points,
        percentage: Math.round((points / total) * 100),
      }))
      .sort((a, b) => b.points - a.points);
  },
}));

export { POINT_VALUES, calculateTier };
export type { GovernanceTier, ContributionCategory };
