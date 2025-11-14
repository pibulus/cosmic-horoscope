// ===================================================================
// COLOR EFFECTS - Shared color calculation utilities
// ===================================================================
// Used by both TextToAscii and AsciiGallery for consistent coloring

/**
 * Calculate HSL color for a specific position in ASCII art
 * based on the selected color effect
 */
export function getEffectColor(
  effect: string,
  x: number,
  y: number,
  lineWidth: number,
  totalLines: number,
): string {
  switch (effect) {
    case "unicorn": {
      const hue = (x * 360 / lineWidth) % 360;
      return `hsl(${hue}, 95%, 65%)`;
    }
    case "fire": {
      const hue = 60 - (y * 60 / totalLines);
      const sat = 100 - (y * 20 / totalLines);
      return `hsl(${hue}, ${sat}%, 55%)`;
    }
    case "cyberpunk": {
      const progress = (x + y) / (lineWidth + totalLines);
      const hue = 320 - (progress * 140);
      return `hsl(${hue}, 100%, 60%)`;
    }
    case "sunrise": {
      const progress = y / totalLines;
      const hue = 330 + (progress * 60);
      const sat = 85 + (progress * 15);
      const bright = 60 + (progress * 20);
      return `hsl(${hue}, ${sat}%, ${bright}%)`;
    }
    case "vaporwave": {
      const progress = y / totalLines;
      const hue = 280 + (progress * 80);
      const sat = 80 + Math.sin((x + y) * 0.3) * 15;
      const bright = 65 + Math.sin(x * 0.4) * 10;
      return `hsl(${hue}, ${sat}%, ${bright}%)`;
    }
    case "chrome": {
      const hue = 200 + Math.sin(x * 0.2) * 60;
      const brightness = 70 + Math.sin(y * 0.3) * 20;
      return `hsl(${hue}, 30%, ${brightness}%)`;
    }
    case "ocean": {
      const progress = y / totalLines;
      const hue = 180 + (progress * 30); // Cyan (180) → Blue (210)
      const sat = 70 + (progress * 20);
      const bright = 50 + (progress * 20);
      return `hsl(${hue}, ${sat}%, ${bright}%)`;
    }
    case "neon": {
      const progress = (x + y) / (lineWidth + totalLines);
      const hue = 60 + Math.sin(progress * 10) * 120; // Yellow/Green/Pink oscillation
      const sat = 100;
      const bright = 60 + Math.sin(progress * 8) * 15;
      return `hsl(${hue}, ${sat}%, ${bright}%)`;
    }
    case "poison": {
      const progress = (x + y) / (lineWidth + totalLines);
      const hue = 90 + (progress * 30); // Lime green (90) → Yellow-green (120)
      const sat = 90 + Math.sin(x * 0.5) * 10;
      const bright = 45 + (progress * 20);
      return `hsl(${hue}, ${sat}%, ${bright}%)`;
    }
    default:
      return "#00FF41";
  }
}

/**
 * Apply a color effect to ASCII art text with special header treatment
 * Returns HTML with colored spans for each line
 * Header section gets a special bright color, body gets gradient
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export function applyColorToArt(art: string, effect: string): string {
  if (effect === "none" || !art) {
    return "";
  }

  const lines = art.split("\n");
  const colorizedLines: string[] = [];
  let inHeader = false;
  let headerLineIndex = 0;

  // Define header colors for each effect (brighter than body)
  const headerColors: Record<string, string> = {
    unicorn: "hsl(280, 100%, 75%)", // Bright purple
    fire: "hsl(40, 100%, 65%)", // Bright orange-yellow
    cyberpunk: "hsl(320, 100%, 70%)", // Hot pink
    sunrise: "hsl(30, 100%, 70%)", // Golden
    vaporwave: "hsl(310, 95%, 75%)", // Pink-purple
    chrome: "hsl(200, 60%, 85%)", // Light cyan
    ocean: "hsl(180, 85%, 65%)", // Bright cyan
    neon: "hsl(100, 100%, 70%)", // Lime green
    poison: "hsl(100, 100%, 55%)", // Toxic green
  };

  const headerColor = headerColors[effect] || "#FFD700"; // Gold fallback

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];

    // Check for header markers
    if (line.includes("[HEADER_START]")) {
      inHeader = true;
      headerLineIndex = 0;
      continue; // Skip the marker line
    }
    if (line.includes("[HEADER_END]")) {
      inHeader = false;
      headerLineIndex = 0;
      continue; // Skip the marker line
    }

    // Apply header color or gradient color
    if (inHeader) {
      headerLineIndex++;
      const isTitleLine = headerLineIndex === 1;
      // Typography improvements: larger titles, better spacing
      const fontSize = isTitleLine
        ? "clamp(24px, 5.5vw, 38px)" // 1.6-1.9rem equivalent
        : "clamp(14px, 3.5vw, 22px)"; // 0.9-1rem equivalent
      const letterSpacing = isTitleLine ? "0.22em" : "0.16em"; // More breathing
      const marginBottom = isTitleLine ? "0.8em" : "0.5em"; // Add rhythm
      const fontFamily = "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace";
      const textShadow = isTitleLine
        ? "0 0 4px currentColor, 0 0 12px rgba(255, 215, 0, 0.25)" // Stronger glow for titles
        : "0 0 2px currentColor, 0 0 6px rgba(255, 215, 0, 0.15)"; // Subtle for subtitles

      // Header gets special bright color
      colorizedLines.push(
        `<span style="color: ${headerColor}; font-weight: 900; letter-spacing: ${letterSpacing}; font-size: ${fontSize}; font-family: ${fontFamily}; text-transform: uppercase; display: block; margin-bottom: ${marginBottom}; text-shadow: ${textShadow};">${
          escapeHtml(line)
        }</span>`,
      );
    } else if (line.trim()) {
      // Body gets gradient effect with reduced glow
      const color = getEffectColor(
        effect,
        Math.floor(line.length / 2),
        y,
        line.length,
        lines.length,
      );
      // Body text: 0.95rem, better line-height, reduced glow by ~40%
      colorizedLines.push(
        `<span style="color: ${color}; font-size: clamp(14px, 3.8vw, 19px); line-height: 1.75; text-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 0 4px currentColor; opacity: 0.92;">${escapeHtml(line)}</span>`,
      );
    } else {
      // Empty lines stay empty
      colorizedLines.push(line);
    }
  }

  return colorizedLines.join("\n");
}
