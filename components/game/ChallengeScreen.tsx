import { GameHeader } from "@/components/game/GameHeader";
import { PromptInput } from "@/components/game/PromptInput";
import { RecreateNote } from "@/components/game/RecreateNote";
import { TargetImageCard } from "@/components/game/TargetImageCard";

const MOCK_CHALLENGE = {
  currentRound: 3,
  totalRounds: 5,
  timeLeft: "00:45",
  targetImageSrc: "/mock-target-image.svg",
  targetImageAlt: "Sunset lake scene with mountains and a purple boat",
  recreatePrompt: "Recreate this image as closely as possible!",
  tip: "Tip: Think about lighting, atmosphere, composition, details!",
  maxPromptLength: 200,
};

export function ChallengeScreen() {
  return (
    <main className="paper-screen min-h-[100dvh] overflow-x-hidden px-4 pb-8 pt-0 sm:px-6 sm:pt-0">
      <GameHeader
        currentRound={MOCK_CHALLENGE.currentRound}
        totalRounds={MOCK_CHALLENGE.totalRounds}
        timeLeft={MOCK_CHALLENGE.timeLeft}
      />

      <section className="mx-auto mt-5 flex w-full max-w-[420px] flex-col items-stretch gap-4 sm:mt-7 sm:gap-5">
        <h2
          className="font-label relative mx-auto inline-flex items-center gap-2 text-ink"
          style={{ fontSize: "clamp(1.4rem, 6vw, 1.85rem)" }}
        >
          <span className="relative">
            Your Challenge
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 right-0 h-[3px]"
              style={{
                background: "#7c3aed",
                borderRadius: 2,
                transform: "skewX(-4deg)",
              }}
            />
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none h-5 w-5 text-[#7c3aed]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          >
            <path d="M12 3l2.39 5.32L20 9.27l-4.2 3.86L17 19l-5-2.94L7 19l1.2-5.87L4 9.27l5.61-.95L12 3z" />
          </svg>
        </h2>

        <TargetImageCard
          imageSrc={MOCK_CHALLENGE.targetImageSrc}
          imageAlt={MOCK_CHALLENGE.targetImageAlt}
        />
        <RecreateNote text={MOCK_CHALLENGE.recreatePrompt} />
        <PromptInput
          tip={MOCK_CHALLENGE.tip}
          maxLength={MOCK_CHALLENGE.maxPromptLength}
        />
      </section>
    </main>
  );
}
