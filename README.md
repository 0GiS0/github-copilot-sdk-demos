# 🤖 GitHub Copilot SDK Demos

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1) [![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0) [![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/) [![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

¡Hola developer 👋🏻! 📚 Este repositorio contiene las **demos con las que estoy aprendiendo GitHub Copilot SDK**. Aquí encontrarás ejemplos prácticos desde lo más básico hasta casos avanzados con chatbots interactivos, agents personalizados, MCP servers y streaming en tiempo real. ¡Acompáñame en este viaje de aprendizaje!

<a href="https://youtu.be/2_MXlt-_898">
 <img src="https://img.youtube.com/vi/2_MXlt-_898/maxresdefault.jpg" alt="GitHub Copilot SDK Demos" width="100%" />
</a>

---

## 📑 Tabla de Contenidos

| Sección | Descripción |
|---------|-------------|
| 🎬 [Demos Disponibles](#-demos-disponibles) | Las 4 demos principales del proyecto |
| ✨ [Características](#-características-comunes) | Funcionalidades comunes del SDK |
| 🛠️ [Tecnologías](#-tecnologías-utilizadas) | Stack tecnológico utilizado |
| 📋 [Requisitos Previos](#-requisitos-previos) | Lo que necesitas para empezar |
| 🚀 [Instalación](#-instalación) | Pasos para configurar el proyecto |
| 💻 [Uso](#-uso) | Cómo ejecutar cada demo |
| 📁 [Estructura del Proyecto](#-estructura-del-proyecto) | Organización de archivos |
| 💡 [Conceptos Clave](#-conceptos-clave) | Ideas importantes para entender el SDK |
| 🌐 [Sígueme](#-sígueme-en-mis-redes-sociales) | Conecta conmigo en redes |

---

## 🎬 Demos Disponibles

### 1️⃣ **0.basic.ts** - Demo Básica

Ejemplo simple para entender los fundamentos del SDK:

- ✅ Crear una sesión de Copilot
- ✅ Enviar un prompt y esperar respuesta
- ✅ Retomar sesiones usando Session ID
- ✅ Manejo correcto de limpieza de recursos

**Comandos:**

```bash
npm start
```

**Ideal para:** Principiantes que quieren aprender lo básico del SDK.

---

### 2️⃣ **1.agents.ts** - Chat Interactivo con Tools y MCP Servers

Demo avanzada con interactividad completa:

- 🛠️ **Custom Tools** - Define tus propias herramientas (get_utc_date, get_youtube_feed)
- 📡 **MCP Servers** - Integra múltiples servidores MCP:
  - `filesystem` - Acceso a archivos locales
  - `github` - Interactúa con la API de GitHub
- 💬 **Chat Loop** - Loop interactivo manteniendo contexto
- ⚡ **Streaming** - Respuestas en tiempo real
- 🔄 **Event Listeners** - Maneja eventos de sesión

**Comandos:**

```bash
npm run agents
```

**Características:**

- Preguntas sobre videos de YouTube
- Sugerencias para mejorar código
- Acceso a información de GitHub
- Mantiene el contexto entre preguntas

**Ideal para:** Usuarios avanzados que quieren crear chatbots con capacidades extendidas.

---

### 3️⃣ **2.streaming.ts** - Demo de Streaming

Recibe respuestas token a token en tiempo real:

- ⚡ **Streaming en Tiempo Real** - Respuestas token por token
- 🎧 **Event Listeners** - Escucha eventos de la sesión
- 💬 **Interfaz Interactiva** - Chat en terminal con UI mejorada
- 🎨 **Output Formateado** - Markdown en terminal

**Comandos:**

```bash
npm run streaming
```

**Ideal para:** Entender cómo funcionan las respuestas en streaming y mejorar la UX de aplicaciones.

---

### 4️⃣ **3.server.ts** - Remote GitHub Copilot CLI

Conexión a un servidor Copilot CLI remoto:

- 🌐 Conexión vía HTTP a servidor remoto
- 📤 Streaming en tiempo real
- ✨ Chat interactivo con eventos en vivo
- 🏗️ Arquitectura cliente-servidor

**Comandos:**

```bash
npm run external-server

```

**Requisitos:**

- Servidor Copilot CLI corriendo en `copilot-cli-server:4321`
- Para desarrollo local en VS Code: Usar Dev Container
- Para Docker: Ajustar URL a `localhost` si es local

**Ideal para:** Entornos de producción donde quieres separar cliente y servidor.

---

## ✨ Características Comunes

- 🚀 **CLI Interactiva** - Chat en tiempo real con GitHub Copilot desde tu terminal
- 🎨 **Interfaz Bonita** - Output con colores, emojis y spinners animados
- 📚 **Bien Comentada** - Código con comentarios en español y emojis explicativos
- 🔄 **Loop Interactivo** - Mantiene sesiones activas para múltiples preguntas
- 📊 **Información de Conexión** - Muestra estado y detalles de la sesión
- 🛠️ **Extensible** - Crea tus propias tools y agents

---

## 🛠️ Tecnologías Utilizadas

- **Node.js 25+** - Runtime de JavaScript
- **TypeScript** - Tipado estático
- **@github/copilot-sdk** - SDK oficial de GitHub Copilot
- **chalk** - Colores y estilos en terminal
- **marked** - Parser de Markdown
- **ora** - Spinners animados
- **Docker** - Containerización (opcional)

---

## 📋 Requisitos Previos

- **Node.js** versión 25 o superior
- **npm** o **yarn**
- **GitHub Copilot** - Necesario tener licencia activa
- **GitHub Token** - Con permisos para usar Copilot (obtén uno aquí: https://github.com/settings/tokens)
- **Docker** (opcional, para ejecutar el servidor de Copilot CLI)

---

## 🚀 Instalación

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/0GiS0/github-copilot-sdk-demos.git
cd github-copilot-sdk-demos
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y añade tu `GH_TOKEN` (token de GitHub con permisos de Copilot):

```env
GH_TOKEN=your_github_token_here
```

### Paso 4: Ejecutar una demo

```bash
npm start                # Demo básica
npm run agents           # Demo con agents y tools
npm run streaming        # Demo de streaming
npm run external-server  # Cliente remoto
```

---

## 💻 Uso

### Ejecutar Demo Básica

```bash
npm start
```

Espera a que se complете la solicitud y verás la respuesta en la terminal.

### Ejecutar Chat con Agents

```bash
npm run agents
```

Escribe tus preguntas y presiona Enter. El chatbot puede:
- Obtener la fecha actual
- Acceder a información de GitHub
- Acceder a archivos del sistema

Escribe `/debug` para ver el payload completo de respuestas.

### Ejecutar Demo de Streaming

```bash
npm run streaming
```

Verás las respuestas generarse token a token en la terminal.

### Ejecutar Cliente Remoto

```bash
npm run external-server
```

Requiere tener un servidor Copilot CLI corriendo en `copilot-cli-server:4321`.

---

## 📁 Estructura del Proyecto

```
github-copilot-sdk-demos/
├── 0.basic.ts              # 📚 Demo básica - Fundamentos del SDK
├── 1.agents.ts             # 🤖 Demo avanzada - Chat con tools y MCP servers
├── 2.streaming.ts          # ⚡ Demo streaming - Respuestas token a token
├── 3.server.ts             # 🌐 Demo remota - Cliente que se conecta a servidor
├── config.example.ts       # ⚙️ Configuración de ejemplo
├── package.json            # 📦 Dependencias del proyecto
├── tsconfig.json           # ⚙️ Configuración de TypeScript
├── Dockerfile              # 🐳 Para ejecutar en Docker
├── .env.example            # 🔑 Variables de entorno de ejemplo
├── .devcontainer/          # 📦 Configuración para Dev Container
├── .gitignore              # 🚫 Archivos ignorados por git
└── README.md               # 📖 Este archivo
```

---

## 💡 Conceptos Clave

### 📌 Session ID

Cada sesión tiene un ID único que permite retomar la conversación más adelante:

```typescript
const sessionId = session.sessionId;
// Guardar para usar después
const resumedSession = await client.resumeSession(sessionId);
```

### 🛠️ Custom Tools (Herramientas)

Define funciones que Copilot puede llamar:

```typescript
const myTool = defineTool("tool_name", {
  description: "Descripción de qué hace",
  parameters: {
    /* ... */
  },
  handler: async (params) => {
    /* implementación */
  },
});
```

### 📡 MCP Servers (Model Context Protocol)

Integra servidores externos para ampliar capacidades:

- `filesystem` - Acceso a archivos
- `github` - Operaciones en GitHub
- Puedes crear los tuyos propios

### ⚡ Streaming

Las respuestas llegan token por token, no todas de una vez:

```typescript
streaming: true; // Habilitado por defecto en demos de streaming
```

### 🎧 Event Listeners

Escucha eventos de la sesión:

- `assistant.message_delta` - Nuevo chunk de respuesta
- `session.idle` - Sesión terminó de procesar
- `session.error` - Error durante el procesamiento

### 🔄 session.send() vs session.sendAndWait()

- `send()` - No bloquea, maneja con event listeners (usado en 3.server.ts)
- `sendAndWait()` - Bloquea hasta obtener respuesta (usado en 0.basic.ts y 1.agents.ts)

---

## 🌐 Sígueme en Mis Redes Sociales

Si te ha gustado este proyecto y quieres ver más contenido como este, no olvides suscribirte a mi canal de YouTube y seguirme en mis redes sociales:

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

**¡Gracias por tu interés en este proyecto! 🚀**
