import { SketchCard } from "@/components/primitives/SketchCard";

type RecreateNoteProps = {
  text?: string;
};

export function RecreateNote({
  text = "Recreate this image as closely as possible!",
}: RecreateNoteProps) {
  return (
    <div className="relative -mt-1">
      <SketchCard
        color="#fef9c3"
        rotate={-1}
        className="mx-auto max-w-[260px] px-4 py-2.5 text-center sm:px-5 sm:py-3"
      >
        <p
          className="font-label text-ink"
          style={{ fontSize: "clamp(0.95rem, 4vw, 1.1rem)" }}
        >
          {text}
        </p>
      </SketchCard>

      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="absolute -bottom-1 -right-3 h-6 w-6 text-ink sm:-right-4"
        fill="none"
      >
        <path
          d="M6 8 C18 6, 25 13, 20 23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 20 L20 24 L24 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
