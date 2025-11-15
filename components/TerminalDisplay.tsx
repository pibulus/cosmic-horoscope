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

/**
 * Get CSS filter string for visual effects
 * NOTE: text-shadow is handled via --terminal-text-shadow CSS variable
 * Only override shadow for extreme effects like glitch/thermal/hologram
 */
function getVisualEffectStyle(effect?: string): string {
  let css = "";
  switch (effect) {
    case "none":
      css = "filter: none; text-shadow: none;";
      break;
    case "neon":
      // Use CSS variable shadow
      css = "filter: saturate(1.1) brightness(1.0);";
      break;
    case "glitch":
      // Custom multi-color shadow for glitch effect
      css =
        "filter: saturate(2.5) contrast(1.5); text-shadow: -3px 0 4px #ff00ff, 3px 0 4px #00ffff, -2px 0 2px #ff0000, 2px 0 2px #00ff00;";
      break;
    case "thermal":
      // Custom warm shadow for thermal effect
      css =
        "filter: saturate(2) contrast(1.8) brightness(1.3) hue-rotate(20deg); text-shadow: 0 0 10px #ff6600, 0 0 20px #ff3300;";
      break;
    case "hologram":
      // Custom cyan/magenta shadow for hologram
      css =
        "filter: saturate(1.8) brightness(1.5); text-shadow: 0 0 10px currentColor, 0 0 20px #00ffff, 0 0 30px #ff00ff; opacity: 0.9;";
      break;
    case "retro":
      // Use CSS variable shadow
      css = "filter: saturate(1.4) contrast(1.2) blur(0.3px);";
      break;
    case "cyberpunk":
      // Custom dual-color shadow for cyberpunk
      css =
        "filter: saturate(2) contrast(1.3); text-shadow: -1px 0 2px #ff00ff, 1px 0 2px #00ffff, 0 0 8px currentColor;";
      break;
    default:
      // Default to subtle filter, let CSS variable handle shadow
      css = "filter: saturate(1.1) brightness(1.0);";
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
}: TerminalDisplayProps) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const periodOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTypingComplete(false);
  }, [content, htmlContent, enableTypewriter]);

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
    "font-family: var(--mono)",
    "color: var(--accent-soft, #ffdfb5)",
    "font-size: 19px",
    "line-height: 1.6",
    "letter-spacing: 0.04em",
    "white-space: pre-wrap",
    "word-break: break-word",
    "overflow-wrap: anywhere",
    "margin: 0 auto",
    "padding: 0",
    "display: block",
    "position: relative",
    "max-width: 52ch",
    "box-sizing: border-box",
    "text-align: left",
    "text-indent: 0",
    "font-weight: 400",
    "filter: var(--terminal-text-filter, saturate(1.25) brightness(1.12))",
    "text-shadow: 0 0 10px rgba(255, 223, 181, 0.35)",
  ].join("; ");

  return (
    <div
      class="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden relative flex flex-col mx-auto terminal-window"
    >
      <style>
        {`
          .terminal-window {
            /* Palette tokens */
            --terminal-color-orange: 255 106 0;
            --terminal-color-purple: 168 85 247;
            --terminal-color-pink: 255 79 212;
            --terminal-color-neon-rgb: 28 255 107;

            /* Derived tokens */
            --terminal-bg-base: #050007;
            --terminal-text-color: var(--accent-soft, #ffdfb5);
            --terminal-text-filter: saturate(1.2) brightness(1.1);

            /* Fixed CRT shell */
            position: relative;
            display: flex;
            flex-direction: column;
            opacity: 1 !important;
            width: min(1100px, calc(100vw - 80px)) !important;
            min-height: 500px !important;
            margin: 0 auto !important;
            overflow: hidden;
            background: var(--terminal-bg-base);
            border-radius: 24px;
            border: 2px solid #ff4fd4;
            box-shadow:
              0 0 40px rgba(255, 0, 200, 0.7),
              0 18px 60px rgba(0, 0, 0, 0.9);
            padding: 0;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            transform-origin: center;
            transition: transform 300ms ease-out, box-shadow 300ms ease-out, filter 300ms ease-out;
            will-change: transform, box-shadow;
            animation: terminal-float 8s ease-in-out infinite;
          }

          @keyframes terminal-float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-12px) rotate(0.3deg);
            }
            50% {
              transform: translateY(-18px) rotate(-0.2deg);
            }
            75% {
              transform: translateY(-8px) rotate(0.1deg);
            }
          }


          @media (hover:hover) {
            .terminal-window:hover {
              transform: translateY(-6px);
              box-shadow:
                0 0 50px rgba(255, 0, 200, 0.9),
                0 24px 70px rgba(0, 0, 0, 0.95);
            }
            .terminal-window:hover::before {
              opacity: 0.95;
              filter: blur(70px) saturate(160%);
            }
          }

          /* Underglow - orange to purple to pink emanating from beneath */
          .terminal-window::before {
            content: "";
            position: absolute;
            inset: -100px;
            border-radius: 50%;
            background:
              radial-gradient(ellipse at 25% 15%, rgba(255, 106, 0, 0.5), transparent 45%),
              radial-gradient(ellipse at 75% 85%, rgba(168, 85, 247, 0.6), transparent 45%),
              radial-gradient(ellipse at 50% 50%, rgba(255, 79, 212, 0.4), transparent 55%);
            pointer-events: none;
            z-index: -1;
            opacity: 0.8;
            filter: blur(60px) saturate(150%);
            animation: glow-pulse 7s ease-in-out infinite;
          }

          @keyframes glow-pulse {
            0%, 100% {
              opacity: 0.75;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.95;
              transform: scale(1.08) rotate(2deg);
            }
          }

          /* Scanline CRT texture */
          .terminal-window::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            background: repeating-linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.03) 0px,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 2px,
              transparent 4px
            );
            opacity: 0.08;
            mix-blend-mode: overlay;
            z-index: 10;
          }

          .terminal-header {
            position: relative;
            overflow: visible;
            border-bottom-width: 3px !important;
            border-color: var(--color-border, #a855f7) !important;
            background: rgba(0, 0, 0, 1) !important;
            border-radius: 0 !important;
          }

          @media (max-width: 639px) {
            .terminal-window {
              width: calc(100vw - 40px) !important;
              min-height: 440px !important;
              border-radius: 18px;
            }
            .terminal-header {
              border-bottom-width: 2px !important;
            }
          }

          @media (min-width: 640px) and (max-width: 1023px) {
            .terminal-window {
              width: min(960px, calc(100vw - 60px)) !important;
              min-height: 480px !important;
              border-radius: 20px;
            }
            .terminal-header {
              border-bottom-width: 2px !important;
            }
          }

          @media (min-width: 1024px) {
            .terminal-window {
              width: min(1100px, calc(100vw - 80px)) !important;
              min-height: 500px !important;
              border-radius: 24px;
            }
            .terminal-header {
              border-bottom-width: 2px !important;
            }
          }


          @media (prefers-reduced-motion: reduce) {
            .terminal-window,
            .terminal-window::before,
            .terminal-window::after,
            .terminal-content::before,
            .terminal-content::after {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
      {/* Terminal Menu Bar - Fully opaque to match content */}
      <div
        class="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between terminal-header"
        style="background-color: rgba(0, 0, 0, 1); border-color: rgba(168, 85, 247, 0.45); position: relative; z-index: 20;"
      >
        <div class="traffic-lights">
          <style>
            {`
              .traffic-lights {
                display: flex;
                gap: 6px;
              }

              .traffic-light {
                width: 8px;
                height: 8px;
                border-radius: 999px;
                background: #ff5f57;
                box-shadow: 0 0 6px rgba(255,95,87,0.7);
              }

              .traffic-light:nth-child(2) {
                background: #ffbd2e;
                box-shadow: 0 0 6px rgba(255,189,46,0.7);
              }

              .traffic-light:nth-child(3) {
                background: #28c840;
                box-shadow: 0 0 6px rgba(40,200,64,0.7);
                animation: breathe 2.6s ease-in-out infinite;
              }

              @keyframes breathe {
                0%, 100% { box-shadow: 0 0 4px rgba(40,200,64,0.3); }
                50% { box-shadow: 0 0 14px rgba(40,200,64,0.9); }
              }
            `}
          </style>
          <div class="traffic-light" title="Close"></div>
          <div class="traffic-light" title="Minimize"></div>
          <div class="traffic-light" title="Maximize"></div>
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

          {/* Period toggle (horoscope mode) */}
          {onPeriodChange && currentPeriod && (
            <div class="horoscope-nav">
              <style>
                {`
                  .horoscope-nav {
                    display: flex;
                    gap: 1.5rem;
                    font-family: var(--sans);
                    font-size: 11px;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                  }

                  .horoscope-nav button {
                    position: relative;
                    background: none;
                    border: none;
                    color: #3cff8f;
                    padding: 0;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: opacity 160ms ease-out, transform 120ms ease-out;
                  }

                  .horoscope-nav button::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -4px;
                    height: 2px;
                    background: linear-gradient(90deg, #3cff8f, #a3ffcf);
                    transform-origin: center;
                    transform: scaleX(0);
                    transition: transform 160ms ease-out;
                  }

                  .horoscope-nav button:hover {
                    opacity: 1;
                    transform: translateY(-1px);
                    text-shadow: 0 0 12px rgba(60, 255, 143, 0.8);
                  }

                  .horoscope-nav button:hover::after,
                  .horoscope-nav button.is-active::after {
                    transform: scaleX(1);
                    box-shadow: 0 0 10px rgba(60, 255, 143, 0.6);
                  }

                  .horoscope-nav button.is-active {
                    opacity: 1;
                    text-shadow: 0 0 8px rgba(60, 255, 143, 0.5);
                  }
                `}
              </style>
              {periodOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  class={value === currentPeriod ? "is-active" : ""}
                  onClick={() => {
                    if (value !== currentPeriod) {
                      sounds.click();
                      onPeriodChange(value);
                    }
                  }}
                >
                  {label.toUpperCase()}
                </button>
              ))}
            </div>
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

      {/* Terminal Content Area */}
      <div
        class="transition-all duration-700 terminal-content relative z-10"
        style="transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);"
      >
        <style>
          {`
            .terminal-content {
              flex: 1;
              position: relative;
              overflow-x: hidden;
              overflow-y: auto;
              padding: 3.5rem 4.5rem !important;
              background: radial-gradient(
                ellipse at top,
                rgba(255, 106, 0, 0.15) 0%,
                rgba(168, 85, 247, 0.12) 45%,
                rgba(5, 0, 7, 0.95) 100%
              );
              border: none;
              box-shadow: none;
              min-height: 300px;
              isolation: isolate;
              border-radius: 0 !important;
            }

            .terminal-content::before {
              display: none;
            }

            .terminal-content::after {
              display: none;
            }

            @media (max-width: 639px) {
              .terminal-content {
                padding: 2rem 1.5rem !important;
                min-height: 280px;
              }
            }
            @media (min-width: 640px) and (max-width: 1023px) {
              .terminal-content {
                padding: 2.5rem 3rem !important;
                min-height: 320px;
              }
            }
            @media (min-width: 1024px) {
              .terminal-content {
                padding: 3.5rem 4.5rem !important;
                min-height: 340px;
              }
            }
          `}
        </style>
        <div class="terminal-text relative z-20" style="min-height: 100%;">
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
          : (htmlContent || content) && enableTypewriter && !typingComplete
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
            <pre
              class="ascii-display font-mono opacity-90"
              style={`${baseTextStyle}; ${getVisualEffectStyle(visualEffect)}`}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )
          : content
          ? (
            // Static text mode
            <pre
              class="ascii-display font-mono opacity-90"
              style={`${baseTextStyle}; ${getVisualEffectStyle(visualEffect)}`}
            >
              {content}
            </pre>
          )
          : null}
        </div>
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

        /* Blinking cursor at the end of text */
        .ascii-display::after {
          content: "";
          display: inline-block;
          width: 0.6em;
          height: 1.1em;
          margin-left: 0.1em;
          background: var(--accent-soft, #ffdfb5);
          vertical-align: -0.1em;
          animation: cursor-blink 1s steps(1) infinite;
        }

        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}
      </style>
    </div>
  );
}
