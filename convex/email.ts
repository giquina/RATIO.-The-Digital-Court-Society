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
