/**
 * Demo data shown to the demo account so no page looks empty.
 * Every section gets at least 1-2 realistic examples.
 *
 * This data is CLIENT-ONLY — never written to the database.
 * Pages check useIsDemoAccount() and fall back to this when queries return empty.
 */

// ── HOME: Activity Feed ──
export const DEMO_ACTIVITY_FEED = [
  {
    _id: "demo_act_1",
    type: "moot_completed",
    title: "Completed moot session",
    description: "R (Miller) v Secretary of State — scored 4.2/5.0",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    icon: "Scale",
  },
  {
    _id: "demo_act_2",
    type: "badge_earned",
    title: "Badge earned: First Moot",
    description: "Completed your first AI Practice session",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icon: "Award",
  },
  {
    _id: "demo_act_3",
    type: "session_created",
    title: "Joined group moot session",
    description: "Constitutional Law — Parliamentary Sovereignty",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: "Calendar",
  },
  {
    _id: "demo_act_4",
    type: "resource_shared",
    title: "Saved research query",
    description: "Duty of care in negligence — Caparo Industries v Dickman",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    icon: "ExternalLink",
  },
];

// ── HOME: Profile Stats (overrides for demo) ──
export const DEMO_PROFILE_STATS = {
  streakDays: 3,
  readinessScore: 42,
  totalSessions: 7,
  totalXp: 1240,
};

// ── SESSIONS: Upcoming ──
export const DEMO_UPCOMING_SESSIONS = [
  {
    _id: "demo_sess_upcoming_1",
    title: "Constitutional Law — Royal Prerogative",
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "judge",
    area: "Public Law",
    hostName: "Amara K.",
    participantCount: 4,
    status: "upcoming",
  },
];

// ── SESSIONS: Past ──
export const DEMO_PAST_SESSIONS = [
  {
    _id: "demo_sess_past_1",
    title: "R (Miller) v Secretary of State",
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    mode: "judge",
    area: "Constitutional Law",
    overallScore: 4.2,
    exchanges: 12,
    maxExchanges: 30,
    personaName: "The Honourable Justice AI",
    status: "completed",
  },
  {
    _id: "demo_sess_past_2",
    title: "Donoghue v Stevenson — Duty of Care",
    completedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    mode: "mentor",
    area: "Tort Law",
    overallScore: 3.8,
    exchanges: 18,
    maxExchanges: 30,
    personaName: "Senior Counsel AI",
    status: "completed",
  },
  {
    _id: "demo_sess_past_3",
    title: "SQE2 Mock — Client Interview",
    completedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    mode: "examiner",
    area: "Professional Ethics",
    overallScore: 3.5,
    exchanges: 22,
    maxExchanges: 30,
    personaName: "SQE Examiner AI",
    status: "completed",
  },
];

// ── SOCIETY: Discover — mock advocates ──
export const DEMO_ADVOCATES = [
  {
    _id: "demo_adv_1",
    fullName: "Amara Khoury",
    displayName: "Amara Khoury",
    university: "King's College London",
    universityShort: "KCL",
    yearOfStudy: 2,
    chamber: "Blackstone",
    avatarColor: "#C9A84C",
    initials: "AK",
    xp: 3420,
    sessionsCompleted: 18,
    totalMoots: 18,
    followerCount: 12,
    commendationCount: 8,
    modules: ["Public Law", "EU Law"],
    rank: "Senior Advocate",
    bio: "Aspiring barrister with a passion for public law and judicial review.",
  },
  {
    _id: "demo_adv_2",
    fullName: "James Okafor",
    displayName: "James Okafor",
    university: "University College London",
    universityShort: "UCL",
    yearOfStudy: 3,
    chamber: "Lincoln",
    avatarColor: "#6B8AFF",
    initials: "JO",
    xp: 2870,
    sessionsCompleted: 14,
    totalMoots: 14,
    followerCount: 9,
    commendationCount: 5,
    modules: ["Criminal Law", "Evidence"],
    rank: "Advocate",
    bio: "Criminal law enthusiast and mooting finalist.",
  },
  {
    _id: "demo_adv_3",
    fullName: "Priya Sharma",
    displayName: "Priya Sharma",
    university: "London School of Economics",
    universityShort: "LSE",
    yearOfStudy: 2,
    chamber: "Gray",
    avatarColor: "#FF6B9D",
    initials: "PS",
    xp: 2340,
    sessionsCompleted: 11,
    totalMoots: 11,
    followerCount: 7,
    commendationCount: 4,
    modules: ["Contract Law", "Tort Law"],
    rank: "Advocate",
  },
  {
    _id: "demo_adv_4",
    fullName: "Reuben Ellis",
    displayName: "Reuben Ellis",
    university: "Birkbeck, University of London",
    universityShort: "BBK",
    yearOfStudy: 1,
    chamber: "Inner Temple",
    avatarColor: "#4ECDC4",
    initials: "RE",
    xp: 1890,
    sessionsCompleted: 9,
    totalMoots: 9,
    followerCount: 5,
    commendationCount: 3,
    modules: ["Public Law", "Contract Law"],
    rank: "Junior Advocate",
  },
  {
    _id: "demo_adv_5",
    fullName: "Fatima Al-Hassan",
    displayName: "Fatima Al-Hassan",
    university: "SOAS University of London",
    universityShort: "SOAS",
    yearOfStudy: 3,
    chamber: "Blackstone",
    avatarColor: "#FFB347",
    initials: "FA",
    xp: 1650,
    sessionsCompleted: 8,
    totalMoots: 8,
    followerCount: 6,
    commendationCount: 2,
    modules: ["International Law", "Human Rights"],
    rank: "Advocate",
    bio: "Focused on international humanitarian law and human rights advocacy.",
  },
];

// ── SOCIETY: Rankings / Leaderboard ──
export const DEMO_LEADERBOARD = [
  { _id: "demo_lb_1", fullName: "Amara Khoury", displayName: "Amara Khoury", university: "King's College London", universityShort: "KCL", yearOfStudy: 2, chamber: "Blackstone", xp: 3420, sessionsCompleted: 18, totalMoots: 18, followerCount: 12, commendationCount: 8, initials: "AK", avatarColor: "#C9A84C", rank: "Senior Advocate" },
  { _id: "demo_lb_2", fullName: "James Okafor", displayName: "James Okafor", university: "University College London", universityShort: "UCL", yearOfStudy: 3, chamber: "Lincoln", xp: 2870, sessionsCompleted: 14, totalMoots: 14, followerCount: 9, commendationCount: 5, initials: "JO", avatarColor: "#6B8AFF", rank: "Advocate" },
  { _id: "demo_lb_3", fullName: "Priya Sharma", displayName: "Priya Sharma", university: "London School of Economics", universityShort: "LSE", yearOfStudy: 2, chamber: "Gray", xp: 2340, sessionsCompleted: 11, totalMoots: 11, followerCount: 7, commendationCount: 4, initials: "PS", avatarColor: "#FF6B9D", rank: "Advocate" },
  { _id: "demo_lb_4", fullName: "Reuben Ellis", displayName: "Reuben Ellis", university: "Birkbeck, University of London", universityShort: "BBK", yearOfStudy: 1, chamber: "Inner Temple", xp: 1890, sessionsCompleted: 9, totalMoots: 9, followerCount: 5, commendationCount: 3, initials: "RE", avatarColor: "#4ECDC4", rank: "Junior Advocate" },
  { _id: "demo_lb_5", fullName: "Fatima Al-Hassan", displayName: "Fatima Al-Hassan", university: "SOAS University of London", universityShort: "SOAS", yearOfStudy: 3, chamber: "Blackstone", xp: 1650, sessionsCompleted: 8, totalMoots: 8, followerCount: 6, commendationCount: 2, initials: "FA", avatarColor: "#FFB347", rank: "Advocate" },
  { _id: "demo_lb_6", fullName: "Demo Advocate", displayName: "Demo Advocate", university: "Birkbeck, University of London", universityShort: "BBK", yearOfStudy: 1, chamber: "Blackstone", xp: 1240, sessionsCompleted: 7, totalMoots: 7, followerCount: 7, commendationCount: 3, initials: "DA", avatarColor: "#8B5E3C", rank: "Junior Advocate" },
];

// ── NOTIFICATIONS ──
export const DEMO_NOTIFICATIONS = [
  {
    _id: "demo_notif_1",
    type: "score",
    title: "Session scored",
    body: "Your moot on R (Miller) scored 4.2/5.0 — well above average.",
    read: false,
    _creationTime: Date.now() - 2 * 60 * 60 * 1000,
    icon: "Scale",
  },
  {
    _id: "demo_notif_2",
    type: "badge",
    title: "Badge unlocked: First Moot",
    body: "You completed your first AI Practice session. Keep going!",
    read: false,
    _creationTime: Date.now() - 5 * 60 * 60 * 1000,
    icon: "Award",
  },
  {
    _id: "demo_notif_3",
    type: "social",
    title: "Amara Khoury followed you",
    body: "A fellow advocate from King's College London is now following your progress.",
    read: true,
    _creationTime: Date.now() - 24 * 60 * 60 * 1000,
    icon: "Users",
  },
  {
    _id: "demo_notif_4",
    type: "session",
    title: "Group moot tomorrow",
    body: "Constitutional Law — Royal Prerogative. 4 advocates confirmed.",
    read: true,
    _creationTime: Date.now() - 36 * 60 * 60 * 1000,
    icon: "Calendar",
  },
];

// ── PORTFOLIO ──
export const DEMO_PORTFOLIO_ITEMS = [
  {
    _id: "demo_port_1",
    type: "case_note",
    title: "Case Note: R (Miller) v Secretary of State [2017] UKSC 5",
    area: "Constitutional Law",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    score: 4.2,
    summary: "Analysis of parliamentary sovereignty and the limits of royal prerogative in triggering Article 50.",
  },
  {
    _id: "demo_port_2",
    type: "session_summary",
    title: "Mentoring Session: Anticipatory Breach",
    area: "Contract Law",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    score: 3.8,
    summary: "Review of skeleton argument structure and mitigation of loss principles.",
  },
];

// ── LIBRARY ──
export const DEMO_LIBRARY_RESOURCES = [
  {
    _id: "demo_lib_1",
    title: "Public Law Revision Guide — Parliamentary Sovereignty",
    type: "pdf",
    uploadedBy: "Amara Khoury",
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    downloads: 23,
    module: "Public Law",
  },
  {
    _id: "demo_lib_2",
    title: "Tort Law Case Summary — Caparo Industries v Dickman",
    type: "pdf",
    uploadedBy: "Priya Sharma",
    uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    downloads: 41,
    module: "Tort Law",
  },
  {
    _id: "demo_lib_3",
    title: "Contract Law — Offer & Acceptance Flowchart",
    type: "image",
    uploadedBy: "James Okafor",
    uploadedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    downloads: 67,
    module: "Contract Law",
  },
];

// ── RESEARCH: Saved ──
export const DEMO_SAVED_RESEARCH = [
  {
    _id: "demo_research_1",
    query: "Duty of care three-stage test Caparo",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    resultCount: 12,
    module: "Tort Law",
    snippet: "The three-stage test from Caparo Industries v Dickman [1990] requires foreseeability, proximity, and that it is fair, just, and reasonable to impose a duty.",
  },
  {
    _id: "demo_research_2",
    query: "Parliamentary sovereignty Dicey Miller",
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    resultCount: 8,
    module: "Public Law",
    snippet: "Dicey's orthodox theory of parliamentary sovereignty was tested in R (Miller) v Secretary of State [2017], where the Supreme Court held that the government could not trigger Article 50 without an Act of Parliament.",
  },
];

// ── PARLIAMENT: Motions ──
export const DEMO_MOTIONS = [
  {
    _id: "demo_motion_1",
    title: "Motion to Establish a Peer Mentorship Programme",
    proposedBy: "Amara Khoury",
    proposedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "debate",
    category: "welfare",
    secondedBy: "James Okafor",
    votesFor: 12,
    votesAgainst: 3,
    abstentions: 2,
    issue: "New members often struggle to navigate the platform and develop effective advocacy skills without structured support.",
    rule: "Under Standing Order 4(1), the Assembly may establish committees and programmes by simple majority.",
    application: "A peer mentorship programme pairing experienced advocates with newcomers would improve retention and skill development across the Society.",
    conclusion: "This House resolves to establish a voluntary Peer Mentorship Programme, administered by a Mentorship Committee of three elected members.",
  },
];

// ── BADGES (earned by demo account) ──
export const DEMO_EARNED_BADGES = [
  { key: "first_moot", earnedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { key: "streak_3", earnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { key: "research_1", earnedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
];

// ── PROFILE: Stats for demo ──
export const DEMO_PROFILE_BADGES_COUNT = 3;
export const DEMO_PROFILE_SESSIONS_COUNT = 7;

// ── POSTS: Demo posts for the Posts feed ──
export const DEMO_POSTS = [
  {
    _id: "demo_post_1",
    _creationTime: Date.now() - 1 * 60 * 60 * 1000,
    profileId: "demo_adv_1",
    body: "Just discovered that the ratio in Donoghue v Stevenson isn't actually as broad as most textbooks suggest. Lord Atkin's 'neighbour principle' was obiter — the actual ratio is much narrower. Worth revisiting if you're doing tort moots.",
    category: "insight",
    caseReference: "Donoghue v Stevenson [1932] AC 562",
    sustainedCount: 8,
    overruledCount: 1,
    distinguishedCount: 3,
    bookmarkCount: 5,
    citedCount: 2,
    commentCount: 0,
    profile: { fullName: "Amara Khoury", universityShort: "KCL", chamber: "Blackstone", rank: "Senior Advocate" },
  },
  {
    _id: "demo_post_2",
    _creationTime: Date.now() - 3 * 60 * 60 * 1000,
    profileId: "demo_adv_2",
    body: "Quick moot tip: when your opponent cites a case you haven't prepared for, don't panic. Say 'My learned friend's reliance on [case] is noted, but I would respectfully distinguish it on the facts before this court.' Then distinguish on ANY factual difference. Buys you time and sounds professional.",
    category: "moot_tip",
    sustainedCount: 14,
    overruledCount: 0,
    distinguishedCount: 2,
    bookmarkCount: 11,
    citedCount: 4,
    commentCount: 0,
    profile: { fullName: "James Okafor", universityShort: "UCL", chamber: "Lincoln", rank: "Advocate" },
  },
  {
    _id: "demo_post_3",
    _creationTime: Date.now() - 6 * 60 * 60 * 1000,
    profileId: "demo_adv_3",
    body: "Does anyone know if Anns v Merton still has any persuasive authority after Murphy v Brentwood? My tutor says it's completely dead but I've seen it cited in two recent High Court decisions. Confused.",
    category: "question",
    caseReference: "Anns v Merton London Borough Council [1978] AC 728",
    sustainedCount: 3,
    overruledCount: 2,
    distinguishedCount: 6,
    bookmarkCount: 4,
    citedCount: 1,
    commentCount: 0,
    profile: { fullName: "Priya Sharma", universityShort: "LSE", chamber: "Gray", rank: "Advocate" },
  },
  {
    _id: "demo_post_4",
    _creationTime: Date.now() - 12 * 60 * 60 * 1000,
    profileId: "demo_adv_4",
    body: "Spotted an interesting case: the Supreme Court just applied proportionality review instead of Wednesbury in a human rights context. This could shift how we approach admin law submissions in moots. The traditional 'irrationality' ground might not be enough anymore.",
    category: "case_spot",
    sustainedCount: 6,
    overruledCount: 0,
    distinguishedCount: 4,
    bookmarkCount: 8,
    citedCount: 3,
    commentCount: 0,
    profile: { fullName: "Reuben Ellis", universityShort: "BBK", chamber: "Inner Temple", rank: "Junior Advocate" },
  },
];
