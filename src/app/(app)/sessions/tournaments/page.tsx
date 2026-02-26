"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { Button, PremiumEmptyState } from "@/components/ui";

export default function TournamentsPage() {
  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Tournaments</h1>
            <p className="text-court-sm text-court-text-sec">Competitive mooting brackets</p>
          </div>
          <Link href="/sessions">
            <Button size="sm" variant="ghost">&larr; Sessions</Button>
          </Link>
        </div>
      </div>

      <div className="px-4">
        <PremiumEmptyState
          icon={<Trophy size={32} />}
          title="Tournaments Coming Soon"
          description="Inter-university moot court tournaments are being organised. Check back soon for registration details."
        />
      </div>
    </div>
  );
}
