"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { notifyDiscord } from "./lib/discord";

// ═══════════════════════════════════════════
// DISCORD WEBHOOK NOTIFICATIONS
// ═══════════════════════════════════════════
// Internal actions called via ctx.scheduler.runAfter(0, ...)
// from mutations. Each action checks for the DISCORD_WEBHOOK_URL
// env var and silently skips if it is not configured.

// ── New user registration ──
export const notifyNewUser = internalAction({
  args: {
    name: v.string(),
    userType: v.optional(v.string()),
    university: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const fields: Array<{ name: string; value: string; inline?: boolean }> = [];
    if (args.userType) {
      fields.push({
        name: "Type",
        value: args.userType === "professional" ? "Professional" : "Student",
        inline: true,
      });
    }
    if (args.university) {
      fields.push({ name: "University", value: args.university, inline: true });
    }

    await notifyDiscord(
      webhookUrl,
      "\ud83c\udf93 New Advocate Joined",
      `**${args.name}** has joined Ratio.`,
      0x57f287, // green
      fields.length > 0 ? fields : undefined
    );
  },
});

// ── New moot session created ──
export const notifyNewSession = internalAction({
  args: {
    title: v.string(),
    creatorName: v.string(),
    module: v.string(),
    type: v.string(),
    date: v.string(),
    university: v.string(),
    isCrossUniversity: v.boolean(),
  },
  handler: async (_ctx, args) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const fields = [
      { name: "Module", value: args.module, inline: true },
      { name: "Type", value: args.type, inline: true },
      { name: "Date", value: args.date, inline: true },
      { name: "University", value: args.university, inline: true },
    ];

    if (args.isCrossUniversity) {
      fields.push({ name: "Cross-University", value: "Yes", inline: true });
    }

    await notifyDiscord(
      webhookUrl,
      "\u2696\ufe0f New Session Created",
      `**${args.creatorName}** created **${args.title}**`,
      0x5865f2, // blurple
      fields
    );
  },
});

// ── AI Judge session started ──
export const notifyAiSessionStarted = internalAction({
  args: {
    advocateName: v.string(),
    mode: v.string(),
    areaOfLaw: v.string(),
    caseTitle: v.string(),
  },
  handler: async (_ctx, args) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const modeLabel =
      args.mode.charAt(0).toUpperCase() + args.mode.slice(1);

    await notifyDiscord(
      webhookUrl,
      "\ud83e\uddd1\u200d\u2696\ufe0f AI Practice Started",
      `**${args.advocateName}** started an AI **${modeLabel}** session.`,
      0xeb459e, // fuchsia
      [
        { name: "Area of Law", value: args.areaOfLaw, inline: true },
        { name: "Case", value: args.caseTitle, inline: true },
      ]
    );
  },
});

// ── AI Judge session completed ──
export const notifyAiSessionCompleted = internalAction({
  args: {
    advocateName: v.string(),
    mode: v.string(),
    areaOfLaw: v.string(),
    overallScore: v.number(),
  },
  handler: async (_ctx, args) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const modeLabel =
      args.mode.charAt(0).toUpperCase() + args.mode.slice(1);

    await notifyDiscord(
      webhookUrl,
      "\u2705 AI Session Completed",
      `**${args.advocateName}** completed an AI **${modeLabel}** session with a score of **${args.overallScore}/5**.`,
      0xfee75c, // yellow
      [{ name: "Area of Law", value: args.areaOfLaw, inline: true }]
    );
  },
});

// ── Subscription event ──
export const notifySubscription = internalAction({
  args: {
    event: v.string(), // "created" | "upgraded" | "downgraded" | "canceled" | "reactivated"
    plan: v.string(),
    previousPlan: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const titles: Record<string, string> = {
      created: "\ud83d\udcb3 New Subscription",
      upgraded: "\u2b06\ufe0f Subscription Upgraded",
      downgraded: "\u2b07\ufe0f Subscription Downgraded",
      canceled: "\u274c Subscription Cancelled",
      reactivated: "\ud83d\udd04 Subscription Reactivated",
    };

    const colors: Record<string, number> = {
      created: 0x57f287,
      upgraded: 0x57f287,
      downgraded: 0xfee75c,
      canceled: 0xed4245,
      reactivated: 0x57f287,
    };

    const fields = [
      { name: "Plan", value: args.plan, inline: true },
    ];
    if (args.previousPlan) {
      fields.push({
        name: "Previous Plan",
        value: args.previousPlan,
        inline: true,
      });
    }

    await notifyDiscord(
      webhookUrl,
      titles[args.event] ?? "\ud83d\udcb3 Subscription Event",
      `A subscription event occurred: **${args.event}**`,
      colors[args.event] ?? 0x5865f2,
      fields
    );
  },
});

// ── Error / critical event ──
export const notifyError = internalAction({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (_ctx, args) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    await notifyDiscord(
      webhookUrl,
      `\u26a0\ufe0f ${args.title}`,
      args.description,
      0xed4245 // red
    );
  },
});
