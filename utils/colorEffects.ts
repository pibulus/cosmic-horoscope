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
export function applyColorToArt(art: string, effect: string): string {
  if (effect === "none" || !art) {
    return "";
  }

  const lines = art.split("\n");
  const colorizedLines: string[] = [];
  let inHeader = false;

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
      continue; // Skip the marker line
    }
    if (line.includes("[HEADER_END]")) {
      inHeader = false;
      continue; // Skip the marker line
    }

    // Apply header color or gradient color
    if (inHeader) {
      // Header gets special bright color
      colorizedLines.push(`<span style="color: ${headerColor}; font-weight: 900; letter-spacing: 0.1em;">${line}</span>`);
    } else if (line.trim()) {
      // Body gets gradient effect
      const color = getEffectColor(
        effect,
        Math.floor(line.length / 2),
        y,
        line.length,
        lines.length,
      );
      colorizedLines.push(`<span style="color: ${color};">${line}</span>`);
    } else {
      // Empty lines stay empty
      colorizedLines.push(line);
    }
  }

  return colorizedLines.join("\n");
}
