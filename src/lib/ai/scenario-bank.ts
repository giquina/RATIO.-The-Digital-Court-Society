/**
 * AI Practice Scenario Bank
 *
 * Contains case briefs for each AI mode, categorised by practice area.
 * When a professional user has declared practice areas, the system
 * picks relevant scenarios. Students and users without declared areas
 * get the default scenarios (which match the original hardcoded ones).
 */

export interface CaseBrief {
  area: string;
  matter: string;
  yourRole: string;
  instructions: string;
  authorities: string[];
  /** If true, this is the default brief for its mode (backward compat) */
  isDefault?: boolean;
}

export type Mode = "judge" | "mentor" | "examiner" | "opponent";

// ── Default briefs (unchanged from original) ──

const DEFAULT_BRIEFS: Record<Mode, CaseBrief> = {
  judge: {
    area: "Public Law",
    matter: "R (on the application of Miller) v Secretary of State — Whether the exercise of prerogative power to trigger Article 50 TEU without Parliamentary authority is unlawful.",
    yourRole: "Leading Counsel for the Appellant",
    instructions: "You will make submissions to the Judge arguing that the prerogative power cannot be used to nullify statutory rights granted under the European Communities Act 1972.",
    authorities: ["R (Miller) v Secretary of State [2017] UKSC 5", "CCSU v Minister for the Civil Service [1985] AC 374", "R (UNISON) v Lord Chancellor [2017] UKSC 51"],
    isDefault: true,
  },
  mentor: {
    area: "Contract Law",
    matter: "Review of skeleton argument on anticipatory breach and mitigation of loss.",
    yourRole: "Mentee — Year 2 LLB student",
    instructions: "Senior Counsel will review your approach, question your reasoning, and help you improve your written advocacy technique.",
    authorities: ["Hochster v De La Tour (1853) 2 E&B 678", "White & Carter v McGregor [1962] AC 413"],
    isDefault: true,
  },
  examiner: {
    area: "Dispute Resolution",
    matter: "Summary Judgment Application under CPR Part 24 — Claimant seeks judgment on breach of contract claim.",
    yourRole: "Counsel for the Applicant",
    instructions: "You have 45 minutes to prepare, then 15 minutes to make oral submissions. You will be assessed against SQE2 advocacy competency standards.",
    authorities: ["Easyair Ltd v Opal Telecom Ltd [2009] EWHC 339", "Swain v Hillman [2001] 1 All ER 91"],
    isDefault: true,
  },
  opponent: {
    area: "Criminal Law",
    matter: "R v Daniels — Admissibility of confession evidence obtained during informal questioning.",
    yourRole: "Prosecution Counsel",
    instructions: "Opposing Counsel will argue for the defence. You must rebut their submissions in real time.",
    authorities: ["R v Fulling [1987] QB 426", "PACE 1984, s.76 and s.78"],
    isDefault: true,
  },
};

// ── Practice-area scenario banks ──
// Each practice area has scenarios for relevant modes.
// Not every area needs every mode — we fall back to defaults for gaps.

const AREA_SCENARIOS: Record<string, Partial<Record<Mode, CaseBrief[]>>> = {
  Criminal: {
    judge: [
      {
        area: "Criminal Law",
        matter: "R v Hughes — Application to exclude identification evidence under PACE s.78 where the ID parade failed to comply with Code D.",
        yourRole: "Defence Counsel",
        instructions: "You will submit that the identification evidence is unreliable and should be excluded. Address the Turnbull guidelines and procedural failures.",
        authorities: ["R v Turnbull [1977] QB 224", "PACE 1984, s.78", "R v Forbes [2001] 1 AC 473"],
      },
      {
        area: "Criminal Law",
        matter: "R v Osman — Whether the defendant's actions constitute self-defence or excessive force under s.76 Criminal Justice and Immigration Act 2008.",
        yourRole: "Defence Counsel",
        instructions: "You will argue that the defendant used reasonable force in the circumstances as they honestly believed them to be.",
        authorities: ["R v Martin [2001] EWCA Crim 2245", "Criminal Justice and Immigration Act 2008, s.76", "Palmer v R [1971] AC 814"],
      },
    ],
    opponent: [
      {
        area: "Criminal Law",
        matter: "R v Blake — Prosecution appeal against unduly lenient sentence for aggravated burglary.",
        yourRole: "Prosecution Counsel",
        instructions: "You represent the Crown. Opposing Counsel argues the sentence was within the judge's discretion. Submit that the sentence falls outside the range.",
        authorities: ["Attorney General's Reference (No. 4 of 1989)", "Sentencing Council Guidelines — Burglary", "R v Offen [2001] 1 WLR 253"],
      },
    ],
  },
  Commercial: {
    judge: [
      {
        area: "Commercial Law",
        matter: "Sterling Industries Ltd v Apex Trading — Whether an exclusion clause in a standard form B2B contract is reasonable under UCTA 1977 s.3.",
        yourRole: "Counsel for the Claimant",
        instructions: "You will argue the exclusion clause is unreasonable given the disparity in bargaining power and the nature of the breach.",
        authorities: ["Photo Production Ltd v Securicor [1980] AC 827", "UCTA 1977, s.3 and s.11", "Watford Electronics v Sanderson [2001] EWCA Civ 317"],
      },
    ],
    mentor: [
      {
        area: "Commercial Law",
        matter: "Review of skeleton argument on implied terms in sale of goods and satisfactory quality under CRA 2015.",
        yourRole: "Mentee — Pupillage applicant",
        instructions: "Senior Counsel will challenge your application of the statutory framework and help you tighten your written advocacy.",
        authorities: ["Consumer Rights Act 2015, s.9-11", "Jewson Ltd v Boyhan [2003] EWCA Civ 1030"],
      },
    ],
  },
  Family: {
    judge: [
      {
        area: "Family Law",
        matter: "Re B (Children) — Application for a Child Arrangements Order under s.8 Children Act 1989. Dispute over relocation of primary carer.",
        yourRole: "Counsel for the Father (Respondent)",
        instructions: "You will argue that the proposed relocation is not in the child's best interests. Focus on the welfare checklist under s.1(3) CA 1989.",
        authorities: ["Children Act 1989, s.1(3)", "Re F (Relocation) [2012] EWCA Civ 1364", "K v K (Relocation) [2011] EWCA Civ 793"],
      },
    ],
  },
  "Public Law": {
    judge: [
      {
        area: "Public Law",
        matter: "R (Begum) v Secretary of State — Whether deprivation of citizenship without an in-country right of appeal violates Article 6 ECHR.",
        yourRole: "Counsel for the Appellant",
        instructions: "You will submit that the decision is procedurally unfair and disproportionate, engaging both common law fairness and ECHR rights.",
        authorities: ["Begum v Secretary of State [2021] UKSC 7", "R (Osborn) v Parole Board [2013] UKSC 61", "HRA 1998, Schedule 1, Articles 6 and 8"],
      },
    ],
  },
  Employment: {
    judge: [
      {
        area: "Employment Law",
        matter: "Patel v DataFlow Solutions Ltd — Claim of automatic unfair dismissal for making a protected disclosure under ERA 1996 s.103A.",
        yourRole: "Counsel for the Claimant",
        instructions: "You will argue that the disclosure qualified under s.43B and the principal reason for dismissal was the protected disclosure.",
        authorities: ["ERA 1996, s.43B and s.103A", "Cavendish Munro v Geduld [2010] ICR 325", "Chesterton Global v Nurmohamed [2017] EWCA Civ 979"],
      },
    ],
    opponent: [
      {
        area: "Employment Law",
        matter: "Morris v Greenfield Academy — Respondent defends constructive dismissal claim where Claimant resigned after grievance outcome.",
        yourRole: "Counsel for the Respondent",
        instructions: "Opposing Counsel will argue for the Claimant. You must argue there was no fundamental breach of the employment contract.",
        authorities: ["Western Excavating v Sharp [1978] ICR 221", "Malik v BCCI [1998] AC 20", "Bournemouth University v Buckland [2010] ICR 908"],
      },
    ],
  },
  "Human Rights": {
    judge: [
      {
        area: "Human Rights",
        matter: "AB v Secretary of State — Challenge to immigration detention under Article 5 ECHR where removal is not imminent.",
        yourRole: "Counsel for the Claimant",
        instructions: "You will submit that continued detention is unlawful under the Hardial Singh principles and Article 5 ECHR.",
        authorities: ["R (Lumba) v Secretary of State [2011] UKSC 12", "R (Hardial Singh) v Governor of Durham Prison [1984] 1 WLR 704", "HRA 1998, Schedule 1, Article 5"],
      },
    ],
  },
  Property: {
    judge: [
      {
        area: "Property Law",
        matter: "Greenacre Developments v Thompson — Adverse possession claim over registered land under LRA 2002.",
        yourRole: "Counsel for the Applicant (squatter)",
        instructions: "You will argue that the requirements of Schedule 6, LRA 2002 are met and the applicant has established the necessary factual possession and intention to possess.",
        authorities: ["LRA 2002, Schedule 6", "J A Pye v Graham [2002] UKHL 30", "Powell v McFarlane (1977) 38 P & CR 452"],
      },
    ],
  },
  "Intellectual Property": {
    judge: [
      {
        area: "Intellectual Property",
        matter: "TechVision Ltd v InnoSoft — Application for interim injunction to restrain alleged patent infringement of AI-related invention.",
        yourRole: "Counsel for the Claimant",
        instructions: "You will submit that there is a serious question to be tried and the balance of convenience favours granting the injunction. Apply the American Cyanamid test.",
        authorities: ["American Cyanamid v Ethicon [1975] AC 396", "Patents Act 1977, s.61", "Series 5 Software v Clarke [1996] 1 All ER 853"],
      },
    ],
  },
  "Clinical Negligence": {
    judge: [
      {
        area: "Clinical Negligence",
        matter: "Collins v NHS Foundation Trust — Whether the Trust breached its duty of care in failing to diagnose a pulmonary embolism within the standard of the reasonable body of medical opinion.",
        yourRole: "Counsel for the Claimant",
        instructions: "You will argue that the Trust's failure to investigate fell below the Bolam standard as modified by Bolitho. Address causation under the 'but for' test.",
        authorities: ["Bolam v Friern Hospital [1957] 1 WLR 582", "Bolitho v City & Hackney HA [1998] AC 232", "Montgomery v Lanarkshire [2015] UKSC 11"],
      },
    ],
  },
};

// ── Selection logic ──

/**
 * Pick a scenario that's relevant to the user's practice areas.
 * Falls back to the default brief if no match is found.
 *
 * @param mode - The AI practice mode (judge, mentor, examiner, opponent)
 * @param practiceAreas - The user's declared practice areas (from profile)
 * @param userType - "student" or "professional"
 */
export function selectScenario(
  mode: Mode,
  practiceAreas?: string[],
  userType?: "student" | "professional",
): CaseBrief {
  // Students always get the default (which is what they've always seen)
  if (!userType || userType === "student" || !practiceAreas?.length) {
    return DEFAULT_BRIEFS[mode];
  }

  // Professionals: try to find a scenario matching one of their practice areas
  // Shuffle to add variety across sessions
  const shuffled = [...practiceAreas].sort(() => Math.random() - 0.5);

  for (const area of shuffled) {
    const areaScenarios = AREA_SCENARIOS[area]?.[mode];
    if (areaScenarios?.length) {
      // Pick a random scenario from this area
      const idx = Math.floor(Math.random() * areaScenarios.length);
      return areaScenarios[idx];
    }
  }

  // No matching area scenarios — fall back to default
  return DEFAULT_BRIEFS[mode];
}

/**
 * Get all default briefs (backward compat for any code referencing CASE_BRIEFS directly).
 */
export const CASE_BRIEFS = DEFAULT_BRIEFS;
