"use client";

import { ArrowLeft, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

type GameHeaderProps = {
  currentRound: number;
  totalRounds: number;
  timeLeft: string;
};

export function GameHeader({
  currentRound,
  totalRounds,
  timeLeft,
}: GameHeaderProps) {
  const router = useRouter();

  return (
    <header className="paper-header sticky top-0 z-30 -mx-4 px-4 py-2 sm:-mx-6 sm:px-6 sm:py-3">
      <div className="mx-auto grid max-w-sm grid-cols-[40px_1fr_72px] items-center">
        <button
          type="button"
          aria-label="Go back to home"
          onClick={() => router.push("/")}
          className={cn(
            "paper-icon-button flex h-9 w-9 items-center justify-center text-ink",
            "transition-transform hover:-rotate-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          )}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex justify-center">
          <div className="paper-card-base relative px-3 py-1">
            <span
              className="font-label text-ink"
              style={{ fontSize: "clamp(0.85rem, 3.6vw, 1rem)" }}
            >
              ROUND {currentRound} / {totalRounds}
            </span>
          </div>
        </div>

        <div className="font-label flex items-center justify-end gap-1 tabular-nums text-[#f59e0b]">
          <Clock className="h-4 w-4" />
          <span>{timeLeft}</span>
        </div>
      </div>
    </header>
  );
}
