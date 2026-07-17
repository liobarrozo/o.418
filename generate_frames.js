const fs = require('fs');
const path = require('path');

const baseArt = fs.readFileSync(path.join(__dirname, '418.txt'), 'utf8').split('\n');

const sparkles = [
  // Frame 1
  [
    "",
    "                                                               *Usar pantalla completa*",
    "",
    "",
    ""
  ],
  // Frame 2
  [
    "",
    "                                                               *Usar pantalla completa*",
    "",
    "                     .",
    "                    . ."
  ],
  // Frame 3
  [
    "",
    "                     *                                         *Usar pantalla completa*",
    "",
    "                    .+. ",
    "                   .'+`."
  ],
  // Frame 4
  [
    "",
    "                     |                                         *Usar pantalla completa*",
    "                   \\ * /",
    "                  -- * --",
    "                   / * \\"
  ],
  // Frame 5
  [
    "                     |",
    "                  \\  |  /                                      *Usar pantalla completa*",
    "                   \\ | /",
    "                ---- * ----",
    "                   / | \\"
  ],
  // Frame 6
  [
    "",
    "                     *                                         *Usar pantalla completa*",
    "                    . .",
    "                   .   .",
    "                  .     ."
  ]
];

const footerText = `

             Lauri Reynoso - Santi Mazzei - Pedro Clementi - Bruno Mancilla - Santi Ávila -
             Jose Malaman - Fede Sánchez - Santi Vera - Berni Llensa - Ignacio Funes - Bruno
              Tinnirello - Agus Stevanato - Martín Cordoba - Tomás Cordoba - Manu Bellido -
              Astor Laporte - Lambert Indeau - Martiniano Garelli - Matías Guevara - Santi
             Moreno - Mateo Zalazar - Ignacio Angulo - Bauti Alcaya - Tomás Manzano - Matías
             Fernández - Maxi Leitner - Chapa - Ignacio Morales - Alejo Fernández - Joaquín
               Villarreal - Martín Clementi - Indalecio - Franco Marasco - Mauro Pereyra -
            Jerónimo Pinea - liobarrozo - Máximo Bessone - Nahu Rodriguez - Lautaro Espada -
             Luciano Burgos - Lucas Muñoz - Dylan Santoni - Leonel Funes - Valentín Murcia -
                             Marcos Parrino - Bruno Sanchez - Ernesto Elias

                                    *Usar pantalla completa*   
`.split('\n');

for (let i = 0; i < sparkles.length; i++) {
  let lines = sparkles[i];
  const newFrame = [...baseArt];
  for (let j = 0; j < 5; j++) {
    newFrame[j] = lines[j].padEnd(105, ' ');
  }
  
  newFrame.push(...footerText);

  fs.writeFileSync(path.join(__dirname, 'frames', `${i + 1}.txt`), newFrame.join('\n'));
}

console.log("Frames generated!");
