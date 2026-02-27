/**
 * POST /api/ai/tts/edge — Text-to-Speech via Microsoft Edge TTS (free)
 *
 * Fallback TTS endpoint using Microsoft's neural voices (same as Edge Read Aloud).
 * No API key needed. Uses en-GB-RyanNeural — authoritative British male voice.
 *
 * This is the free fallback when ElevenLabs quota is exceeded or unavailable.
 * Returns MP3 audio stream.
 *
 * Includes a 10-second timeout so requests don't hang if Microsoft's
 * WebSocket server is slow or unreachable.
 */

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// British male voice — authoritative, calm (same voice as our promo voiceovers)
const VOICE = "en-GB-RyanNeural";

// Timeout for the entire TTS generation (WebSocket connect + stream)
const TTS_TIMEOUT_MS = 10_000;

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
    // Race the TTS generation against a timeout so we don't hang
    const audioBuffer = await Promise.race([
      generateAudio(text),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Edge TTS timed out")), TTS_TIMEOUT_MS)
      ),
    ]);

    if (audioBuffer.length === 0) {
      console.error("[Edge TTS] Audio stream produced zero chunks");
      return new Response(
        JSON.stringify({ error: "empty_audio" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(audioBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[Edge TTS] Error:", err);
    return new Response(
      JSON.stringify({ error: "edge_tts_error" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function generateAudio(text: string): Promise<Uint8Array> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const { audioStream } = tts.toStream(text);

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.from(chunk));
  }
  const buf = Buffer.concat(chunks);
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}
