"use client";

import { Card } from "@/components/ui";
import {
  Scale, Users, Mic, Target, Shield, BookOpen, Globe, Award,
  GraduationCap, Heart, ArrowRight,
} from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: <GraduationCap size={22} className="text-gold" />,
    title: "Join Your Chamber",
    description: "Sign up with your university email and join one of four Inns of Court-inspired chambers.",
  },
  {
    step: 2,
    icon: <Mic size={22} className="text-gold" />,
    title: "Practice Advocacy",
    description: "Join moot sessions, practise with AI Judge, and develop your oral advocacy skills.",
  },
  {
    step: 3,
    icon: <Target size={22} className="text-gold" />,
    title: "Get Feedback",
    description: "Receive detailed scoring across 7 dimensions of advocacy, powered by AI and peer review.",
  },
  {
    step: 4,
    icon: <Award size={22} className="text-gold" />,
    title: "Rise Through the Ranks",
    description: "Earn points, climb the leaderboard, unlock badges, and build your advocacy portfolio.",
  },
];

const PRINCIPLES = [
  {
    icon: <Shield size={24} className="text-gold" />,
    title: "Academic Integrity",
    description:
      "Ratio upholds the highest standards of academic honesty. AI tools assist learning, never replace it.",
  },
  {
    icon: <Users size={24} className="text-gold" />,
    title: "Student Governance",
    description:
      "Built by law students, governed by law students. Every chamber elects its own leadership.",
  },
  {
    icon: <Globe size={24} className="text-gold" />,
    title: "Open Access",
    description:
      "Free for all UK law students to get started. Core features are always accessible, with optional premium tiers for deeper training.",
  },
  {
    icon: <Scale size={24} className="text-gold" />,
    title: "Advocacy Excellence",
    description:
      "Modelled on the Inns of Court tradition, adapted for the modern law student experience.",
  },
  {
    icon: <Award size={24} className="text-gold" />,
    title: "Verified Credentials",
    description:
      "Earn professional certificates assessed across 7 dimensions of advocacy, with QR-verified credentials signed by the Founder.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <h1 className="font-serif text-2xl font-bold text-court-text">About Ratio</h1>
      </div>

      {/* Mission Statement */}
      <section className="px-4 md:px-6 lg:px-8 mt-4">
        <Card highlight className="p-6 md:p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gold/[0.04]" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-gold/[0.03]" />
          <div className="relative">
            <Scale size={32} className="text-gold mx-auto mb-4" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-court-text leading-relaxed max-w-lg mx-auto">
              &ldquo;To cultivate the next generation of advocates through accessible,
              technology-enhanced legal practice.&rdquo;
            </h2>
            <div className="w-12 h-0.5 bg-gold/30 mx-auto mt-5" />
          </div>
        </Card>
      </section>

      {/* What is Ratio? */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <Card className="p-5 md:p-6">
          <h2 className="font-serif text-lg font-bold text-court-text mb-3">
            What is Ratio?
          </h2>
          <div className="space-y-3 text-court-base text-court-text-sec leading-relaxed">
            <p>
              Ratio is the digital court society for UK law students. Inspired by the
              historic Inns of Court, Ratio creates a structured environment where students
              can practise oral advocacy, receive AI-powered feedback, and build a
              professional portfolio of their mooting and advocacy experience.
            </p>
            <p>
              Whether you are preparing for your first moot court competition, training for
              the SQE2 oral skills assessment, or simply want to become a more persuasive
              advocate, Ratio gives you the tools, community, and structure to improve.
            </p>
            <p>
              The platform combines traditional mooting with cutting-edge AI. Our AI Judge
              listens to your arguments, asks interventions, and scores your performance
              across seven key dimensions of advocacy - just like a real bench.
            </p>
          </div>
        </Card>
      </section>

      {/* How It Works */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <h2 className="font-serif text-lg font-bold text-court-text mb-4 px-1">
          How It Works
        </h2>
        <div className="space-y-3">
          {HOW_IT_WORKS.map((item) => (
            <Card key={item.step} className="p-4 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-gold-dim flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-court-xs font-bold text-gold bg-gold-dim px-2 py-0.5 rounded">
                    STEP {item.step}
                  </span>
                  <h3 className="text-court-md font-bold text-court-text">{item.title}</h3>
                </div>
                <p className="text-court-base text-court-text-sec leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Principles */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <h2 className="font-serif text-lg font-bold text-court-text mb-4 px-1">
          Our Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRINCIPLES.map((principle) => (
            <Card key={principle.title} className="p-5">
              <div className="w-12 h-12 rounded-court bg-gold-dim flex items-center justify-center mb-3">
                {principle.icon}
              </div>
              <h3 className="font-serif text-base font-bold text-court-text mb-2">
                {principle.title}
              </h3>
              <p className="text-court-base text-court-text-sec leading-relaxed">
                {principle.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Built by Students */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <Card className="p-6 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              background: "radial-gradient(circle at 50% 50%, #C9A84C, transparent 70%)",
            }}
          />
          <div className="relative">
            <Heart size={28} className="text-gold mx-auto mb-3" />
            <h2 className="font-serif text-xl font-bold text-court-text mb-2">
              Built by Students, for Students
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed max-w-md mx-auto">
              Ratio was created by law students who believed that advocacy training should be
              accessible to everyone, not just those at institutions with established mooting
              cultures. Every feature has been designed with the student experience in mind.
            </p>
            <div className="flex justify-center gap-6 mt-5">
              {[
                { value: "20+", label: "Universities" },
                { value: "4", label: "Chambers" },
                { value: "7", label: "Scoring Dimensions" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-xl font-bold text-gold">{stat.value}</p>
                  <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <div className="text-center mt-8 pb-4">
        <p className="text-court-xs text-court-text-ter">
          Ratio v1.0.0
        </p>
      </div>
    </div>
  );
}
