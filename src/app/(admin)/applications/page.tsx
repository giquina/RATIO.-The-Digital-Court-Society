"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  Briefcase,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Loader2,
  User,
  Mail,
  GraduationCap,
  Link as LinkIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
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

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const counts: any = useQuery(anyApi.careers.getApplicationCounts, {});
  const applications: any[] | undefined = useQuery(
    anyApi.careers.listApplications,
    statusFilter ? { status: statusFilter } : {}
  );
  const updateStatus = useMutation(anyApi.careers.updateApplicationStatus);

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
        {counts && (
          <div className="flex gap-4 mt-3 text-court-xs text-court-text-ter">
            <span>{counts.total} total</span>
            <span className="text-yellow-400">{counts.pending ?? 0} pending</span>
            <span className="text-blue-400">{counts.reviewing ?? 0} reviewing</span>
            <span className="text-purple-400">{counts.shortlisted ?? 0} shortlisted</span>
            <span className="text-green-400">{counts.accepted ?? 0} accepted</span>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto no-scrollbar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-court-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-court-text-sec hover:bg-white/[0.04]"
            }`}
          >
            {tab.label}
            {counts && tab.key && counts[tab.key] ? (
              <span className="ml-1.5 opacity-60">({counts[tab.key]})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {applications === undefined ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-court-text-ter" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase size={32} className="text-court-text-ter mx-auto mb-3" />
          <p className="text-court-text-sec text-court-sm">No applications found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {applications.map((app: any) => {
            const isExpanded = expandedId === app._id;
            const actions = NEXT_STATUS[app.status] ?? [];
            return (
              <div
                key={app._id}
                className="bg-white/[0.03] border border-court-border rounded-xl overflow-hidden"
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
                        className={`text-court-xs font-bold px-2 py-0.5 rounded-full border ${
                          STATUS_COLORS[app.status] ?? "text-court-text-ter"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-court-sm text-court-text-sec truncate">
                      {app.positionTitle}
                    </p>
                    <p className="text-court-xs text-court-text-ter mt-0.5">
                      {new Date(app.appliedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {app.university && ` · ${app.university}`}
                    </p>
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
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-court-sm">
                        <Mail size={14} className="text-court-text-ter" />
                        <a href={`mailto:${app.email}`} className="text-gold hover:underline">
                          {app.email}
                        </a>
                      </div>
                      {app.university && (
                        <div className="flex items-center gap-2 text-court-sm text-court-text-sec">
                          <GraduationCap size={14} className="text-court-text-ter" />
                          {app.university}
                          {app.yearOfStudy && ` — ${app.yearOfStudy}`}
                        </div>
                      )}
                      {app.portfolioUrl && (
                        <div className="flex items-center gap-2 text-court-sm">
                          <LinkIcon size={14} className="text-court-text-ter" />
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline truncate"
                          >
                            {app.portfolioUrl}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Cover Message */}
                    <div>
                      <p className="text-court-xs font-bold text-court-text-ter uppercase tracking-wider mb-1">
                        Cover Message
                      </p>
                      <p className="text-court-sm text-court-text-sec leading-relaxed whitespace-pre-wrap">
                        {app.coverMessage}
                      </p>
                    </div>

                    {/* Relevant Experience */}
                    {app.relevantExperience && (
                      <div>
                        <p className="text-court-xs font-bold text-court-text-ter uppercase tracking-wider mb-1">
                          Relevant Experience
                        </p>
                        <p className="text-court-sm text-court-text-sec leading-relaxed whitespace-pre-wrap">
                          {app.relevantExperience}
                        </p>
                      </div>
                    )}

                    {/* CV Download */}
                    {app.cvStorageId && (
                      <CvDownloadButton storageId={app.cvStorageId} fileName={app.cvFileName} />
                    )}

                    {/* Internal Notes */}
                    <div>
                      <p className="text-court-xs font-bold text-court-text-ter uppercase tracking-wider mb-1">
                        Internal Notes
                      </p>
                      <textarea
                        value={notesMap[app._id] ?? app.reviewNotes ?? ""}
                        onChange={(e) =>
                          setNotesMap((prev) => ({ ...prev, [app._id]: e.target.value }))
                        }
                        placeholder="Add review notes..."
                        rows={2}
                        className="w-full bg-white/[0.04] border border-court-border rounded-lg px-3 py-2 text-court-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                      />
                    </div>

                    {/* Actions */}
                    {actions.length > 0 && (
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
                    )}

                    {/* Review info */}
                    {app.reviewedAt && (
                      <p className="text-court-xs text-court-text-ter">
                        Last reviewed: {new Date(app.reviewedAt).toLocaleDateString("en-GB")}
                      </p>
                    )}
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

/** Separate component for CV download to isolate the query */
function CvDownloadButton({ storageId, fileName }: { storageId: any; fileName?: string }) {
  const url: string | null | undefined = useQuery(anyApi.careers.getCvDownloadUrl, { storageId });

  if (!url) return null;

  return (
    <div>
      <p className="text-court-xs font-bold text-court-text-ter uppercase tracking-wider mb-1">
        CV / Resume
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/[0.06] border border-court-border rounded-lg text-court-sm text-gold hover:bg-white/[0.08] transition-colors"
      >
        <Download size={14} />
        {fileName ?? "Download CV"}
      </a>
    </div>
  );
}
