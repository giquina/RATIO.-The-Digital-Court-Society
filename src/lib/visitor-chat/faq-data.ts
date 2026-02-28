/**
 * FAQ knowledge base for The Usher visitor chat.
 *
 * Static Q&A pairs extracted from FAQSection.tsx plus visitor-specific extras.
 * The `matchFAQ()` function uses keyword scoring to find the best match.
 */

type FAQEntry = {
  keywords: string[];
  question: string;
  answer: string;
  category: "general" | "pricing" | "features" | "technical" | "legal";
};

const FAQ_ENTRIES: FAQEntry[] = [
  // ── From FAQSection.tsx ──
  {
    keywords: ["what", "ratio", "about", "platform", "is"],
    question: "What is RATIO?",
    answer:
      "RATIO is a digital court society built for the UK legal community. It combines AI-powered advocacy training, live video mooting, legal research, moot organisation, competitive tournaments, a peer-reviewed law book, democratic governance, and a national inter-university league. It serves law students and legal professionals alike.",
    category: "general",
  },
  {
    keywords: ["free", "cost", "price", "pay", "money", "expensive", "cheap"],
    question: "Is RATIO free?",
    answer:
      "Yes! The core platform is free forever for students. This includes live video mooting, unlimited moot organisation, the Legal Research Engine, Parliament voting rights, Chamber membership, and 3 AI Judge sessions per month. Premium plans start at \u00a35.99/mo for students and \u00a314.99/mo for professionals, unlocking unlimited AI sessions, advanced tools, and certificates.",
    category: "pricing",
  },
  {
    keywords: ["who", "join", "eligible", "student", "professional", "lawyer", "barrister", "solicitor"],
    question: "Who can join?",
    answer:
      "RATIO is open to the entire UK legal community. Law students at any UK university (LLB, GDL, LPC, BPC, LLM) can join for free. Legal professionals including barristers, solicitors, solicitor advocates, pupillage applicants, and paralegals can join on a Professional plan. During onboarding you select whether you\u2019re a student or professional.",
    category: "general",
  },
  {
    keywords: ["video", "moot", "mooting", "live", "courtroom", "session"],
    question: "How does live video mooting work?",
    answer:
      "Sessions take place in virtual courtrooms with live video and audio. You join a lobby, enter through a formal courtroom entrance, then present submissions with timed speaking slots. Judges preside, counsel take turns, and clerks manage procedure. After the session, you receive AI-generated feedback on your performance.",
    category: "features",
  },
  {
    keywords: ["ai", "judge", "artificial", "intelligence", "practice", "training"],
    question: "How does the AI Judge work?",
    answer:
      "The AI Judge simulates a High Court judge hearing oral submissions. You present your argument, and the AI intervenes with questions, challenges your reasoning, and tests your knowledge. After each session, you receive a detailed scorecard across 7 dimensions: argument structure, use of authorities, oral delivery, judicial handling, court manner, persuasiveness, and time management.",
    category: "features",
  },
  {
    keywords: ["research", "engine", "case", "law", "statute", "legislation", "search"],
    question: "What is the Legal Research Engine?",
    answer:
      "The Research Engine lets you search every UK statute and court judgment in one place. It draws from official sources including legislation.gov.uk and the National Archives. Results include OSCOLA-formatted citations, and you can filter by court hierarchy, year range, judge, or party name.",
    category: "features",
  },
  {
    keywords: ["parliament", "tribunal", "governance", "vote", "motion", "democracy"],
    question: "What are Parliament and Tribunal?",
    answer:
      "Parliament is the democratic governance system. Any verified Advocate can propose motions, debate policy, and vote. The Tribunal handles disputes through a judicial process: file a case, serve notice, exchange submissions, attend a hearing, and receive a binding judgment from elected judicial Advocates.",
    category: "features",
  },
  {
    keywords: ["chamber", "chambers", "inn", "house", "team", "gray", "lincoln", "inner", "middle"],
    question: "What is a Chamber?",
    answer:
      "Chambers are the four houses of RATIO, modelled on the Inns of Court: Gray\u2019s, Lincoln\u2019s, Inner, and Middle. When you join, you select a Chamber. It\u2019s your team for national rankings, inter-university competition, and tournaments. Every moot and score contributes to your Chamber\u2019s standing.",
    category: "features",
  },
  {
    keywords: ["tournament", "competition", "bracket", "elimination", "round"],
    question: "How do tournaments work?",
    answer:
      "Mooting societies and Advocates can create structured tournaments with single elimination or round-robin formats. Participants are matched, results tracked through live brackets, and winners advance. Inter-university tournaments let Chambers compete across the country, feeding into the national league table.",
    category: "features",
  },
  {
    keywords: ["data", "privacy", "security", "gdpr", "information", "safe"],
    question: "How is my data handled?",
    answer:
      "Your data is yours. We store only what\u2019s necessary: profile information, session records, and scores. We don\u2019t sell data to third parties. AI sessions are processed securely and not used to train external models. You can export or delete your data at any time. Full details are in our Privacy Policy.",
    category: "legal",
  },
  {
    keywords: ["certificate", "certificates", "qualification", "credential", "verify"],
    question: "What are RATIO Certificates?",
    answer:
      "RATIO offers three levels of verified advocacy certificates \u2014 Foundation, Intermediate, and Advanced \u2014 earned by completing AI Judge sessions, group moots, and hitting scoring thresholds. Each includes a skills breakdown, is signed by the Founder, and comes with a QR code for employer verification. Free for subscribers, or one-time purchase for free-tier users.",
    category: "features",
  },
  {
    keywords: ["ambassador", "programme", "campus", "represent", "university", "apply"],
    question: "How does the Ambassador Programme work?",
    answer:
      "The Ambassador Programme invites moot society leaders and advocacy enthusiasts at UK universities to represent RATIO on campus. Ambassadors receive free Premium+ access, all certificates, a personalised letter of recommendation, and are featured on the website. Visit the Ambassadors page to apply.",
    category: "general",
  },

  // ── Visitor-specific extras ──
  {
    keywords: ["sign", "up", "register", "create", "account", "start", "get", "started", "begin"],
    question: "How do I sign up?",
    answer:
      "Signing up takes less than a minute! Click the \u201cJoin Free\u201d button, create your account, select whether you\u2019re a student or professional, choose your university and Chamber, and you\u2019re in. The core platform is completely free for students.",
    category: "general",
  },
  {
    keywords: ["app", "mobile", "phone", "ios", "android", "download", "install"],
    question: "Is there a mobile app?",
    answer:
      "RATIO works as a Progressive Web App (PWA), which means you can add it to your home screen on any phone or tablet and it works just like a native app \u2014 no app store download needed. Just visit the site in your browser, tap \u201cAdd to Home Screen\u201d, and you\u2019re set.",
    category: "technical",
  },
  {
    keywords: ["try", "before", "demo", "test", "preview", "trial"],
    question: "Can I try it before signing up?",
    answer:
      "Absolutely! The free tier gives you full access to live mooting, the Legal Research Engine, Parliament, Chambers, and 3 AI Judge sessions per month \u2014 no credit card required. Premium features include a free trial so you can test everything before committing.",
    category: "pricing",
  },
  {
    keywords: ["difference", "plan", "plans", "premium", "compare", "tier", "tiers", "subscription"],
    question: "What\u2019s the difference between plans?",
    answer:
      "Free: Core mooting, research, governance, 3 AI sessions/month. Premium (\u00a35.99/mo): Unlimited AI, Case Brief Generator, Argument Builder, tournaments, analytics, certificates. Premium+ (\u00a37.99/mo): Everything plus SQE2 prep, timed assessments, personalised learning paths. Professional (\u00a314.99/mo): All features for practising lawyers, no university needed.",
    category: "pricing",
  },
  {
    keywords: ["university", "universities", "school", "uni", "supported", "which", "available"],
    question: "What universities are supported?",
    answer:
      "RATIO supports all UK universities. During onboarding you select your institution from a comprehensive list covering every university offering law programmes in the UK. If your university isn\u2019t listed, just let us know and we\u2019ll add it.",
    category: "general",
  },
  {
    keywords: ["sqe", "sqe2", "solicitor", "qualifying", "exam", "preparation"],
    question: "Does RATIO help with SQE2 preparation?",
    answer:
      "Yes! The Premium+ plan (\u00a37.99/mo) includes dedicated SQE2 preparation: timed advocacy assessments matching the SQE2 format, SRA competency scoring, mock oral examination mode, and personalised learning paths. It\u2019s designed to give you a competitive edge in the oral advocacy station.",
    category: "features",
  },
];

export type FAQMatch = {
  question: string;
  answer: string;
  score: number;
};

/**
 * Match a visitor's input against the FAQ knowledge base.
 *
 * Uses keyword scoring with page-context boosting.
 * Returns the best match if score >= threshold, otherwise null.
 */
export function matchFAQ(
  input: string,
  pageContext?: string,
): FAQMatch | null {
  const tokens = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 1);

  if (tokens.length === 0) return null;

  let bestMatch: FAQMatch | null = null;
  let bestScore = 0;

  // Determine page category boost
  const pageLower = (pageContext ?? "").toLowerCase();
  const pageCategory: string | null = pageLower.includes("pricing")
    ? "pricing"
    : pageLower.includes("feature")
      ? "features"
      : null;

  for (const entry of FAQ_ENTRIES) {
    let score = 0;

    // Count keyword matches
    for (const token of tokens) {
      if (entry.keywords.some((kw) => kw.includes(token) || token.includes(kw))) {
        score += 1;
      }
    }

    // Bonus for page-context relevance
    if (pageCategory && entry.category === pageCategory) {
      score += 0.5;
    }

    // Bonus for exact phrase match in question
    if (entry.question.toLowerCase().includes(input.toLowerCase().trim())) {
      score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = {
        question: entry.question,
        answer: entry.answer,
        score,
      };
    }
  }

  // Threshold: need at least 2 keyword matches to be confident
  return bestScore >= 2 ? bestMatch : null;
}
