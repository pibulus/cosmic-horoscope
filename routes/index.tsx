import HomeIsland from "../islands/HomeIsland.tsx";
import ThemeIsland from "../islands/ThemeIsland.tsx";
import BackgroundEffects from "../islands/BackgroundEffects.tsx";
import BackgroundCanvas from "../islands/BackgroundCanvas.tsx";
import { AboutModal } from "../islands/AboutModal.tsx";
import { WelcomeModal } from "../islands/WelcomeModal.tsx";
import WelcomeChecker from "../islands/WelcomeChecker.tsx";

export default function Home() {
  return (
    <div
      id="main-content"
      class="min-h-[100dvh] w-full flex flex-col relative overflow-hidden global-flicker"
      style="background: linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%); position: fixed; top: 0; left: 0; right: 0; bottom: 0;"
    >
      {/* Animated canvas background */}
      <BackgroundCanvas />

      {/* Global atmospheric effects removed for crisper terminal */}

      {/* Check if first visit and show welcome */}
      <WelcomeChecker />

      {/* First-visit welcome modal */}
      <WelcomeModal />

      {/* About modal (opened by footer link) */}
      <AboutModal />

      {/* Floating Theme Button */}
      {/* <div class="fixed top-4 right-4 z-50">
        <ThemeIsland />
      </div> */}

      {/* Main interactive content */}
      <HomeIsland />
    </div>
  );
}
