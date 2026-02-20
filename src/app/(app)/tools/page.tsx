"use client";

import Link from "next/link";
import { Card, Tag } from "@/components/ui";
import { Mic, FileText, Scale, Target, ArrowRight, Sparkles, Bot } from "lucide-react";

const TOOLS = [
  {
    title: "AI Judge",
    description:
      "Practice oral advocacy with an AI-powered judge. Present your arguments, face interventions, and receive detailed scoring across 7 dimensions.",
    icon: <Mic size={24} />,
    accentColor: "#C9A84C",
    href: "/ai-practice",
    available: true,
    tag: "Try Now",
    tagColor: "gold" as const,
  },
  {
    title: "Case Brief Generator",
    description:
      "Upload or paste a case and generate a structured brief with facts, issues, ratio decidendi, and application notes. Perfect for moot preparation.",
    icon: <FileText size={24} />,
    accentColor: "#4A8FE7",
    href: "/tools/case-brief",
    available: true,
    tag: "Try Now",
    tagColor: "blue" as const,
  },
  {
    title: "Argument Builder",
    description:
      "Input your skeleton argument and let AI identify logical weaknesses, missing authorities, and suggest counter-arguments to strengthen your case.",
    icon: <Scale size={24} />,
    accentColor: "#4CAF50",
    href: "/tools/argument-builder",
    available: true,
    tag: "Try Now",
    tagColor: "green" as const,
  },
  {
    title: "Learning Path",
    description:
      "Get personalised study recommendations based on your performance data. Focus on your weakest advocacy dimensions with tailored exercises.",
    icon: <Target size={24} />,
    accentColor: "#E97451",
    href: "/tools/learning-path",
    available: false,
    tag: "Coming Soon",
    tagColor: "orange" as const,
  },
];

export default function ToolsPage() {
  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={20} className="text-gold" />
          <h1 className="font-serif text-2xl font-bold text-court-text">AI Tools</h1>
        </div>
        <p className="text-xs text-court-text-sec mt-1">
          Practice, analyse, and prepare with AI-powered legal tools
        </p>
      </div>

      {/* Tools Grid */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOOLS.map((tool) => {
            const Wrapper = tool.available ? Link : "div";
            const wrapperProps = tool.available ? { href: tool.href } : {};

            return (
              <Wrapper key={tool.title} {...(wrapperProps as any)}>
                <Card
                  className={`p-5 h-full relative overflow-hidden transition-all ${
                    tool.available
                      ? "hover:border-white/10 cursor-pointer"
                      : "opacity-80"
                  }`}
                >
                  {/* Accent glow */}
                  <div
                    className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10"
                    style={{ background: tool.accentColor, filter: "blur(30px)" }}
                  />

                  <div className="relative">
                    {/* Top row: icon + tag */}
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className="w-12 h-12 rounded-court flex items-center justify-center"
                        style={{
                          background: `${tool.accentColor}15`,
                          color: tool.accentColor,
                        }}
                      >
                        {tool.icon}
                      </div>
                      <Tag color={tool.tagColor} small>
                        {tool.tag}
                      </Tag>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-base font-bold text-court-text mb-2">
                      {tool.title}
                    </h3>

                    {/* Description */}
                    <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
                      {tool.description}
                    </p>

                    {/* Action */}
                    {tool.available ? (
                      <div className="flex items-center gap-1.5 text-gold text-court-base font-bold">
                        <Sparkles size={14} />
                        Launch Tool
                        <ArrowRight size={14} className="ml-auto" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-court-text-ter text-court-base">
                        <Sparkles size={14} />
                        In Development
                      </div>
                    )}
                  </div>
                </Card>
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* Info Card */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <Card className="p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.03] to-transparent" />
          <div className="relative flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-gold-dim flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-gold" />
            </div>
            <div>
              <h3 className="text-court-md font-bold text-court-text mb-1">
                About Our AI Tools
              </h3>
              <p className="text-court-base text-court-text-sec leading-relaxed">
                All AI tools are designed to assist your learning, not replace it. They
                follow our Academic Integrity principles and are built to complement
                traditional mooting practice. Your data is never shared and all sessions
                remain private.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
