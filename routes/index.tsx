import HomeIsland from "../islands/HomeIsland.tsx";
import ThemeIsland from "../islands/ThemeIsland.tsx";
import { AboutModal } from "../islands/AboutModal.tsx";
import { WelcomeModal } from "../islands/WelcomeModal.tsx";
import WelcomeChecker from "../islands/WelcomeChecker.tsx";

export default function Home() {

  return (
    <div
      class="min-h-[100dvh] flex flex-col"
      style="background: var(--color-base-gradient, var(--color-base, #0a0e27))"
    >
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-purple-500 focus:text-white focus:rounded-lg focus:font-bold"
      >
        Skip to content
      </a>
      {/* Check if first visit and show welcome */}
      <WelcomeChecker />

      {/* First-visit welcome modal */}
      <WelcomeModal />

      {/* About modal (opened by footer link) */}
      <AboutModal />

      {/* Floating Theme Button */}
      <div class="fixed top-4 right-4 z-50">
        <ThemeIsland />
      </div>

      {/* Main interactive content */}
      <HomeIsland />
    </div>
  );
}
