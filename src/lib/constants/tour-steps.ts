export interface TourStep {
  /** Unique identifier for this step */
  id: string;
  /** CSS selector for the element to highlight */
  target: string;
  /** Step title displayed in the tooltip */
  title: string;
  /** Step description displayed below the title */
  description: string;
  /** Tooltip position relative to the highlighted target */
  position: "top" | "bottom" | "left" | "right";
  /** If the step requires a specific route, specify it here */
  page?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "[data-tour='dashboard']",
    title: "Welcome to Ratio",
    description:
      "This is your dashboard -- the centre of your advocacy training. From here you can track your progress, view activity, and access all areas of the platform.",
    position: "bottom",
  },
  {
    id: "quick-actions",
    target: "[data-tour='quick-actions']",
    title: "Quick Actions",
    description:
      "These shortcuts give you immediate access to the most common tasks: creating sessions, viewing your timetable, practising with AI, and checking the rankings.",
    position: "bottom",
  },
  {
    id: "sessions",
    target: "[data-tour='nav-sessions']",
    title: "Sessions",
    description:
      "Browse, create, and join moot court sessions. Each session simulates a real hearing with assigned roles -- counsel, judge, and observer.",
    position: "right",
  },
  {
    id: "moot-court",
    target: "[data-tour='nav-moot-court']",
    title: "Moot Court",
    description:
      "Practise oral advocacy with an AI judge. Receive structured feedback on your legal reasoning, case citation, and persuasion.",
    position: "right",
  },
  {
    id: "law-book",
    target: "[data-tour='nav-law-book']",
    title: "The Law Book",
    description:
      "A collaborative legal encyclopedia built by advocates. Research case law, statutes, and legal principles across all major practice areas.",
    position: "right",
  },
  {
    id: "society",
    target: "[data-tour='nav-society']",
    title: "Society",
    description:
      "Connect with fellow advocates. Follow peers, view chamber rankings, and commend outstanding contributions to the court.",
    position: "right",
  },
  {
    id: "clerk",
    target: "[data-tour='clerk-button']",
    title: "The Clerk",
    description:
      "Need guidance? The Clerk provides contextual help, a legal glossary, and step-by-step guides for every area of the platform.",
    position: "top",
  },
  {
    id: "profile",
    target: "[data-tour='nav-profile']",
    title: "Your Profile",
    description:
      "Complete your advocate profile to appear in the society directory. Add your university, chamber preference, and areas of legal interest.",
    position: "right",
  },
];
