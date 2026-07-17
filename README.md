# o.418 - Terminal Animation Server

Una alternativa ultra-liviana y *Zero-Dependency* inspirada en [parrot.live](https://github.com/hugomd/parrot.live), diseñada para transmitir arte ASCII animado directamente a cualquier terminal usando `curl`.

## 🚀 Características

- **Zero-Dependency**: Desarrollado íntegramente con los módulos nativos de Node.js (`http`, `fs`, `path`). No requiere `npm install` ni librerías de terceros.
- **Smart Routing**: 
  - Si la petición proviene de la terminal (detectado mediante el header `User-Agent: curl`), el servidor inicia una transmisión continua (*streaming*) de la animación.
  - Si la petición proviene de un navegador web, el servidor devuelve una **Landing Page interactiva y moderna** con instrucciones para ejecutar la animación.
- **Eficiencia de Memoria**: Todos los frames se cargan en la RAM durante el inicio del servidor, evitando lecturas intensivas en disco (`I/O`) en cada petición.
- **Safe Backpressure**: Maneja la desconexión prematura de clientes (`req.on('close')`) limpiando los temporizadores de manera segura para evitar fugas de memoria (*memory leaks*).

## 🛠️ ¿Cómo funciona técnicamente?

La "magia" de esta animación reside en el uso de estándares de red y de terminal:

1. **Chunked Transfer Encoding**: El servidor HTTP mantiene la conexión abierta indefinidamente, enviando fragmentos de texto cada 100 milisegundos.
2. **Códigos de Escape ANSI**: Antes de enviar cada nuevo *frame*, el servidor inyecta caracteres de control ANSI (por ejemplo: `\x1b[2J\x1b[3J\x1b[H`). Esto da la orden directa a la terminal del cliente de **limpiar la pantalla** y **reposicionar el cursor** en la parte superior, creando la ilusión óptica de un refresco de pantalla suave. Además, se aplican códigos de color dinámicos (rojo, cyan, magenta, etc.) en cada iteración.
3. **Generación Programática**: El arte y la estructura están separados. Un script independiente (`generate_frames.js`) se encarga de tomar un diseño base, incrustarle las animaciones (ej. destellos de luz) y el texto formateado, para luego compilar los frames definitivos que consumirá el servidor.

---

## 📂 Estructura del Proyecto

```text
.
├── server.js               # Punto de entrada principal (Servidor HTTP nativo)
├── generate_frames.js      # Script de compilación de la animación
├── 418.txt                 # Plantilla base del diseño ASCII ("o . 4 1 8")
├── fieles.txt              # Lista de nombres que se procesan al final de la animación
└── frames/                 # Carpeta destino donde viven los frames pre-compilados
    ├── 1.txt               
    ├── 2.txt
    └── ...
```

---

## 💻 Uso e Instalación

### Requisitos
- [Node.js](https://nodejs.org/) (v14+)

### Ejecutar Localmente

1. Clona el repositorio e ingresa a la carpeta.
2. Levanta el servidor:
   ```bash
   node server.js
   ```
3. **Para ver la animación públicamente**: Ejecuta desde cualquier terminal:
   ```bash
   curl o-418.top
   ```
4. **Para ver la Landing Page**: Visita `http://o-418.top` en cualquier navegador web.

*(Nota: para probar localmente mientras desarrollas, puedes seguir usando `curl http://localhost:3000` y `http://localhost:3000`)*

---

## 🎨 ¿Cómo modificar la animación?

El sistema está diseñado para ser fácilmente extensible:

1. Modifica la plantilla base en el archivo `418.txt`.
2. Actualiza los nombres en `fieles.txt` si es necesario.
3. Ejecuta el compilador de frames para aplicar los cambios a la animación:
   ```bash
   node generate_frames.js
   ```
4. Reinicia tu `server.js` para que los nuevos frames compilados sean cargados en memoria.
