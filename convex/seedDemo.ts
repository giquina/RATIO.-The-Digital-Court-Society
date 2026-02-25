"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// ═══════════════════════════════════════════════════════════════
// DEMO ACCOUNT SEED
// ═══════════════════════════════════════════════════════════════
// Creates the demo@ratio.law account through the OFFICIAL auth flow.
// Execute via: npx convex run seedDemo:seedDemoAccount
// Safe to re-run (idempotent — checks for existing account first).

export const seedDemoAccount = action({
  args: {},
  handler: async (ctx) => {
    const email = "demo@ratio.law";
    const password = "DemoAdvocate2026";
    const name = "Demo Advocate";

    // Check if account already exists
    // @ts-expect-error — deep type instantiation from Convex internal API refs
    const existing: any = await ctx.runQuery(internal.seed.checkDemoExists);
    if (existing && existing.secret) {
      // Account exists — delete it and recreate through official flow
      await ctx.runMutation(internal.seed.deleteDemoAccount, { email });
    }

    // Create account through the OFFICIAL auth:store flow
    // This is the exact same code path used by the registration page.
    // The store mutation handles password hashing internally.
    const result: any = await (ctx as any).runMutation("auth:store" as any, {
      args: {
        type: "createAccountFromCredentials",
        provider: "password",
        account: { id: email, secret: password },
        profile: { email },
        shouldLinkViaEmail: false,
        shouldLinkViaPhone: false,
      },
    });

    // Update the user record with the name
    if (result && result.user) {
      await ctx.runMutation(internal.seed.updateDemoUser, {
        userId: result.user._id,
        name,
      });
    }

    // Create profile so user skips onboarding
    await ctx.runMutation(internal.seed.createDemoProfile, {
      email,
      name,
    });
  },
});
