// ===================================================================
// TYPEWRITER TEXT - Character-by-character reveal with keyboard sounds
// ===================================================================
// Creates the magical "receiving transmission" effect

import { useEffect, useRef, useState } from "preact/hooks";
import SimpleTypeWriter from "../utils/simple-typewriter.js";

interface TypewriterTextProps {
  /** The text to type out */
  text: string;
  /** HTML content with color spans (for colored text) */
  htmlText?: string;
  /** Speed in milliseconds per character (default: 60) */
  speed?: number;
  /** Whether typing is enabled (default: true) */
  enabled?: boolean;
  /** Callback when typing completes */
  onComplete?: () => void;
  /** CSS class for the container */
  className?: string;
  /** Inline styles for the container */
  style?: string;
}

export function TypewriterText({
  text,
  htmlText,
  speed = 60,
  enabled = true,
  onComplete,
  className = "",
  style = "",
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [displayedHtml, setDisplayedHtml] = useState("");
  const [isTyping, setIsTyping] = useState(enabled);
  const [isComplete, setIsComplete] = useState(false);
  const typewriterRef = useRef<SimpleTypeWriter | null>(null);
  const intervalRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const containerRef = useRef<HTMLPreElement>(null);

  // Initialize keyboard sounds
  useEffect(() => {
    if (!typewriterRef.current) {
      typewriterRef.current = new SimpleTypeWriter({
        volume: 0.15, // Quieter for continuous typing
        enabled: true,
        pack: "cherry-mx-black",
      });
      typewriterRef.current.init();
    }

    return () => {
      if (typewriterRef.current) {
        typewriterRef.current.dispose();
      }
    };
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!enabled || !isTyping) {
      // If disabled or not typing, show full text immediately
      setDisplayedText(text);
      setDisplayedHtml(htmlText || "");
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    // Reset for new text
    currentIndexRef.current = 0;
    setDisplayedText("");
    setDisplayedHtml("");
    setIsComplete(false);

    // Clear any existing interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // Start typing
    intervalRef.current = setInterval(() => {
      const index = currentIndexRef.current;

      if (index >= text.length) {
        // Typing complete
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsComplete(true);
        setIsTyping(false);
        if (onComplete) onComplete();
        return;
      }

      // Add next character
      const nextChar = text[index];
      setDisplayedText((prev) => prev + nextChar);

      // For HTML, we need to update carefully to preserve color spans
      if (htmlText) {
        // Simple approach: reveal characters in the HTML string
        // This works because we're just incrementing visibility
        setDisplayedHtml(htmlText.slice(0, findHtmlPosition(htmlText, index + 1)));
      }

      // Play keyboard sound for this character
      if (typewriterRef.current && nextChar.trim()) {
        // Only play sound for non-whitespace
        typewriterRef.current.play({
          key: nextChar,
          keyCode: nextChar.charCodeAt(0),
        });
      }

      currentIndexRef.current++;
    }, speed) as unknown as number;

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, htmlText, speed, enabled, isTyping, onComplete]);

  // Helper to find position in HTML string accounting for tags
  const findHtmlPosition = (html: string, targetIndex: number): number => {
    let visibleChars = 0;
    let htmlPos = 0;
    let inTag = false;

    while (htmlPos < html.length && visibleChars < targetIndex) {
      const char = html[htmlPos];

      if (char === "<") {
        inTag = true;
      } else if (char === ">") {
        inTag = false;
        htmlPos++;
        continue;
      }

      if (!inTag) {
        visibleChars++;
      }

      htmlPos++;
    }

    // Make sure we close any open tags
    while (htmlPos < html.length && html[htmlPos] !== ">") {
      htmlPos++;
    }
    if (htmlPos < html.length) htmlPos++; // Include the closing >

    return htmlPos;
  };

  // Click to skip typing
  const handleClick = () => {
    if (isTyping && !isComplete) {
      // Stop typing and show full text
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayedText(text);
      setDisplayedHtml(htmlText || "");
      setIsTyping(false);
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <pre
      ref={containerRef}
      class={`typewriter-text ${className} ${isTyping ? "cursor-typing" : ""}`}
      style={style}
      onClick={handleClick}
      title={isTyping ? "Click to skip typing" : ""}
    >
      {displayedHtml ? (
        <span dangerouslySetInnerHTML={{ __html: displayedHtml }} />
      ) : (
        displayedText
      )}
      {isTyping && <span class="typing-cursor">█</span>}
      <style>
        {`
        .typewriter-text {
          cursor: ${isTyping ? "pointer" : "default"};
        }

        .typing-cursor {
          animation: blink-cursor 1s step-end infinite;
          opacity: 1;
        }

        @keyframes blink-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        `}
      </style>
    </pre>
  );
}
