# 🤖 GitHub Copilot SDK Demos

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

¡Hola developer 👋🏻! Colección completa de ejemplos prácticos para dominar el **GitHub Copilot SDK**. Desde demos básicas hasta chatbots interactivos con agents y conexiones remotas a servidores de Copilot CLI. Aprenderás cómo usar herramientas personalizadas (tools), MCP servers, streaming en tiempo real y mucho más.

<a href="https://youtu.be/VIDEO_CODE">
 <img src="https://img.youtube.com/vi/VIDEO_CODE/maxresdefault.jpg" alt="GitHub Copilot SDK Demos" width="100%" />
</a>

> **Nota:** Reemplaza `VIDEO_CODE` con el código de tu vídeo de YouTube

---

## 📑 Tabla de Contenidos

- [Demos Disponibles](#-demos-disponibles)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Conceptos Clave](#-conceptos-clave)
- [Sígueme](#sígueme-en-mis-redes-sociales)

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

### 3️⃣ **3.server.ts** - Remote GitHub Copilot CLI

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

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Tipado estático
- **@github/copilot-sdk** - SDK oficial de GitHub Copilot
- **chalk** - Colores y estilos en terminal
- **Docker** - Containerización

---

## 📋 Requisitos Previos

- **Node.js** versión 18 o superior
- **npm** o **yarn**
- **Docker** (para ejecutar el servidor de Copilot CLI)
- **GitHub Copilot** - Token de autenticación necesario

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

### Paso 3: Configurar variables de entorno (para demos con MCP GitHub)

```bash
cp .env.example .env
```

Edita `.env` y añade tu `GH_TOKEN` (token de GitHub con permisos necesarios):

```bash
GH_TOKEN=your_github_token_here
```

---

## 💻 Uso

Elige qué demo quieres ejecutar:

### Ejecutar Demo Básica

```bash
npm start
```

### Ejecutar Chat con Agents

```bash
npm run agents
```

### Ejecutar Demo de Streaming

```bash
npm run streaming
```

### Ejecutar Cliente Remoto

```bash
npm run external-server
```

---

## 📁 Estructura del Proyecto

```
github-copilot-sdk-demos/
├── 0.basic.ts              # 📚 Demo básica - Fundamentos del SDK
├── 1.agents.ts             # 🤖 Demo avanzada - Chat con tools y MCP servers
├── 2.streaming.ts          # ⚡ Demo streaming - Respuestas token a token
├── 3.server.ts             # 🌐 Demo remota - Cliente que se conecta a servidor
├── config.example.ts       # ⚙️ Configuración de ejemplo (copia a config.ts)
├── package.json            # 📦 Dependencias del proyecto
├── tsconfig.json           # ⚙️ Configuración de TypeScript
├── Dockerfile              # 🐳 Para ejecutar en Docker
├── .env.example            # 🔑 Variables de entorno de ejemplo
├── .gitignore              # 🚫 Archivos ignorados por git
└── README.md               # 📖 Este archivo
```

### Descripción de Archivos

| Archivo               | Descripción                                             |
| --------------------- | ------------------------------------------------------- |
| **0.basic.ts**        | Ejemplo simple para aprender los fundamentos            |
| **1.agents.ts**       | Chat interactivo con custom tools y MCP servers         |
| **2.streaming.ts**    | Demo de streaming token a token (concepto intermedio)   |
| **3.server.ts**       | Cliente que se conecta a servidor remoto de Copilot CLI |
| **config.example.ts** | Archivo de configuración de ejemplo con comentarios     |
| **package.json**      | Scripts: `start`, `agents`, `streaming`, `external-server` |

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
streaming: true; // Habilitado por defecto en 3.server.ts
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
