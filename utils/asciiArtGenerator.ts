// ===================================================================
// ASCII ART GENERATOR - Figlet text conversion for cosmic horoscopes
// ===================================================================
// Converts horoscope text and sign names to ASCII art
// Uses figlet library for text-to-ASCII transformation

/**
 * Simple text-based horoscope formatter with improved spacing and color markers
 * Formats horoscope with a beautiful header and body text
 * Uses special markers for header colorization
 */
export function generateHoroscopeAscii(
  signName: string,
  horoscopeText: string,
  period: string = "daily",
  date: string = "",
  emoji?: string,
): string {
  const signUpper = signName.toUpperCase();
  const periodUpper = period.toUpperCase();
  const titleLine = emoji ? `${emoji}  ${signUpper}` : signUpper;
  const metaLine = date ? `${periodUpper} • ${date}` : periodUpper;

  // Wrap header in special markers for colorization
  const header = `[HEADER_START]
${titleLine}
${metaLine}
[HEADER_END]`;

  // Format horoscope text with nice line breaks (max 68 chars per line for better fit)
  const words = horoscopeText.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > 66) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  // Join lines with proper spacing (no centering - left aligned looks cleaner)
  const bodyText = lines.join("\n");

  // Add spacing between header and body
  return `${header}\n\n${bodyText}\n`;
}

/**
 * Escape HTML for safe display
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
