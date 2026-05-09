"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { SketchCard } from "@/components/primitives/SketchCard";
import { SketchButton } from "@/components/primitives/SketchButton";

type Rule = {
  step: string;
  title: string;
  body: string;
  color: string;
  rotate: number;
};

const rules: Rule[] = [
  {
    step: "Step 1",
    title: "See the target",
    body: "You're shown an image. You can't see the prompt that made it.",
    color: "#fef9c3",
    rotate: -1.5,
  },
  {
    step: "Step 2",
    title: "Write your prompt",
    body: "You have 60 seconds to describe the image as precisely as you can.",
    color: "#bbf7d0",
    rotate: 1,
  },
  {
    step: "Step 3",
    title: "See how close",
    body: "Compare side-by-side. Get a score and tips on how to do better.",
    color: "#fbcfe8",
    rotate: -1,
  },
];

export function RulesSection() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const modal = open ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How to play"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
    >
      <button
        type="button"
        aria-label="Close rules"
        onClick={() => setOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/60 backdrop-blur-[2px]"
      />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-md flex-col">
        <SketchCard color="#f6eddc" className="paper-thick-card flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3 sm:px-5 sm:py-4">
            <h2
              className="font-label text-ink"
              style={{ fontSize: "clamp(1.5rem, 6vw, 2.25rem)" }}
            >
              How to Play
            </h2>
            <button
              type="button"
              aria-label="Close rules"
              onClick={() => setOpen(false)}
              className="paper-icon-button flex h-9 w-9 items-center justify-center text-ink transition-transform hover:-rotate-3"
            >
              <X className="doodle-icon h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 py-5 sm:gap-5 sm:px-5">
            {rules.map((rule) => (
              <SketchCard
                key={rule.step}
                color={rule.color}
                rotate={rule.rotate}
                className="px-4 py-3 sm:px-5 sm:py-4"
              >
                <div className="font-label text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {rule.step}
                </div>
                <h3
                  className="font-label mt-1 font-bold leading-tight text-ink"
                  style={{ fontSize: "clamp(1rem, 4.4vw, 1.25rem)" }}
                >
                  {rule.title}
                </h3>
                <p
                  className="font-label mt-1.5 leading-snug text-ink"
                  style={{ fontSize: "clamp(0.85rem, 3.6vw, 1rem)" }}
                >
                  {rule.body}
                </p>
              </SketchCard>
            ))}
          </div>
        </SketchCard>
      </div>
    </div>
  ) : null;

  return (
    <>
      <SketchButton
        variant="accent"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="w-full rotate-[-0.3deg]"
      >
        Rules
      </SketchButton>
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
