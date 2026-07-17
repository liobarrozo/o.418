const fs = require('fs');
const path = require('path');

const baseArt = fs.readFileSync(path.join(__dirname, '418.txt'), 'utf8').split('\n');

const sparkles = [
  // Frame 1
  [
    "",
    "                                                                *Usar pantalla completa*",
    "",
    "",
    ""
  ],
  // Frame 2
  [
    "",
    "                                                                *Usar pantalla completa*",
    "",
    "                     .",
    "                    . ."
  ],
  // Frame 3
  [
    "",
    "                                                                *Usar pantalla completa*",
    "                     *",
    "                    .+. ",
    "                   .'+`."
  ],
  // Frame 4
  [
    "",
    "                     |                                          *Usar pantalla completa*",
    "                   \\ * /",
    "                  -- * --",
    "                   / * \\"
  ],
  // Frame 5
  [
    "                     |",
    "                  \\  |  /                                       *Usar pantalla completa*",
    "                   \\ | /",
    "                ---- * ----",
    "                   / | \\"
  ],
  // Frame 6
  [
    "",
    "                     *                                          *Usar pantalla completa*",
    "                    . .",
    "                   .   .",
    "                  .     ."
  ]
];

// Ensure they all have exactly 5 lines
// We pad them with spaces to match line width roughly (around 105 chars)

let fieles = [];
try {
  fieles = fs.readFileSync(path.join(__dirname, 'fieles.txt'), 'utf8')
    .split('\n')
    .map(name => name.trim())
    .filter(name => name.length > 0);
} catch(e) {}
const fielesText = fieles.join(' - ');

function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + word).length > maxWidth) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}
const fielesLines = wrapText(fielesText, 80).map(l => {
  const pad = ' '.repeat(Math.max(0, Math.floor((105 - l.length) / 2)));
  return pad + l;
});

for (let i = 0; i < sparkles.length; i++) {
  let lines = sparkles[i];
  const newFrame = [...baseArt];
  for (let j = 0; j < 5; j++) {
    newFrame[j] = lines[j].padEnd(105, ' ');
  }
  
  if (fielesLines.length > 0) {
    newFrame.push('', '', ...fielesLines, '');
  }

  fs.writeFileSync(path.join(__dirname, 'frames', `${i + 1}.txt`), newFrame.join('\n'));
}

console.log("Frames generated!");
