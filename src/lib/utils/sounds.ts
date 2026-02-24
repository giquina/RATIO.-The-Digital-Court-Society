// Sound design system for Ratio courtroom experience
// Uses Web Audio API — zero dependencies, works in all modern browsers

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  delay = 0
) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

// ── Gavel tap: entering chambers ──
// Deep woody knock (low freq + noise burst)
export function playGavel() {
  try {
    const ctx = getCtx();
    // Knock body
    playTone(120, 0.15, "sine", 0.3);
    playTone(80, 0.2, "triangle", 0.2);
    // Wooden resonance
    playTone(240, 0.08, "square", 0.05, 0.02);
    // Second lighter tap
    playTone(140, 0.1, "sine", 0.15, 0.25);
    playTone(90, 0.12, "triangle", 0.1, 0.25);
  } catch (e) {
    // Silent fail — audio not critical
  }
}

// ── Soft chime: session complete ──
export function playChime() {
  try {
    // Major triad ascending: C5, E5, G5
    playTone(523, 0.6, "sine", 0.12, 0);
    playTone(659, 0.5, "sine", 0.1, 0.15);
    playTone(784, 0.7, "sine", 0.12, 0.3);
  } catch (e) {}
}

// ── Countdown tick ──
export function playTick() {
  try {
    playTone(800, 0.05, "sine", 0.08);
  } catch (e) {}
}

// ── Countdown final (the "go") ──
export function playCountdownFinal() {
  try {
    playTone(1047, 0.3, "sine", 0.15);
    playTone(1319, 0.3, "sine", 0.12, 0.05);
  } catch (e) {}
}

// ── Notification ping ──
export function playNotification() {
  try {
    playTone(880, 0.15, "sine", 0.08);
    playTone(1100, 0.2, "sine", 0.06, 0.1);
  } catch (e) {}
}

// ── Error / warning ──
export function playError() {
  try {
    playTone(300, 0.15, "square", 0.06);
    playTone(250, 0.2, "square", 0.04, 0.15);
  } catch (e) {}
}

// ── Message sent ──
export function playMessageSent() {
  try {
    playTone(600, 0.08, "sine", 0.05);
    playTone(800, 0.06, "sine", 0.04, 0.05);
  } catch (e) {}
}

// ── Message received ──
export function playMessageReceived() {
  try {
    playTone(700, 0.1, "sine", 0.05);
  } catch (e) {}
}

// ── Star rating tap ──
export function playStarTap(starNumber: number) {
  try {
    // Higher pitch for higher stars
    const freq = 400 + starNumber * 80;
    playTone(freq, 0.1, "sine", 0.06);
  } catch (e) {}
}

// ── Session recording start ──
export function playRecordingStart() {
  try {
    playTone(440, 0.1, "sine", 0.08);
    playTone(440, 0.1, "sine", 0.08, 0.2);
    playTone(660, 0.2, "sine", 0.1, 0.4);
  } catch (e) {}
}

// ── Judge response incoming (authoritative low tone) ──
export function playJudgeResponse() {
  try {
    playTone(180, 0.2, "sine", 0.06);
    playTone(220, 0.15, "sine", 0.04, 0.1);
  } catch (e) {}
}

// ── Court in session (richer gavel with resonance) ──
export function playCourtInSession() {
  try {
    const ctx = getCtx();
    // Triple gavel
    playTone(120, 0.15, "sine", 0.25);
    playTone(80, 0.2, "triangle", 0.15);
    playTone(240, 0.08, "square", 0.04, 0.02);
    // Second tap
    playTone(130, 0.12, "sine", 0.18, 0.35);
    playTone(85, 0.15, "triangle", 0.1, 0.35);
    // Third tap (loudest)
    playTone(125, 0.18, "sine", 0.3, 0.65);
    playTone(82, 0.22, "triangle", 0.18, 0.65);
    playTone(250, 0.1, "square", 0.05, 0.67);
  } catch (e) {}
}

// ── Voice recording start beep ──
export function playRecordBeep() {
  try {
    playTone(880, 0.08, "sine", 0.1);
    playTone(1100, 0.12, "sine", 0.08, 0.1);
  } catch (e) {}
}

// ── Voice recording stop beep ──
export function playRecordStopBeep() {
  try {
    playTone(1100, 0.08, "sine", 0.08);
    playTone(880, 0.12, "sine", 0.06, 0.1);
  } catch (e) {}
}

// ── Resume audio context after user interaction (required by browsers) ──
export function resumeAudio() {
  if (audioCtx?.state === "suspended") {
    audioCtx.resume();
  }
}
