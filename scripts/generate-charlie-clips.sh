#!/bin/bash
# Generate all 30 narrator clips using Charlie voice (ElevenLabs)
# Usage: bash scripts/generate-charlie-clips.sh

set -e

VOICE_ID="IKne3meq5aSn9XLyUdCD"
API_KEY="sk_aee29701bfa7179d6b36b309309fe6d49db2851d75acb48c"
OUT_DIR="C:/Users/Pc/Giquina-Projects/RATIO.-The-Digital-Court-Society/public/audio/voiceover"

generate() {
  local filename="$1"
  local text="$2"
  echo "[$3/30] $filename"

  # Generate with retry (ElevenLabs rate limits)
  local attempts=0
  while [ $attempts -lt 3 ]; do
    curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
      -H "xi-api-key: $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"text\":\"$text\",\"model_id\":\"eleven_multilingual_v2\",\"voice_settings\":{\"stability\":0.62,\"similarity_boost\":0.72,\"style\":0.35}}" \
      --output "$OUT_DIR/$filename"

    local fsize=$(stat -c%s "$OUT_DIR/$filename" 2>/dev/null || echo "0")
    if [ "$fsize" -gt 1000 ]; then
      break
    fi
    attempts=$((attempts + 1))
    echo "  Retrying ($attempts/3)..."
    sleep 3
  done

  local fsize=$(stat -c%s "$OUT_DIR/$filename" 2>/dev/null || echo "0")
  if [ "$fsize" -lt 1000 ]; then
    echo "  FAILED (file too small: ${fsize} bytes)"
    return 1
  fi

  # Apply 150ms fade-out using ffmpeg
  local dur=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$OUT_DIR/$filename")
  local fade_start=$(node -e "console.log(Math.max(0, $dur - 0.15).toFixed(3))")
  local tmp="$OUT_DIR/__tmp_${filename}"
  ffmpeg -y -i "$OUT_DIR/$filename" -af "afade=t=out:st=$fade_start:d=0.15" "$tmp" 2>/dev/null
  mv "$tmp" "$OUT_DIR/$filename"
  echo "  ${dur}s"

  # Brief delay to avoid rate limiting
  sleep 1
}

echo "=== Generating 30 Charlie voice clips ==="
echo ""

# ── AIPracticeCinematic (9 clips) ──
generate "cinematic-01-cold-open.mp3" "Every advocate starts somewhere." 1
generate "cinematic-02-preparation.mp3" "Long before the courtroom. Before the wig, the gown, any of it. There's the work you do when nobody's watching." 2
generate "cinematic-03-choose-judge.mp3" "RATIO pairs you with an AI Judge. Four temperaments — strict, Socratic, pragmatic, or standard. You pick the bench." 3
generate "cinematic-04-case-brief.mp3" "You get a genuine constitutional law brief. Real authorities, real facts, and a role — junior counsel, leading counsel, whichever suits you." 4
generate "cinematic-05-court-opens.mp3" "Then the session starts. You argue your case, live, in real time. The Judge listens. And when you slip — the Judge pushes back." 5
generate "cinematic-06-exchange.mp3" "You distinguish the authorities. You think on your feet. It feels like standing before a real bench — because the pressure is the same." 6
generate "cinematic-07-feedback.mp3" "When it's over, you get a proper judgment. Scored across seven dimensions of advocacy." 7
generate "cinematic-08-improvement.mp3" "Detailed written feedback. What worked, what didn't, and a clear sense of where to go next." 8
generate "cinematic-09-cta.mp3" "RATIO. The Digital Court Society. It's free for UK law students. You can start today." 9

# ── AIPracticeShort (3 clips) ──
generate "short-01-hook.mp3" "Can you argue before a judge?" 10
generate "short-02-intro.mp3" "RATIO trains you with AI." 11
generate "short-03-cta.mp3" "RATIO. The Digital Court Society. Free for UK law students. Start practice today." 12

# ── FeatureShowcase (9 clips) ──
generate "showcase-01-open.mp3" "RATIO is a lot more than practice." 13
generate "showcase-02-sessions.mp3" "You can book a moot court with other advocates in a few minutes. Six roles, real arguments — no waiting around for university schedules." 14
generate "showcase-03-rankings.mp3" "There's a national ranking system. You start as a Pupil and work your way up to King's Counsel." 15
generate "showcase-04-chambers.mp3" "You choose an Inn — Gray's, Lincoln's, Inner, or Middle. Each one has its own culture, its own colours." 16
generate "showcase-05-parliament.mp3" "There's a whole governance layer. Real motions, real votes. You actually shape the constitution of the society you belong to." 17
generate "showcase-06-badges.mp3" "You earn milestones as you go. First Moot, Seasoned Counsel, the Hundred-Day Streak. Things that actually mean something." 18
generate "showcase-07-lawbook.mp3" "Over forty structured legal modules. Constitutional, criminal, commercial, human rights — all of it." 19
generate "showcase-08-stats.mp3" "A hundred and forty-two UK universities. Thousands of advocates already on it." 20
generate "showcase-09-cta.mp3" "RATIO. The Digital Court Society. Free for UK law students. Come join." 21

# ── LiveSessionSnippet (3 narrator clips) ──
generate "session-01-title.mp3" "Here's what a session actually looks like." 22
generate "session-02-score.mp3" "And when it's done, you get a proper scored judgment." 23
generate "session-03-cta.mp3" "That could be you. RATIO — free for law students. Start whenever you're ready." 24

# ── ConstitutionalLaw (6 clips) ──
generate "conlaw-01-title.mp3" "Constitutional law. The foundation of the legal system. And one of the most demanding subjects you'll face." 25
generate "conlaw-02-topics.mp3" "RATIO covers the essential topics. Parliamentary sovereignty, the rule of law, separation of powers, judicial review, the royal prerogative, the Human Rights Act, devolution, constitutional reform, and EU withdrawal." 26
generate "conlaw-03-cases.mp3" "You'll work with the landmark cases that define constitutional law. From Entick v Carrington to the Miller decisions. Not just reading them — arguing them." 27
generate "conlaw-04-practice.mp3" "Now watch how it works in practice. You receive a constitutional law brief. You choose your role, your judge. And then you argue — live, in real time. The AI Judge pushes back on every weak point." 28
generate "conlaw-05-score.mp3" "Every session ends with a scored judgment. Seven dimensions of advocacy. Clear, honest, actionable." 29
generate "conlaw-06-cta.mp3" "RATIO. The Digital Court Society. Constitutional law practice that feels like the real thing. Free for UK law students. Start today." 30

echo ""
echo "=== COMPLETE ==="
echo ""
echo "Duration summary:"
for f in "$OUT_DIR"/cinematic-0*.mp3 "$OUT_DIR"/short-0*.mp3 "$OUT_DIR"/showcase-0*.mp3 "$OUT_DIR"/session-0[1-3]-*.mp3 "$OUT_DIR"/conlaw-0*.mp3; do
  dur=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$f" 2>/dev/null)
  printf "  %-40s %ss\n" "$(basename "$f")" "$dur"
done
