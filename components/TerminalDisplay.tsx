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
    "color: #1cff6b",
    "font-size: clamp(16px, 4.5vw, 26px)",
    "line-height: 1.6",
    "white-space: pre-wrap",
    "word-break: break-word",
    "overflow-wrap: anywhere",
    "margin: 0",
    "padding: 0",
    "display: block",
    "position: relative",
    "max-width: 100%",
    "box-sizing: border-box",
    "text-align: left",
    "text-indent: 0",
    "font-weight: 900",
    "filter: saturate(1.65) brightness(1.08)",
    "text-shadow: 0 0 3px rgba(28, 255, 107, 0.55), 0 0 8px rgba(28, 255, 107, 0.18)",
  ].join("; ");

  return (
    <div
      class="overflow-hidden relative flex flex-col mx-auto terminal-window"
      style="
        background-color: rgba(10, 12, 20, 0.45);
        border: 3px solid var(--color-border, #a855f7);
        box-shadow:
          0 20px 36px rgba(0, 0, 0, 0.7),
          0 10px 18px rgba(0, 0, 0, 0.45);
        z-index: 10;
        border-radius: 24px;
      "
    >
      <style>
        {`
          .terminal-window {
            opacity: 1 !important;
            width: 76vw !important;
            max-width: 76vw !important;
            min-height: 60vh !important;
            margin: 0 auto !important;
            overflow: hidden;
            background-color: rgba(10, 12, 20, 0.45);
            border-radius: 24px;
            border: inherit;
            box-shadow:
              0 20px 36px rgba(0, 0, 0, 0.7),
              0 10px 18px rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(10px) saturate(120%);
            -webkit-backdrop-filter: blur(10px) saturate(120%);
          }


          .terminal-header {
            position: relative;
            overflow: visible;
            border-bottom-width: 3px !important;
            border-color: var(--color-border, #a855f7) !important;
            background: transparent !important;
          }

          @media (max-width: 639px) {
            .terminal-window {
              width: 92vw !important;
              max-width: 92vw !important;
              min-height: 72vh !important;
            }
            .terminal-header {
              border-bottom-width: 3px !important;
            }
          }

          @media (min-width: 640px) {
            .terminal-window {
              border-width: 6px !important;
              width: 85vw !important;
              max-width: 85vw !important;
              min-height: 66vh !important;
            }
            .terminal-header {
              border-bottom-width: 4px !important;
            }
          }

          @media (min-width: 1024px) {
            .terminal-window {
              border-width: 8px !important;
              width: 76vw !important;
              max-width: 76vw !important;
              min-height: 60vh !important;
            }
            .terminal-header {
              border-bottom-width: 5px !important;
            }
          }

        `}
      </style>
      {/* Terminal Menu Bar - Semi-opaque to show scanlines */}
      <div
        class="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between terminal-header"
        style="background-color: transparent; border-color: rgba(168, 85, 247, 0.45); position: relative; z-index: 20;"
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

          {/* Period toggle (horoscope mode) */}
          {onPeriodChange && currentPeriod && (
            <div
              class="flex items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-sm uppercase tracking-[0.28em]"
              style="color: rgba(0, 255, 65, 0.7); font-weight: 800;"
            >
              {periodOptions.map(({ value, label }, index) => (
                <span class="flex items-center gap-2" key={value}>
                  <button
                    type="button"
                    class="hover:opacity-100 transition-all focus:outline-none active:scale-95"
                    style={`background: transparent; border: none; padding: 0; margin: 0; color: ${
                      value === currentPeriod ? "#1cff6b" : "rgba(0, 255, 65, 0.55)"
                    }; font-weight: 900; letter-spacing: 0.3em; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35em;`}
                    onClick={() => {
                      if (value !== currentPeriod) {
                        sounds.click();
                        onPeriodChange(value);
                      }
                    }}
                  >
                    <span style="letter-spacing: inherit;">
                      {label.toUpperCase()}
                    </span>
                  </button>
                  {index < periodOptions.length - 1 && (
                    <span
                      class="opacity-40 text-[10px] sm:text-xs"
                      style="color: rgba(0,255,65,0.4); letter-spacing: 0;"
                    >
                      •
                    </span>
                  )}
                </span>
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
        style="padding: 20px; background: transparent !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); overflow-x: hidden; overflow-y: auto; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: inset 0 0 28px rgba(0, 0, 0, 0.58); min-height: 55vh;"
      >
        <style>
          {`
            .terminal-content {
              overflow-x: hidden;
              overflow-y: auto;
              padding: 20px !important;
              border: 1px solid rgba(255, 255, 255, 0.08);
              box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.5);
              background: transparent;
              position: relative;
              min-height: 55vh;
            }

            .terminal-text {
              position: relative;
            }

            .ascii-display {
              letter-spacing: 0.2px;
              white-space: pre-wrap;
              word-break: break-word;
              overflow-wrap: anywhere;
              max-width: 100%;
              box-sizing: border-box;
            }
            .ascii-display .cursor-inline {
              display: inline-block;
              margin-left: 0.1em;
              vertical-align: baseline;
            }

            @media (max-width: 639px) {
              .terminal-content {
                min-height: 68vh !important;
              }
            }
            @media (min-width: 640px) {
              .terminal-content {
                padding: 32px !important;
                min-height: 62vh !important;
              }
            }
            @media (min-width: 1024px) {
              .terminal-content {
                padding: 44px !important;
                min-height: 55vh !important;
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
              dangerouslySetInnerHTML={{
                __html: htmlContent || "",
              }}
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

    </div>
  );
}
