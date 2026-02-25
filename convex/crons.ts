import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// ── Daily analytics snapshot at 08:00 UTC ──
crons.daily(
  "daily-analytics-snapshot",
  { hourUTC: 8, minuteUTC: 0 },
  internal.analytics.computeDailySnapshot
);

// ── Weekly cohort retention at 09:00 UTC every Monday ──
crons.weekly(
  "weekly-cohorts",
  { dayOfWeek: "monday", hourUTC: 9, minuteUTC: 0 },
  internal.analytics.computeWeeklyCohorts
);

// ── Weekly email digest at 08:30 UTC every Monday ──
crons.weekly(
  "weekly-digest",
  { dayOfWeek: "monday", hourUTC: 8, minuteUTC: 30 },
  internal.digest.sendWeeklyDigest
);

export default crons;
