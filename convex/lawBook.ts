import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

/**
 * Submit a new Law Book topic for peer review.
 *
 * Creates:
 * 1. A lawBookTopics entry (status = "review")
 * 2. A lawBookVersions entry (the initial draft, status = "pending_review")
 * 3. A lawBookContributions entry (type = "create", 10 points)
 * 4. lawBookCitations entries for each citation provided
 */
export const submitTopic = mutation({
  args: {
    module: v.string(), // slug, e.g. "contract"
    title: v.string(),
    issue: v.string(),
    rule: v.string(),
    application: v.string(),
    conclusion: v.string(),
    citations: v.array(
      v.object({
        type: v.string(), // "Case", "Statute", "Article", "Textbook"
        text: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // ── Auth ──
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found — complete onboarding first");

    // ── Validate ──
    if (!args.title.trim()) throw new Error("Title is required");
    if (!args.issue.trim()) throw new Error("Issue section is required");
    if (!args.rule.trim()) throw new Error("Rule section is required");
    if (!args.application.trim()) throw new Error("Application section is required");
    if (!args.conclusion.trim()) throw new Error("Conclusion section is required");
    if (args.citations.length < 2) throw new Error("At least 2 citations are required");

    // ── Resolve module ──
    const lawModule = await ctx.db
      .query("lawBookModules")
      .withIndex("by_slug", (q) => q.eq("slug", args.module))
      .first();
    if (!lawModule) throw new Error(`Module "${args.module}" not found`);

    // ── Build slug from title ──
    const slug = args.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // ── Build IRAC markdown content ──
    const content = [
      `# ${args.title.trim()}`,
      "",
      "## Issue",
      args.issue.trim(),
      "",
      "## Rule",
      args.rule.trim(),
      "",
      "## Application",
      args.application.trim(),
      "",
      "## Conclusion",
      args.conclusion.trim(),
    ].join("\n");

    // ── Create topic ──
    const topicId = await ctx.db.insert("lawBookTopics", {
      moduleId: lawModule._id,
      title: args.title.trim(),
      slug,
      summary: args.issue.trim().slice(0, 200),
      status: "review",
      contributorCount: 1,
      citationCount: args.citations.length,
      viewCount: 0,
    });

    // ── Create initial version ──
    const versionId = await ctx.db.insert("lawBookVersions", {
      topicId,
      authorId: profile._id,
      content,
      versionNumber: 1,
      changeNote: "Initial submission",
      status: "pending_review",
    });

    // ── Link current version back to topic ──
    await ctx.db.patch(topicId, { currentVersionId: versionId });

    // ── Record contribution ──
    await ctx.db.insert("lawBookContributions", {
      userId: profile._id,
      topicId,
      versionId,
      type: "create",
      pointsAwarded: 10,
    });

    // ── Insert citations ──
    for (const citation of args.citations) {
      await ctx.db.insert("lawBookCitations", {
        topicId,
        versionId,
        citationType: citation.type.toLowerCase(), // "case", "statute", "article", "textbook"
        citationText: citation.text,
        oscolaFormatted: citation.text, // user is asked for OSCOLA format already
      });
    }

    // ── Update module topic count ──
    await ctx.db.patch(lawModule._id, {
      topicCount: lawModule.topicCount + 1,
    });

    return topicId;
  },
});
