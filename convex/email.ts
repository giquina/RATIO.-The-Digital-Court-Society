"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// ═══════════════════════════════════════════
// EMAIL SERVICE (Resend)
// ═══════════════════════════════════════════
// Sends transactional emails via Resend API.
// Called from other Convex functions via internal.email.send.
//
// Required env var: RESEND_API_KEY
// Optional env var: RESEND_FROM_EMAIL (defaults to onboarding@resend.dev)

export const send = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[email] RESEND_API_KEY not set — skipping email send");
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Ratio <onboarding@resend.dev>";

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: args.to,
          subject: args.subject,
          html: args.html,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        console.error(`[email] Resend error ${response.status}: ${body}`);
        return { success: false, error: body };
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (err) {
      console.error("[email] Failed to send:", err);
      return { success: false, error: String(err) };
    }
  },
});

// ── Pre-built email templates as HTML strings ──
// These render React Email components to HTML at build time isn't possible in
// Convex actions (no JSX runtime). Instead, we use simple HTML templates.
// For complex templates, render on the Next.js side and pass HTML to this action.

export const sendWelcome = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="background-color:#0C1220;font-family:'DM Sans',-apple-system,sans-serif;margin:0;padding:0">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <div style="text-align:center;padding-bottom:24px">
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:700;color:#F2EDE6;letter-spacing:0.12em;margin:0">RATIO<span style="color:#C9A84C">.</span></p>
  </div>
  <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:700;color:#F2EDE6;line-height:28px;margin:0 0 16px">Welcome to the Bar, ${args.name}</p>
  <p style="color:rgba(242,237,230,0.6);font-size:14px;line-height:22px;margin:0 0 12px">Your account has been created. Ratio is a constitutional training ground for UK law advocates — practice mooting, build your legal portfolio, and advance through the ranks.</p>
  <p style="color:rgba(242,237,230,0.6);font-size:14px;line-height:22px;margin:0 0 12px">Here is how to get started:</p>
  <p style="color:rgba(242,237,230,0.6);font-size:14px;line-height:22px;margin:0 0 4px;padding-left:8px">1. Complete your profile in Settings</p>
  <p style="color:rgba(242,237,230,0.6);font-size:14px;line-height:22px;margin:0 0 4px;padding-left:8px">2. Join or create a moot court session</p>
  <p style="color:rgba(242,237,230,0.6);font-size:14px;line-height:22px;margin:0 0 4px;padding-left:8px">3. Try AI Practice for solo preparation</p>
  <div style="text-align:center;margin:24px 0">
    <a href="https://ratiothedigitalcourtsociety.com/home" style="background-color:#C9A84C;color:#0C1220;font-size:14px;font-weight:700;padding:12px 28px;border-radius:12px;text-decoration:none;display:inline-block">Enter the Court</a>
  </div>
  <hr style="border-color:rgba(255,255,255,0.06);margin:32px 0 16px">
  <div style="text-align:center">
    <p style="color:rgba(242,237,230,0.3);font-size:11px;line-height:16px;margin:0">Ratio — The Digital Court Society</p>
  </div>
</div>
</body>
</html>`.trim();

    return ctx.runAction(internal.email.send, {
      to: args.to,
      subject: "Welcome to Ratio — Your advocacy begins",
      html,
    });
  },
});

// ── Admin notification: new signup ──
// Sends an email to ADMIN_EMAIL whenever a new advocate completes onboarding.
// Called via ctx.scheduler.runAfter(0, ...) from profile creation mutations.
export const notifyAdminNewSignup = internalAction({
  args: {
    name: v.string(),
    userType: v.optional(v.string()),
    university: v.optional(v.string()),
    chamber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn("[email] ADMIN_EMAIL not set — skipping admin signup notification");
      return;
    }

    const typeLabel = args.userType === "professional" ? "Professional" : "Student";
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London",
    });

    const detailRows = [
      `<tr><td style="color:rgba(242,237,230,0.4);font-size:13px;padding:6px 12px 6px 0;white-space:nowrap">Type</td><td style="color:#F2EDE6;font-size:13px;padding:6px 0">${typeLabel}</td></tr>`,
      args.university
        ? `<tr><td style="color:rgba(242,237,230,0.4);font-size:13px;padding:6px 12px 6px 0;white-space:nowrap">University</td><td style="color:#F2EDE6;font-size:13px;padding:6px 0">${args.university}</td></tr>`
        : "",
      args.chamber
        ? `<tr><td style="color:rgba(242,237,230,0.4);font-size:13px;padding:6px 12px 6px 0;white-space:nowrap">Chamber</td><td style="color:#F2EDE6;font-size:13px;padding:6px 0">${args.chamber}</td></tr>`
        : "",
      `<tr><td style="color:rgba(242,237,230,0.4);font-size:13px;padding:6px 12px 6px 0;white-space:nowrap">Joined</td><td style="color:#F2EDE6;font-size:13px;padding:6px 0">${dateStr}</td></tr>`,
    ]
      .filter(Boolean)
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="background-color:#0C1220;font-family:'DM Sans',-apple-system,sans-serif;margin:0;padding:0">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <div style="text-align:center;padding-bottom:24px">
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:700;color:#F2EDE6;letter-spacing:0.12em;margin:0">RATIO<span style="color:#C9A84C">.</span></p>
  </div>
  <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:700;color:#F2EDE6;line-height:26px;margin:0 0 16px">New Advocate Registered</p>
  <p style="color:rgba(242,237,230,0.6);font-size:14px;line-height:22px;margin:0 0 16px"><strong style="color:#F2EDE6">${args.name}</strong> has joined Ratio and completed onboarding.</p>
  <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
    ${detailRows}
  </table>
  <div style="text-align:center;margin:24px 0">
    <a href="https://ratiothedigitalcourtsociety.com/rankings" style="background-color:#C9A84C;color:#0C1220;font-size:13px;font-weight:700;padding:10px 24px;border-radius:10px;text-decoration:none;display:inline-block">View Rankings</a>
  </div>
  <hr style="border-color:rgba(255,255,255,0.06);margin:32px 0 16px">
  <div style="text-align:center">
    <p style="color:rgba(242,237,230,0.3);font-size:11px;line-height:16px;margin:0">Ratio — Admin Notification</p>
  </div>
</div>
</body>
</html>`.trim();

    return ctx.runAction(internal.email.send, {
      to: adminEmail,
      subject: `New Advocate: ${args.name} joined Ratio`,
      html,
    });
  },
});
