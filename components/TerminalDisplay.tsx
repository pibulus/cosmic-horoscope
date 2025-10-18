// ===================================================================
// TERMINAL DISPLAY - Shared terminal window component
// ===================================================================
// Used by both TextToAscii and AsciiGallery for consistent UI

import { useEffect, useRef, useState } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";
import {
  copyToClipboard,
  downloadPNG,
  downloadText,
} from "../utils/exportUtils.ts";
import { TypedWriter } from "./TypedWriter.tsx";
import { COLOR_EFFECTS } from "../utils/constants.ts";

/**
 * Get CSS filter string for visual effects
 */
function getVisualEffectStyle(effect?: string): string {
  let css = "";
  switch (effect) {
    case "none":
      css = "filter: none; text-shadow: none;";
      break;
    case "neon":
      css =
        "filter: saturate(1.1) brightness(1.0); text-shadow: 0 0 1px currentColor;";
      break;
    case "glitch":
      css =
        "filter: saturate(2.5) contrast(1.5); text-shadow: -3px 0 4px #ff00ff, 3px 0 4px #00ffff, -2px 0 2px #ff0000, 2px 0 2px #00ff00;";
      break;
    case "thermal":
      css =
        "filter: saturate(2) contrast(1.8) brightness(1.3) hue-rotate(20deg); text-shadow: 0 0 10px #ff6600, 0 0 20px #ff3300;";
      break;
    case "hologram":
      css =
        "filter: saturate(1.8) brightness(1.5); text-shadow: 0 0 10px currentColor, 0 0 20px #00ffff, 0 0 30px #ff00ff; opacity: 0.9;";
      break;
    case "retro":
      css =
        "filter: saturate(1.4) contrast(1.2) blur(0.3px); text-shadow: 0 0 2px currentColor, 0 0 4px currentColor;";
      break;
    case "cyberpunk":
      css =
        "filter: saturate(2) contrast(1.3); text-shadow: -1px 0 2px #ff00ff, 1px 0 2px #00ffff, 0 0 8px currentColor;";
      break;
    default:
      // Default to subtle glow
      css =
        "filter: saturate(1.1) brightness(1.0); text-shadow: 0 0 1px currentColor;";
  }
  return css;
}

interface TerminalDisplayProps {
  /** Plain text content to display */
  content: string;
  /** HTML content with color spans (optional) */
  htmlContent?: string;
  /** Whether content is currently loading */
  isLoading?: boolean;
  /** Filename for downloads (without extension) */
  filename?: string;
  /** Optional shuffle handler for gallery mode */
  onShuffle?: () => void;
  /** Terminal title bar path */
  terminalPath?: string;
  /** Whether to show shuffle button in menu bar */
  showShuffleButton?: boolean;
  /** Visual effect to apply (glow, saturation, etc.) */
  visualEffect?: string;
  /** Hide export buttons (for cosmic-horoscope which renders them externally) */
  hideExportButtons?: boolean;
  /** Enable typewriter effect (default: false) */
  enableTypewriter?: boolean;
  /** Typewriter speed in ms per character (default: 60) */
  typewriterSpeed?: number;
  /** Current period (for horoscope mode) */
  currentPeriod?: string;
  /** Period change handler (for horoscope mode) */
  onPeriodChange?: (period: string) => void;
  /** Current color effect (for horoscope mode) */
  colorEffect?: string;
  /** Color change handler (for horoscope mode) */
  onColorChange?: (color: string) => void;
}

export function TerminalDisplay({
  content,
  htmlContent,
  isLoading = false,
  filename = "ascii-art",
  onShuffle,
  terminalPath = "~/output/text-art.txt",
  showShuffleButton = false,
  visualEffect = "subtle",
  hideExportButtons = false,
  enableTypewriter = false,
  typewriterSpeed = 60,
  currentPeriod,
  onPeriodChange,
  colorEffect,
  onColorChange,
}: TerminalDisplayProps) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [mobileExportOpen, setMobileExportOpen] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    const success = await copyToClipboard(
      content,
      htmlContent || content,
      "email",
    );
    if (success) {
      setCopiedToClipboard(true);
      // Clear any existing timeout
      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
      }
      // Set new timeout and store reference
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedToClipboard(false);
        copyTimeoutRef.current = null;
      }, 2000) as unknown as number;
    }
  };

  const handleDownloadText = () => {
    downloadText(content, htmlContent || "", filename);
  };

  const handleDownloadPNG = async () => {
    await downloadPNG(".ascii-display", filename);
  };

  const hasContent = Boolean(content);
  const baseTextStyle = [
    "color: #1cff6b",
    "font-size: clamp(14px, 2.75vw, 24px)",
    "line-height: 1.55",
    "white-space: pre-wrap",
    "word-break: break-word",
    "overflow-wrap: anywhere",
    "margin: 0",
    "padding: 0",
    "display: block",
    "max-width: 100%",
    "box-sizing: border-box",
    "text-align: left",
    "text-indent: 0",
    "font-weight: 900",
    "filter: saturate(1.65) brightness(1.08)",
    "text-shadow: 0 0 2px rgba(28, 255, 107, 0.7), 0 0 10px rgba(28, 255, 107, 0.28)",
  ].join("; ");

  return (
    <div
      class="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden relative flex flex-col mx-auto terminal-window"
      style="
        background-color: #000000 !important;
        background: #000000 !important;
        border: 6px solid var(--color-border, #a855f7);
        box-shadow:
          0 30px 60px rgba(0, 0, 0, 0.8),
          0 15px 30px rgba(0, 0, 0, 0.6),
          20px 20px 0 rgba(0, 0, 0, 0.5),
          inset 0 0 40px rgba(168, 85, 247, 0.3),
          inset 0 0 18px rgba(28, 255, 107, 0.22);
        opacity: 1 !important;
        animation: float-breathe 6s ease-in-out infinite;
      "
    >
      <style>
        {`
          .terminal-window {
            opacity: 1 !important;
            width: 76vw !important;
            max-width: 76vw !important;
            height: 60vh !important;
            min-height: 60vh !important;
            max-height: 60vh !important;
            margin: 0 auto !important;
          }

          .terminal-header {
            position: relative;
            overflow: hidden;
            border-bottom-width: 6px !important;
          }

          .terminal-header::before {
            content: "";
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px,
              transparent 3px
            );
            opacity: 0.35;
            mix-blend-mode: screen;
            pointer-events: none;
            z-index: 1;
          }

          .terminal-header > * {
            position: relative;
            z-index: 2;
          }

          /* Mobile: Portrait, fixed dimensions */
          @media (max-width: 639px) {
            .terminal-window {
              width: 92vw !important;
              max-width: 92vw !important;
              height: 75vh !important;
              min-height: 75vh !important;
              max-height: 75vh !important;
              margin: 0 auto !important;
            }
          }

          /* Tablet: Fixed aspect ratio */
          @media (min-width: 640px) {
            .terminal-window {
              border-width: 12px !important;
              box-shadow:
                0 40px 80px rgba(0, 0, 0, 0.9),
                0 20px 40px rgba(0, 0, 0, 0.7),
                24px 24px 0 rgba(0, 0, 0, 0.6) !important;
              width: 85vw !important;
              max-width: 85vw !important;
              height: 65vh !important;
              min-height: 65vh !important;
              max-height: 65vh !important;
              margin: 0 auto !important;
            }
            .terminal-header {
              border-bottom-width: 12px !important;
            }
          }

          /* Desktop: Fixed aspect ratio */
          @media (min-width: 1024px) {
            .terminal-window {
              border-width: 16px !important;
              box-shadow:
                0 50px 100px rgba(0, 0, 0, 1),
                0 25px 50px rgba(0, 0, 0, 0.8),
                28px 28px 0 rgba(0, 0, 0, 0.7) !important;
              width: 76vw !important;
              max-width: 76vw !important;
              height: 60vh !important;
              min-height: 60vh !important;
              max-height: 60vh !important;
              margin: 0 auto !important;
            }
            .terminal-header {
              border-bottom-width: 16px !important;
            }
          }

          /* Floating breathe animation */
          @keyframes float-breathe {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.005);
            }
          }
        `}
      </style>
      {/* Terminal Menu Bar - Semi-opaque to show scanlines */}
      <div
        class="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between terminal-header"
        style="background-color: rgba(0, 0, 0, 0.85); border-color: rgba(168, 85, 247, 0.45); position: relative; z-index: 20; backdrop-filter: blur(6px);"
      >
        <div class="flex space-x-1.5 sm:space-x-2">
          <div
            class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full hover:scale-125 transition-transform cursor-pointer"
            title="Close (jk)"
          >
          </div>
          <div
            class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full hover:scale-125 transition-transform cursor-pointer"
            title="Minimize (nope)"
          >
          </div>
          <div
            class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full hover:scale-125 transition-transform cursor-pointer"
            title="Full screen (maybe)"
          >
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          {/* Only show terminal path when NOT in horoscope mode */}
          {!onPeriodChange && (
            <span
              class="text-xs sm:text-sm font-mono opacity-70 hidden sm:inline tracking-[0.2em]"
              style="color: #00FF41"
            >
              {terminalPath}
            </span>
          )}

          {/* Period dropdown (horoscope mode) */}
          {onPeriodChange && currentPeriod && (
            <select
              value={currentPeriod}
              onChange={(e) => {
                sounds.click();
                onPeriodChange((e.target as HTMLSelectElement).value);
              }}
              class="px-3 py-2 text-xs sm:text-sm font-mono font-black border-2 rounded transition-all hover:scale-105 cursor-pointer tracking-[0.15em]"
              style="background-color: rgba(0,255,65,0.18); color: #00FF41; border-color: #00FF41; font-weight: 900; box-shadow: 0 0 12px rgba(0,255,65,0.28);"
            >
              <option style="background-color: #000; color: #00FF41; font-weight: 900;" value="daily">Daily</option>
              <option style="background-color: #000; color: #00FF41; font-weight: 900;" value="weekly">Weekly</option>
              <option style="background-color: #000; color: #00FF41; font-weight: 900;" value="monthly">Monthly</option>
            </select>
          )}

          {/* Color dropdown (horoscope mode) */}
          {onColorChange && colorEffect && (
            <select
              value={colorEffect}
              onChange={(e) => {
                sounds.click();
                onColorChange((e.target as HTMLSelectElement).value);
              }}
              class="px-3 py-2 text-xs sm:text-sm font-mono font-black border-2 rounded transition-all hover:scale-105 cursor-pointer tracking-[0.15em]"
              style="background-color: rgba(0,255,65,0.18); color: #00FF41; border-color: #00FF41; font-weight: 900; box-shadow: 0 0 12px rgba(0,255,65,0.28);"
            >
              {COLOR_EFFECTS.map(effect => (
                <option key={effect.value} value={effect.value} style="background-color: #000; color: #00FF41; font-weight: 900;">
                  {effect.name}
                </option>
              ))}
            </select>
          )}

          {/* Shuffle button in menu bar (gallery mode) */}
          {showShuffleButton && onShuffle && hasContent && (
            <button
              onClick={onShuffle}
              class="px-3 py-2 text-sm font-mono font-bold transition-all hover:scale-110 active:scale-95 opacity-80 hover:opacity-100 tracking-[0.1em]"
              style="color: #00FF41"
              title="Get a random ASCII art"
            >
              🎲
            </button>
          )}
        </div>
      </div>

      {/* Atmospheric effects - INSIDE terminal */}
      <div class="terminal-film-grain"></div>

      {/* Scanlines overlay - 80s retro feel (covers entire terminal including header) */}
      <div class="scanlines"></div>

      {/* Noise overlay */}
      <div class="noise"></div>

      {/* Terminal Content Area - Fills remaining space */}
      <div
        class="flex-1 overflow-auto custom-scrollbar transition-all duration-700 terminal-content relative z-10"
        style="padding: 18px; background-color: rgba(0, 0, 0, 0.82) !important; background: rgba(0, 0, 0, 0.82) !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); overflow-x: hidden;"
      >
        <style>
          {`
            .terminal-content {
              background-color: rgba(0, 0, 0, 0.82) !important;
              background: rgba(0, 0, 0, 0.82) !important;
              overflow-x: hidden;
              padding: 18px !important;
            }
            @media (min-width: 640px) {
              .terminal-content {
                padding: 30px !important;
              }
            }
            @media (min-width: 1024px) {
              .terminal-content {
                padding: 42px !important;
              }
            }
          `}
        </style>
        {isLoading && !content
          ? (
            <div class="flex items-start justify-start w-full pt-2 pl-2">
              <pre
                class="font-mono text-lg animate-loading-cursor"
                style="color: #00FF41;"
              >
                <span class="blinking-cursor">█</span>
              </pre>
            </div>
          )
          : (htmlContent || content) && enableTypewriter
          ? (
            // Typewriter mode
            <TypedWriter
              text={content}
              htmlText={htmlContent}
              speed={typewriterSpeed}
              enabled={true}
              onComplete={() => setTypingComplete(true)}
              className="ascii-display font-mono opacity-90"
              style={`${baseTextStyle}; ${getVisualEffectStyle(visualEffect)}`}
            />
          )
          : htmlContent
          ? (
            // Static HTML mode
            <div class="relative">
              <pre
                class="ascii-display font-mono opacity-90"
                style={`${baseTextStyle}; ${getVisualEffectStyle(visualEffect)}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
              <span class="blinking-cursor" style="color: #1cff6b; font-size: clamp(14px, 2.75vw, 24px); font-weight: 900; text-shadow: 0 0 4px rgba(28, 255, 107, 0.6);">█</span>
            </div>

          )
          : content
          ? (
            // Static text mode
            <div class="relative">
              <pre
                class="ascii-display font-mono opacity-90"
                style={`${baseTextStyle}; ${getVisualEffectStyle(visualEffect)}`}
              >
                {content}
              </pre>
              <span class="blinking-cursor" style="color: #1cff6b; font-size: clamp(14px, 2.75vw, 24px); font-weight: 900; text-shadow: 0 0 4px rgba(28, 255, 107, 0.6);">█</span>
            </div>
          )
          : null}
      </div>

      {/* Share Button - Commented out for now
      {!hideExportButtons && hasContent && (
        <div class="absolute bottom-6 right-6 z-10 animate-pop-in">
          <button
            onClick={async () => {
              sounds.click();
              // Use Web Share API if available
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: 'Cosmic Horoscope',
                    text: content,
                  });
                } catch (err) {
                  // User cancelled or error - fall back to copy
                  handleCopy();
                }
              } else {
                // Desktop - just copy
                handleCopy();
              }
            }}
            class={`px-6 py-3 border-4 rounded-2xl font-mono font-black shadow-brutal-lg transition-all hover:shadow-brutal-xl hover:-translate-y-1 active:translate-y-0 ${
              copiedToClipboard ? "animate-bounce-once" : ""
            }`}
            style={copiedToClipboard
              ? "background-color: #4ADE80; color: #0a0a0a; border-color: #4ADE80;"
              : "background-color: #1a1a1a; color: #00FF41; border-color: #00FF41; box-shadow: 0 0 12px rgba(0,255,65,0.4);"}
            title={navigator.share ? "Share horoscope" : "Copy to clipboard"}
          >
            {copiedToClipboard ? "✅ COPIED!" : "🔗 SHARE"}
          </button>
        </div>
      )}
      */}

      <style>
        {`
        /* Blinking cursor animation */
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .blinking-cursor {
          animation: blink 1s infinite;
        }

        /* Pop-in animation for export button */
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          60% {
            transform: scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-pop-in {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Dropdown open animation - light bounce */
        @keyframes dropdownOpen {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          60% {
            opacity: 1;
            transform: translateY(2px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-dropdown-open {
          animation: dropdownOpen 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Brutal Shadows - Chunky and bold */
        .shadow-brutal {
          box-shadow: 4px 4px 0 var(--color-border, #0A0A0A);
        }

        .shadow-brutal-lg {
          box-shadow: 6px 6px 0 var(--color-border, #0A0A0A);
        }

        .shadow-brutal-xl {
          box-shadow: 8px 8px 0 var(--color-border, #0A0A0A);
        }

        .hover\\:shadow-brutal-xl:hover {
          box-shadow: 8px 8px 0 var(--color-border, #0A0A0A);
        }

        /* Bounce once animation for copy success */
        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-10px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-5px); }
        }

        .animate-bounce-once {
          animation: bounceOnce 0.5s ease-out;
        }

        /* Loading cursor animation */
        @keyframes loadingCursor {
          0% { transform: translateX(0); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(40px); }
        }

        .animate-loading-cursor {
          animation: loadingCursor 1.5s ease-out;
        }

        /* Transform utilities */
        .hover\\:-translate-y-1:hover {
          transform: translateY(-4px);
        }

        .active\\:translate-y-0:active {
          transform: translateY(0);
        }

        /* Custom Scrollbar for output terminal */
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00FF41;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00CC33;
        }

        /* 80s Retro Scanlines Effect */
        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.08),
            rgba(255, 255, 255, 0.08) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          z-index: 15;
        }

        /* CRT Noise Effect */
        .noise {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 15;
          animation: noise-anim 0.2s steps(10) infinite;
        }

        @keyframes noise-anim {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0); }
          60% { transform: translate(1%, 0); }
          70% { transform: translate(0, -1%); }
          80% { transform: translate(0, 1%); }
          90% { transform: translate(-1%, -1%); }
        }

        /* Film grain overlay - INSIDE terminal */
        .terminal-film-grain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
          opacity: 0.18;
          pointer-events: none;
          z-index: 100;
          mix-blend-mode: overlay;
          animation: grain-flow 8s steps(10) infinite;
        }

        @keyframes grain-flow {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(15%, 5%); }
          60% { transform: translate(5%, 15%); }
          70% { transform: translate(-10%, -15%); }
          80% { transform: translate(20%, 0%); }
          90% { transform: translate(-20%, 10%); }
        }

        /* Responsive letter-spacing for ASCII display - matches asciifier-web */
        .ascii-display {
          letter-spacing: 0.2px;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
          max-width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 640px) {
          .ascii-display {
            letter-spacing: 0.4px;
          }
        }
        @media (min-width: 768px) {
          .ascii-display {
            letter-spacing: 0.6px;
          }
        }
        @media (min-width: 1024px) {
          .ascii-display {
            letter-spacing: 0.8px;
          }
        }
      `}
      </style>
    </div>
  );
}
