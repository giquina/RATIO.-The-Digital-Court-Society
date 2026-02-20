// ── Chambers ──
export const CHAMBERS = [
  { name: "Gray's", color: "#6B2D3E", motto: "Wisdom through advocacy", icon: "⚖️" },
  { name: "Lincoln's", color: "#2E5090", motto: "Justice through scholarship", icon: "📘" },
  { name: "Inner", color: "#3D6B45", motto: "Service through practice", icon: "🌿" },
  { name: "Middle", color: "#8B6914", motto: "Excellence through tradition", icon: "🏛️" },
] as const;

export const CHAMBER_COLORS: Record<string, string> = {
  "Gray's": "#6B2D3E",
  "Lincoln's": "#2E5090",
  Inner: "#3D6B45",
  Middle: "#8B6914",
};

// ── Ranks (ascending order) ──
export const RANKS = [
  { name: "Pupil", minMoots: 0, minPoints: 0 },
  { name: "Junior Counsel", minMoots: 5, minPoints: 100 },
  { name: "Senior Counsel", minMoots: 20, minPoints: 500 },
  { name: "King's Counsel", minMoots: 50, minPoints: 1500 },
  { name: "Bencher", minMoots: 100, minPoints: 5000 },
] as const;

// ── Session Types ──
export const SESSION_TYPES = [
  { value: "moot", label: "Moot", icon: "Scale" },
  { value: "mock_trial", label: "Mock Trial", icon: "Landmark" },
  { value: "sqe2_prep", label: "SQE2 Prep", icon: "Target" },
  { value: "debate", label: "Debate", icon: "Mic" },
  { value: "workshop", label: "Workshop", icon: "PenLine" },
] as const;

// ── Default Role Templates ──
export const MOOT_ROLES = [
  "Presiding Judge",
  "Leading Counsel (Appellant)",
  "Junior Counsel (Appellant)",
  "Leading Counsel (Respondent)",
  "Junior Counsel (Respondent)",
  "Clerk",
];

export const MOCK_TRIAL_ROLES = [
  "Judge",
  "Prosecution Counsel",
  "Defence Counsel",
  "Witness 1",
  "Witness 2",
  "Clerk",
];

// ── Law Modules (common UK LLB) ──
export const LAW_MODULES = [
  "Contract Law",
  "Tort Law",
  "Public Law",
  "Criminal Law",
  "EU Law",
  "Land Law",
  "Equity & Trusts",
  "Human Rights",
  "Commercial Law",
  "Company Law",
  "Family Law",
  "Employment Law",
  "International Law",
  "Evidence",
  "Jurisprudence",
  "Dispute Resolution",
] as const;

// ── UK Universities (pilot + expansion) ──
export const UNIVERSITIES = [
  { name: "University College London", short: "UCL", city: "London" },
  { name: "King's College London", short: "KCL", city: "London" },
  { name: "London School of Economics", short: "LSE", city: "London" },
  { name: "University of Oxford", short: "Oxford", city: "Oxford" },
  { name: "University of Cambridge", short: "Cambridge", city: "Cambridge" },
  { name: "University of Bristol", short: "Bristol", city: "Bristol" },
  { name: "University of Manchester", short: "Manchester", city: "Manchester" },
  { name: "University of Birmingham", short: "Birmingham", city: "Birmingham" },
  { name: "University of Edinburgh", short: "Edinburgh", city: "Edinburgh" },
  { name: "University of Leeds", short: "Leeds", city: "Leeds" },
  { name: "University of Exeter", short: "Exeter", city: "Exeter" },
  { name: "University of Warwick", short: "Warwick", city: "Coventry" },
  { name: "University of Nottingham", short: "Nottingham", city: "Nottingham" },
  { name: "Durham University", short: "Durham", city: "Durham" },
  { name: "Queen Mary University of London", short: "QMUL", city: "London" },
  { name: "SOAS University of London", short: "SOAS", city: "London" },
  { name: "City, University of London", short: "City", city: "London" },
  { name: "University of Sheffield", short: "Sheffield", city: "Sheffield" },
  { name: "University of Glasgow", short: "Glasgow", city: "Glasgow" },
  { name: "Cardiff University", short: "Cardiff", city: "Cardiff" },
] as const;

// ── Feedback Dimensions ──
export const FEEDBACK_DIMENSIONS = [
  { key: "argumentStructure", label: "Argument Structure (IRAC)", icon: "Target" },
  { key: "useOfAuthorities", label: "Use of Authorities", icon: "Book" },
  { key: "oralDelivery", label: "Oral Delivery & Clarity", icon: "Mic" },
  { key: "judicialHandling", label: "Response to Interventions", icon: "Scale" },
  { key: "courtManner", label: "Court Manner & Etiquette", icon: "GraduationCap" },
  { key: "persuasiveness", label: "Persuasiveness", icon: "Lightbulb" },
  { key: "timeManagement", label: "Time Management", icon: "Timer" },
] as const;

// ── Badge Definitions ──
export const BADGE_DEFINITIONS = [
  { name: "First Moot", icon: "Scale", category: "moots", requirement: { type: "moots_completed", threshold: 1 } },
  { name: "Regular Advocate", icon: "FileText", category: "moots", requirement: { type: "moots_completed", threshold: 5 } },
  { name: "Seasoned Counsel", icon: "Landmark", category: "moots", requirement: { type: "moots_completed", threshold: 20 } },
  { name: "7-Day Streak", icon: "Flame", category: "streak", requirement: { type: "streak_days", threshold: 7 } },
  { name: "30-Day Streak", icon: "Flame", category: "streak", requirement: { type: "streak_days", threshold: 30 } },
  { name: "100-Day Streak", icon: "Trophy", category: "streak", requirement: { type: "streak_days", threshold: 100 } },
  { name: "First Commendation", icon: "Star", category: "community", requirement: { type: "commendations_received", threshold: 1 } },
  { name: "Respected Advocate", icon: "Star", category: "community", requirement: { type: "commendations_received", threshold: 50 } },
  { name: "AI Sparring Partner", icon: "Bot", category: "skill", requirement: { type: "ai_sessions", threshold: 5 } },
  { name: "50 Followers", icon: "Users", category: "community", requirement: { type: "followers", threshold: 50 } },
] as const;

// ── AI Personas ──
export const AI_PERSONAS = {
  judge: {
    name: "The Honourable Justice AI",
    subtitle: "High Court Judge",
    icon: "Scale",
    color: "#C9A84C",
    gradient: ["#2C1810", "#4A2C20"],
  },
  mentor: {
    name: "Senior Counsel AI",
    subtitle: "Chambers Mentor",
    icon: "BookOpen",
    color: "#4A8FE7",
    gradient: ["#1A2744", "#2E5090"],
  },
  examiner: {
    name: "SQE2 Examiner AI",
    subtitle: "Assessment Panel",
    icon: "Target",
    color: "#6B2D3E",
    gradient: ["#3D1A2A", "#6B2D3E"],
  },
  opponent: {
    name: "Opposing Counsel AI",
    subtitle: "Adversary",
    icon: "Mic",
    color: "#4CAF50",
    gradient: ["#1A3D2A", "#3D6B45"],
  },
} as const;
