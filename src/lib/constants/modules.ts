// ── Unified Module Registry ──
// Single source of truth for all law modules across Ratio.
// Replaces fragmented definitions in app.ts, law-book pages, and session creation.

export interface LawModule {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  color: string;
  gradient: [string, string];
  category: "core" | "professional" | "specialist" | "academic";
  topicCount: number;
}

export const MODULE_REGISTRY: LawModule[] = [
  // ── Core Qualifying Law Subjects ──
  {
    id: "contract",
    slug: "contract",
    title: "Contract Law",
    shortTitle: "Contract",
    icon: "FileText",
    description: "Formation, terms, vitiating factors, discharge, and remedies for breach of contract",
    color: "gold",
    gradient: ["#2C1810", "#4A2C20"],
    category: "core",
    topicCount: 12,
  },
  {
    id: "tort",
    slug: "tort",
    title: "Tort Law",
    shortTitle: "Tort",
    icon: "Shield",
    description: "Negligence, duty of care, occupiers' liability, nuisance, and defamation",
    color: "red",
    gradient: ["#2C1018", "#4A2030"],
    category: "core",
    topicCount: 10,
  },
  {
    id: "criminal",
    slug: "criminal",
    title: "Criminal Law",
    shortTitle: "Criminal",
    icon: "Gavel",
    description: "Offences against the person, property, defences, and principles of criminal liability",
    color: "burgundy",
    gradient: ["#3D1A2A", "#6B2D3E"],
    category: "core",
    topicCount: 14,
  },
  {
    id: "public",
    slug: "public",
    title: "Public Law",
    shortTitle: "Public",
    icon: "Landmark",
    description: "Constitutional principles, judicial review, separation of powers, and administrative law",
    color: "blue",
    gradient: ["#1A2744", "#2E5090"],
    category: "core",
    topicCount: 11,
  },
  {
    id: "eu",
    slug: "eu",
    title: "EU Law",
    shortTitle: "EU",
    icon: "Star",
    description: "Retained EU law, supremacy, direct effect, free movement, and post-Brexit implications",
    color: "blue",
    gradient: ["#1A2040", "#2A3870"],
    category: "core",
    topicCount: 8,
  },
  {
    id: "land",
    slug: "land",
    title: "Land Law",
    shortTitle: "Land",
    icon: "Landmark",
    description: "Estates, interests in land, registration, co-ownership, leases, and mortgages",
    color: "green",
    gradient: ["#1A2D1A", "#2D4A2D"],
    category: "core",
    topicCount: 10,
  },
  {
    id: "equity-trusts",
    slug: "equity-trusts",
    title: "Equity & Trusts",
    shortTitle: "Equity",
    icon: "Scale",
    description: "Express, resulting, and constructive trusts, fiduciary duties, and equitable remedies",
    color: "gold",
    gradient: ["#2A2010", "#4A3820"],
    category: "core",
    topicCount: 9,
  },

  // ── Professional / Practice-Oriented ──
  {
    id: "commercial",
    slug: "commercial",
    title: "Commercial Law",
    shortTitle: "Commercial",
    icon: "BarChart3",
    description: "Sale of goods, agency, insurance, negotiable instruments, and commercial transactions",
    color: "gold",
    gradient: ["#2C2010", "#4A3520"],
    category: "professional",
    topicCount: 8,
  },
  {
    id: "company",
    slug: "company",
    title: "Company Law",
    shortTitle: "Company",
    icon: "Users",
    description: "Corporate governance, directors' duties, shareholder rights, and insolvency",
    color: "blue",
    gradient: ["#1A2540", "#2A4070"],
    category: "professional",
    topicCount: 9,
  },
  {
    id: "employment",
    slug: "employment",
    title: "Employment Law",
    shortTitle: "Employment",
    icon: "Medal",
    description: "Employment contracts, unfair dismissal, discrimination, and collective labour law",
    color: "green",
    gradient: ["#1A2E20", "#2D4A30"],
    category: "professional",
    topicCount: 7,
  },
  {
    id: "family",
    slug: "family",
    title: "Family Law",
    shortTitle: "Family",
    icon: "Users",
    description: "Marriage, divorce, children, financial provision, and domestic abuse",
    color: "burgundy",
    gradient: ["#2E1A28", "#4A2D3E"],
    category: "professional",
    topicCount: 8,
  },
  {
    id: "evidence",
    slug: "evidence",
    title: "Evidence",
    shortTitle: "Evidence",
    icon: "Search",
    description: "Admissibility, burden of proof, hearsay, character evidence, and expert witnesses",
    color: "orange",
    gradient: ["#2C2010", "#4A3020"],
    category: "professional",
    topicCount: 7,
  },

  // ── Specialist ──
  {
    id: "human-rights",
    slug: "human-rights",
    title: "Human Rights",
    shortTitle: "Human Rights",
    icon: "Shield",
    description: "ECHR rights, HRA 1998, proportionality, margin of appreciation, and Bill of Rights debate",
    color: "green",
    gradient: ["#102A1A", "#204A30"],
    category: "specialist",
    topicCount: 8,
  },
  {
    id: "international",
    slug: "international",
    title: "International Law",
    shortTitle: "International",
    icon: "TrendingUp",
    description: "Sources, state responsibility, international organisations, use of force, and treaties",
    color: "blue",
    gradient: ["#101A30", "#203050"],
    category: "specialist",
    topicCount: 7,
  },
  {
    id: "constitutional",
    slug: "constitutional",
    title: "Constitutional Law",
    shortTitle: "Constitutional",
    icon: "BookOpen",
    description: "Parliamentary sovereignty, rule of law, royal prerogative, and devolution",
    color: "gold",
    gradient: ["#2A2010", "#4A3820"],
    category: "specialist",
    topicCount: 9,
  },
  {
    id: "dispute-resolution",
    slug: "dispute-resolution",
    title: "Dispute Resolution",
    shortTitle: "ADR",
    icon: "MessageCircle",
    description: "Mediation, arbitration, negotiation, litigation procedure, and access to justice",
    color: "green",
    gradient: ["#1A2D20", "#2D4A35"],
    category: "specialist",
    topicCount: 6,
  },

  // ── Academic / Theoretical ──
  {
    id: "jurisprudence",
    slug: "jurisprudence",
    title: "Jurisprudence",
    shortTitle: "Jurisprudence",
    icon: "BookOpen",
    description: "Natural law, positivism, legal realism, critical legal studies, and philosophy of law",
    color: "burgundy",
    gradient: ["#2A1520", "#4A2A38"],
    category: "academic",
    topicCount: 8,
  },
];

// ── Helpers ──

/** Backward-compatible flat string array (matches original LAW_MODULES) */
export const LAW_MODULE_TITLES = MODULE_REGISTRY.map((m) => m.title) as readonly string[];

/** Look up a module by its URL slug */
export function getModuleBySlug(slug: string): LawModule | undefined {
  return MODULE_REGISTRY.find((m) => m.slug === slug);
}

/** Look up a module by its display title (e.g., "Contract Law") */
export function getModuleByTitle(title: string): LawModule | undefined {
  return MODULE_REGISTRY.find((m) => m.title === title);
}

/** Get modules filtered by category */
export function getModulesByCategory(category: LawModule["category"]): LawModule[] {
  return MODULE_REGISTRY.filter((m) => m.category === category);
}

/** Get all unique categories in display order */
export const MODULE_CATEGORIES: { key: LawModule["category"]; label: string }[] = [
  { key: "core", label: "Core Qualifying Subjects" },
  { key: "professional", label: "Professional Practice" },
  { key: "specialist", label: "Specialist Areas" },
  { key: "academic", label: "Academic & Theoretical" },
];

/** Map a legacy display title to a module slug (for URL generation) */
export function titleToSlug(title: string): string {
  const mod = getModuleByTitle(title);
  if (mod) return mod.slug;
  // Fallback: generate slug from title
  return title.toLowerCase().replace(/[&]/g, "and").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
