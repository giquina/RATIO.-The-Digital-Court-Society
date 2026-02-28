"use client";

interface UsherQuickRepliesProps {
  options: string[];
  onSelect: (option: string) => void;
}

export function UsherQuickReplies({ options, onSelect }: UsherQuickRepliesProps) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-1 mt-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className="text-court-xs text-gold font-semibold border border-gold/25 rounded-full px-3 py-1.5 hover:bg-gold/10 transition-colors cursor-pointer"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
