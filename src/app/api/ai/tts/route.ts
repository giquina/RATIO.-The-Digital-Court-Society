/**
 * POST /api/ai/tts — Text-to-Speech via ElevenLabs
 *
 * Receives text from the client, forwards to ElevenLabs API,
 * and returns an MP3 audio stream. Falls back gracefully if
 * the API key is missing (client should use browser speechSynthesis).
 *
 * Returns 503 if no API key is configured.
 * Returns 429 if ElevenLabs quota is exceeded.
 */

export const runtime = "edge";

// British male voice — "Daniel" on ElevenLabs
const VOICE_ID = "onwK4e9ZLuTAKqWW03F9";

// Model — eleven_turbo_v2_5 is fast and good quality
const MODEL_ID = "eleven_turbo_v2_5";

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "not_configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let text: string;
  try {
    const body = await request.json();
    text = body.text;
    if (!text || typeof text !== "string" || text.length > 5000) {
      return new Response(
        JSON.stringify({ error: "invalid_text" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ error: "invalid_body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.3,
          },
        }),
      }
    );

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "quota_exceeded" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "elevenlabs_error", status: response.status }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "network_error" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
