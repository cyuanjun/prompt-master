"use client";

import { useState } from "react";
import { Lightbulb, Pencil, Sparkles } from "lucide-react";
import { SketchButton } from "@/components/primitives/SketchButton";
import { SketchCard } from "@/components/primitives/SketchCard";

type PromptInputProps = {
  tip?: string;
  maxLength?: number;
};

export function PromptInput({
  tip = "Tip: Think about lighting, atmosphere, composition, details!",
  maxLength = 200,
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const isEmpty = value.trim().length === 0;

  return (
    <div className="relative">
      <label
        htmlFor="challenge-prompt"
        className="font-label mb-2 flex items-center gap-2 text-base text-ink"
      >
        <Pencil className="h-4 w-4" />
        Your Prompt
      </label>

      <SketchCard color="#ffffff" className="relative">
        <textarea
          id="challenge-prompt"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={3}
          maxLength={maxLength}
          placeholder="Describe the image as accurately as you can..."
          className="font-label w-full resize-none bg-transparent px-3 py-2.5 pr-16 text-ink outline-none placeholder:text-muted sm:px-4 sm:py-3"
        />
        <span className="font-label absolute bottom-1.5 right-2 text-xs text-muted">
          {value.length} / {maxLength}
        </span>
      </SketchCard>

      <div className="mt-2 flex items-start gap-2 text-muted">
        <Lightbulb className="mt-[2px] h-4 w-4 shrink-0 text-[#f59e0b]" />
        <p className="font-label text-xs sm:text-sm">{tip}</p>
      </div>

      <div className="relative mt-4">
        <SketchButton
          type="button"
          variant="primary"
          disabled={isEmpty}
          onClick={() => {}}
          className="w-full"
          icon={<Sparkles className="h-4 w-4" />}
        >
          Generate
        </SketchButton>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="absolute -right-2 -top-3 h-4 w-4 text-[#7c3aed]"
          fill="currentColor"
        >
          <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="absolute -right-5 top-5 h-3 w-3 text-[#7c3aed]"
          fill="currentColor"
        >
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
        </svg>
      </div>
    </div>
  );
}
