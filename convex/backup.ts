import { internalMutation } from "./_generated/server";

/**
 * Weekly backup — exports critical tables to Convex file storage.
 *
 * Triggered by cron (Sunday 03:00 UTC). Serialises profiles, users,
 * subscriptions, adminRoles, and analyticsDaily into a single JSON blob,
 * stores it in Convex file storage, and records metadata in the `backups` table.
 *
 * Retention: keeps the last 4 backups (rolling monthly window).
 */

const CRITICAL_TABLES = [
  "profiles",
  "users",
  "subscriptions",
  "adminRoles",
  "analyticsDaily",
] as const;

const MAX_BACKUPS = 4; // keep ~1 month of weekly backups

export const weeklyBackup = internalMutation({
  args: {},
  handler: async (ctx) => {
    const data: Record<string, unknown[]> = {};
    let totalRecords = 0;

    // Export each critical table
    for (const tableName of CRITICAL_TABLES) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = await (ctx.db as any).query(tableName).collect();
      data[tableName] = rows;
      totalRecords += rows.length;
    }

    // Serialize and store
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const storageId = await ctx.storage.store(blob);

    // Record metadata
    await ctx.db.insert("backups", {
      type: "weekly_snapshot",
      tables: [...CRITICAL_TABLES],
      storageId,
      sizeBytes: json.length,
      recordCount: totalRecords,
      createdAt: new Date().toISOString(),
    });

    // Prune old backups beyond retention limit
    const allBackups = await ctx.db
      .query("backups")
      .withIndex("by_type", (q) => q.eq("type", "weekly_snapshot"))
      .collect();

    // Sort by date descending and delete oldest beyond MAX_BACKUPS
    const sorted = allBackups.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (let i = MAX_BACKUPS; i < sorted.length; i++) {
      // Delete the stored file and the metadata record
      await ctx.storage.delete(sorted[i].storageId);
      await ctx.db.delete(sorted[i]._id);
    }

    return { totalRecords, sizeBytes: json.length, tablesExported: CRITICAL_TABLES.length };
  },
});
