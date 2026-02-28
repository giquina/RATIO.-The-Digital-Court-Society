/**
 * Notification chime for The Usher greeting.
 *
 * Generates a short, warm descending bell tone (~300ms) using the Web Audio API.
 * Zero file size — no MP3 needed.
 *
 * Respects:
 *  - User mute preference (localStorage)
 *  - prefers-reduced-motion media query
 */

export function playUsherChime(): void {
  try {
    // Respect mute preference
    if (localStorage.getItem("ratio-usher-muted") === "true") return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    // A5 (880Hz) descending to E5 (660Hz) — warm, professional tone
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);

    // Soft volume with fade-out
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);

    // Clean up context after sound finishes
    setTimeout(() => ctx.close().catch(() => {}), 500);
  } catch {
    // AudioContext may not be available — silently ignore
  }
}

/**
 * Court tone for AuthTransition ("The Summons").
 *
 * Deep, institutional tone: A3 (220Hz) fundamental + E4 (330Hz) perfect fifth harmonic.
 * ~400ms with exponential decay. Feels like a courtroom resonance.
 */
export function playCourtTone(): void {
  try {
    if (localStorage.getItem("ratio-usher-muted") === "true") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = new AudioContext();

    // Fundamental: A3 (220Hz) — deep, institutional
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(220, ctx.currentTime);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    // Harmonic: E4 (330Hz, perfect fifth) — adds richness
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(330, ctx.currentTime + 0.05);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    gain2.gain.setValueAtTime(0.03, ctx.currentTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.05);
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.5);

    setTimeout(() => ctx.close().catch(() => {}), 600);
  } catch {
    // AudioContext may not be available — silently ignore
  }
}
