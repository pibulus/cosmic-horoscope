// ===================================================================
// TYPEWRITER TEXT - Character-by-character reveal with keyboard sounds
// ===================================================================
// Creates the magical "receiving transmission" effect with organic typos

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
  /** Probability of typos (0-1, default: 0.03 = 3%) */
  typoProbability?: number;
  /** Probability of thinking pauses (0-1, default: 0.02 = 2%) */
  pauseProbability?: number;
}

// Helper: Get a plausible typo character for the given character
function getTypoChar(char: string): string {
  const typoMap: Record<string, string[]> = {
    a: ["s", "q", "z"],
    b: ["v", "g", "n"],
    c: ["x", "v", "d"],
    d: ["s", "f", "e"],
    e: ["w", "r", "d"],
    f: ["d", "g", "r"],
    g: ["f", "h", "t"],
    h: ["g", "j", "y"],
    i: ["u", "o", "k"],
    j: ["h", "k", "u"],
    k: ["j", "l", "i"],
    l: ["k", "o", "p"],
    m: ["n", "j", "k"],
    n: ["b", "m", "h"],
    o: ["i", "p", "l"],
    p: ["o", "l"],
    q: ["w", "a"],
    r: ["e", "t", "f"],
    s: ["a", "d", "w"],
    t: ["r", "y", "g"],
    u: ["y", "i", "j"],
    v: ["c", "b", "f"],
    w: ["q", "e", "s"],
    x: ["z", "c", "s"],
    y: ["t", "u", "h"],
    z: ["a", "x", "s"],
  };

  const lowerChar = char.toLowerCase();
  const typos = typoMap[lowerChar];

  if (!typos || typos.length === 0) {
    // No typo mapping, just return a random nearby key
    return String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 3) - 1);
  }

  const typo = typos[Math.floor(Math.random() * typos.length)];
  // Match case of original
  return char === char.toUpperCase() ? typo.toUpperCase() : typo;
}

export function TypewriterText({
  text,
  htmlText,
  speed = 60,
  enabled = true,
  onComplete,
  className = "",
  style = "",
  typoProbability = 0.03,
  pauseProbability = 0.02,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [displayedHtml, setDisplayedHtml] = useState("");
  const [isTyping, setIsTyping] = useState(enabled);
  const [isComplete, setIsComplete] = useState(false);
  const typewriterRef = useRef<SimpleTypeWriter | null>(null);
  const stopTypingRef = useRef(false);
  const containerRef = useRef<HTMLPreElement>(null);
  const currentContentRef = useRef<string>(""); // Track what we're currently typing

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

  // Helper to play keyboard sound
  const playKeySound = (char: string) => {
    if (typewriterRef.current && char.trim()) {
      typewriterRef.current.play({
        key: char,
        keyCode: char.charCodeAt(0),
      });
    }
  };

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

  // Async typing function with organic behavior
  const typeText = async () => {
    stopTypingRef.current = false;
    let currentText = "";
    let currentHtml = "";

    for (let i = 0; i < text.length; i++) {
      if (stopTypingRef.current) break;

      const char = text[i];

      // Random thinking pause before typing this character
      if (Math.random() < pauseProbability) {
        await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 200));
      }

      // Should we make a typo?
      const makeTypo = char.trim() && Math.random() < typoProbability;

      if (makeTypo) {
        // Type wrong character
        const typoChar = getTypoChar(char);
        currentText += typoChar;
        setDisplayedText(currentText);
        if (htmlText) {
          currentHtml = htmlText.slice(0, findHtmlPosition(htmlText, currentText.length));
          setDisplayedHtml(currentHtml);
        }
        playKeySound(typoChar);

        // Pause to "notice" the typo
        await new Promise((resolve) => setTimeout(resolve, speed + 100));

        if (stopTypingRef.current) break;

        // Backspace the typo
        currentText = currentText.slice(0, -1);
        setDisplayedText(currentText);
        if (htmlText) {
          currentHtml = htmlText.slice(0, findHtmlPosition(htmlText, currentText.length));
          setDisplayedHtml(currentHtml);
        }
        playKeySound("\b"); // Backspace sound

        // Small pause before typing correct character
        await new Promise((resolve) => setTimeout(resolve, speed / 2));

        if (stopTypingRef.current) break;
      }

      // Type the correct character
      currentText += char;
      setDisplayedText(currentText);
      if (htmlText) {
        currentHtml = htmlText.slice(0, findHtmlPosition(htmlText, currentText.length));
        setDisplayedHtml(currentHtml);
      }
      playKeySound(char);

      // Wait for next character
      await new Promise((resolve) => setTimeout(resolve, speed));
    }

    // Typing complete
    if (!stopTypingRef.current) {
      setIsComplete(true);
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (!enabled) {
      // If disabled, show full text immediately
      stopTypingRef.current = true;
      setDisplayedText(text);
      setDisplayedHtml(htmlText || "");
      setIsTyping(false);
      setIsComplete(true);
      currentContentRef.current = text;
      if (onComplete) onComplete();
      return;
    }

    // Only restart if the SOURCE content changed
    const contentKey = `${text}|${htmlText || ""}`;
    if (currentContentRef.current === contentKey) {
      // Same content, don't restart
      return;
    }

    // Content changed - stop current typing and start new
    stopTypingRef.current = true;
    currentContentRef.current = contentKey;

    // Small delay to ensure previous typing fully stopped
    setTimeout(() => {
      if (!enabled) return;

      // Reset state for new typing animation
      setDisplayedText("");
      setDisplayedHtml("");
      setIsComplete(false);
      setIsTyping(true);
      stopTypingRef.current = false;

      // Start typing the new content
      typeText();
    }, 50);

    return () => {
      stopTypingRef.current = true;
    };
  }, [text, htmlText, speed, enabled]);

  // Click to skip typing
  const handleClick = () => {
    if (isTyping && !isComplete) {
      // Stop typing and show full text
      stopTypingRef.current = true;
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
