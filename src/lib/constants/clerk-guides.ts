// ── The Clerk — Per-Route Walkthrough Guides ──
// Contextual guides shown based on the advocate's current page.

export interface GuideStep {
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface RouteGuide {
  route: string; // pathname prefix
  title: string;
  description: string;
  steps: GuideStep[];
}

export const ROUTE_GUIDES: RouteGuide[] = [
  {
    route: "/home",
    title: "Your Home Dashboard",
    description:
      "The dashboard is your starting point. It surfaces your key statistics, recent activity, and quick actions so you can pick up where you left off.",
    steps: [
      {
        icon: "BarChart3",
        title: "Stats Overview",
        description:
          "View your current rank, advocacy score, streak count, and total sessions at a glance. These update in real-time as you complete activities.",
      },
      {
        icon: "Activity",
        title: "Activity Feed",
        description:
          "See recent actions from advocates you follow, including completed sessions, earned badges, and commendations. Engage with the community by commending noteworthy achievements.",
      },
      {
        icon: "Zap",
        title: "Quick Actions",
        description:
          "Access common tasks directly from the dashboard: start an AI practice session, browse upcoming moots, or review your latest feedback.",
      },
    ],
  },
  {
    route: "/sessions",
    title: "Finding and Joining Sessions",
    description:
      "The Sessions page is where advocacy happens. Browse available moots, claim roles, create your own sessions, and review your history.",
    steps: [
      {
        icon: "Search",
        title: "Browse Sessions",
        description:
          "Filter available sessions by module, session type, date, and university. Each listing shows the topic, available roles, and participant count.",
      },
      {
        icon: "UserPlus",
        title: "Claim a Role",
        description:
          "Open a session to view its details and available roles. Select an unclaimed role to join. You will receive a confirmation and any preparation materials attached by the session creator.",
      },
      {
        icon: "Plus",
        title: "Create a Session",
        description:
          "Use the Create Session button to set up your own moot, mock trial, debate, SQE2 prep, or workshop. Define the topic, roles, timing, and visibility settings.",
      },
      {
        icon: "History",
        title: "View Session History",
        description:
          "Access your past sessions to review feedback, scores, and transcripts. Your session history contributes to your overall advocacy profile and progression.",
      },
    ],
  },
  {
    route: "/sessions/create",
    title: "Creating a Moot Session",
    description:
      "Walk through the session creation process step by step. A well-prepared session attracts engaged participants and produces better advocacy practice.",
    steps: [
      {
        icon: "List",
        title: "Choose Session Type",
        description:
          "Select from Moot, Mock Trial, SQE2 Prep, Debate, or Workshop. Each type has different role structures and feedback criteria tailored to its format.",
      },
      {
        icon: "FileText",
        title: "Set Session Details",
        description:
          "Enter the case topic, select the relevant law module, set the date and time, and add an optional description or issue summary for participants.",
      },
      {
        icon: "Users",
        title: "Define Roles",
        description:
          "Configure the available roles for your session. Standard moot roles are pre-filled, but you can customise role names and speaking time limits to suit your format.",
      },
      {
        icon: "Send",
        title: "Invite Advocates",
        description:
          "Choose whether the session is open to your chamber, your university, or the entire Ratio community. You can also invite specific advocates directly.",
      },
      {
        icon: "CheckCircle",
        title: "Publish",
        description:
          "Review your session details and publish. Your session will appear in the listings immediately. Participants will receive notifications when they join.",
      },
    ],
  },
  {
    route: "/community",
    title: "The Advocate Society",
    description:
      "Discover fellow advocates, build your network, and see how you compare across the national rankings.",
    steps: [
      {
        icon: "Search",
        title: "Discover Advocates",
        description:
          "Browse advocates by university, chamber, rank, or module interest. Use the search bar to find specific individuals by name or institution.",
      },
      {
        icon: "UserPlus",
        title: "Follow Advocates",
        description:
          "Follow advocates whose work you respect. Their activity will appear in your home feed, and you can commend their achievements after sessions.",
      },
      {
        icon: "Trophy",
        title: "View Rankings",
        description:
          "Access the national, university, and chamber leaderboards. Rankings reflect cumulative advocacy points and update after every completed session.",
      },
    ],
  },
  {
    route: "/parliament",
    title: "How Parliament Works",
    description:
      "Parliament is where advocates shape the platform. Propose motions, participate in debates, and vote on changes to Ratio's governance.",
    steps: [
      {
        icon: "FileText",
        title: "Motions",
        description:
          "Browse current and past motions. Each motion follows the IRAC structure and progresses through stages: draft, tabled, seconded, debating, voting, and finally passed or defeated.",
      },
      {
        icon: "Vote",
        title: "Voting",
        description:
          "Cast your vote (Aye, No, or Abstain) on motions in the voting stage. Voting is open to all eligible advocates until the deadline. Results are published transparently.",
      },
      {
        icon: "MessageSquare",
        title: "Debates",
        description:
          "Contribute to parliamentary debates by speaking for or against a motion. Debates are structured with formal speaking turns, points of order, and questions.",
      },
      {
        icon: "BookOpen",
        title: "Standing Orders",
        description:
          "Review the platform's standing orders, which govern procedures, conduct, and governance. Standing orders are amended through the parliamentary process.",
      },
    ],
  },
  {
    route: "/tribunal",
    title: "The Tribunal System",
    description:
      "The Tribunal is the judicial arm of Ratio's governance. It handles conduct complaints through a structured, fair process.",
    steps: [
      {
        icon: "FilePlus",
        title: "Filing a Case",
        description:
          "If you believe an advocate has violated the standing orders or code of conduct, you may file a case using the IRAC structure. Specify the issue, relevant rules, your application of the facts, and the remedy you seek.",
      },
      {
        icon: "Scale",
        title: "Hearings",
        description:
          "Cases proceed through acknowledgement, service, written submissions, and a hearing before an assigned judge. Both parties have the opportunity to present their position.",
      },
      {
        icon: "Gavel",
        title: "Judgments",
        description:
          "The presiding judge delivers a reasoned judgment granting, partially granting, or dismissing the case. Judgments are published and may be appealed where the rules permit.",
      },
    ],
  },
  {
    route: "/law-book",
    title: "Contributing to the Law Book",
    description:
      "The Law Book is Ratio's collaborative legal knowledge base. Browse topics, contribute content, and build your academic portfolio.",
    steps: [
      {
        icon: "BookOpen",
        title: "Browse Modules and Topics",
        description:
          "The Law Book is organised by law module (Contract, Tort, Public Law, and so on). Within each module, topics cover key principles, cases, and statutory provisions.",
      },
      {
        icon: "PenLine",
        title: "Edit and Contribute",
        description:
          "Select a topic to propose edits or create new entries. Write in Markdown, include OSCOLA citations, and submit for peer review by the Editorial Board. Approved contributions earn advocacy points.",
      },
      {
        icon: "Quote",
        title: "Cite Authorities",
        description:
          "Add case law, statutes, articles, and textbook references using the citation tool. All citations are formatted in OSCOLA and can be copied for use in your moot preparation.",
      },
    ],
  },
  {
    route: "/rankings",
    title: "Rankings and Progression",
    description:
      "Understand how ranks, points, and leaderboards work to track your advocacy development over time.",
    steps: [
      {
        icon: "Award",
        title: "Ranks Explained",
        description:
          "Progress from Pupil through Junior Counsel, Senior Counsel, King's Counsel, and Bencher. Each rank requires a minimum number of completed sessions and total advocacy points.",
      },
      {
        icon: "TrendingUp",
        title: "Earning Points",
        description:
          "Advocacy points are earned from session completion, score quality, streak bonuses, commendations received, and Law Book contributions. Higher-scored sessions yield more points.",
      },
      {
        icon: "BarChart3",
        title: "Leaderboards",
        description:
          "View national, university, and chamber rankings. Filter by time period to see weekly, monthly, or all-time standings. Rankings reset at the start of each academic year.",
      },
    ],
  },
  {
    route: "/profile",
    title: "Your Advocate Profile",
    description:
      "Your profile is your advocacy portfolio. It showcases your stats, session history, and achievements to the Ratio community.",
    steps: [
      {
        icon: "BarChart3",
        title: "Performance Stats",
        description:
          "View your advocacy score breakdown across all seven dimensions, your rank progression over time, and your session completion rate.",
      },
      {
        icon: "Briefcase",
        title: "Advocacy Portfolio",
        description:
          "Review your saved AI sessions, peer feedback, earned badges, and Law Book contributions. Your portfolio provides a comprehensive record of your development.",
      },
      {
        icon: "Share2",
        title: "Sharing and Privacy",
        description:
          "Control who can see your profile and what information is visible. You can make your profile public, restrict it to your chamber, or set it to private.",
      },
    ],
  },
  {
    route: "/help",
    title: "The Help Centre",
    description:
      "Find answers to your questions and learn how to make the most of Ratio.",
    steps: [
      {
        icon: "Search",
        title: "Search for Answers",
        description:
          "Use the search bar to find specific questions across all help categories. Results update in real-time as you type.",
      },
      {
        icon: "FolderOpen",
        title: "Browse by Category",
        description:
          "Explore help topics organised by category: Getting Started, Sessions, AI Judge, Scoring, Governance, the Law Book, and Account settings.",
      },
    ],
  },
];

export const FALLBACK_GUIDE: RouteGuide = {
  route: "/",
  title: "Welcome to Ratio",
  description:
    "Your digital court society. Practise advocacy, engage with governance, and build your legal skills.",
  steps: [
    {
      icon: "Home",
      title: "Home Dashboard",
      description:
        "View your stats, activity feed, and quick actions.",
    },
    {
      icon: "Mic",
      title: "Sessions",
      description:
        "Browse and join moot sessions or create your own.",
    },
    {
      icon: "Users",
      title: "Society",
      description:
        "Discover advocates, follow peers, and view rankings.",
    },
  ],
};

/**
 * Returns the most specific guide matching the given pathname.
 * Falls back to the generic welcome guide if no route matches.
 */
export function getGuideForRoute(pathname: string): RouteGuide {
  // Sort by route length descending so more specific routes match first
  const sorted = [...ROUTE_GUIDES].sort(
    (a, b) => b.route.length - a.route.length
  );
  const match = sorted.find((guide) => pathname.startsWith(guide.route));
  return match ?? FALLBACK_GUIDE;
}
