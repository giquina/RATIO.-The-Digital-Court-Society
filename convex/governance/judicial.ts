import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

// ═══════════════════════════════════════════
// CASES
// ═══════════════════════════════════════════

export const listCases = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cases = args.status
      ? await ctx.db.query("cases").withIndex("by_status", (idx) => idx.eq("status", args.status!)).order("desc").take(args.limit ?? 20)
      : await ctx.db.query("cases").order("desc").take(args.limit ?? 20);
    return Promise.all(
      cases.map(async (c) => {
        const filer = await ctx.db.get(c.filedById);
        const respondent = await ctx.db.get(c.respondentId);
        const judge = c.assignedJudgeId ? await ctx.db.get(c.assignedJudgeId) : null;
        return { ...c, filer, respondent, judge };
      })
    );
  },
});

export const getCaseById = query({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    const caseData = await ctx.db.get(args.caseId);
    if (!caseData) return null;

    const filer = await ctx.db.get(caseData.filedById);
    const respondent = await ctx.db.get(caseData.respondentId);
    const judge = caseData.assignedJudgeId ? await ctx.db.get(caseData.assignedJudgeId) : null;

    const submissions = await ctx.db
      .query("caseSubmissions")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect();

    const hearings = await ctx.db
      .query("hearings")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect();

    const judgments = await ctx.db
      .query("judgments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect();

    return { ...caseData, filer, respondent, judge, submissions, hearings, judgments };
  },
});

export const fileCase = mutation({
  args: {
    filedById: v.id("profiles"),
    respondentId: v.id("profiles"),
    title: v.string(),
    issue: v.string(),
    rule: v.string(),
    application: v.string(),
    conclusion: v.string(),
    remedySought: v.string(),
    relatedMotionId: v.optional(v.id("motions")),
  },
  handler: async (ctx, args) => {
    // Vexatious filing check: 3+ dismissed cases = cooldown
    const filedCases = await ctx.db
      .query("cases")
      .withIndex("by_filer", (q) => q.eq("filedById", args.filedById))
      .collect();
    const dismissedCount = filedCases.filter((c) => c.status === "closed").length;
    if (dismissedCount >= 3) {
      throw new Error("Filing restricted: too many dismissed cases. Please wait before filing again.");
    }

    const caseId = await ctx.db.insert("cases", {
      ...args,
      status: "filed",
      assignedJudgeId: undefined,
    });

    // Create initial submission
    await ctx.db.insert("caseSubmissions", {
      caseId,
      submittedById: args.filedById,
      type: "initial_filing",
      content: `## Issue\n${args.issue}\n\n## Rule\n${args.rule}\n\n## Application\n${args.application}\n\n## Conclusion\n${args.conclusion}`,
      submittedAt: new Date().toISOString(),
    });

    // Audit
    await ctx.db.insert("auditLog", {
      actorId: args.filedById,
      action: "case_filed",
      targetType: "case",
      targetId: caseId,
      details: args.title,
    });

    return caseId;
  },
});

export const addSubmission = mutation({
  args: {
    caseId: v.id("cases"),
    submittedById: v.id("profiles"),
    type: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("caseSubmissions", {
      ...args,
      submittedAt: new Date().toISOString(),
    });
  },
});

// ═══════════════════════════════════════════
// JUDGMENTS
// ═══════════════════════════════════════════

export const issueJudgment = mutation({
  args: {
    caseId: v.id("cases"),
    hearingId: v.optional(v.id("hearings")),
    judgeId: v.id("profiles"),
    outcome: v.string(),
    reasoning: v.string(),
    remedy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const judgmentId = await ctx.db.insert("judgments", {
      ...args,
      isAppealable: true,
      publishedAt: new Date().toISOString(),
    });

    await ctx.db.patch(args.caseId, { status: "judgment" });

    await ctx.db.insert("auditLog", {
      actorId: args.judgeId,
      action: "judgment_issued",
      targetType: "case",
      targetId: args.caseId,
      details: args.outcome,
    });

    return judgmentId;
  },
});

export const listJudgments = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const judgments = await ctx.db
      .query("judgments")
      .order("desc")
      .take(args.limit ?? 20);
    return Promise.all(
      judgments.map(async (j) => {
        const caseData = await ctx.db.get(j.caseId);
        const judge = await ctx.db.get(j.judgeId);
        return { ...j, case: caseData, judge };
      })
    );
  },
});
