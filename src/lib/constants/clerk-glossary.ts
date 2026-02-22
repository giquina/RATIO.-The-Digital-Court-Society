// ── The Clerk — Glossary Data ──
// Legal, platform, and governance terms used throughout Ratio.

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: "legal" | "platform" | "governance";
  relatedTerms?: string[];
}

// Sorted alphabetically by term
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Advocacy Dimensions",
    definition:
      "The seven criteria against which advocacy performance is assessed in Ratio: Argument Structure (IRAC), Use of Authorities, Oral Delivery and Clarity, Response to Judicial Interventions, Court Manner and Etiquette, Persuasiveness, and Time Management. Each dimension is scored from 0 to 100.",
    category: "platform",
    relatedTerms: ["Advocacy Score", "AI Judge"],
  },
  {
    term: "Advocacy Score",
    definition:
      "A numerical rating from 0 to 100 representing an advocate's overall performance. In Ratio, this is calculated as a weighted average across the seven advocacy dimensions, with more recent sessions carrying greater weight.",
    category: "platform",
    relatedTerms: ["Advocacy Dimensions", "National Rankings"],
  },
  {
    term: "Advocate",
    definition:
      "A registered member of Ratio. All participants on the platform are referred to as advocates, reflecting the professional identity of those who practice oral advocacy.",
    category: "platform",
    relatedTerms: ["Chamber", "Pupil", "Advocacy Score"],
  },
  {
    term: "AI Judge",
    definition:
      "An artificial intelligence system within Ratio that simulates a judicial officer during practice sessions. The AI Judge evaluates oral submissions in real-time, delivers interventions, and provides scored feedback across all seven advocacy dimensions.",
    category: "platform",
    relatedTerms: ["Advocacy Dimensions", "Session"],
  },
  {
    term: "Appellant",
    definition:
      "The party who brings an appeal against the decision of a lower court. In Ratio moot sessions, one team represents the appellant and argues that the lower court's decision should be overturned.",
    category: "legal",
    relatedTerms: ["Respondent", "Submission", "Moot"],
  },
  {
    term: "Bencher",
    definition:
      "The highest rank attainable on Ratio, awarded to advocates who have completed at least 100 sessions and accumulated 5,000 or more advocacy points. In the Inns of Court tradition, Benchers are the governing members of an Inn.",
    category: "platform",
    relatedTerms: ["King's Counsel", "Pupil"],
  },
  {
    term: "Bundle",
    definition:
      "A compiled set of documents prepared for a hearing, typically including the case materials, skeleton arguments, and relevant authorities. In Ratio, session creators can attach a bundle URL for participants to access preparation materials.",
    category: "legal",
    relatedTerms: ["Skeleton Argument", "Session"],
  },
  {
    term: "Chamber",
    definition:
      "One of the four houses within Ratio, modelled on the historic Inns of Court: Gray's Inn, Lincoln's Inn, Inner Temple, and Middle Temple. In Ratio, your chamber is your primary community. Chambers compete in inter-chamber rankings and events.",
    category: "platform",
    relatedTerms: ["Advocate", "National Rankings"],
  },
  {
    term: "Commendation",
    definition:
      "A peer endorsement given by one advocate to another after a session, recognising excellent advocacy. In Ratio, commendations contribute to advocacy points and influence national rankings.",
    category: "platform",
    relatedTerms: ["National Rankings", "Session"],
  },
  {
    term: "Court Clerk (role)",
    definition:
      "A session role in Ratio moots and mock trials. The Court Clerk is responsible for timekeeping, managing the order of proceedings, and ensuring administrative matters are handled properly during the session.",
    category: "legal",
    relatedTerms: ["Presiding Judge", "Session"],
  },
  {
    term: "Cross-examination",
    definition:
      "The questioning of a witness by the opposing party in a trial. In Ratio mock trial sessions, advocates practise cross-examination technique, testing their ability to challenge testimony effectively and within proper procedural bounds.",
    category: "legal",
    relatedTerms: ["Moot", "Session"],
  },
  {
    term: "IRAC",
    definition:
      "A structured legal reasoning framework standing for Issue, Rule, Application, Conclusion. In Ratio, IRAC is the foundational method for constructing arguments. Motions in Parliament and cases in the Tribunal also follow this structure.",
    category: "legal",
    relatedTerms: ["Submission", "Skeleton Argument", "Motion"],
  },
  {
    term: "Junior Counsel (rank)",
    definition:
      "The second rank in Ratio's progression system, achieved after completing 5 sessions and accumulating 100 advocacy points. Junior Counsel have demonstrated consistent engagement with the platform.",
    category: "platform",
    relatedTerms: ["Pupil", "Senior Counsel"],
  },
  {
    term: "Junior Counsel (role)",
    definition:
      "A session role in Ratio moot sessions. Junior Counsel supports the Lead Counsel by presenting a secondary ground of appeal. This role is well-suited to advocates building their confidence in oral advocacy.",
    category: "legal",
    relatedTerms: ["Lead Counsel", "Presiding Judge"],
  },
  {
    term: "King's Counsel",
    definition:
      "The fourth rank in Ratio's progression system, achieved after completing 50 sessions and accumulating 1,500 advocacy points. In the legal profession, King's Counsel (KC) is a mark of excellence in advocacy awarded by the Crown.",
    category: "platform",
    relatedTerms: ["Senior Counsel", "Bencher"],
  },
  {
    term: "Lead Counsel",
    definition:
      "A session role in Ratio moot sessions. Lead Counsel presents the primary ground of appeal for their side (appellant or respondent) and bears principal responsibility for the team's oral submissions before the judge.",
    category: "legal",
    relatedTerms: ["Junior Counsel (role)", "Presiding Judge"],
  },
  {
    term: "Moot",
    definition:
      "A simulated appellate court hearing in which advocates present oral arguments on a point of law before a judge. Mooting is the primary activity on Ratio and the traditional method of advocacy training in UK law schools.",
    category: "legal",
    relatedTerms: ["Appellant", "Respondent", "Session"],
  },
  {
    term: "Motion",
    definition:
      "A formal proposal submitted to Ratio's Parliament for debate and vote. In Ratio, motions follow the IRAC structure and must be seconded by another advocate before they can proceed to the debating and voting stages.",
    category: "governance",
    relatedTerms: ["Parliament", "Standing Orders"],
  },
  {
    term: "National Rankings",
    definition:
      "The platform-wide leaderboard in Ratio, ranking all advocates by cumulative advocacy points. Points are earned through session completion, score quality, streaks, and commendations. Rankings reset each academic year, with historical records preserved.",
    category: "platform",
    relatedTerms: ["Advocacy Score", "Streak"],
  },
  {
    term: "OSCOLA",
    definition:
      "The Oxford University Standard for the Citation of Legal Authorities, which is the predominant legal citation system in UK academia. In Ratio, all Law Book contributions and research citations use OSCOLA formatting.",
    category: "legal",
    relatedTerms: ["Bundle", "Skeleton Argument"],
  },
  {
    term: "Parliament",
    definition:
      "The legislative body within Ratio's governance structure. Parliament enables advocates to propose, debate, and vote on motions that shape platform policies, procedures, and standing orders. It mirrors the democratic processes of real parliamentary systems.",
    category: "governance",
    relatedTerms: ["Motion", "Standing Orders"],
  },
  {
    term: "Presiding Judge",
    definition:
      "A session role in Ratio moot sessions. The Presiding Judge oversees proceedings, asks interventions of counsel, manages court decorum, and delivers feedback or a judgment at the conclusion of the moot.",
    category: "legal",
    relatedTerms: ["Lead Counsel", "Court Clerk (role)"],
  },
  {
    term: "Pupil",
    definition:
      "The initial rank assigned to every new advocate upon joining Ratio. In the legal profession, pupillage is the final stage of training for barristers. In Ratio, the rank reflects a newcomer beginning their advocacy journey.",
    category: "platform",
    relatedTerms: ["Junior Counsel (rank)", "Advocate"],
  },
  {
    term: "Respondent",
    definition:
      "The party who responds to an appeal, defending the decision of the lower court. In Ratio moot sessions, one team represents the respondent and argues that the original decision should be upheld.",
    category: "legal",
    relatedTerms: ["Appellant", "Submission", "Moot"],
  },
  {
    term: "Senior Counsel",
    definition:
      "The third rank in Ratio's progression system, achieved after completing 20 sessions and accumulating 500 advocacy points. Senior Counsel have built a substantial record of advocacy practice.",
    category: "platform",
    relatedTerms: ["Junior Counsel (rank)", "King's Counsel"],
  },
  {
    term: "Session",
    definition:
      "A scheduled advocacy event on Ratio. Sessions can take the form of moots, mock trials, SQE2 preparation exercises, debates, or workshops. Each session has defined roles, a module area, and produces scored feedback for participants.",
    category: "platform",
    relatedTerms: ["Moot", "Advocacy Dimensions"],
  },
  {
    term: "Skeleton Argument",
    definition:
      "A concise written outline of a party's legal arguments, authorities, and submissions filed in advance of a hearing. In Ratio, advocates may prepare skeleton arguments as part of their session preparation and attach them to the session bundle.",
    category: "legal",
    relatedTerms: ["Bundle", "IRAC", "Submission"],
  },
  {
    term: "Standing Orders",
    definition:
      "The permanent rules governing the procedures, conduct, membership, and governance of Ratio. Standing orders can be amended through the parliamentary process by passing a motion. They serve as the platform's constitutional framework.",
    category: "governance",
    relatedTerms: ["Parliament", "Motion"],
  },
  {
    term: "Streak",
    definition:
      "A count of consecutive days on which an advocate has completed at least one advocacy activity in Ratio. Maintaining streaks earns bonus advocacy points and unlocks badges at milestones of 7, 30, and 100 days.",
    category: "platform",
    relatedTerms: ["National Rankings", "Advocacy Score"],
  },
  {
    term: "Submission",
    definition:
      "An oral or written argument presented to the court by an advocate. In Ratio, submissions are the core of moot sessions, where advocates present their arguments on the relevant point of law to the presiding judge.",
    category: "legal",
    relatedTerms: ["Moot", "IRAC", "Skeleton Argument"],
  },
  {
    term: "The Clerk",
    definition:
      "The contextual help and guidance system within Ratio. The Clerk provides searchable FAQs, a glossary of legal and platform terminology, and step-by-step walkthrough guides tailored to the page you are currently viewing.",
    category: "platform",
    relatedTerms: ["Advocate"],
  },
  {
    term: "Tribunal",
    definition:
      "The judicial body within Ratio's governance structure. The Tribunal adjudicates cases filed by advocates for conduct violations. Cases follow a formal process of filing, service, written submissions, hearing, and judgment, with the right of appeal.",
    category: "governance",
    relatedTerms: ["Standing Orders", "Parliament"],
  },
];
