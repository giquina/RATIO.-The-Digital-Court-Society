/**
 * Discord webhook notification utility.
 * Sends rich embed messages to a Discord channel via webhook URL.
 *
 * Used by internal actions in convex/discord.ts — never called directly
 * from mutations (mutations cannot make external HTTP requests).
 */

export async function notifyDiscord(
  webhookUrl: string,
  title: string,
  description: string,
  color: number = 0x5865f2,
  fields?: Array<{ name: string; value: string; inline?: boolean }>
) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title,
            description,
            color,
            fields,
            timestamp: new Date().toISOString(),
            footer: { text: "Ratio \u2014 The Digital Court Society" },
          },
        ],
      }),
    });
  } catch (error) {
    console.error("[discord] Webhook notification failed:", error);
    // Don't throw — notifications should never break the app
  }
}
