/**
 * POST /api/ai/transcribe — Speech-to-Text via OpenAI Whisper
 *
 * Receives an audio blob from the client, forwards it to OpenAI's
 * Whisper API, and returns the transcript. Falls back gracefully
 * if the API key is missing (client should use browser Speech
 * Recognition as backup).
 *
 * Edge Runtime compatible.
 */

import { safeErrorResponse } from "@/lib/ai/validation";
import { checkRateLimit, CHAT_RATE_LIMIT } from "@/lib/ai/rate-limiter";

export const runtime = "edge";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25 MB (Whisper limit)

function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request): Promise<Response> {
  const ip = getClientIP(request);

  // Rate limit
  const ipCheck = checkRateLimit(ip, CHAT_RATE_LIMIT.limit, CHAT_RATE_LIMIT.windowMs);
  if (!ipCheck.allowed) {
    return safeErrorResponse(429, "Too many requests.", "IP_RATE_LIMIT");
  }

  // Check for OpenAI API key
  const openaiKey = process.env.OPENAI_API_KEY ?? "";
  if (!openaiKey) {
    return safeErrorResponse(
      503,
      "Speech transcription is not configured. Please use text input.",
      "NO_OPENAI_KEY",
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return safeErrorResponse(400, "No audio file provided.", "NO_AUDIO");
    }

    if (audioFile.size > MAX_AUDIO_SIZE) {
      return safeErrorResponse(413, "Audio file too large.", "AUDIO_TOO_LARGE");
    }

    // Forward to OpenAI Whisper
    const whisperForm = new FormData();
    whisperForm.append("file", audioFile, "recording.webm");
    whisperForm.append("model", "whisper-1");
    whisperForm.append("language", "en");
    whisperForm.append("response_format", "json");

    const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
      },
      body: whisperForm,
    });

    if (!whisperRes.ok) {
      const errBody = await whisperRes.text().catch(() => "");
      console.error(`[TRANSCRIBE] Whisper error ${whisperRes.status}: ${errBody.slice(0, 200)}`);
      return safeErrorResponse(502, "Transcription failed. Please try text input.", "WHISPER_ERROR");
    }

    const data = await whisperRes.json();
    const transcript = data?.text ?? "";

    return new Response(
      JSON.stringify({ transcript }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("[TRANSCRIBE] Error:", err instanceof Error ? err.message : "unknown");
    return safeErrorResponse(500, "Transcription failed.", "TRANSCRIBE_ERROR");
  }
}
