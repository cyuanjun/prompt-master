import { Header } from "@/components/landing/Header";
import { DescriptionCard } from "@/components/landing/DescriptionCard";
import { JoinGameCard } from "@/components/landing/JoinGameCard";
import { PracticeModeCard } from "@/components/landing/PracticeModeCard";

export default function HomePage() {
  return (
    <main className="paper-screen min-h-[100dvh] overflow-x-hidden px-4 pb-6 pt-0 sm:px-6 sm:pt-0">
      <Header />
      <section className="mx-auto mt-5 flex w-full max-w-[260px] flex-col items-stretch gap-4 sm:mt-8 sm:max-w-[280px] sm:gap-5">
        <DescriptionCard />
        <JoinGameCard />
        <PracticeModeCard />
      </section>
    </main>
  );
}
