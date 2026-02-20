import { v } from "convex/values";
import { action } from "../_generated/server";

export const analyse = action({
  args: {
    argument: v.string(),
    side: v.string(), // "appellant" | "respondent" | "claimant" | "defendant"
    areaOfLaw: v.string(),
    authorities: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const prompt = `You are a senior UK barrister and devil's advocate. Analyse the following skeleton argument and provide detailed constructive feedback.

Area of Law: ${args.areaOfLaw}
Side: ${args.side}
${args.authorities?.length ? `Cited Authorities: ${args.authorities.join(", ")}` : ""}

SKELETON ARGUMENT:
${args.argument}

Provide your analysis as a JSON object:
{
  "overallAssessment": "2-3 sentence overall evaluation of argument quality",
  "strengths": [
    { "point": "Description of strength", "detail": "Why this works well" }
  ],
  "weaknesses": [
    { "point": "Description of weakness", "detail": "Why this is problematic and how to fix it" }
  ],
  "missingAuthorities": [
    { "case": "Case name [citation]", "relevance": "Why this case should be cited" }
  ],
  "counterArguments": [
    { "point": "Counter-argument the opposition will raise", "response": "Suggested rebuttal" }
  ],
  "logicalGaps": [
    { "gap": "Description of logical gap", "suggestion": "How to bridge it" }
  ],
  "iracCompliance": {
    "issue": { "score": 0, "feedback": "Assessment of issue identification (0-5)" },
    "rule": { "score": 0, "feedback": "Assessment of rule statement (0-5)" },
    "application": { "score": 0, "feedback": "Assessment of application to facts (0-5)" },
    "conclusion": { "score": 0, "feedback": "Assessment of conclusion (0-5)" }
  },
  "revisedOutline": "A suggested improved argument structure in 5-8 bullet points",
  "overallScore": 0
}

Score 0-10 overall. Be constructive — this is a training tool for law students, not a critic.
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
            max_tokens: 2000,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await response.json();
        const text = data.content?.[0]?.text || "";
        const cleaned = text.replace(/```json|```/g, "").trim();
        return { analysis: JSON.parse(cleaned), provider: "anthropic" };
      } catch (e) {
        console.error("Anthropic argument builder error:", e);
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
            max_tokens: 2000,
            temperature: 0.4,
          }),
        });
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";
        const cleaned = text.replace(/```json|```/g, "").trim();
        return { analysis: JSON.parse(cleaned), provider: "openai" };
      } catch (e) {
        console.error("OpenAI argument builder error:", e);
      }
    }

    // Fallback demo response
    return {
      analysis: {
        overallAssessment:
          "AI API key not configured. Please add ANTHROPIC_API_KEY or OPENAI_API_KEY to your Convex environment variables to receive real argument analysis.",
        strengths: [],
        weaknesses: [],
        missingAuthorities: [],
        counterArguments: [],
        logicalGaps: [],
        iracCompliance: {
          issue: { score: 0, feedback: "Configure an API key for IRAC analysis." },
          rule: { score: 0, feedback: "Configure an API key for IRAC analysis." },
          application: { score: 0, feedback: "Configure an API key for IRAC analysis." },
          conclusion: { score: 0, feedback: "Configure an API key for IRAC analysis." },
        },
        revisedOutline: "Configure an API key to receive a revised argument outline.",
        overallScore: 0,
      },
      provider: "fallback",
    };
  },
});
