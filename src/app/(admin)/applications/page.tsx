"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  Briefcase,
  Download,
  ChevronDown,
  ChevronUp,
  Loader2,
  User,
  Mail,
  GraduationCap,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  Search,
  Linkedin,
  Globe,
  FileText,
  Clock,
} from "lucide-react";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "reviewing", label: "Reviewing" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  reviewing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  shortlisted: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  accepted: "bg-green-400/10 text-green-400 border-green-400/20",
  rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};

const NEXT_STATUS: Record<string, { label: string; status: string; icon: any }[]> = {
  pending: [
    { label: "Start Review", status: "reviewing", icon: Eye },
    { label: "Reject", status: "rejected", icon: XCircle },
  ],
  reviewing: [
    { label: "Shortlist", status: "shortlisted", icon: Star },
    { label: "Reject", status: "rejected", icon: XCircle },
  ],
  shortlisted: [
    { label: "Accept", status: "accepted", icon: CheckCircle2 },
    { label: "Reject", status: "rejected", icon: XCircle },
  ],
  accepted: [],
  rejected: [],
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const counts: any = useQuery(anyApi.careers.getApplicationCounts, {});
  const applications: any[] | undefined = useQuery(
    anyApi.careers.listApplications,
    statusFilter ? { status: statusFilter } : {}
  );
  const updateStatus = useMutation(anyApi.careers.updateApplicationStatus);

  // Client-side search filtering
  const filtered = applications?.filter((app: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.fullName?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.positionTitle?.toLowerCase().includes(q) ||
      app.university?.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (appId: any, newStatus: string) => {
    try {
      await updateStatus({
        applicationId: appId,
        status: newStatus,
        reviewNotes: notesMap[appId] || undefined,
      });
    } catch {
      // Handle error silently
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase size={20} className="text-gold" />
          <h1 className="font-serif text-2xl font-bold text-court-text">Career Applications</h1>
        </div>
        <p className="text-court-sm text-court-text-sec">
          Review and manage applications from the careers page.
        </p>

        {/* Stats bar */}
        {counts && (
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { label: "Total", value: counts.total, color: "text-court-text" },
              { label: "Pending", value: counts.pending ?? 0, color: "text-yellow-400" },
              { label: "Reviewing", value: counts.reviewing ?? 0, color: "text-blue-400" },
              { label: "Shortlisted", value: counts.shortlisted ?? 0, color: "text-purple-400" },
              { label: "Accepted", value: counts.accepted ?? 0, color: "text-green-400" },
              { label: "Rejected", value: counts.rejected ?? 0, color: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.03] border border-court-border rounded-lg px-3 py-2 min-w-[80px]">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-court-xs text-court-text-ter">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-court-text-ter" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, position, university..."
            className="w-full bg-white/[0.03] border border-court-border rounded-lg pl-9 pr-3 py-2 text-court-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-2 rounded-lg text-court-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-court-text-sec hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              {tab.label}
              {counts && tab.key && counts[tab.key] ? (
                <span className="ml-1 opacity-60">({counts[tab.key]})</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filtered === undefined ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-court-text-ter" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.02] border border-court-border rounded-xl">
          <Briefcase size={32} className="text-court-text-ter mx-auto mb-3" />
          <p className="text-court-text-sec text-court-sm">
            {searchQuery ? "No applications match your search." : "No applications found."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((app: any) => {
            const isExpanded = expandedId === app._id;
            const actions = NEXT_STATUS[app.status] ?? [];
            return (
              <div
                key={app._id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isExpanded
                    ? "bg-white/[0.04] border-gold/20"
                    : "bg-white/[0.02] border-court-border hover:border-white/15"
                }`}
              >
                {/* Summary Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : app._id)}
                  className="w-full text-left p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                    <User size={18} className="text-court-text-ter" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-court-base font-bold text-court-text">
                        {app.fullName}
                      </span>
                      <span
                        className={`text-court-xs font-bold px-2 py-0.5 rounded-full border capitalize ${
                          STATUS_COLORS[app.status] ?? "text-court-text-ter"
                        }`}
                      >
                        {app.status}
                      </span>
                      {app.linkedinUrl && (
                        <Linkedin size={13} className="text-[#0A66C2]" />
                      )}
                      {app.cvStorageId && (
                        <FileText size={13} className="text-court-text-ter" />
                      )}
                    </div>
                    <p className="text-court-sm text-court-text-sec truncate">
                      {app.positionTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-court-xs text-court-text-ter">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {timeAgo(app.appliedAt)}
                      </span>
                      {app.university && (
                        <>
                          <span>·</span>
                          <span>{app.university}</span>
                        </>
                      )}
                      {app.yearOfStudy && (
                        <>
                          <span>·</span>
                          <span>{app.yearOfStudy}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-court-text-ter shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-court-text-ter shrink-0" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-court-border pt-4 space-y-4">
                    {/* Quick Links Row */}
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`mailto:${app.email}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-court-border rounded-lg text-court-xs text-court-text-sec hover:text-gold hover:border-gold/20 transition-colors"
                      >
                        <Mail size={12} /> {app.email}
                      </a>
                      {app.linkedinUrl && (
                        <a
                          href={app.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/8 border border-[#0A66C2]/20 rounded-lg text-court-xs text-[#0A66C2] hover:bg-[#0A66C2]/15 transition-colors"
                        >
                          <Linkedin size={12} /> LinkedIn Profile
                        </a>
                      )}
                      {app.portfolioUrl && (
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-court-border rounded-lg text-court-xs text-court-text-sec hover:text-gold hover:border-gold/20 transition-colors"
                        >
                          <Globe size={12} /> Portfolio
                        </a>
                      )}
                      {app.cvStorageId && (
                        <CvDownloadButton storageId={app.cvStorageId} fileName={app.cvFileName} />
                      )}
                    </div>

                    {/* Cover Message */}
                    <div>
                      <p className="text-court-xs font-bold text-court-text-ter uppercase tracking-wider mb-1.5">
                        Cover Message
                      </p>
                      <div className="bg-white/[0.03] border border-court-border rounded-lg p-3">
                        <p className="text-court-sm text-court-text-sec leading-relaxed whitespace-pre-wrap">
                          {app.coverMessage}
                        </p>
                      </div>
                    </div>

                    {/* Relevant Experience */}
                    {app.relevantExperience && (
                      <div>
                        <p className="text-court-xs font-bold text-court-text-ter uppercase tracking-wider mb-1.5">
                          Relevant Experience
                        </p>
                        <div className="bg-white/[0.03] border border-court-border rounded-lg p-3">
                          <p className="text-court-sm text-court-text-sec leading-relaxed whitespace-pre-wrap">
                            {app.relevantExperience}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Internal Notes */}
                    <div>
                      <p className="text-court-xs font-bold text-court-text-ter uppercase tracking-wider mb-1.5">
                        Internal Notes
                      </p>
                      <textarea
                        value={notesMap[app._id] ?? app.reviewNotes ?? ""}
                        onChange={(e) =>
                          setNotesMap((prev) => ({ ...prev, [app._id]: e.target.value }))
                        }
                        placeholder="Add review notes..."
                        rows={2}
                        className="w-full bg-white/[0.03] border border-court-border rounded-lg px-3 py-2 text-court-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      {actions.length > 0 ? (
                        <div className="flex gap-2">
                          {actions.map((action) => {
                            const Icon = action.icon;
                            const isReject = action.status === "rejected";
                            return (
                              <button
                                key={action.status}
                                onClick={() => handleStatusChange(app._id, action.status)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-court-sm font-semibold transition-all ${
                                  isReject
                                    ? "text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20"
                                    : "text-gold bg-gold/10 hover:bg-gold/20 border border-gold/20"
                                }`}
                              >
                                <Icon size={14} />
                                {action.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span />
                      )}
                      {app.reviewedAt && (
                        <p className="text-court-xs text-court-text-ter">
                          Reviewed {timeAgo(app.reviewedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** CV download as inline button */
function CvDownloadButton({ storageId, fileName }: { storageId: any; fileName?: string }) {
  const url: string | null | undefined = useQuery(anyApi.careers.getCvDownloadUrl, { storageId });

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-court-border rounded-lg text-court-xs text-court-text-sec hover:text-gold hover:border-gold/20 transition-colors"
    >
      <Download size={12} />
      {fileName ?? "Download CV"}
    </a>
  );
}
