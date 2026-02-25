"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// ═══════════════════════════════════════════
// WEEKLY EMAIL DIGEST
// ═══════════════════════════════════════════
// Sends a weekly KPI summary email to the admin address.
// Scheduled by cron every Monday at 08:30 UTC.
//
// Required env var: ADMIN_EMAIL
// Uses internal.email.send (which requires RESEND_API_KEY)

// ── Price mapping (pence per month) — mirrors analytics.ts ──
const PLAN_MRR_PENCE: Record<string, number> = {
  free: 0,
  premium: 599,
  premium_plus: 799,
  professional: 1499,
  professional_plus: 2499,
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  premium: "Premium",
  premium_plus: "Premium+",
  professional: "Professional",
  professional_plus: "Professional+",
};

export const sendWeeklyDigest = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn("[digest] ADMIN_EMAIL not set — skipping weekly digest");
      return;
    }

    // ── Compute the 7-day window ──
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86_400_000);
    const weekStart = weekAgo.getTime();
    const weekEnd = now.getTime();

    // ── Gather data via internal queries ──
    // We run queries through ctx.runQuery to get snapshot data
    const latestSnapshot = await ctx.runQuery(
      internal.analytics.getLatestSnapshot
    );

    const weekStartDate = weekAgo.toISOString().slice(0, 10);
    const weekEndDate = now.toISOString().slice(0, 10);
    const weekSnapshots = await ctx.runQuery(
      internal.analytics.getSnapshotRange,
      { startDate: weekStartDate, endDate: weekEndDate }
    );

    // Also get previous week snapshots for comparison
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86_400_000);
    const prevWeekStartDate = twoWeeksAgo.toISOString().slice(0, 10);
    const prevWeekSnapshots = await ctx.runQuery(
      internal.analytics.getSnapshotRange,
      { startDate: prevWeekStartDate, endDate: weekStartDate }
    );

    // ── Aggregate this week's KPIs from snapshots ──
    let totalNewSignups = 0;
    let totalAiSessions = 0;
    let latestActiveUsers = 0;
    let latestMrrCents = 0;
    let latestTotalUsers = 0;
    let totalChurned = 0;

    for (const snap of weekSnapshots) {
      totalNewSignups += snap.newSignups ?? 0;
      totalAiSessions += snap.aiSessionsCompleted ?? 0;
      totalChurned += snap.churnedUsers ?? 0;
    }

    if (weekSnapshots.length > 0) {
      const latest = weekSnapshots[weekSnapshots.length - 1];
      latestActiveUsers = latest.activeUsers ?? 0;
      latestMrrCents = latest.mrrCents ?? 0;
      latestTotalUsers = latest.totalUsers ?? 0;
    } else if (latestSnapshot) {
      // Fallback to the last available snapshot
      latestActiveUsers = latestSnapshot.activeUsers ?? 0;
      latestMrrCents = latestSnapshot.mrrCents ?? 0;
      latestTotalUsers = latestSnapshot.totalUsers ?? 0;
    }

    // ── Aggregate previous week for comparison ──
    let prevNewSignups = 0;
    let prevAiSessions = 0;
    let prevMrrCents = 0;
    let prevChurned = 0;

    for (const snap of prevWeekSnapshots) {
      prevNewSignups += snap.newSignups ?? 0;
      prevAiSessions += snap.aiSessionsCompleted ?? 0;
      prevChurned += snap.churnedUsers ?? 0;
    }

    if (prevWeekSnapshots.length > 0) {
      prevMrrCents =
        prevWeekSnapshots[prevWeekSnapshots.length - 1].mrrCents ?? 0;
    }

    // ── Compute WoW changes ──
    const signupDelta = totalNewSignups - prevNewSignups;
    const aiDelta = totalAiSessions - prevAiSessions;
    const mrrDelta = latestMrrCents - prevMrrCents;
    const churnDelta = totalChurned - prevChurned;

    // ── Get recent signups for the "Top 5 New Signups" section ──
    // We need to fetch profiles created in the past 7 days
    // Since we can't use internal queries for profiles directly here
    // (we need the DB), we'll use the snapshot data for the summary.
    // For the top signups list, we'll note it's data-dependent.

    // ── Compute new subscription events ──
    // Subscriptions created/upgraded/canceled this week
    const newSubsThisWeek = weekSnapshots.reduce(
      (acc, s) => acc + (s.paidUsers > 0 ? 1 : 0),
      0
    );

    // ── Format helpers ──
    function formatPence(pence: number): string {
      return `\u00a3${(pence / 100).toFixed(2)}`;
    }

    function formatDelta(delta: number, isPositiveGood = true): string {
      if (delta === 0) return '<span style="color:rgba(242,237,230,0.4)">no change</span>';
      const arrow = delta > 0 ? "\u2191" : "\u2193";
      const isGood = isPositiveGood ? delta > 0 : delta < 0;
      const color = isGood ? "#4ade80" : "#f87171";
      return `<span style="color:${color}">${arrow} ${Math.abs(delta)}</span>`;
    }

    function formatMrrDelta(delta: number): string {
      if (delta === 0) return '<span style="color:rgba(242,237,230,0.4)">no change</span>';
      const arrow = delta > 0 ? "\u2191" : "\u2193";
      const color = delta > 0 ? "#4ade80" : "#f87171";
      return `<span style="color:${color}">${arrow} ${formatPence(Math.abs(delta))}</span>`;
    }

    // ── Format the date range ──
    const dateRange = `${weekAgo.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} \u2013 ${now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

    // ── Build the HTML email ──
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color:#0C1220;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;color:#F2EDE6">
<div style="max-width:600px;margin:0 auto;padding:32px 24px">

  <!-- Header -->
  <div style="text-align:center;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.06)">
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:700;color:#F2EDE6;letter-spacing:0.12em;margin:0">RATIO<span style="color:#C9A84C">.</span></p>
    <p style="color:rgba(242,237,230,0.4);font-size:12px;margin:8px 0 0;letter-spacing:0.05em">WEEKLY OPERATIONS DIGEST</p>
  </div>

  <!-- Date range -->
  <div style="text-align:center;padding:20px 0 24px">
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#F2EDE6;margin:0">${dateRange}</p>
  </div>

  <!-- KPI Summary Table -->
  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead>
      <tr>
        <th style="text-align:left;padding:10px 12px;font-size:11px;color:rgba(242,237,230,0.4);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.06)">Metric</th>
        <th style="text-align:right;padding:10px 12px;font-size:11px;color:rgba(242,237,230,0.4);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.06)">This Week</th>
        <th style="text-align:right;padding:10px 12px;font-size:11px;color:rgba(242,237,230,0.4);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.06)">WoW</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
        <td style="padding:12px;font-size:14px;color:#F2EDE6">New Signups</td>
        <td style="padding:12px;font-size:14px;color:#F2EDE6;text-align:right;font-weight:700">${totalNewSignups}</td>
        <td style="padding:12px;font-size:13px;text-align:right">${formatDelta(signupDelta)}</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
        <td style="padding:12px;font-size:14px;color:#F2EDE6">Total Advocates</td>
        <td style="padding:12px;font-size:14px;color:#F2EDE6;text-align:right;font-weight:700">${latestTotalUsers}</td>
        <td style="padding:12px;font-size:13px;text-align:right;color:rgba(242,237,230,0.4)">&mdash;</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
        <td style="padding:12px;font-size:14px;color:#F2EDE6">Active Users (latest day)</td>
        <td style="padding:12px;font-size:14px;color:#F2EDE6;text-align:right;font-weight:700">${latestActiveUsers}</td>
        <td style="padding:12px;font-size:13px;text-align:right;color:rgba(242,237,230,0.4)">&mdash;</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04);background-color:rgba(201,168,76,0.06)">
        <td style="padding:12px;font-size:14px;color:#C9A84C;font-weight:600">MRR</td>
        <td style="padding:12px;font-size:14px;color:#C9A84C;text-align:right;font-weight:700">${formatPence(latestMrrCents)}</td>
        <td style="padding:12px;font-size:13px;text-align:right">${formatMrrDelta(mrrDelta)}</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
        <td style="padding:12px;font-size:14px;color:#F2EDE6">AI Sessions Completed</td>
        <td style="padding:12px;font-size:14px;color:#F2EDE6;text-align:right;font-weight:700">${totalAiSessions}</td>
        <td style="padding:12px;font-size:13px;text-align:right">${formatDelta(aiDelta)}</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
        <td style="padding:12px;font-size:14px;color:#F2EDE6">Churned Users</td>
        <td style="padding:12px;font-size:14px;color:#F2EDE6;text-align:right;font-weight:700">${totalChurned}</td>
        <td style="padding:12px;font-size:13px;text-align:right">${formatDelta(churnDelta, false)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Notable Events Section -->
  <div style="background-color:#182640;border-radius:14px;padding:20px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.06)">
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;font-weight:700;color:#F2EDE6;margin:0 0 12px">Notable Events</p>
    ${totalNewSignups > 0
      ? `<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#4ade80;margin-right:8px;vertical-align:middle"></span>
          <span style="font-size:13px;color:rgba(242,237,230,0.7)">${totalNewSignups} new advocate${totalNewSignups !== 1 ? "s" : ""} joined this week</span>
        </div>`
      : ""
    }
    ${mrrDelta > 0
      ? `<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#C9A84C;margin-right:8px;vertical-align:middle"></span>
          <span style="font-size:13px;color:rgba(242,237,230,0.7)">MRR increased by ${formatPence(mrrDelta)}</span>
        </div>`
      : ""
    }
    ${mrrDelta < 0
      ? `<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#f87171;margin-right:8px;vertical-align:middle"></span>
          <span style="font-size:13px;color:rgba(242,237,230,0.7)">MRR decreased by ${formatPence(Math.abs(mrrDelta))}</span>
        </div>`
      : ""
    }
    ${totalChurned > 0
      ? `<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#f87171;margin-right:8px;vertical-align:middle"></span>
          <span style="font-size:13px;color:rgba(242,237,230,0.7)">${totalChurned} cancellation${totalChurned !== 1 ? "s" : ""} this week</span>
        </div>`
      : ""
    }
    ${totalNewSignups === 0 && mrrDelta === 0 && totalChurned === 0
      ? `<p style="font-size:13px;color:rgba(242,237,230,0.4);margin:0">No notable events this week.</p>`
      : ""
    }
  </div>

  <!-- Daily Breakdown Mini Table -->
  ${weekSnapshots.length > 0
    ? `<div style="background-color:#182640;border-radius:14px;padding:20px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.06)">
        <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;font-weight:700;color:#F2EDE6;margin:0 0 12px">Daily Breakdown</p>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th style="text-align:left;padding:6px 8px;font-size:10px;color:rgba(242,237,230,0.4);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.06)">Date</th>
              <th style="text-align:right;padding:6px 8px;font-size:10px;color:rgba(242,237,230,0.4);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.06)">Signups</th>
              <th style="text-align:right;padding:6px 8px;font-size:10px;color:rgba(242,237,230,0.4);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.06)">Active</th>
              <th style="text-align:right;padding:6px 8px;font-size:10px;color:rgba(242,237,230,0.4);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.06)">AI</th>
            </tr>
          </thead>
          <tbody>
            ${weekSnapshots
              .map(
                (s: any) => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.03)">
                <td style="padding:6px 8px;font-size:12px;color:rgba(242,237,230,0.7)">${s.date}</td>
                <td style="padding:6px 8px;font-size:12px;color:#F2EDE6;text-align:right;font-weight:600">${s.newSignups ?? 0}</td>
                <td style="padding:6px 8px;font-size:12px;color:#F2EDE6;text-align:right">${s.activeUsers ?? 0}</td>
                <td style="padding:6px 8px;font-size:12px;color:#F2EDE6;text-align:right">${s.aiSessionsCompleted ?? 0}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`
    : ""
  }

  <!-- CTA -->
  <div style="text-align:center;margin:28px 0">
    <a href="https://ratiothedigitalcourtsociety.com/dashboard" style="background-color:#C9A84C;color:#0C1220;font-size:13px;font-weight:700;padding:12px 28px;border-radius:12px;text-decoration:none;display:inline-block;letter-spacing:0.02em">Open Admin Dashboard</a>
  </div>

  <!-- Footer -->
  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:32px 0 16px">
  <div style="text-align:center">
    <p style="color:rgba(242,237,230,0.3);font-size:11px;line-height:16px;margin:0">Ratio Weekly Digest &middot; Sent automatically every Monday at 08:30 UTC</p>
    <p style="color:rgba(242,237,230,0.2);font-size:10px;margin:4px 0 0">The Digital Court Society</p>
  </div>

</div>
</body>
</html>`.trim();

    // ── Send via Resend ──
    const weekLabel = `${weekAgo.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} - ${now.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
    const subject = `Ratio Weekly Digest: ${weekLabel} | ${totalNewSignups} signups, ${formatPence(latestMrrCents)} MRR`;

    await ctx.runAction(internal.email.send, {
      to: adminEmail,
      subject,
      html,
    });

    console.log(
      `[digest] Weekly digest sent to ${adminEmail} — ${totalNewSignups} signups, ${formatPence(latestMrrCents)} MRR`
    );
  },
});
