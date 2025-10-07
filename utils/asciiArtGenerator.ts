// ===================================================================
// ASCII ART GENERATOR - Figlet text conversion for cosmic horoscopes
// ===================================================================
// Converts horoscope text and sign names to ASCII art
// Uses figlet library for text-to-ASCII transformation

/**
 * Curated figlet fonts for horoscope display
 * Hand-picked for readability and cosmic vibes
 */
export const FIGLET_FONTS = [
  { name: "Standard", value: "Standard" },
  { name: "Doom", value: "Doom" },
  { name: "Slant", value: "Slant" },
  { name: "Shadow", value: "Shadow" },
  { name: "Ghost", value: "Ghost" },
  { name: "Bloody", value: "Bloody" },
  { name: "Colossal", value: "Colossal" },
  { name: "Isometric3", value: "Isometric3" },
  { name: "Poison", value: "Poison" },
  { name: "Speed", value: "Speed" },
  { name: "Star Wars", value: "Star Wars" },
  { name: "Small", value: "Small" },
  { name: "Chunky", value: "Chunky" },
  { name: "Larry 3D", value: "Larry 3D" },
  { name: "Banner", value: "Banner" },
  { name: "Block", value: "Block" },
  { name: "Big", value: "Big" },
];

/**
 * Simple text-based horoscope formatter with improved spacing and color markers
 * Formats horoscope with a beautiful header and body text
 * Uses special markers for header colorization
 */
export function generateHoroscopeAscii(
  signName: string,
  horoscopeText: string,
  font: string = "Standard"
): string {
  const signUpper = signName.toUpperCase();

  // Wrap header in special markers for colorization
  const header = `[HEADER_START]
${signUpper} HOROSCOPE
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
