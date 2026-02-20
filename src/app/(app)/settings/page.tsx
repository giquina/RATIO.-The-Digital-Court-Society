"use client";

import { useState } from "react";
import { Card, Button, SectionHeader } from "@/components/ui";
import {
  User, Mail, GraduationCap, Eye, Users, Bell, Mail as MailIcon,
  Smartphone, Clock, Moon, FileText, Shield, Scale, ChevronRight,
  LogOut, Trash2, AlertTriangle,
} from "lucide-react";

// ── Toggle Switch ──
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        on ? "bg-gold" : "bg-white/10"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Row Types ──
type SettingsRow = {
  icon: React.ReactNode;
  label: string;
  description?: string;
  value?: string;
} & ({ type: "toggle"; key: string } | { type: "link"; href?: string } | { type: "info" });

function SettingsSection({
  title,
  rows,
  toggles,
  onToggle,
}: {
  title: string;
  rows: SettingsRow[];
  toggles: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <div>
      <h3 className="text-court-xs font-bold text-court-text-ter uppercase tracking-widest mb-2 px-1">
        {title}
      </h3>
      <Card className="divide-y divide-court-border-light">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-court-text-sec shrink-0">
              {row.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-court-base font-medium text-court-text">{row.label}</p>
              {row.description && (
                <p className="text-court-sm text-court-text-ter mt-0.5">{row.description}</p>
              )}
            </div>
            {row.type === "toggle" && (
              <Toggle on={!!toggles[row.key]} onToggle={() => onToggle(row.key)} />
            )}
            {row.type === "link" && (
              <ChevronRight size={16} className="text-court-text-ter" />
            )}
            {row.type === "info" && row.value && (
              <span className="text-court-base text-court-text-sec">{row.value}</span>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    profileVisible: true,
    followerCount: true,
    emailNotifs: true,
    pushNotifs: false,
    sessionReminders: true,
    darkMode: true,
  });

  const handleToggle = (key: string) => {
    if (key === "darkMode") return; // always on
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text">Settings</h1>
        <p className="text-xs text-court-text-sec mt-1">Manage your account and preferences</p>
      </div>

      <div className="px-4 md:px-6 lg:px-8 space-y-5">
        {/* Account */}
        <SettingsSection
          title="Account"
          toggles={toggles}
          onToggle={handleToggle}
          rows={[
            { icon: <User size={16} />, label: "Name", type: "info", value: "Ali Giquina" },
            { icon: <Mail size={16} />, label: "Email", type: "info", value: "ali.g@ucl.ac.uk" },
            { icon: <GraduationCap size={16} />, label: "University", type: "info", value: "UCL" },
          ]}
        />

        {/* Privacy */}
        <SettingsSection
          title="Privacy"
          toggles={toggles}
          onToggle={handleToggle}
          rows={[
            {
              icon: <Eye size={16} />,
              label: "Profile Visibility",
              description: "Allow others to view your profile",
              type: "toggle",
              key: "profileVisible",
            },
            {
              icon: <Users size={16} />,
              label: "Show Follower Count",
              description: "Display your follower count publicly",
              type: "toggle",
              key: "followerCount",
            },
          ]}
        />

        {/* Notifications */}
        <SettingsSection
          title="Notifications"
          toggles={toggles}
          onToggle={handleToggle}
          rows={[
            {
              icon: <MailIcon size={16} />,
              label: "Email Notifications",
              description: "Receive updates via email",
              type: "toggle",
              key: "emailNotifs",
            },
            {
              icon: <Smartphone size={16} />,
              label: "Push Notifications",
              description: "Browser push notifications",
              type: "toggle",
              key: "pushNotifs",
            },
            {
              icon: <Clock size={16} />,
              label: "Session Reminders",
              description: "Reminders 30 minutes before sessions",
              type: "toggle",
              key: "sessionReminders",
            },
          ]}
        />

        {/* Appearance */}
        <SettingsSection
          title="Appearance"
          toggles={toggles}
          onToggle={handleToggle}
          rows={[
            {
              icon: <Moon size={16} />,
              label: "Dark Mode",
              description: "Always on for the Ratio experience",
              type: "toggle",
              key: "darkMode",
            },
          ]}
        />

        {/* Legal */}
        <SettingsSection
          title="Legal"
          toggles={toggles}
          onToggle={handleToggle}
          rows={[
            { icon: <FileText size={16} />, label: "Terms of Service", type: "link" },
            { icon: <Shield size={16} />, label: "Privacy Policy", type: "link" },
            { icon: <Scale size={16} />, label: "Code of Conduct", type: "link" },
          ]}
        />

        {/* Danger Zone */}
        <div>
          <h3 className="text-court-xs font-bold text-red-400/60 uppercase tracking-widest mb-2 px-1">
            Danger Zone
          </h3>
          <Card className="p-4 border-red-500/10">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={16} />
                <span className="text-court-base text-court-text-ter">
                  These actions are irreversible
                </span>
              </div>
              <div className="flex gap-2.5 sm:ml-auto">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors">
                  <LogOut size={14} />
                  Sign Out
                </button>
                <button className="text-xs text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1">
                  <Trash2 size={12} />
                  Delete Account
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Version */}
        <p className="text-center text-court-xs text-court-text-ter pt-4 pb-2">
          Ratio v1.0.0
        </p>
      </div>
    </div>
  );
}
