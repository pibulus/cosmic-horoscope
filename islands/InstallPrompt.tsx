// ===================================================================
// INSTALL PROMPT - PWA Add to Home Screen prompt
// ===================================================================
// Smart install prompt that handles both iOS and Android

// deno-lint-ignore-file no-explicit-any

import { useEffect, useRef, useState } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";

const PROMPT_DISMISSED_KEY = "stargram-install-dismissed";
const PROMPT_DELAY_MS = 10000; // Show after 10 seconds

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    // Check if already dismissed
    if (localStorage.getItem(PROMPT_DISMISSED_KEY)) {
      return;
    }

    // Check if already installed
    if (globalThis.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isiOS);
    setIsAndroid(isAndroidDevice);

    // iOS: Show after delay (no beforeinstallprompt event)
    if (isiOS) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
        sounds.success();
      }, PROMPT_DELAY_MS);

      return () => clearTimeout(timer);
    }

    // Android/Chrome: Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;

      // Show prompt after delay
      setTimeout(() => {
        setShowPrompt(true);
        sounds.success();
      }, PROMPT_DELAY_MS);
    };

    globalThis.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );

    return () => {
      globalThis.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (isAndroid && deferredPromptRef.current) {
      // Android: Show native install prompt
      deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === "accepted") {
        sounds.success();
      }

      deferredPromptRef.current = null;
      setShowPrompt(false);
      localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
    }
    // iOS: Instructions are shown in the prompt itself
  };

  const handleDismiss = () => {
    sounds.click();
    setShowPrompt(false);
    localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
  };

  if (!showPrompt) return null;

  return (
    <div
      class="fixed bottom-20 sm:bottom-24 left-4 right-4 sm:left-auto sm:right-6 z-40 animate-slide-up"
      style="max-width: 400px; margin-left: auto; margin-right: auto;"
    >
      <div
        class="p-4 sm:p-5 border-4 rounded-2xl shadow-brutal-xl relative"
        style="background: linear-gradient(135deg, #a78bfa 0%, #f0abfc 100%); border-color: var(--color-border, #a78bfa);"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleDismiss}
          class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full font-bold transition-all hover:scale-110"
          style="background-color: rgba(0, 0, 0, 0.3); color: white;"
          aria-label="Dismiss install prompt"
        >
          ×
        </button>

        {/* Content */}
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="text-3xl">✨</div>
            <div>
              <h3 class="text-lg sm:text-xl font-black font-mono text-white">
                Add to Home Screen
              </h3>
              <p class="text-sm font-mono text-white opacity-90">
                Get horoscopes with one tap!
              </p>
            </div>
          </div>

          {isIOS
            ? (
              // iOS Instructions
              <div
                class="p-3 rounded-xl text-sm font-mono space-y-2"
                style="background-color: rgba(0, 0, 0, 0.2); color: white;"
              >
                <p class="font-bold">How to install:</p>
                <ol class="space-y-1 pl-4 list-decimal">
                  <li>
                    Tap the Share button
                    <span class="inline-block mx-1 px-2 py-0.5 rounded bg-white/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="inline"
                      >
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                      </svg>
                    </span>
                  </li>
                  <li>Scroll and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
              </div>
            )
            : (
              // Android Install Button
              <button
                type="button"
                onClick={handleInstall}
                class="w-full px-5 py-3 border-3 rounded-xl font-mono font-black text-base transition-all hover:scale-105 active:scale-95 shadow-brutal-sm"
                style="background-color: white; color: #a78bfa; border-color: rgba(0, 0, 0, 0.3);"
              >
                📱 Install App
              </button>
            )}

          <p class="text-xs text-center font-mono text-white opacity-80">
            Free. No ads. Works offline.
          </p>
        </div>
      </div>

      <style>
        {`
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .shadow-brutal-xl {
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);
        }

        .shadow-brutal-sm {
          box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
        }
        `}
      </style>
    </div>
  );
}
