"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Book, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { Card, Button, DynamicIcon } from "@/components/ui";
import { getModuleByTitle } from "@/lib/constants/modules";

// ── Types ──

interface DebateFormData {
  title: string;
  background: string;
  legalIssue: string;
  argumentsFor: string;
  argumentsAgainst: string;
  closingPosition: string;
  module: string;
  references: string[];
}

interface DebateTemplateProps {
  initialTitle?: string;
  initialBackground?: string;
  initialModule?: string;
  initialReferences?: string[];
  onSubmit: (data: DebateFormData) => void;
  onCancel: () => void;
}

// ── Textarea field config ──

interface SectionField {
  key: keyof Pick<DebateFormData, "background" | "legalIssue" | "argumentsFor" | "argumentsAgainst" | "closingPosition">;
  label: string;
  placeholder: string;
  rows: number;
}

const SECTION_FIELDS: SectionField[] = [
  {
    key: "background",
    label: "Background",
    placeholder: "Set the context for this debate",
    rows: 3,
  },
  {
    key: "legalIssue",
    label: "Legal Issue",
    placeholder: "What specific legal question does this debate address?",
    rows: 3,
  },
  {
    key: "argumentsFor",
    label: "Arguments For",
    placeholder: "Key arguments supporting the motion",
    rows: 4,
  },
  {
    key: "argumentsAgainst",
    label: "Arguments Against",
    placeholder: "Key arguments opposing the motion",
    rows: 4,
  },
  {
    key: "closingPosition",
    label: "Closing Position",
    placeholder: "Your preliminary view on the matter",
    rows: 3,
  },
];

const textareaClasses =
  "w-full bg-white/[0.03] border border-court-border rounded-xl text-court-base text-court-text placeholder:text-court-text-ter resize-none focus:border-gold/30 focus:outline-none transition-colors p-3 font-sans";

const labelClasses =
  "text-court-xs font-bold text-court-text-ter uppercase tracking-widest mb-1.5 block";

// ── Component ──

export default function DebateTemplate({
  initialTitle = "",
  initialBackground = "",
  initialModule = "",
  initialReferences = [],
  onSubmit,
  onCancel,
}: DebateTemplateProps) {
  const [title, setTitle] = useState(initialTitle);
  const [sections, setSections] = useState({
    background: initialBackground,
    legalIssue: "",
    argumentsFor: "",
    argumentsAgainst: "",
    closingPosition: "",
  });
  const [references, setReferences] = useState<string[]>(initialReferences);
  const [newReference, setNewReference] = useState("");

  const moduleData = useMemo(
    () => (initialModule ? getModuleByTitle(initialModule) : undefined),
    [initialModule]
  );

  // Count how many IRAC sections have content
  const filledSectionCount = useMemo(() => {
    return Object.values(sections).filter((v) => v.trim().length > 0).length;
  }, [sections]);

  const canSubmit = title.trim().length > 0 && filledSectionCount >= 2;

  const handleSectionChange = (
    key: keyof typeof sections,
    value: string
  ) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddReference = () => {
    const trimmed = newReference.trim();
    if (trimmed && !references.includes(trimmed)) {
      setReferences((prev) => [...prev, trimmed]);
      setNewReference("");
    }
  };

  const handleRemoveReference = (index: number) => {
    setReferences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      background: sections.background.trim(),
      legalIssue: sections.legalIssue.trim(),
      argumentsFor: sections.argumentsFor.trim(),
      argumentsAgainst: sections.argumentsAgainst.trim(),
      closingPosition: sections.closingPosition.trim(),
      module: initialModule,
      references,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl font-bold text-court-text">
          Create Structured Debate
        </h2>
        <p className="text-court-sm text-court-text-sec mt-1">
          Build a well-reasoned academic debate
        </p>
      </div>

      {/* Title field */}
      <div>
        <label className={labelClasses}>Motion Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="This House believes..."
          className={cn(
            "w-full bg-white/[0.03] border border-court-border rounded-xl text-court-text placeholder:text-court-text-ter focus:border-gold/30 focus:outline-none transition-colors p-3",
            "font-serif text-base font-medium"
          )}
        />
      </div>

      {/* Module indicator */}
      {moduleData && (
        <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.03] rounded-xl border border-court-border-light">
          <DynamicIcon
            name={moduleData.icon}
            size={16}
            className="text-gold"
          />
          <span className="text-court-sm font-medium text-court-text-sec">
            {moduleData.title}
          </span>
        </div>
      )}

      {/* IRAC-inspired sections */}
      <div className="space-y-4">
        {SECTION_FIELDS.map((field) => (
          <Card key={field.key} className="p-4">
            <label className={labelClasses}>{field.label}</label>
            <textarea
              rows={field.rows}
              value={sections[field.key]}
              onChange={(e) => handleSectionChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={textareaClasses}
            />
          </Card>
        ))}
      </div>

      {/* References section */}
      <Card className="p-4">
        <label className={labelClasses}>References</label>

        {/* Existing references */}
        {references.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {references.map((ref, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-court-border-light rounded-lg text-court-xs text-court-text-sec"
              >
                <Book size={10} className="text-court-text-ter shrink-0" />
                <span className="line-clamp-1">{ref}</span>
                <button
                  onClick={() => handleRemoveReference(i)}
                  className="text-court-text-ter hover:text-red-400 transition-colors shrink-0"
                  aria-label={`Remove reference: ${ref}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add reference input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newReference}
            onChange={(e) => setNewReference(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddReference();
              }
            }}
            placeholder="Add a case, statute, or academic reference"
            className="flex-1 bg-white/[0.03] border border-court-border rounded-xl text-court-xs text-court-text placeholder:text-court-text-ter focus:border-gold/30 focus:outline-none transition-colors px-3 py-2"
          />
          <button
            onClick={handleAddReference}
            disabled={!newReference.trim()}
            className={cn(
              "px-3 py-2 rounded-xl border border-court-border text-court-text-ter transition-all duration-200",
              newReference.trim()
                ? "hover:border-gold/30 hover:text-gold cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            )}
            aria-label="Add reference"
          >
            <Plus size={14} />
          </button>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <Button variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Submit Debate
        </Button>
      </div>
    </motion.div>
  );
}
