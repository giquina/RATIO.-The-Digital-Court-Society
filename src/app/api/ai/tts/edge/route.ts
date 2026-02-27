/**
 * POST /api/ai/tts/edge — Text-to-Speech via Microsoft Edge TTS (free)
 *
 * Fallback TTS endpoint using Microsoft's neural voices (same as Edge Read Aloud).
 * No API key needed. Uses en-GB-RyanNeural — authoritative British male voice.
 *
 * This is the free fallback when ElevenLabs quota is exceeded or unavailable.
 * Returns MP3 audio stream.
 *
 * Has a 10-second server-side timeout because msedge-tts can hang forever
 * if the Microsoft WebSocket is unreachable.
 */

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// British male voice — authoritative, calm (same voice as our promo voiceovers)
const VOICE = "en-GB-RyanNeural";

// Server-side timeout — msedge-tts can hang forever on WebSocket connect
const EDGE_TTS_TIMEOUT_MS = 10_000;

export async function POST(request: Request): Promise<Response> {
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
    // Race TTS generation against a timeout
    const result = await Promise.race([
      generateEdgeTTS(text),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Edge TTS timeout")), EDGE_TTS_TIMEOUT_MS)
      ),
    ]);

    return result;
  } catch (err) {
    const isTimeout = err instanceof Error && err.message === "Edge TTS timeout";
    console.error("[Edge TTS]", isTimeout ? "Timeout after 10s" : "Error:", err);
    return new Response(
      JSON.stringify({ error: isTimeout ? "edge_tts_timeout" : "edge_tts_error" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function generateEdgeTTS(text: string): Promise<Response> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const { audioStream } = tts.toStream(text);

  // Collect audio chunks into a single buffer
  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.from(chunk));
  }
  const audioBuffer = Buffer.concat(chunks);

  if (audioBuffer.length === 0) {
    console.error("[Edge TTS] Audio stream produced zero chunks");
    return new Response(
      JSON.stringify({ error: "empty_audio" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
