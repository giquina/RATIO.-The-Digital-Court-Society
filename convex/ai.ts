import { v } from "convex/values";
import { action } from "./_generated/server";

// This action calls the external LLM API for AI Judge conversations.
// Using Convex actions since they can make external HTTP requests.

// Fetch real UK case law from Find Case Law API to ground AI responses
async function fetchRelevantCaseLaw(areaOfLaw: string, matter: string): Promise<string> {
  try {
    const searchTerms = `${areaOfLaw} ${matter}`.replace(/[^\w\s]/g, " ").trim();
    const params = new URLSearchParams({ query: searchTerms, per_page: "5" });
    const response = await fetch(
      `https://caselaw.nationalarchives.gov.uk/atom.xml?${params}`,
      { headers: { Accept: "application/atom+xml" } }
    );
    if (!response.ok) return "";
    const xml = await response.text();

    // Extract case names and neutral citations
    const entries: string[] = [];
    const entryBlocks = xml.split("<entry>").slice(1);
    for (const block of entryBlocks.slice(0, 5)) {
      const titleMatch = block.match(/<title[^>]*>([^<]+)<\/title>/);
      const citMatch = block.match(/<tna:identifier[^>]*type="ukncn"[^>]*>([^<]+)<\/tna:identifier>/);
      const dateMatch = block.match(/<published>([^<]+)<\/published>/);
      if (titleMatch) {
        const name = titleMatch[1].trim();
        const cit = citMatch ? citMatch[1].trim() : "";
        const year = dateMatch ? dateMatch[1].substring(0, 4) : "";
        entries.push(cit ? `${name} ${cit} (${year})` : `${name} (${year})`);
      }
    }
    return entries.length > 0
      ? `\n\nREAL UK AUTHORITIES (from Find Case Law — National Archives) relevant to this area:\n${entries.map((e) => `- ${e}`).join("\n")}\nYou should cite these real authorities when challenging or testing Counsel. Refer to their ratio decidendi and obiter dicta. If Counsel cites a case you have not seen, ask them to explain its relevance.`
      : "";
  } catch {
    return "";
  }
}

export const chat = action({
  args: {
    mode: v.string(), // "judge" | "mentor" | "examiner" | "opponent"
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
    caseContext: v.object({
      areaOfLaw: v.string(),
      matter: v.string(),
      yourRole: v.string(),
      authorities: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Fetch real case law to ground the AI's responses
    const caseLawContext = await fetchRelevantCaseLaw(
      args.caseContext.areaOfLaw,
      args.caseContext.matter
    );

    const systemPrompts: Record<string, string> = {
      judge: `You are The Honourable Justice AI, presiding over a moot court. You are a firm but fair High Court judge. Intervene with judicial questions every 2-3 responses. Challenge weak arguments. Never break character. The case concerns: ${args.caseContext.matter}. Counsel appears as ${args.caseContext.yourRole}. Key authorities cited by Counsel: ${args.caseContext.authorities.join(", ")}.${caseLawContext}`,
      mentor: `You are a Senior Counsel mentor at a UK Ratio. Be warm but rigorous. Ask Socratic questions. Help improve advocacy technique. The topic is: ${args.caseContext.matter}.${caseLawContext}`,
      examiner: `You are an SQE2 Examiner. Assess advocacy competence clinically against SRA standards. Do not coach — assess. The case: ${args.caseContext.matter}. Candidate role: ${args.caseContext.yourRole}.${caseLawContext}`,
      opponent: `You are Opposing Counsel. Argue against the user's position firmly but fairly. Exploit weaknesses, distinguish their authorities. Case: ${args.caseContext.matter}.${caseLawContext}`,
    };

    const apiMessages = [
      { role: "system", content: systemPrompts[args.mode] || systemPrompts.judge },
      ...args.messages,
    ];

    // Try Anthropic first, fallback to OpenAI
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

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
            max_tokens: 500,
            system: systemPrompts[args.mode] || systemPrompts.judge,
            messages: args.messages.map((m) => ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.content,
            })),
          }),
        });

        const data = await response.json();
        const text = data.content?.[0]?.text;
        if (text) return { response: text, provider: "anthropic" };
      } catch (e) {
        console.error("Anthropic API error:", e);
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
            messages: apiMessages.map((m) => ({
              role: m.role === "ai" ? "assistant" : m.role,
              content: m.content,
            })),
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return { response: text, provider: "openai" };
      } catch (e) {
        console.error("OpenAI API error:", e);
      }
    }

    // Fallback: hardcoded responses for demo / no API key
    const fallbackResponses = [
      "Counsel, that is an interesting submission, but I am not yet persuaded. Can you direct me to the specific paragraph in the judgment that supports your proposition?",
      "I note you rely heavily on Miller. But the constitutional landscape has shifted since that decision. How do you address the subsequent developments?",
      "Very well, Counsel. I think I understand your primary submission. Let me put this to you — if your argument succeeds, what is the limiting principle?",
      "That is helpful, Counsel. Please continue to your next point.",
    ];

    const idx = args.messages.filter((m) => m.role === "user").length - 1;
    return {
      response: fallbackResponses[Math.min(idx, fallbackResponses.length - 1)],
      provider: "fallback",
    };
  },
});

// Generate AI feedback scores at end of session
export const generateFeedback = action({
  args: {
    mode: v.string(),
    transcript: v.array(
      v.object({
        role: v.string(),
        message: v.string(),
        timestamp: v.string(),
      })
    ),
    areaOfLaw: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return demo scores
      return {
        scores: {
          argumentStructure: 3.5,
          useOfAuthorities: 4.0,
          oralDelivery: 3.8,
          judicialHandling: 3.2,
          courtManner: 4.5,
          persuasiveness: 3.6,
          timeManagement: 4.0,
        },
        overallScore: 3.8,
        aiJudgment: "Counsel demonstrated a solid understanding of the constitutional principles at play. The opening submissions were well-structured. However, responses to judicial interventions could be more precise.",
        keyImprovement: "When facing a judicial intervention, pause before responding. Take a moment to consider the exact question being asked, then respond with specificity.",
      };
    }

    const transcriptText = args.transcript
      .map((t) => `${t.role === "ai" ? "JUDGE" : "COUNSEL"}: ${t.message}`)
      .join("\n\n");

    const prompt = `Analyse this moot court transcript and score the advocate's performance.

TRANSCRIPT:
${transcriptText}

Score each dimension 1-5 (one decimal place):
1. Argument Structure (IRAC compliance)
2. Use of Authorities (accuracy, relevance)
3. Oral Delivery (clarity, pace)
4. Response to Judicial Intervention (composure, accuracy)
5. Court Manner (forms of address, etiquette)
6. Persuasiveness (overall advocacy quality)
7. Time Management (efficient use of time)

Return JSON only:
{
  "scores": { "argumentStructure": X, "useOfAuthorities": X, "oralDelivery": X, "judicialHandling": X, "courtManner": X, "persuasiveness": X, "timeManagement": X },
  "overallScore": X,
  "aiJudgment": "3-4 sentence judgment",
  "keyImprovement": "1 specific actionable improvement"
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("Feedback generation error:", e);
      return {
        scores: {
          argumentStructure: 3.5, useOfAuthorities: 3.5, oralDelivery: 3.5,
          judicialHandling: 3.5, courtManner: 3.5, persuasiveness: 3.5, timeManagement: 3.5,
        },
        overallScore: 3.5,
        aiJudgment: "Assessment could not be generated. Please try again.",
        keyImprovement: "Continue practising to receive detailed feedback.",
      };
    }
  },
});
