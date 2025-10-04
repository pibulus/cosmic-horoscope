// 🎨 Curated ASCII Art Collection
// Source: asciiart.eu - public domain ASCII art archive
// Purpose: Welcome examples to inspire users

export interface AsciiArt {
  title: string;
  category: string;
  art: string;
  artist?: string;
}

export const asciiCollection: AsciiArt[] = [
  // Dragons
  {
    title: "Dragon Text",
    category: "mythology",
    art: `      \_
   \_\_| |\_ \_\_ \_\_ \_  \_\_ \_  \_\_\_  \_ \_\_  \_\_\_
  / \_\` | '\_\_/ \_\` |/ \_\` |/ \_ \\| '\_ \\/ \_\_|
 | (\_| | | | (\_| | (\_| | (\_) | | | \\\_\_ \\
  \\\_\_,\_|\_|  \\\_\_,\_|\\\_\_, |\\\_\_\_/|\_| |\_|\_\_\_/
                  |\_\_\_/                 `,
  },
  {
    title: "Small Dragon",
    category: "mythology",
    art: `       .
 .>   )\\;\`a\_\_
(  \_ \_)/ /-." ~~
 \`( )\_ )/
  <\_  <\_`,
    artist: "sb/dwb",
  },
  {
    title: "Cute Dragon",
    category: "mythology",
    art: `                    /     \\
                   ((     ))
               ===  \\\\\_v\_//  ===
                ====)\_^\_(====
                ===/ O O \\===
                = | /\_ \_\\ | =
               =   \\/\_ \_\\/   =
                    \\\_ \_/
                    (o\_o)
                     VwV`,
    artist: "Roland Waylor",
  },

  // Cats
  {
    title: "Simple Cat",
    category: "animals",
    art: ` /\\_/\\
( o o )
==_Y_==
  \`-'`,
  },
  {
    title: "Detailed Cat",
    category: "animals",
    art: `   |\\---/|
   | ,_, |
    \\_\`_/-..----.
 ___/ \`   ' ,""+ \\
(___...'   __\\    |\`.___.';
  (___,'(___,\`___()/'.....+`,
    artist: "sk",
  },

  // Geometric Art
  {
    title: "Tetrahedron",
    category: "geometry",
    art: `       ^
      /|\\
     / | \\
    /  |  \\
    '-.|.-'`,
    artist: "KCK",
  },
  {
    title: "Dodecahedron",
    category: "geometry",
    art: `      _----------_,
    ,"__         _-:,
   /    ""--_--""...:\\
  /         |.........\\
 /          |..........\\
/,         _'_........./
! -,    _-"   "-_... ,;;:
\\   -_-"         "-_/;;;;
 \\   \\             /;;;;'
  \\   \\           /;;;;
   '.  \\         /;;;'
     "-_\_____/;;'`,
    artist: "Michael Naylor",
  },

  // Welcome Messages
  {
    title: "Welcome Banner",
    category: "text",
    art: `
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀  ▀▀▀▀█░█▀▀▀▀  ▀▀▀▀█░█▀▀▀▀
▐░▌       ▐░▌▐░▌          ▐░▌               ▐░▌          ▐░▌
▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░▌               ▐░▌          ▐░▌
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌               ▐░▌          ▐░▌
▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀▀▀▀▀▀█░▌▐░▌               ▐░▌          ▐░▌
▐░▌       ▐░▌          ▐░▌▐░▌               ▐░▌          ▐░▌
▐░▌       ▐░▌ ▄▄▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄  ▄▄▄▄█░█▄▄▄▄  ▄▄▄▄█░█▄▄▄▄
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀
`,
  },

  // Dividers
  {
    title: "Celtic Border",
    category: "borders",
    art: ` .--..--..--..--..--..--..--..--..--..--..--.
/ .. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\
\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/ /
 \\/ /\\/ /\\/ /\\/ /\\/ /\\/ /\\/ /\\/ /\\/ /\\/ /\\/ /`,
  },

  // Emoji-style
  {
    title: "Peace Sign",
    category: "emoji",
    art: `
    .-""""""-.
  .'          '.
 /   O      O   \\
:                :
|                |
:       __       :
 \\  .-"    "-.  /
  '.          .'
    '-......-'
`,
  },
];

// Get a random ASCII art piece
export function getRandomAscii(): AsciiArt {
  const randomIndex = Math.floor(Math.random() * asciiCollection.length);
  return asciiCollection[randomIndex];
}

// Get ASCII art by category
export function getAsciiByCategory(category: string): AsciiArt[] {
  return asciiCollection.filter((art) => art.category === category);
}

// Get all categories
export function getCategories(): string[] {
  return [...new Set(asciiCollection.map((art) => art.category))];
}
