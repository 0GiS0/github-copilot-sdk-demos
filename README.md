# GitHub Copilot CLI Remoto

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

¡Hola developer 👋🏻! En este proyecto te enseño cómo llevar GitHub Copilot CLI a cualquier lugar exponiendo un servidor remoto accesible desde tu máquina local. Con esta solución, puedes interactuar con Copilot a través de una interfaz CLI interactiva, todo conectado a través de una URL remota.

<a href="https://youtu.be/VIDEO_CODE">
 <img src="https://img.youtube.com/vi/VIDEO_CODE/maxresdefault.jpg" alt="GitHub Copilot CLI remoto" width="100%" />
</a>

> **Nota:** Reemplaza `VIDEO_CODE` con el código de tu vídeo de YouTube

---

## 📑 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Despliegue](#despliegue)
- [Sígueme](#sígueme-en-mis-redes-sociales)

---

## ✨ Características

- 🚀 **CLI Interactiva** - Chat en tiempo real con GitHub Copilot desde tu terminal
- 🌍 **Remota** - Expone Copilot CLI desde cualquier ubicación mediante URL
- 🎨 **Interfaz Bonita** - Output con colores y spinner animado mientras procesa
- 🐳 **Containerizada** - Fácil de desplegar con Docker
- 🔄 **Loop Interactivo** - Mantiene la sesión activa para múltiples preguntas
- 📊 **Información de Conexión** - Muestra la URL y puerto conectado

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

## 🚀 Instalación y Uso

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/0GiS0/github-copilot-cli-server-mode.git
cd github-copilot-cli-server-mode
```

### Paso 2: Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y añade tu `GITHUB_TOKEN`:

```bash
GITHUB_TOKEN=your_github_token_here
```

### Paso 3: Iniciar el servidor Docker con Copilot CLI

En una terminal, construye la imagen Docker:

```bash
docker build -t github-copilot-cli-server-mode:latest .
```

Luego, ejecuta el contenedor pasando tu token de GitHub:

```bash
docker run --name copilot-cli \
  --env-file .env \
  -p 8080:8080 \
  --rm \
  github-copilot-cli-server-mode:latest
```

Deberías ver algo como:

```
2026-01-26 10:30:45 INFO: Server listening on port 8080
2026-01-26 10:30:45 INFO: GitHub Copilot CLI is ready
```

### Paso 4: En otra terminal, instalar dependencias de Node.js

```bash
npm install
```

### Paso 5: Ejecutar la aplicación cliente

```bash
npm start
```

La aplicación verificará automáticamente que el servidor Docker esté disponible y luego iniciará el chat interactivo.

---

## 💻 Uso

La primera vez que ejecutes la app, verá algo así:

```
╔════════════════════════════════════════╗
║     🚀 GitHub Copilot CLI Chat         ║
╚════════════════════════════════════════╝

Checking connection to: localhost:8080
✓ Copilot server is available (Status: 200)

Connected to: localhost:8080

Type your message and press Enter to chat.
Type 'exit' or press Ctrl+C to quit.

You:
```

Luego puedes hacer preguntas a Copilot:

```bash
You: ¿Cuál es la capital de Francia?
⠋ Thinking...
🤖 Copilot: La capital de Francia es París, ubicada en el norte de Francia...

You: Crea una función en JavaScript que ordene un array
⠋ Thinking...
🤖 Copilot: Aquí tienes una función que ordena un array...

You: exit
👋 Goodbye!
```

---

### Flujo de Ejecución

```
┌─────────────────────────────┐
│ Terminal 1: Docker Server   │
├─────────────────────────────┤
│ $ docker run ...            │
│ Server listening on 8080    │
│ Ready for connections ✓     │
└─────────────────────────────┘
           ↓ (conexión)
┌─────────────────────────────┐
│ Terminal 2: Node.js Client  │
├─────────────────────────────┤
│ $ npm start                 │
│ Connecting to localhost...  │
│ Ready for questions ✓       │
└─────────────────────────────┘
```

---

## 🐳 Despliegue

### Desplegar Localmente con Docker

Ya lo cubrimos en los pasos de instalación, pero aquí está el resumen:

```bash
# Terminal 1: Construir y ejecutar el servidor Docker
docker build -t github-copilot-cli-server-mode:latest .
docker run --name copilot-cli \
  --env-file .env \
  -p 8080:8080 \
  --rm \
  github-copilot-cli-server-mode:latest

# Terminal 2: Ejecutar la aplicación cliente
npm start
```

### Detener los Contenedores

Para detener el contenedor Docker, simplemente presiona `Ctrl+C` en la terminal donde se ejecuta.

### Desplegar en Azure

Para desplegar en Azure Container Instances:

```bash
# Logearse en Azure
az login

# Crear un registro de contenedores (si no existe)
az acr create --resource-group mi-grupo --name miacr --sku Basic

# Construir la imagen en Azure
az acr build --registry miacr --image github-copilot-cli:latest .

# Desplegar la imagen
az container create \
  --resource-group mi-grupo \
  --name copilot-cli \
  --image miacr.azurecr.io/github-copilot-cli:latest \
  --ports 8080 \
  --environment-variables GITHUB_TOKEN='your_token_here' \
  --registry-login-server miacr.azurecr.io \
  --registry-username <username> \
  --registry-password <password>
```

Luego, desde tu máquina local, conecta modificando `COPILOT_URL` en `index.ts`:

```typescript
const COPILOT_URL = "your-azure-instance.eastus.azurecontainer.io:8080";
```

---

## 📁 Estructura del Proyecto

```
github-copilot-cli-server-mode/
├── index.ts                 # Aplicación cliente con CLI interactiva
├── package.json             # Dependencias del proyecto
├── tsconfig.json            # Configuración de TypeScript
├── Dockerfile               # Servidor Copilot CLI en Docker
├── .env.example             # Variables de entorno de ejemplo
├── .gitignore              # Archivos ignorados por git
└── README.md               # Este archivo
```

### Archivos Principales

- **index.ts** - Aplicación Node.js que se conecta al servidor Docker y proporciona una interfaz CLI interactiva con Copilot
- **Dockerfile** - Contenedor que ejecuta Copilot CLI en modo servidor en el puerto 8080
- **.env** - Contiene `GITHUB_TOKEN` necesario para autenticar con Copilot

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
