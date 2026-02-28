// ── The Clerk — Help & FAQ Data ──
// Extracted from the help page into typed, reusable constants.

export interface HelpItem {
  q: string;
  a: string;
}

export interface HelpSection {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  items: HelpItem[];
}

export const HELP_SECTIONS: HelpSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "BookOpen",
    items: [
      {
        q: "What is Ratio?",
        a: "Ratio is a digital court society for UK law students. It provides a structured platform for practising oral advocacy through mooting, AI-powered practice sessions, and peer feedback. Think of it as a modern version of the Inns of Court experience, accessible to all law students.",
      },
      {
        q: "How do I create an account?",
        a: "Sign up using your university email address (.ac.uk). You will be asked to choose a chamber, select your university and year of study, and set up your profile. The process takes less than 2 minutes.",
      },
      {
        q: "Which universities are supported?",
        a: "Ratio supports 142 UK universities across all regions, including UCL, KCL, LSE, Oxford, Cambridge, Birkbeck, Bristol, Manchester, Edinburgh, Birmingham, Leeds, Exeter, Warwick, Nottingham, Durham, QMUL, SOAS, City, Sheffield, Glasgow, Cardiff, and many more. If your university is not listed during registration, contact us and we will add it.",
      },
      {
        q: "What are chambers?",
        a: "Chambers are the four houses within Ratio, modelled on the historic Inns of Court: Gray's Inn, Lincoln's Inn, Inner Temple, and Middle Temple. When you join, you select a chamber. Your chamber is your community within Ratio, and you can participate in inter-chamber competitions and rankings.",
      },
      {
        q: "What are the advocacy ranks?",
        a: "All advocates begin as a Pupil. As you complete sessions and earn points, you progress through Junior Counsel, Senior Counsel, King's Counsel, and ultimately Bencher. Each rank has specific requirements for sessions completed and total advocacy points accumulated.",
      },
    ],
  },
  {
    id: "sessions",
    title: "Sessions & Mooting",
    icon: "Mic",
    items: [
      {
        q: "How do I join a moot session?",
        a: "Navigate to the Sessions page and browse available sessions. You can filter by module, date, and session type. Click on a session to view its details and available roles, then click 'Join' to take a role. You will receive a confirmation and preparation materials.",
      },
      {
        q: "Can I create my own moot session?",
        a: "Yes. Go to Sessions and select Create Session. You can set the case topic, module, date and time, available roles, and whether it is public or private. You can invite specific advocates or open it to your chamber or the wider community.",
      },
      {
        q: "What types of sessions are available?",
        a: "Ratio supports five session types: Moot (traditional appellate advocacy), Mock Trial (courtroom simulation), SQE2 Prep (assessment-focused practice), Debate (informal argumentation), and Workshop (skills training). Each has tailored roles and feedback criteria.",
      },
      {
        q: "What roles can I take in a moot?",
        a: "A standard moot has six roles: Presiding Judge, Leading Counsel for the Appellant, Junior Counsel for the Appellant, Leading Counsel for the Respondent, Junior Counsel for the Respondent, and Court Clerk. Each role has distinct responsibilities and speaking time allocations.",
      },
      {
        q: "Can I moot with advocates from other universities?",
        a: "Yes. When creating a session, enable the cross-university option to open it to advocates across all supported institutions. Cross-university sessions are an excellent way to broaden your experience and encounter different advocacy styles.",
      },
    ],
  },
  {
    id: "ai-judge",
    title: "AI Judge",
    icon: "Brain",
    items: [
      {
        q: "How does the AI Judge work?",
        a: "The AI Judge uses advanced speech recognition and natural language processing to listen to your oral submissions. It evaluates your advocacy in real-time, asks interventions (just like a real judge), and provides detailed scoring across 7 dimensions of advocacy.",
      },
      {
        q: "What are the 7 scoring dimensions?",
        a: "Your advocacy is scored across: Argument Structure (IRAC method), Use of Authorities (case citations and statutes), Oral Delivery and Clarity, Response to Judicial Interventions, Court Manner and Etiquette, Persuasiveness, and Time Management.",
      },
      {
        q: "Is the AI Judge a replacement for real mooting?",
        a: "No. The AI Judge is designed to complement traditional mooting, not replace it. It is ideal for practice between moot sessions, for students who want to build confidence before their first moot, or for focused skills development on specific advocacy dimensions.",
      },
      {
        q: "What AI modes are available?",
        a: "Ratio offers four Moot Court modes: Judge (simulates a High Court judge hearing your submissions), Mentor (provides guided coaching on your technique), Examiner (runs SQE2-focused oral assessments), and Opponent (acts as opposing counsel to test your arguments).",
      },
      {
        q: "Is my audio recorded during AI sessions?",
        a: "Audio from AI Judge sessions is processed in real-time for transcription and analysis but is not permanently stored. Your transcript and scores are saved to your profile so you can review your performance, but the raw audio is discarded after processing.",
      },
    ],
  },
  {
    id: "rankings",
    title: "Scoring & Rankings",
    icon: "BarChart3",
    items: [
      {
        q: "How is my score calculated?",
        a: "Your overall score is a weighted average of the 7 advocacy dimensions. Each dimension is scored from 0 to 100. Scores from both AI Judge sessions and peer-reviewed moot sessions contribute to your profile. More recent sessions carry slightly more weight.",
      },
      {
        q: "How do the national rankings work?",
        a: "Rankings are based on cumulative advocacy points earned from sessions. Points are awarded for session completion, score quality, consistency (streaks), and community engagement (commendations). Rankings reset each academic year, with historical records preserved.",
      },
      {
        q: "What are streaks?",
        a: "A streak tracks consecutive days on which you have completed at least one advocacy activity, such as a session or a Moot Court practice. Maintaining streaks earns bonus advocacy points and unlocks streak-based badges at 7, 30, and 100 days.",
      },
      {
        q: "What are commendations?",
        a: "Commendations are peer endorsements. After a session, advocates can commend other participants for excellent advocacy. Receiving commendations contributes to your advocacy points and helps build your reputation within the community.",
      },
    ],
  },
  {
    id: "governance",
    title: "Governance & Parliament",
    icon: "Landmark",
    items: [
      {
        q: "What is Parliament in Ratio?",
        a: "Parliament is the legislative body within Ratio. Advocates can propose motions to change platform policies, standing orders, or governance procedures. Motions are debated and voted upon by eligible advocates, mirroring real parliamentary procedure.",
      },
      {
        q: "How do I propose a motion?",
        a: "Navigate to Parliament and select Propose Motion. Draft your motion using the IRAC framework (Issue, Rule, Application, Conclusion), select a category (policy, constitutional, procedural, or conduct), and submit. Your motion requires a seconder before it can proceed to debate.",
      },
      {
        q: "What is the Tribunal?",
        a: "The Tribunal is the judicial arm of Ratio governance. Advocates can file cases against other advocates for conduct violations. Cases follow a structured process: filing, acknowledgement, service, submissions, hearing, and judgment. Decisions may be appealed.",
      },
    ],
  },
  {
    id: "law-book",
    title: "The Law Book",
    icon: "Library",
    items: [
      {
        q: "What is the Law Book?",
        a: "The Law Book is Ratio's collaborative legal knowledge base. Advocates can browse, contribute to, and cite legal topics organised by module. Contributions are peer-reviewed by the Editorial Board before publication, ensuring quality and accuracy.",
      },
      {
        q: "How do I contribute to the Law Book?",
        a: "Navigate to the Law Book, select a module, and choose a topic. You can propose edits to existing content or create new topic entries. All contributions are written in Markdown and must include proper OSCOLA citations. Contributions earn advocacy points upon approval.",
      },
      {
        q: "What is OSCOLA?",
        a: "OSCOLA (Oxford University Standard for the Citation of Legal Authorities) is the standard referencing system used in UK legal academia. Ratio uses OSCOLA formatting throughout the Law Book and research features to ensure consistent, professional citation practices.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Privacy",
    icon: "Shield",
    items: [
      {
        q: "Who can see my profile and scores?",
        a: "By default, your profile is visible to other Ratio advocates. You can control visibility in Settings under Privacy. You can hide your follower count, make your profile private, or restrict visibility to your chamber only.",
      },
      {
        q: "How is my data used?",
        a: "Your data is used solely to provide the Ratio service. Audio from AI Judge sessions is processed in real-time and not permanently stored. Your scores, session history, and profile data are stored securely. We never sell or share your personal data with third parties.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. You can request account deletion in Settings under Account. This will permanently remove your profile, scores, and session history. Contributions to the Law Book will be anonymised but retained for the benefit of the community.",
      },
    ],
  },
];
