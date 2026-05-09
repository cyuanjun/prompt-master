import { RulesSection } from "./RulesSection";

export function DescriptionCard() {
  return (
    <section className="welcome-memo-card" aria-labelledby="welcome-title">
      <div className="welcome-memo-content">
        <h1
          id="welcome-title"
          className="welcome-memo-title font-label logo-text whitespace-nowrap leading-tight text-ink"
        >
          Welcome to the Arena!
        </h1>

        <div className="welcome-memo-lines font-label relative text-ink">
          <p>Guess the prompt.</p>
          <p>Recreate the vision.</p>
          <p className="relative inline-block pr-1">
            <span className="relative z-10">Win the battle!</span>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-0.5 h-[3px] w-full"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0, transparent 35%, #dc2626 35%, #dc2626 75%, transparent 75%)",
                borderRadius: "2px",
                transform: "skewX(-4deg)",
              }}
            />
          </p>
        </div>
      </div>

      <div className="welcome-memo-actions">
        <RulesSection />
      </div>
    </section>
  );
}
