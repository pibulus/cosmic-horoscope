import HomeIsland from "../islands/HomeIsland.tsx";
import ThemeIsland from "../islands/ThemeIsland.tsx";
import BackgroundEffects from "../islands/BackgroundEffects.tsx";
import { AboutModal } from "../islands/AboutModal.tsx";
import { WelcomeModal } from "../islands/WelcomeModal.tsx";
import WelcomeChecker from "../islands/WelcomeChecker.tsx";

export default function Home() {
  return (
    <div
      id="main-content"
      class="min-h-[100dvh] flex flex-col relative"
      style="background: var(--color-base, #0a0a0a)"
    >
      {/* Animated Background Effects - Mesh gradients, particles, cursor glow */}
      <BackgroundEffects />

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
