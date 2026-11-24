"use client";

import Link from "next/link";
import { BarChart3, ArrowLeft } from "lucide-react";

interface BrandHeaderProps {
  mode?: "survey" | "records";
  onLogoClick?: () => void;
}

export function BrandHeader({
  mode = "survey",
  onLogoClick,
}: BrandHeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onLogoClick}
        className="flex items-center gap-2.5 sm:gap-3.5 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-3.5 py-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
        aria-label="RoboWheels x 2026 NSTW Home"
      >
        <img
          src="/logos/robowheels.png"
          alt="RoboWheels: Innovation for Every-Juan"
          className="h-9 sm:h-11 w-auto object-contain"
        />
        <span className="text-slate-300 font-display text-lg font-bold select-none">
          ×
        </span>
        <img
          src="/logos/nstw-2026.png"
          alt="2026 NSTW"
          className="h-7 sm:h-9 w-auto object-contain"
        />
      </button>

      {mode === "survey" ? (
        <Link
          href="/records"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0B153C] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-[#172863] active:scale-[0.98] transition-all"
        >
          <BarChart3 className="w-4 h-4 text-[#FBBF49]" />
          <span>View Records</span>
        </Link>
      ) : (
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0B153C] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-[#172863] active:scale-[0.98] transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#2EB5F4]" />
          <span>Back to Evaluation</span>
        </Link>
      )}
    </header>
  );
}
