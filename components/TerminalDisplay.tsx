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

  return (
    <div
      class="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden relative flex flex-col mx-auto terminal-window"
      style="
        background-color: #000000 !important;
        background: #000000 !important;
        border: 6px solid var(--color-border, #a855f7);
        box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.5);
        max-width: 95vw;
        max-height: 90vh;
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 2;
        opacity: 1 !important;
      "
    >
      <style>
        {`
          .terminal-window {
            opacity: 1 !important;
          }
          @media (min-width: 640px) {
            .terminal-window {
              border-width: 12px !important;
              box-shadow: 16px 16px 0 rgba(0, 0, 0, 0.6) !important;
            }
          }
          @media (min-width: 1024px) {
            .terminal-window {
              border-width: 16px !important;
              box-shadow: 20px 20px 0 rgba(0, 0, 0, 0.7) !important;
            }
          }
        `}
      </style>
      {/* Terminal Menu Bar */}
      <div
        class="px-3 sm:px-4 py-2 sm:py-3 border-b-3 sm:border-b-4 flex items-center justify-between"
        style="background-color: #1a1a1a; border-color: var(--color-border, #0A0A0A)"
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
              class="text-[10px] sm:text-xs font-mono opacity-60 hidden sm:inline"
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
              class="px-2 py-1 text-[10px] sm:text-xs font-mono font-bold border-2 rounded transition-all hover:scale-105 cursor-pointer"
              style="background-color: rgba(0,0,0,0.8); color: #00FF41; border-color: #00FF41;"
            >
              <option style="background-color: #000; color: #00FF41;" value="daily">Daily</option>
              <option style="background-color: #000; color: #00FF41;" value="weekly">Weekly</option>
              <option style="background-color: #000; color: #00FF41;" value="monthly">Monthly</option>
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
              class="px-2 py-1 text-[10px] sm:text-xs font-mono font-bold border-2 rounded transition-all hover:scale-105 cursor-pointer"
              style="background-color: rgba(0,0,0,0.8); color: #00FF41; border-color: #00FF41;"
            >
              {COLOR_EFFECTS.map(effect => (
                <option key={effect.value} value={effect.value} style="background-color: #000; color: #00FF41;">
                  {effect.name}
                </option>
              ))}
            </select>
          )}

          {/* Shuffle button in menu bar (gallery mode) */}
          {showShuffleButton && onShuffle && hasContent && (
            <button
              onClick={onShuffle}
              class="px-2 py-1 text-xs font-mono font-bold transition-all hover:scale-110 active:scale-95 opacity-70 hover:opacity-100"
              style="color: #00FF41"
              title="Get a random ASCII art"
            >
              🎲
            </button>
          )}
        </div>
      </div>

      {/* Scanlines overlay - 80s retro feel */}
      <div class="scanlines"></div>

      {/* Noise overlay */}
      <div class="noise"></div>

      {/* Terminal Content Area - Fills remaining space */}
      <div
        class="flex-1 overflow-auto custom-scrollbar transition-all duration-700 terminal-content relative z-10"
        style="padding: 12px; background-color: #000000 !important; background: #000000 !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);"
      >
        <style>
          {`
            .terminal-content {
              background-color: #000000 !important;
              background: #000000 !important;
            }
            @media (min-width: 640px) {
              .terminal-content {
                padding: 24px !important;
              }
            }
            @media (min-width: 1024px) {
              .terminal-content {
                padding: 36px !important;
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
              className="ascii-display font-mono opacity-95"
              style={`color: #00FF41; font-size: clamp(14px, 3.5vw, 32px); line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: anywhere; word-break: break-word; margin: 0; padding: 0; display: block; text-align: left; text-indent: 0; letter-spacing: 0.02em; font-weight: 600; font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', 'Monaco', monospace; ${
                getVisualEffectStyle(visualEffect)
              }`}
            />
          )
          : htmlContent
          ? (
            // Static HTML mode
            <pre
              class="ascii-display font-mono opacity-95"
              style={`color: #00FF41; font-size: clamp(14px, 3.5vw, 32px); line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: anywhere; word-break: break-word; margin: 0; padding: 0; display: block; text-align: left; text-indent: 0; letter-spacing: 0.02em; font-weight: 600; font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', 'Monaco', monospace; ${
                getVisualEffectStyle(visualEffect)
              }`}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

          )
          : content
          ? (
            // Static text mode
            <pre
              class="ascii-display font-mono opacity-95"
              style={`color: #00FF41; font-size: clamp(14px, 3.5vw, 32px); line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: anywhere; word-break: break-word; margin: 0; padding: 0; display: block; text-align: left; text-indent: 0; letter-spacing: 0.02em; font-weight: 600; font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', 'Monaco', monospace; ${
                getVisualEffectStyle(visualEffect)
              }`}
            >
              {content}
            </pre>
          )
          : null}
      </div>

      {/* Export Buttons - Show when content is ready (unless hidden) */}
      {!hideExportButtons && hasContent && (
        <>
          {/* Mobile: Single Export Dropdown */}
          <div class="sm:hidden absolute bottom-4 right-4 z-10 animate-pop-in">
            <div class="relative">
              <button
                onClick={() => {
                  sounds.click();
                  setMobileExportOpen(!mobileExportOpen);
                }}
                class="px-4 py-3 border-3 rounded-xl font-mono font-black shadow-brutal-lg transition-all hover:shadow-brutal-xl active:scale-95"
                style="background-color: var(--color-accent, #a855f7); color: var(--color-text, #faf9f6); border-color: var(--color-border, #a855f7);"
              >
                📤 Export
              </button>
              {mobileExportOpen && (
                <div
                  class="absolute bottom-full right-0 mb-2 border-3 rounded-xl overflow-hidden shadow-brutal-lg animate-dropdown-open"
                  style="background-color: var(--color-base, #FAF9F6); border-color: var(--color-border, #0A0A0A);"
                >
                  <button
                    onClick={() => {
                      handleDownloadPNG();
                      setMobileExportOpen(false);
                    }}
                    class="w-full px-4 py-3 font-mono font-bold text-left hover:bg-opacity-80 transition-colors"
                    style="background-color: var(--color-secondary, #1a1a1a); color: var(--color-text, #faf9f6);"
                  >
                    🖼️ PNG
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadText();
                      setMobileExportOpen(false);
                    }}
                    class="w-full px-4 py-3 font-mono font-bold text-left hover:bg-opacity-80 transition-colors border-t-2"
                    style="background-color: var(--color-secondary, #1a1a1a); color: var(--color-text, #faf9f6); border-color: var(--color-border, #a855f7);"
                  >
                    💾 TXT
                  </button>
                  <button
                    onClick={() => {
                      handleCopy();
                      setMobileExportOpen(false);
                    }}
                    class="w-full px-4 py-3 font-mono font-bold text-left hover:bg-opacity-80 transition-colors border-t-2"
                    style={copiedToClipboard
                      ? "background-color: #4ADE80; color: #0a0a0a; border-color: var(--color-border, #a855f7);"
                      : "background-color: var(--color-accent, #a855f7); color: var(--color-text, #faf9f6); border-color: var(--color-border, #a855f7);"}
                  >
                    {copiedToClipboard ? "✅ COPIED!" : "📋 COPY"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Three Button Layout */}
          <div class="hidden sm:flex absolute bottom-6 right-6 z-10 gap-3 animate-pop-in">
            <button
              onClick={handleDownloadPNG}
              class="px-5 py-3 border-4 rounded-2xl font-mono font-black shadow-brutal-lg transition-all hover:shadow-brutal-xl hover:-translate-y-1 active:translate-y-0"
              style="background-color: var(--color-secondary, #1a1a1a); color: var(--color-text, #faf9f6); border-color: var(--color-border, #a855f7);"
              title="Download as PNG image"
            >
              🖼️ PNG
            </button>
            <button
              onClick={handleDownloadText}
              class="px-5 py-3 border-4 rounded-2xl font-mono font-black shadow-brutal-lg transition-all hover:shadow-brutal-xl hover:-translate-y-1 active:translate-y-0"
              style="background-color: var(--color-secondary, #1a1a1a); color: var(--color-text, #faf9f6); border-color: var(--color-border, #a855f7);"
              title="Download as text file"
            >
              💾 TXT
            </button>
            <button
              onClick={handleCopy}
              class={`px-6 py-3 border-4 rounded-2xl font-mono font-black shadow-brutal-lg transition-all hover:shadow-brutal-xl hover:-translate-y-1 active:translate-y-0 ${
                copiedToClipboard ? "animate-bounce-once" : ""
              }`}
              style={copiedToClipboard
                ? "background-color: #4ADE80; color: #0a0a0a; border-color: var(--color-border, #a855f7);"
                : "background-color: var(--color-accent, #a855f7); color: var(--color-text, #faf9f6); border-color: var(--color-border, #a855f7);"}
              title="Copy to clipboard"
            >
              {copiedToClipboard ? "✅ COPIED!" : "📋 COPY"}
            </button>
          </div>
        </>
      )}

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
          z-index: 5;
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
          z-index: 5;
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
      `}
      </style>
    </div>
  );
}
