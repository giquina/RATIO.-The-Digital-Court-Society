"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import {
  Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, Mic, BarChart3,
  Shield, Mail, MessageCircle, ExternalLink,
} from "lucide-react";

// ── FAQ Data ──
const FAQ_SECTIONS = [
  {
    title: "Getting Started",
    icon: <BookOpen size={16} className="text-gold" />,
    items: [
      {
        q: "What is Ratio?",
        a: "Ratio is a digital court society for UK law students. It provides a structured platform for practising oral advocacy through mooting, AI-powered practice sessions, and peer feedback. Think of it as a modern version of the Inns of Court experience, accessible to all law students.",
      },
      {
        q: "How do I create an account?",
        a: "Sign up using your university email address (.ac.uk). You will be asked to choose a chamber, select your university and year of study, and set up your profile. The process takes less than 2 minutes.",
      },
      {
        q: "Which universities are supported?",
        a: "Ratio supports 142 UK universities across all regions, including UCL, KCL, LSE, Oxford, Cambridge, Birkbeck, Bristol, Manchester, Edinburgh, Birmingham, Leeds, Exeter, Warwick, Nottingham, Durham, QMUL, SOAS, City, Sheffield, Glasgow, Cardiff, and many more. If your university is not listed during registration, contact us and we will add it.",
      },
    ],
  },
  {
    title: "Sessions & Mooting",
    icon: <Mic size={16} className="text-gold" />,
    items: [
      {
        q: "How do I join a moot session?",
        a: "Navigate to the Sessions page and browse available sessions. You can filter by module, date, and session type. Click on a session to view its details and available roles, then click 'Join' to take a role. You will receive a confirmation and preparation materials.",
      },
      {
        q: "Can I create my own moot session?",
        a: "Yes! Go to Sessions > Create Session. You can set the case topic, module, date and time, available roles, and whether it is public or private. You can invite specific advocates or open it to your chamber or the wider community.",
      },
      {
        q: "What types of sessions are available?",
        a: "Ratio supports five session types: Moot (traditional appellate advocacy), Mock Trial (courtroom simulation), SQE2 Prep (assessment-focused practice), Debate (informal argumentation), and Workshop (skills training). Each has tailored roles and feedback criteria.",
      },
    ],
  },
  {
    title: "AI Judge",
    icon: <Mic size={16} className="text-gold" />,
    items: [
      {
        q: "How does the AI Judge work?",
        a: "The AI Judge uses advanced speech recognition and natural language processing to listen to your oral submissions. It evaluates your advocacy in real-time, asks interventions (just like a real judge), and provides detailed scoring across 7 dimensions of advocacy.",
      },
      {
        q: "What are the 7 scoring dimensions?",
        a: "Your advocacy is scored across: Argument Structure (IRAC method), Use of Authorities (case citations and statutes), Oral Delivery & Clarity, Response to Judicial Interventions, Court Manner & Etiquette, Persuasiveness, and Time Management.",
      },
      {
        q: "Is the AI Judge a replacement for real mooting?",
        a: "No. The AI Judge is designed to complement traditional mooting, not replace it. It is ideal for practice between moot sessions, for students who want to build confidence before their first moot, or for focused skills development on specific advocacy dimensions.",
      },
    ],
  },
  {
    title: "Scoring & Rankings",
    icon: <BarChart3 size={16} className="text-gold" />,
    items: [
      {
        q: "How is my score calculated?",
        a: "Your overall score is a weighted average of the 7 advocacy dimensions. Each dimension is scored from 0 to 100. Scores from both AI Judge sessions and peer-reviewed moot sessions contribute to your profile. More recent sessions carry slightly more weight.",
      },
      {
        q: "How do the national rankings work?",
        a: "Rankings are based on cumulative advocacy points earned from sessions. Points are awarded for session completion, score quality, consistency (streaks), and community engagement (commendations). Rankings reset each academic year, with historical records preserved.",
      },
    ],
  },
  {
    title: "Account & Privacy",
    icon: <Shield size={16} className="text-gold" />,
    items: [
      {
        q: "Who can see my profile and scores?",
        a: "By default, your profile is visible to other Ratio users. You can control visibility in Settings > Privacy. You can hide your follower count, make your profile private, or restrict visibility to your chamber only.",
      },
      {
        q: "How is my data used?",
        a: "Your data is used solely to provide the Ratio service. Audio from AI Judge sessions is processed in real-time and not permanently stored. Your scores, session history, and profile data are stored securely. We never sell or share your personal data with third parties.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Getting Started": true,
  });
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter FAQ items by search
  const filteredSections = FAQ_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={20} className="text-gold" />
          <h1 className="font-serif text-2xl font-bold text-court-text">Help & FAQ</h1>
        </div>
        <p className="text-court-sm text-court-text-sec mt-1">
          Find answers to common questions about Ratio
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="bg-white/[0.05] rounded-xl px-4 py-3 flex items-center gap-2.5 border border-court-border-light focus-within:border-gold/30 transition-colors">
          <Search size={16} className="text-court-text-ter shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="flex-1 bg-transparent text-court-base text-court-text outline-none placeholder:text-court-text-ter"
            aria-label="Search FAQ"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-court-text-ter text-court-sm hover:text-court-text transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="px-4 md:px-6 lg:px-8 space-y-3">
        {filteredSections.map((section) => {
          const isOpen = !!openSections[section.title];
          return (
            <Card key={section.title} className="overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gold-dim flex items-center justify-center shrink-0">
                  {section.icon}
                </div>
                <h3 className="flex-1 text-left font-serif text-court-md font-bold text-court-text">
                  {section.title}
                </h3>
                <span className="text-court-xs text-court-text-ter mr-2">
                  {section.items.length} {section.items.length === 1 ? "question" : "questions"}
                </span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-court-text-ter" />
                ) : (
                  <ChevronDown size={16} className="text-court-text-ter" />
                )}
              </button>

              {/* Items */}
              {isOpen && (
                <div className="border-t border-court-border-light">
                  {section.items.map((item, idx) => {
                    const key = `${section.title}-${idx}`;
                    const isItemOpen = !!openItems[key];
                    return (
                      <div
                        key={key}
                        className="border-b border-court-border-light last:border-b-0"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                        >
                          <span className="text-court-base text-gold font-bold w-5 shrink-0">
                            Q
                          </span>
                          <p className="flex-1 text-court-base text-court-text font-medium">
                            {item.q}
                          </p>
                          {isItemOpen ? (
                            <ChevronUp size={14} className="text-court-text-ter shrink-0" />
                          ) : (
                            <ChevronDown size={14} className="text-court-text-ter shrink-0" />
                          )}
                        </button>
                        {isItemOpen && (
                          <div className="px-4 pb-3.5 pl-4 sm:pl-9">
                            <p className="text-court-base text-court-text-sec leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}

        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle size={32} className="text-court-text-ter mx-auto mb-3" />
            <p className="text-court-base text-court-text-ter">
              No results found for &ldquo;{search}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <Card className="p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.03] to-transparent" />
          <div className="relative text-center">
            <MessageCircle size={28} className="text-gold mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-court-text mb-1">
              Still need help?
            </h3>
            <p className="text-court-base text-court-text-sec mb-4 max-w-sm mx-auto">
              Our support team is available Monday to Friday, 9am to 5pm GMT.
              We aim to respond within 24 hours.
            </p>
            <a
              href="mailto:mgiqui01@student.bbk.ac.uk"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-court-sm px-5 py-2.5 rounded-xl hover:bg-gold/90 transition-colors"
            >
              <Mail size={14} />
              mgiqui01@student.bbk.ac.uk
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
