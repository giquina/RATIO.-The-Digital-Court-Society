"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Scale,
  Mic,
  BookOpen,
  Wrench,
  Trophy,
  Swords,
  Landmark,
  Users,
  User,
  FolderOpen,
  Bell,
  Settings,
  HelpCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/helpers";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/sessions", label: "Sessions", icon: Scale },
      { href: "/ai-practice", label: "AI Practice", icon: Mic },
    ],
  },
  {
    title: "LEARN",
    items: [
      { href: "/law-book", label: "Law Book", icon: BookOpen },
      { href: "/tools", label: "Tools", icon: Wrench },
    ],
  },
  {
    title: "COMPETE",
    items: [
      { href: "/rankings", label: "Rankings", icon: Trophy },
      { href: "/sessions/tournaments", label: "Tournaments", icon: Swords },
      { href: "/chambers", label: "Chambers", icon: Landmark },
      { href: "/community", label: "Community", icon: Users },
    ],
  },
  {
    title: "YOUR ACCOUNT",
    items: [
      { href: "/profile", label: "Profile", icon: User },
      { href: "/portfolio", label: "Portfolio", icon: FolderOpen },
      { href: "/notifications", label: "Notifications", icon: Bell },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { href: "/help", label: "Help", icon: HelpCircle },
      { href: "/about", label: "About", icon: Info },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 h-screen bg-navy-mid border-r border-court-border z-40 transition-all duration-300",
        collapsed ? "w-[72px]" : "lg:w-[240px] w-[72px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-court-border shrink-0">
        <Link href="/home" className="flex items-center gap-2">
          <Scale size={24} className="text-gold shrink-0" />
          {!collapsed && (
            <span className="hidden lg:inline font-serif text-lg font-bold tracking-[0.12em] text-court-text">
              RATIO<span className="text-gold">.</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-2">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="hidden lg:block text-court-xs font-bold tracking-[0.15em] text-court-text-ter px-3 mb-2">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200 group relative",
                    isActive
                      ? "bg-gold-dim text-gold"
                      : "text-court-text-sec hover:bg-white/[0.04] hover:text-court-text"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-r" />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className="shrink-0"
                  />
                  {!collapsed && (
                    <span className="hidden lg:inline text-court-base font-semibold truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center h-12 border-t border-court-border text-court-text-ter hover:text-court-text transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
