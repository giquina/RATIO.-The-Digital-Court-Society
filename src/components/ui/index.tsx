"use client";

import { cn, getInitials } from "@/lib/utils/helpers";
import { CHAMBER_COLORS } from "@/lib/constants/app";

// ── Avatar ──
export function Avatar({
  name,
  initials,
  chamber,
  size = "md",
  border = false,
  online = false,
}: {
  name?: string;
  initials?: string;
  chamber?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  border?: boolean;
  online?: boolean;
}) {
  const display = initials ?? (name ? getInitials(name) : "?");
  const color = chamber ? CHAMBER_COLORS[chamber] ?? "#6B2D3E" : "#6B2D3E";
  const sizes = { xs: "w-6 h-6 text-[9px]", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-lg" };

  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-serif font-bold text-court-text",
          sizes[size],
          border && "ring-2 ring-gold shadow-[0_0_12px_rgba(201,168,76,0.2)]"
        )}
        style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
      >
        {display}
      </div>
      {online && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-navy" />
      )}
    </div>
  );
}

// ── Tag ──
export function Tag({
  children,
  color = "gold",
  small = false,
}: {
  children: React.ReactNode;
  color?: "gold" | "green" | "red" | "blue" | "burgundy" | "orange" | string;
  small?: boolean;
}) {
  const colorMap: Record<string, string> = {
    gold: "text-gold bg-gold-dim border-gold/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    burgundy: "text-[#E0D0A8] bg-burgundy/20 border-burgundy/30",
    orange: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  };

  return (
    <span
      className={cn(
        "font-bold tracking-wider border rounded whitespace-nowrap",
        small ? "text-[9px] px-1.5 py-0" : "text-[10px] px-2 py-0.5",
        colorMap[color] ?? colorMap.gold
      )}
    >
      {children}
    </span>
  );
}

// ── Button ──
export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: "bg-gold text-navy font-bold hover:bg-gold/90",
    secondary: "bg-white/5 text-court-text-sec border border-court-border hover:bg-white/10",
    outline: "border border-gold text-gold font-bold hover:bg-gold/10",
    ghost: "text-court-text-sec hover:text-court-text hover:bg-white/5",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-sm rounded-xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-semibold transition-all duration-200 tracking-wide cursor-pointer",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

// ── ProgressBar ──
export function ProgressBar({
  pct,
  color = "gold",
  height = 4,
}: {
  pct: number;
  color?: string;
  height?: number;
}) {
  const colors: Record<string, string> = {
    gold: "from-gold to-gold/60",
    green: "from-green-500 to-green-500/60",
    red: "from-red-500 to-red-500/60",
    blue: "from-blue-400 to-blue-400/60",
    orange: "from-orange-400 to-orange-400/60",
  };

  return (
    <div className="bg-white/[0.06] rounded-full overflow-hidden" style={{ height }}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out", colors[color] ?? colors.gold)}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

// ── Card ──
export function Card({
  children,
  className,
  highlight = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-navy-card rounded-court border transition-all duration-200",
        highlight ? "border-gold/25" : "border-court-border-light",
        onClick && "cursor-pointer hover:border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}

// ── SectionHeader ──
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="font-serif text-lg font-bold text-court-text">{title}</h2>
      {action && (
        <button onClick={onAction} className="text-xs text-gold font-semibold">
          {action} →
        </button>
      )}
    </div>
  );
}

// ── FollowButton ──
export function FollowButton({
  isFollowing,
  onToggle,
  small = false,
}: {
  isFollowing: boolean;
  onToggle: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "font-bold rounded-lg transition-all duration-200",
        small ? "px-3 py-1 text-[10px]" : "px-4 py-1.5 text-xs",
        isFollowing
          ? "border border-white/10 text-court-text-sec hover:border-red-400/30 hover:text-red-400"
          : "border border-gold bg-gold text-navy hover:bg-gold/90"
      )}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

// ── CommendButton ──
export function CommendButton({
  isCommended,
  count,
  onToggle,
}: {
  isCommended: boolean;
  count: number;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
          isCommended
            ? "bg-gold-dim border border-gold/25 text-gold"
            : "text-court-text-ter hover:text-gold hover:bg-gold-dim"
        )}
      >
        ⚖️ {isCommended ? "Commended" : "Commend"}
      </button>
      <span className="text-[11px] text-court-text-ter">{count}</span>
    </div>
  );
}

// ── EmptyState ──
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-4xl mb-4">{icon}</span>
      <h3 className="font-serif text-lg font-bold text-court-text mb-2">{title}</h3>
      <p className="text-sm text-court-text-ter mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  );
}

// ── Skeleton ──
export function Skeleton({
  className,
  rounded = false,
}: {
  className?: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/[0.06]",
        rounded ? "rounded-full" : "rounded-court",
        className
      )}
    />
  );
}

// ── CardSkeleton ──
export function CardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex gap-3 items-center">
        <Skeleton rounded className="w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full mt-3" />
      <Skeleton className="h-2.5 w-2/3 mt-1.5" />
    </Card>
  );
}

// ── ErrorState ──
export function ErrorState({
  title = "Something went wrong",
  description = "Please try again later",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <span className="text-2xl">!</span>
      </div>
      <h3 className="font-serif text-lg font-bold text-court-text mb-2">{title}</h3>
      <p className="text-sm text-court-text-ter mb-6 max-w-xs">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>Try Again</Button>
      )}
    </div>
  );
}
