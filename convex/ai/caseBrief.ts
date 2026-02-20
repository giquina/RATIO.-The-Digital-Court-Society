import { v } from "convex/values";
import { action } from "../_generated/server";

export const generate = action({
  args: {
    caseName: v.string(),
    caseText: v.optional(v.string()),
    citation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const prompt = `You are a UK law case brief generator. Generate a structured case brief for the following case.

${args.citation ? `Citation: ${args.citation}` : ""}
Case: ${args.caseName}
${args.caseText ? `\nCase text / notes:\n${args.caseText}` : ""}

Return a JSON object with this exact structure:
{
  "caseName": "Full case name",
  "citation": "Neutral citation if known",
  "court": "Which court heard this",
  "year": "Year of decision",
  "facts": "Key material facts (3-5 sentences)",
  "issue": "The legal question(s) before the court",
  "held": "What the court decided",
  "ratioDecidendi": "The binding principle / reason for the decision",
  "obiterDicta": "Any notable non-binding statements (or 'None identified')",
  "application": "How this case has been applied in subsequent decisions",
  "significance": "Why this case matters for UK law students",
  "keyQuotes": ["Up to 3 important quotes from the judgment"],
  "relatedCases": ["Up to 5 related case names with brief relevance note"]
}

Return ONLY valid JSON. No markdown formatting.`;

    if (anthropicKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await response.json();
        const text = data.content?.[0]?.text || "";
        const cleaned = text.replace(/```json|```/g, "").trim();
        return { brief: JSON.parse(cleaned), provider: "anthropic" };
      } catch (e) {
        console.error("Anthropic case brief error:", e);
      }
    }

    if (openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1500,
            temperature: 0.3,
          }),
        });
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";
        const cleaned = text.replace(/```json|```/g, "").trim();
        return { brief: JSON.parse(cleaned), provider: "openai" };
      } catch (e) {
        console.error("OpenAI case brief error:", e);
      }
    }

    // Fallback demo response
    return {
      brief: {
        caseName: args.caseName,
        citation: args.citation || "Citation not available",
        court: "To be confirmed",
        year: "N/A",
        facts: "AI API key not configured. Please add ANTHROPIC_API_KEY or OPENAI_API_KEY to your Convex environment variables to generate real case briefs.",
        issue: "What legal principles apply to this case?",
        held: "Unable to generate without AI API access.",
        ratioDecidendi: "Configure an API key to receive the ratio decidendi analysis.",
        obiterDicta: "None identified",
        application: "Configure an API key for application analysis.",
        significance: "Configure an API key for significance analysis.",
        keyQuotes: [],
        relatedCases: [],
      },
      provider: "fallback",
    };
  },
});
