// ===================================================================
// TYPED WRITER - Uses typed.js library with keyboard sounds
// ===================================================================

import { useEffect, useRef } from "preact/hooks";
import Typed from "typed.js";
import SimpleTypeWriter from "../utils/simple-typewriter.js";

interface TypedWriterProps {
  /** Plain text to type */
  text: string;
  /** HTML content to type (takes priority) */
  htmlText?: string;
  /** Speed in ms per character */
  speed?: number;
  /** Enable typing animation */
  enabled?: boolean;
  /** Callback when complete */
  onComplete?: () => void;
  /** CSS class */
  className?: string;
  /** Inline styles */
  style?: string;
}

export function TypedWriter({
  text,
  htmlText,
  speed = 60,
  enabled = true,
  onComplete,
  className = "",
  style = "",
}: TypedWriterProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<Typed | null>(null);
  const soundsRef = useRef<SimpleTypeWriter | null>(null);
  const lastContentRef = useRef<string>(""); // Track last rendered payload

  useEffect(() => {
    // Initialize keyboard sounds once
    if (!soundsRef.current) {
      soundsRef.current = new SimpleTypeWriter({
        volume: 0.08,
        enabled: true,
        pack: "cherry-mx-black",
      });
      soundsRef.current.init();
    }

    return () => {
      if (soundsRef.current) {
        soundsRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!elementRef.current) return;

    const contentKey = `${text}|${htmlText || ""}`;
    if (lastContentRef.current === contentKey && typedRef.current) {
      // Same content rendered already; keep existing typing instance
      return;
    }
    lastContentRef.current = contentKey;

    if (typedRef.current) {
      typedRef.current.destroy();
    }

    if (!enabled) {
      elementRef.current.innerHTML = htmlText || text;
      if (onComplete) onComplete();
      return;
    }

    let lastLength = 0;
    let lastChar = "";

    const observer = new MutationObserver(() => {
      if (!elementRef.current || !typedRef.current) return;

      const currentText = elementRef.current.textContent || "";
      const newLength = currentText.length;

      if (newLength > lastLength) {
        const newChar = currentText[newLength - 1] || "a";

        if (soundsRef.current) {
          soundsRef.current.play({
            key: newChar,
            keyCode: newChar.charCodeAt(0),
          });
        }

        if (lastChar === "." || lastChar === "!" || lastChar === "?") {
          typedRef.current.stop();
          setTimeout(() => {
            if (typedRef.current) {
              typedRef.current.start();
            }
          }, 400);
        }

        lastChar = newChar;
      }

      lastLength = newLength;
    });

    observer.observe(elementRef.current, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    let jitterTimer: number | null = null;

    typedRef.current = new Typed(elementRef.current, {
      strings: [htmlText || text],
      typeSpeed: speed,
      showCursor: false,
      contentType: htmlText ? "html" : "text",
      onBegin: (self: Typed) => {
        const originalSpeed = speed;
        jitterTimer = window.setInterval(() => {
          if (self && !self.typingComplete) {
            const variation = 0.7 + Math.random() * 0.6;
            self.typeSpeed = Math.floor(originalSpeed * variation);
          } else {
            if (jitterTimer !== null) {
              clearInterval(jitterTimer);
              jitterTimer = null;
            }
          }
        }, 100);
      },
      onComplete: () => {
        observer.disconnect();
        if (jitterTimer !== null) {
          clearInterval(jitterTimer);
          jitterTimer = null;
        }

        if (onComplete) onComplete();
      },
    });

    return () => {
      observer.disconnect();
      if (typedRef.current) {
        typedRef.current.destroy();
      }
      if (jitterTimer !== null) {
        clearInterval(jitterTimer);
        jitterTimer = null;
      }
    };
  }, [text, htmlText, speed, enabled, onComplete]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={style}
    />
  );
}
