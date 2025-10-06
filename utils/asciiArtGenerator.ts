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
 * Simple text-based horoscope formatter
 * This is a placeholder until we add figlet library
 * For now, just format the horoscope nicely with sign header
 */
export function generateHoroscopeAscii(
  signName: string,
  horoscopeText: string,
  font: string = "Standard"
): string {
  // For now, create a simple bordered ASCII art header
  // TODO: Replace with actual figlet library once added

  const signUpper = signName.toUpperCase();
  const borderLength = signUpper.length + 4;
  const border = "═".repeat(borderLength);

  // Create ASCII art header for the sign
  const header = `
╔${border}╗
║  ${signUpper}  ║
╚${border}╝
`;

  // Format horoscope text with nice line breaks (max 60 chars per line)
  const words = horoscopeText.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > 58) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  // Center each line
  const centeredLines = lines.map(line => {
    const padding = Math.max(0, Math.floor((60 - line.length) / 2));
    return " ".repeat(padding) + line;
  });

  return header + "\n" + centeredLines.join("\n") + "\n";
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
