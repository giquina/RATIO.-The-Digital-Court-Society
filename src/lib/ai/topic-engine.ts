// ── AI Topic Engine ──
// Generates intelligent, academically sound debate suggestions for each law module.
// In demo mode, serves pre-generated seed suggestions.
// In production, supplements with AI-generated + editorially curated topics.

// ── Types ──

export type TopicType =
  | "formal_motion"
  | "case_analysis"
  | "reform_discussion"
  | "ethical_hypothetical";

export type Difficulty = "foundation" | "intermediate" | "advanced";

export interface TopicSuggestion {
  id: string;
  moduleSlug: string;
  type: TopicType;
  title: string;
  description: string;
  references: string[];
  difficulty: Difficulty;
  tags: string[];
  weekGenerated?: string; // ISO week for rotation tracking
}

export interface DiscussionPrompt {
  id: string;
  moduleSlug: string;
  question: string;
  context: string;
  difficulty: Difficulty;
}

export interface CaseSpotlightData {
  id: string;
  moduleSlug: string;
  caseName: string;
  citation: string;
  year: number;
  court: string;
  summary: string;
  significance: string;
  tags: string[];
}

// ── Topic type metadata ──

export const TOPIC_TYPE_META: Record<TopicType, { label: string; color: string; icon: string }> = {
  formal_motion: { label: "Formal Motion", color: "gold", icon: "Scale" },
  case_analysis: { label: "Case Analysis", color: "blue", icon: "Search" },
  reform_discussion: { label: "Reform Discussion", color: "green", icon: "TrendingUp" },
  ethical_hypothetical: { label: "Ethical Hypothetical", color: "burgundy", icon: "Shield" },
};

// ── Seed suggestions (used in demo mode + initial content) ──

export const SEED_SUGGESTIONS: TopicSuggestion[] = [
  // ── Contract Law ──
  {
    id: "contract-1",
    moduleSlug: "contract",
    type: "formal_motion",
    title: "This House believes that the doctrine of consideration should be abolished in English law",
    description: "Examine whether the requirement of consideration serves any modern purpose or merely creates technical barriers to enforceable agreements.",
    references: ["Williams v Roffey Bros [1991] 1 QB 1", "Stilk v Myrick (1809) 2 Camp 317", "Law Revision Committee, Sixth Interim Report (1937)"],
    difficulty: "intermediate",
    tags: ["consideration", "formation", "reform"],
  },
  {
    id: "contract-2",
    moduleSlug: "contract",
    type: "case_analysis",
    title: "Analyse the impact of MWB Business Exchange v Rock Advertising on variation clauses",
    description: "Consider whether the Supreme Court's approach to no oral modification clauses strikes the right balance between commercial certainty and party autonomy.",
    references: ["MWB Business Exchange v Rock Advertising [2018] UKSC 24", "Globe Motors v TRW Lucas [2016] EWCA Civ 396"],
    difficulty: "advanced",
    tags: ["variation", "commercial certainty", "party autonomy"],
  },
  {
    id: "contract-3",
    moduleSlug: "contract",
    type: "reform_discussion",
    title: "Should English law introduce a general duty of good faith in contractual performance?",
    description: "Many civil law systems impose good faith obligations. Consider whether Leggatt J's approach in Yam Seng should be extended.",
    references: ["Yam Seng Pte Ltd v ITC [2013] EWHC 111 (QB)", "Bates v Post Office [2019] EWHC 606 (QB)"],
    difficulty: "advanced",
    tags: ["good faith", "relational contracts", "comparative law"],
  },
  {
    id: "contract-4",
    moduleSlug: "contract",
    type: "ethical_hypothetical",
    title: "A firm discovers a clerical error gave it a contract worth ten times the agreed value. Must it disclose?",
    description: "Explore the intersection of unilateral mistake, unconscionability, and professional ethics when one party knows of the other's error.",
    references: ["Hartog v Colin & Shields [1939] 3 All ER 566", "Smith v Hughes (1871) LR 6 QB 597"],
    difficulty: "foundation",
    tags: ["mistake", "ethics", "disclosure"],
  },

  // ── Criminal Law ──
  {
    id: "criminal-1",
    moduleSlug: "criminal",
    type: "formal_motion",
    title: "This House believes that the law on self-defence is too generous to the householder",
    description: "Evaluate whether s.76 Criminal Justice and Immigration Act 2008, as amended by s.43 Crime and Courts Act 2013, achieves the right balance.",
    references: ["R v Martin [2001] EWCA Crim 2245", "Criminal Justice and Immigration Act 2008, s.76"],
    difficulty: "intermediate",
    tags: ["self-defence", "householder", "reasonable force"],
  },
  {
    id: "criminal-2",
    moduleSlug: "criminal",
    type: "case_analysis",
    title: "Evaluate the Supreme Court's reasoning in R v Jogee on joint enterprise",
    description: "Assess whether the correction of the law on parasitic accessory liability has improved justice or created uncertainty.",
    references: ["R v Jogee [2016] UKSC 8", "R v Powell; R v English [1999] 1 AC 1", "Chan Wing-Siu v R [1985] AC 168"],
    difficulty: "advanced",
    tags: ["joint enterprise", "accessory liability", "mens rea"],
  },
  {
    id: "criminal-3",
    moduleSlug: "criminal",
    type: "reform_discussion",
    title: "Should the offence of murder be reformed to include degrees of culpability?",
    description: "The Law Commission's 2006 report proposed a three-tier structure for homicide. Consider whether the mandatory life sentence remains appropriate.",
    references: ["Law Commission, Murder, Manslaughter and Infanticide (2006) No 304", "R v Woollin [1999] 1 AC 82"],
    difficulty: "intermediate",
    tags: ["murder", "sentencing", "mandatory sentence", "reform"],
  },
  {
    id: "criminal-4",
    moduleSlug: "criminal",
    type: "ethical_hypothetical",
    title: "A doctor administers pain relief knowing it will hasten death. Should the law distinguish motive from intention?",
    description: "Explore the doctrine of double effect and its application to end-of-life care in criminal law.",
    references: ["R v Adams [1957] Crim LR 365", "R v Cox (1992) 12 BMLR 38", "Airedale NHS Trust v Bland [1993] AC 789"],
    difficulty: "intermediate",
    tags: ["intention", "double effect", "euthanasia", "ethics"],
  },

  // ── Tort Law ──
  {
    id: "tort-1",
    moduleSlug: "tort",
    type: "formal_motion",
    title: "This House believes that Caparo v Dickman imposes an unjustifiably restrictive test for duty of care",
    description: "Consider whether the three-stage test adequately balances claimant protection with limiting indeterminate liability.",
    references: ["Caparo Industries plc v Dickman [1990] 2 AC 605", "Robinson v Chief Constable [2018] UKSC 4"],
    difficulty: "intermediate",
    tags: ["duty of care", "negligence", "proximity"],
  },
  {
    id: "tort-2",
    moduleSlug: "tort",
    type: "case_analysis",
    title: "Assess the significance of Robinson v Chief Constable for the development of duty of care",
    description: "Analyse the Supreme Court's retreat from the Caparo test to an incremental, precedent-based approach.",
    references: ["Robinson v Chief Constable [2018] UKSC 4", "Michael v Chief Constable of South Wales [2015] UKSC 2"],
    difficulty: "advanced",
    tags: ["duty of care", "police", "incrementalism"],
  },
  {
    id: "tort-3",
    moduleSlug: "tort",
    type: "reform_discussion",
    title: "Should England adopt a general privacy tort?",
    description: "Compare the piecemeal development through misuse of private information with a codified right to privacy.",
    references: ["Campbell v MGN [2004] UKHL 22", "PJS v News Group [2016] UKSC 26"],
    difficulty: "advanced",
    tags: ["privacy", "human rights", "media law"],
  },

  // ── Public Law ──
  {
    id: "public-1",
    moduleSlug: "public",
    type: "formal_motion",
    title: "This House believes that the UK needs a codified constitution",
    description: "Evaluate the merits and risks of codification for parliamentary sovereignty, constitutional flexibility, and rights protection.",
    references: ["A.V. Dicey, Introduction to the Study of the Law of the Constitution (1885)", "House of Lords Constitution Committee, Reviewing the Constitution (2001)"],
    difficulty: "foundation",
    tags: ["constitution", "parliamentary sovereignty", "codification"],
  },
  {
    id: "public-2",
    moduleSlug: "public",
    type: "case_analysis",
    title: "Evaluate R (Miller) v Secretary of State for the impact on parliamentary sovereignty",
    description: "Assess both Miller I (Article 50) and Miller/Cherry (prorogation) for their constitutional significance.",
    references: ["R (Miller) v Secretary of State [2017] UKSC 5", "R (Miller) v The Prime Minister [2019] UKSC 41"],
    difficulty: "intermediate",
    tags: ["prerogative", "parliament", "prorogation"],
  },
  {
    id: "public-3",
    moduleSlug: "public",
    type: "ethical_hypothetical",
    title: "A government minister bypasses parliamentary approval to deploy troops. Where does accountability lie?",
    description: "Explore the boundaries of the royal prerogative in the context of military action and democratic accountability.",
    references: ["GCHQ case [1985] AC 374", "War Powers Convention"],
    difficulty: "intermediate",
    tags: ["prerogative", "accountability", "military action"],
  },

  // ── Equity & Trusts ──
  {
    id: "equity-1",
    moduleSlug: "equity-trusts",
    type: "formal_motion",
    title: "This House believes that the rule in Re Diplock is an unjust restriction on restitutionary claims",
    description: "Examine whether the personal equitable claim for recovery of mistaken payments should survive modern unjust enrichment principles.",
    references: ["Ministry of Health v Simpson [1951] AC 251", "Lipkin Gorman v Karpnale [1991] 2 AC 548"],
    difficulty: "advanced",
    tags: ["restitution", "equitable claims", "tracing"],
  },
  {
    id: "equity-2",
    moduleSlug: "equity-trusts",
    type: "case_analysis",
    title: "Assess the impact of Jones v Kernott on common intention constructive trusts",
    description: "Consider whether the Supreme Court's approach provides sufficient certainty for cohabiting couples.",
    references: ["Jones v Kernott [2011] UKSC 53", "Stack v Dowden [2007] UKHL 17"],
    difficulty: "intermediate",
    tags: ["constructive trusts", "cohabitation", "common intention"],
  },

  // ── Human Rights ──
  {
    id: "hr-1",
    moduleSlug: "human-rights",
    type: "formal_motion",
    title: "This House believes that the Human Rights Act 1998 should be replaced with a British Bill of Rights",
    description: "Evaluate whether a domestic Bill of Rights would better protect rights while restoring parliamentary sovereignty.",
    references: ["Human Rights Act 1998", "Independent Human Rights Act Review (2021)", "Rights Brought Home: The Human Rights Bill (1997) Cm 3782"],
    difficulty: "intermediate",
    tags: ["HRA", "Bill of Rights", "sovereignty"],
  },
  {
    id: "hr-2",
    moduleSlug: "human-rights",
    type: "reform_discussion",
    title: "Should the UK withdraw from the European Convention on Human Rights?",
    description: "Assess the legal and political implications of withdrawal for rights protection and international standing.",
    references: ["ECHR, Protocol 15", "Human Rights Act 1998, s.2"],
    difficulty: "foundation",
    tags: ["ECHR", "withdrawal", "international obligations"],
  },

  // ── Land Law ──
  {
    id: "land-1",
    moduleSlug: "land",
    type: "formal_motion",
    title: "This House believes that adverse possession is an unjust means of acquiring title to land",
    description: "Evaluate whether the Land Registration Act 2002 reforms struck the right balance between registered title and long possession.",
    references: ["Land Registration Act 2002, Sch 6", "Pye v Graham [2002] UKHL 30", "JA Pye (Oxford) v UK (2007) ECHR"],
    difficulty: "intermediate",
    tags: ["adverse possession", "registration", "property rights"],
  },

  // ── EU Law ──
  {
    id: "eu-1",
    moduleSlug: "eu",
    type: "formal_motion",
    title: "This House believes retained EU law adequately protects workers' rights post-Brexit",
    description: "Assess whether the Retained EU Law (Revocation and Reform) Act 2023 provides sufficient legal certainty.",
    references: ["Retained EU Law (Revocation and Reform) Act 2023", "European Union (Withdrawal) Act 2018"],
    difficulty: "intermediate",
    tags: ["retained EU law", "Brexit", "workers' rights"],
  },

  // ── Commercial Law ──
  {
    id: "commercial-1",
    moduleSlug: "commercial",
    type: "case_analysis",
    title: "Analyse the scope of the implied term of satisfactory quality under s.14 Sale of Goods Act 1979",
    description: "Consider whether the statutory framework adequately addresses digital goods and modern commercial transactions.",
    references: ["Sale of Goods Act 1979, s.14", "Consumer Rights Act 2015, s.9-11", "Jewson Ltd v Boyhan [2003] EWCA Civ 1030"],
    difficulty: "intermediate",
    tags: ["sale of goods", "satisfactory quality", "consumer rights"],
  },

  // ── Company Law ──
  {
    id: "company-1",
    moduleSlug: "company",
    type: "formal_motion",
    title: "This House believes that the separate legal personality of companies should be pierced more readily",
    description: "Evaluate the post-Prest approach to veil piercing and whether it adequately addresses corporate abuse.",
    references: ["Salomon v A Salomon & Co [1897] AC 22", "Prest v Petrodel [2013] UKSC 34"],
    difficulty: "intermediate",
    tags: ["veil piercing", "separate personality", "corporate abuse"],
  },

  // ── Family Law ──
  {
    id: "family-1",
    moduleSlug: "family",
    type: "reform_discussion",
    title: "Has the Divorce, Dissolution and Separation Act 2020 achieved its objectives?",
    description: "Assess whether no-fault divorce has reduced conflict and improved outcomes for families.",
    references: ["Divorce, Dissolution and Separation Act 2020", "Owens v Owens [2018] UKSC 41"],
    difficulty: "foundation",
    tags: ["divorce", "no-fault", "family reform"],
  },

  // ── Employment Law ──
  {
    id: "employment-1",
    moduleSlug: "employment",
    type: "case_analysis",
    title: "Evaluate the Supreme Court's approach to worker status in Uber v Aslam",
    description: "Consider the implications for the gig economy and whether the current tripartite classification remains fit for purpose.",
    references: ["Uber BV v Aslam [2021] UKSC 5", "Autoclenz v Belcher [2011] UKSC 41"],
    difficulty: "intermediate",
    tags: ["worker status", "gig economy", "employment rights"],
  },

  // ── International Law ──
  {
    id: "international-1",
    moduleSlug: "international",
    type: "ethical_hypothetical",
    title: "A state invokes self-defence to conduct a cyber-attack on another state's infrastructure. Is this lawful?",
    description: "Explore the application of Article 51 UN Charter and the Tallinn Manual principles to cyber operations.",
    references: ["UN Charter, Art 51", "Tallinn Manual 2.0 on the International Law Applicable to Cyber Operations (2017)"],
    difficulty: "advanced",
    tags: ["cyber warfare", "self-defence", "use of force"],
  },

  // ── Evidence ──
  {
    id: "evidence-1",
    moduleSlug: "evidence",
    type: "formal_motion",
    title: "This House believes that the hearsay rule in criminal proceedings is too complex and should be simplified",
    description: "Evaluate whether the Criminal Justice Act 2003 reforms achieved the Law Commission's objectives.",
    references: ["Criminal Justice Act 2003, ss.114-136", "Law Commission, Evidence in Criminal Proceedings: Hearsay and Related Topics (1997) No 245"],
    difficulty: "intermediate",
    tags: ["hearsay", "criminal evidence", "reform"],
  },

  // ── Jurisprudence ──
  {
    id: "jurisprudence-1",
    moduleSlug: "jurisprudence",
    type: "formal_motion",
    title: "This House believes that law and morality are inseparable",
    description: "Engage with the Hart-Fuller debate and its modern implications for the relationship between positive law and moral standards.",
    references: ["H.L.A. Hart, The Concept of Law (1961)", "Lon Fuller, The Morality of Law (1964)", "Hart-Fuller Debate, 71 Harv L Rev (1958)"],
    difficulty: "foundation",
    tags: ["positivism", "natural law", "Hart-Fuller debate"],
  },

  // ── Dispute Resolution ──
  {
    id: "adr-1",
    moduleSlug: "dispute-resolution",
    type: "reform_discussion",
    title: "Should mediation be mandatory before litigation in civil disputes?",
    description: "Assess the court's approach to costs sanctions for unreasonable refusal to mediate and proposals for compulsory ADR.",
    references: ["Halsey v Milton Keynes [2004] EWCA Civ 576", "Churchill v Merthyr Tydfil [2023] EWCA Civ 1416"],
    difficulty: "intermediate",
    tags: ["mediation", "access to justice", "costs"],
  },

  // ── Constitutional Law ──
  {
    id: "constitutional-1",
    moduleSlug: "constitutional",
    type: "formal_motion",
    title: "This House believes that the House of Lords should be replaced with an elected second chamber",
    description: "Evaluate whether an elected upper house would improve democratic legitimacy without undermining the primacy of the Commons.",
    references: ["Parliament Acts 1911 and 1949", "House of Lords Reform Bill 2012", "Wakeham Commission Report (2000)"],
    difficulty: "foundation",
    tags: ["Lords reform", "bicameralism", "democracy"],
  },
  {
    id: "constitutional-2",
    moduleSlug: "constitutional",
    type: "case_analysis",
    title: "Assess the constitutional significance of the Supreme Court's prorogation decision",
    description: "Evaluate whether R (Miller) v The Prime Minister represents judicial overreach or proper constitutional guardianship.",
    references: ["R (Miller) v The Prime Minister [2019] UKSC 41", "Entick v Carrington (1765) 19 St Tr 1029"],
    difficulty: "advanced",
    tags: ["prorogation", "rule of law", "judicial review"],
  },
];

// ── Discussion prompts (lower-friction engagement) ──

export const SEED_DISCUSSION_PROMPTS: DiscussionPrompt[] = [
  { id: "dp-contract-1", moduleSlug: "contract", question: "What is the strongest argument against enforcing penalty clauses?", context: "Consider Cavendish v Makdessi and the modern approach.", difficulty: "foundation" },
  { id: "dp-contract-2", moduleSlug: "contract", question: "Should promissory estoppel be a cause of action, not just a defence?", context: "Compare the position in English law with Australian developments.", difficulty: "intermediate" },
  { id: "dp-criminal-1", moduleSlug: "criminal", question: "Is the reasonable person test in loss of control truly objective?", context: "Consider whether qualifying triggers effectively replicate the old provocation defence.", difficulty: "intermediate" },
  { id: "dp-criminal-2", moduleSlug: "criminal", question: "How should the law treat defendants who make unreasonable mistakes about consent?", context: "Reflect on the Sexual Offences Act 2003, s.1(1)(c) and recent case law.", difficulty: "foundation" },
  { id: "dp-tort-1", moduleSlug: "tort", question: "Should pure economic loss ever be recoverable in negligence?", context: "Trace the development from Hedley Byrne through Murphy to Customs & Excise.", difficulty: "intermediate" },
  { id: "dp-tort-2", moduleSlug: "tort", question: "What makes a duty of care 'fair, just, and reasonable'?", context: "Consider whether this limb of Caparo is merely a policy disguise.", difficulty: "foundation" },
  { id: "dp-public-1", moduleSlug: "public", question: "Can parliamentary sovereignty survive a codified constitution?", context: "Consider the tension between entrenchment and the doctrine of implied repeal.", difficulty: "intermediate" },
  { id: "dp-public-2", moduleSlug: "public", question: "What are the limits of judicial review in a democracy?", context: "Reflect on the Supreme Court's approach in Privacy International and Miller.", difficulty: "advanced" },
  { id: "dp-equity-1", moduleSlug: "equity-trusts", question: "Should the beneficiary principle be relaxed for non-charitable purpose trusts?", context: "Consider Re Denley and the Quistclose trust.", difficulty: "intermediate" },
  { id: "dp-land-1", moduleSlug: "land", question: "Is the distinction between legal and equitable interests in land still useful?", context: "Consider registration and the impact of Williams & Glyn's Bank.", difficulty: "foundation" },
  { id: "dp-company-1", moduleSlug: "company", question: "Do directors' duties under the Companies Act 2006 adequately protect stakeholders?", context: "Consider s.172 and the 'enlightened shareholder value' approach.", difficulty: "intermediate" },
  { id: "dp-employment-1", moduleSlug: "employment", question: "Is the tripartite classification of worker/employee/self-employed still fit for purpose?", context: "Reflect on the gig economy cases and Taylor Review recommendations.", difficulty: "foundation" },
  { id: "dp-hr-1", moduleSlug: "human-rights", question: "When should absolute rights yield to competing public interests?", context: "Consider the distinction between absolute, limited, and qualified rights under the ECHR.", difficulty: "foundation" },
  { id: "dp-evidence-1", moduleSlug: "evidence", question: "Should defendants be permitted to cross-examine complainants in person?", context: "Consider the vulnerable witness provisions and the Domestic Abuse Act 2021.", difficulty: "intermediate" },
  { id: "dp-jurisprudence-1", moduleSlug: "jurisprudence", question: "Does Dworkin's 'right answer thesis' survive hard cases?", context: "Consider judicial disagreement as evidence for or against the thesis.", difficulty: "advanced" },
  { id: "dp-adr-1", moduleSlug: "dispute-resolution", question: "Is arbitration truly more efficient than litigation?", context: "Consider costs, duration, and the rise of emergency arbitrator provisions.", difficulty: "intermediate" },
  { id: "dp-constitutional-1", moduleSlug: "constitutional", question: "Should the UK adopt a written constitution?", context: "Consider the experiences of other common law jurisdictions.", difficulty: "foundation" },
  { id: "dp-eu-1", moduleSlug: "eu", question: "What has been the practical impact of retained EU law on UK courts?", context: "Consider the approach to interpreting pre-Brexit EU-derived legislation.", difficulty: "intermediate" },
  { id: "dp-family-1", moduleSlug: "family", question: "Is the welfare principle in s.1 Children Act 1989 sufficiently clear to guide judges?", context: "Consider the welfare checklist and judicial discretion.", difficulty: "foundation" },
  { id: "dp-international-1", moduleSlug: "international", question: "Can international law be enforced without a world government?", context: "Consider the ICJ, ICC, and mechanisms of state compliance.", difficulty: "foundation" },
];

// ── Case spotlights ──

export const SEED_CASE_SPOTLIGHTS: CaseSpotlightData[] = [
  { id: "cs-contract", moduleSlug: "contract", caseName: "Carlill v Carbolic Smoke Ball Co", citation: "[1893] 1 QB 256", year: 1893, court: "Court of Appeal", summary: "The court held that an advertisement offering a reward constituted a unilateral offer capable of acceptance by performance.", significance: "Established the enforceability of unilateral contracts and the principles governing advertisements as offers.", tags: ["offer", "unilateral contract", "formation"] },
  { id: "cs-criminal", moduleSlug: "criminal", caseName: "R v Woollin", citation: "[1999] 1 AC 82", year: 1999, court: "House of Lords", summary: "The House of Lords clarified that a jury may 'find' intention where death or serious injury was a virtual certainty of the defendant's actions.", significance: "Settled the direction on oblique intention, replacing earlier conflicting authorities.", tags: ["intention", "murder", "mens rea"] },
  { id: "cs-tort", moduleSlug: "tort", caseName: "Donoghue v Stevenson", citation: "[1932] AC 562", year: 1932, court: "House of Lords", summary: "Lord Atkin established the neighbour principle as the foundation of the modern duty of care in negligence.", significance: "Created the general tort of negligence and the concept of duty of care owed to those foreseeably affected.", tags: ["duty of care", "negligence", "neighbour principle"] },
  { id: "cs-public", moduleSlug: "public", caseName: "Entick v Carrington", citation: "(1765) 19 St Tr 1029", year: 1765, court: "Court of Common Pleas", summary: "Lord Camden held that the executive has no power to enter property or seize papers without clear legal authority.", significance: "A foundational case for the rule of law and the principle that executive power must have legal basis.", tags: ["rule of law", "executive power", "individual liberty"] },
  { id: "cs-equity", moduleSlug: "equity-trusts", caseName: "Keech v Sandford", citation: "(1726) Sel Cas Ch 61", year: 1726, court: "Court of Chancery", summary: "The Lord Chancellor held that a trustee who renewed a lease in his own name held it on trust for the beneficiary.", significance: "Established the strict no-profit rule for fiduciaries, a cornerstone of trust law.", tags: ["fiduciary duty", "no-profit rule", "trustee"] },
  { id: "cs-hr", moduleSlug: "human-rights", caseName: "Ghaidan v Godin-Mendoza", citation: "[2004] UKHL 30", year: 2004, court: "House of Lords", summary: "The House of Lords used s.3 HRA to read the Rent Act as applying to same-sex partners.", significance: "Demonstrated the transformative interpretive power of s.3 HRA 1998.", tags: ["s.3 HRA", "interpretation", "equality"] },
  { id: "cs-land", moduleSlug: "land", caseName: "Williams & Glyn's Bank v Boland", citation: "[1981] AC 487", year: 1981, court: "House of Lords", summary: "A beneficial interest coupled with actual occupation constituted an overriding interest binding on a purchaser.", significance: "Highlighted the tension between registration principle and protection of occupants' interests.", tags: ["overriding interests", "actual occupation", "registration"] },
  { id: "cs-company", moduleSlug: "company", caseName: "Salomon v A Salomon & Co", citation: "[1897] AC 22", year: 1897, court: "House of Lords", summary: "The House of Lords held that a properly incorporated company is a legal person distinct from its members.", significance: "The foundational case for the doctrine of separate legal personality in English company law.", tags: ["separate personality", "incorporation", "limited liability"] },
  { id: "cs-constitutional", moduleSlug: "constitutional", caseName: "R (Miller) v The Prime Minister", citation: "[2019] UKSC 41", year: 2019, court: "Supreme Court", summary: "An unanimous Supreme Court held that the Prime Minister's advice to prorogue Parliament was unlawful and void.", significance: "Established that prorogation is justiciable and that the executive cannot frustrate Parliament's constitutional functions.", tags: ["prorogation", "justiciability", "parliamentary sovereignty"] },
  { id: "cs-employment", moduleSlug: "employment", caseName: "Uber BV v Aslam", citation: "[2021] UKSC 5", year: 2021, court: "Supreme Court", summary: "The Supreme Court held that Uber drivers are workers entitled to minimum wage and holiday pay.", significance: "Landmark ruling on worker status in the gig economy with broad implications for platform-based work.", tags: ["worker status", "gig economy", "employment rights"] },
  { id: "cs-evidence", moduleSlug: "evidence", caseName: "Woolmington v DPP", citation: "[1935] AC 462", year: 1935, court: "House of Lords", summary: "Viscount Sankey LC established that the prosecution bears the burden of proving guilt beyond reasonable doubt.", significance: "The 'golden thread' of English criminal law — the presumption of innocence.", tags: ["burden of proof", "presumption of innocence", "golden thread"] },
  { id: "cs-family", moduleSlug: "family", caseName: "Gillick v West Norfolk AHA", citation: "[1986] AC 112", year: 1986, court: "House of Lords", summary: "The House of Lords held that children who demonstrate sufficient understanding can consent to medical treatment.", significance: "Established the concept of Gillick competence and children's evolving autonomy in law.", tags: ["children's rights", "Gillick competence", "consent"] },
];

// ── Engine functions ──

/** Get suggestions for a specific module, optionally filtered by type */
export function getSuggestionsForModule(
  moduleSlug: string,
  type?: TopicType,
): TopicSuggestion[] {
  let results = SEED_SUGGESTIONS.filter((s) => s.moduleSlug === moduleSlug);
  if (type) results = results.filter((s) => s.type === type);
  return results;
}

/** Get discussion prompts for a module */
export function getPromptsForModule(moduleSlug: string): DiscussionPrompt[] {
  return SEED_DISCUSSION_PROMPTS.filter((p) => p.moduleSlug === moduleSlug);
}

/** Get the case spotlight for a module */
export function getCaseSpotlight(moduleSlug: string): CaseSpotlightData | undefined {
  return SEED_CASE_SPOTLIGHTS.find((c) => c.moduleSlug === moduleSlug);
}

/** Get a random selection of suggestions across modules (for discovery) */
export function getRandomSuggestions(count: number = 5): TopicSuggestion[] {
  const shuffled = [...SEED_SUGGESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Structured debate template (pre-filled when creating from a suggestion) */
export interface DebateTemplate {
  title: string;
  background: string;
  legalIssue: string;
  argumentsFor: string;
  argumentsAgainst: string;
  closingPosition: string;
  module: string;
  references: string[];
}

/** Generate a debate template from a topic suggestion */
export function createDebateTemplate(suggestion: TopicSuggestion): DebateTemplate {
  return {
    title: suggestion.title,
    background: suggestion.description,
    legalIssue: "",
    argumentsFor: "",
    argumentsAgainst: "",
    closingPosition: "",
    module: suggestion.moduleSlug,
    references: suggestion.references,
  };
}
