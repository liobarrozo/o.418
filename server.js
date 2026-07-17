const fs = require('fs/promises');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const REDIRECT_URL = 'https://github.com/liobarrozo/react-portfolio'; // URL de respaldo

// Códigos ANSI para colores en la terminal
const ANSI_COLORS = [
  '\x1b[31m', // Rojo
  '\x1b[32m', // Verde
  '\x1b[33m', // Amarillo
  '\x1b[34m', // Azul
  '\x1b[35m', // Magenta
  '\x1b[36m', // Cyan
  '\x1b[37m'  // Blanco
];
const ANSI_RESET = '\x1b[0m';
const ANSI_CLEAR = '\x1b[2J\x1b[3J\x1b[H';

let frames = [];

// Inicializar y cargar frames en memoria
async function initFrames() {
  try {
    const framesDir = path.join(__dirname, 'frames');
    const files = await fs.readdir(framesDir);
    
    // Filtrar archivos de texto y ordenarlos numéricamente/alfabéticamente
    const txtFiles = files
      .filter(file => file.endsWith('.txt'))
      .sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });

    frames = await Promise.all(
      txtFiles.map(async file => {
        const content = await fs.readFile(path.join(framesDir, file), 'utf-8');
        return content;
      })
    );

    console.log(`Cargados ${frames.length} frames en memoria.`);
  } catch (error) {
    console.error('Error cargando los frames de animación:', error);
    // Frame por defecto en caso de error
    frames = ['  O   O\n    v\n \\_____/\n'];
  }
}

// Retorna un color aleatorio diferente al anterior
function getNextColor(lastColorIdx) {
  let idx;
  do {
    idx = Math.floor(Math.random() * ANSI_COLORS.length);
  } while (idx === lastColorIdx && ANSI_COLORS.length > 1);
  return idx;
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  // Ruta de healthcheck
  if (req.url === '/healthcheck') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }

  const userAgent = req.headers['user-agent'] || '';
  const isCurl = userAgent.toLowerCase().includes('curl');

  // Si no es curl (es decir, es un navegador web u otro cliente HTTP)
  if (!isCurl) {
    // Renderizamos una landing page interactiva y premium en lugar de solo redirigir
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Animación en Terminal</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --bg-color: #0d0f14;
            --card-bg: #161b22;
            --accent-color: #58a6ff;
            --text-main: #c9d1d9;
            --text-muted: #8b949e;
          }
          body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Outfit', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
          }
          .container {
            max-width: 600px;
            width: 100%;
            background: var(--card-bg);
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 1px solid #30363d;
            text-align: center;
            animation: fadeIn 0.8s ease-out;
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 800;
            background: linear-gradient(45deg, #58a6ff, #bc8cff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p {
            color: var(--text-muted);
            font-size: 1.1rem;
            margin-bottom: 30px;
            line-height: 1.6;
          }
          .code-box {
            background: #090c10;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 18px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 25px;
            cursor: pointer;
            transition: border-color 0.2s;
          }
          .code-box:hover {
            border-color: var(--accent-color);
          }
          .code-text {
            color: #79c0ff;
            user-select: all;
          }
          .copy-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-family: inherit;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: color 0.2s;
          }
          .code-box:hover .copy-btn {
            color: var(--accent-color);
          }
          .footer {
            margin-top: 30px;
            font-size: 0.85rem;
            color: var(--text-muted);
          }
          .footer a {
            color: var(--accent-color);
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
        <script>
          function copyCommand() {
            const cmd = "curl " + window.location.host;
            navigator.clipboard.writeText(cmd);
            const btn = document.querySelector('.copy-btn');
            btn.innerHTML = '✨ ¡Copiado!';
            setTimeout(() => {
              btn.innerHTML = '📋 Copiar';
            }, 2000);
          }
        </script>
      </head>
      <body>
        <div class="container">
          <h1>Animación en Terminal</h1>
          <p>Ejecuta este comando desde cualquier terminal para ver la animación en vivo:</p>
          <div class="code-box" onclick="copyCommand()">
            <span class="code-text">curl <script>document.write(window.location.host)</script></span>
            <button class="copy-btn">📋 Copiar</button>
          </div>
          <div class="footer">
            Creado para nuestro grupo. Ver portafolio en <a href="${REDIRECT_URL}" target="_blank">GitHub</a>.
          </div>
        </div>
      </body>
      </html>
    `);
  }

  // Si el cliente es curl, iniciamos el stream de texto plano
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  let currentFrameIdx = 0;
  let lastColorIdx = -1;
  let timer = null;

  function sendFrame() {
    // 1. Limpiar pantalla y posicionar cursor en inicio
    res.write(ANSI_CLEAR);

    // 2. Colorear frame actual
    const colorIdx = getNextColor(lastColorIdx);
    lastColorIdx = colorIdx;
    const colorCode = ANSI_COLORS[colorIdx];
    const frameText = frames[currentFrameIdx];

    // Escribir el frame coloreado al stream
    const success = res.write(`${colorCode}${frameText}${ANSI_RESET}`);

    // Avanzar frame
    currentFrameIdx = (currentFrameIdx + 1) % frames.length;

    // Control de flujo / Backpressure
    if (success) {
      timer = setTimeout(sendFrame, 100);
    } else {
      res.once('drain', () => {
        timer = setTimeout(sendFrame, 100);
      });
    }
  }

  // Iniciar ciclo de animación
  sendFrame();

  // Limpieza al cerrar la conexión
  const cleanup = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    res.end();
  };

  req.on('close', cleanup);
  req.on('error', cleanup);
});

// Inicializar frames y arrancar el servidor
initFrames().then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor de animación ejecutándose en http://localhost:${PORT}`);
  });
});
