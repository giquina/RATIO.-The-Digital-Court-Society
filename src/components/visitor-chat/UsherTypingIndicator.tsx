"use client";

export function UsherTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gold/[0.06] border border-gold/10 rounded-court px-3.5 py-2.5">
        <p className="font-serif text-court-xs text-gold font-bold mb-1">The Usher</p>
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold/50"
              style={{
                animation: "usher-bounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
