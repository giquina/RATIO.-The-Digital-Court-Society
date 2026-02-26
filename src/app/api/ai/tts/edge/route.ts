/**
 * POST /api/ai/tts/edge — Text-to-Speech via Microsoft Edge TTS (free)
 *
 * Fallback TTS endpoint using Microsoft's neural voices (same as Edge Read Aloud).
 * No API key needed. Uses en-GB-RyanNeural — authoritative British male voice.
 *
 * This is the free fallback when ElevenLabs quota is exceeded or unavailable.
 * Returns MP3 audio stream.
 */

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// British male voice — authoritative, calm (same voice as our promo voiceovers)
const VOICE = "en-GB-RyanNeural";

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
    const tts = new MsEdgeTTS();
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(text);

    // Collect audio chunks into a single buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
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
