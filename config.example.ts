/**
 * ⚙️ Archivo de Configuración de Ejemplo
 * 
 * 📚 PROPÓSITO EDUCATIVO:
 * Este archivo centraliza todas las constantes configurables del proyecto.
 * Cópialo como `config.ts` y modifica los valores según tus necesidades.
 * 
 * 💡 CÓMO USAR:
 * 1. Copia este archivo: cp config.example.ts config.ts
 * 2. Modifica los valores en config.ts
 * 3. Importa en tus scripts: import { CONFIG } from './config'
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🤖 CONFIGURACIÓN DEL MODELO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🧠 Modelo de IA a utilizar
 * 
 * Opciones disponibles (según tu suscripción):
 * - "gpt-4.1"           → GPT-4.1 estándar
 * - "gpt-5.2"           → GPT-5.2 (más reciente)
 * - "gpt-5-mini"        → Versión ligera de GPT-5
 * - "claude-sonnet-4.5" → Claude Sonnet 4.5 (Anthropic)
 * - "claude-haiku-4.5"  → Claude Haiku (más rápido, económico)
 * - "claude-opus-4.5"   → Claude Opus (más potente)
 * 
 * 💰 NOTA: Cada modelo tiene diferente coste (ver multiplicadores en SDK)
 */
export const MODEL_NAME = "gpt-5.2";

/**
 * 🧠 Modelo para el servidor remoto (3.server.ts)
 * Generalmente usamos uno más ligero para respuestas rápidas
 */
export const SERVER_MODEL_NAME = "gpt-5-mini";

// ═══════════════════════════════════════════════════════════════════════════
// 💬 MENSAJES DEL SISTEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎭 Mensaje del sistema para el agente (1.agents.ts)
 * Define la personalidad y comportamiento del asistente
 * 
 * 💡 TIPS para escribir buenos system messages:
 * - Sé específico sobre el rol del asistente
 * - Define qué herramientas puede usar y cuándo
 * - Especifica el formato de respuesta deseado
 * - Incluye restricciones si las hay
 */
export const AGENT_SYSTEM_MESSAGE = `Eres un asistente que me ayuda a buscar vídeos en el canal de YouTube de returngis. 
Como parte de la respuesta debes incluir la fecha actual si te preguntan sobre videos.
Para preguntas relacionadas con GitHub usa el MCP Server. 
Indica si has usado alguna tool para conseguir la respuesta y cuál ha sido.

IMPORTANTE: Cuando uses las tools 'list_available_models' o 'list_active_sessions', 
formatea la respuesta de manera clara y visual con emojis. 
NO uses markdown (no uses # ni **). 
Estructura la información de forma que sea fácil de leer en una terminal. 
Omite fechas y horas en la información de sesiones.`;

/**
 * 🎭 Mensaje del sistema para el servidor remoto (3.server.ts)
 */
export const SERVER_SYSTEM_MESSAGE = `You are a helpful assistant working in a remote environment. 
The user cannot see files you create or modify directly. Therefore, when the user asks you to create or modify anything, you MUST:

1. Always provide the complete content/code in your response
2. Use markdown formatting (code blocks, lists, etc.) to make it clear and readable
3. Never just say "I've created the file" or "I've modified it" - show the actual content
4. Include explanations of what you created or changed
5. If asked to create multiple files, show the content of each one

Be direct and show the work, not just confirmations.`;

// ═══════════════════════════════════════════════════════════════════════════
// ⏱️ TIMEOUTS Y LÍMITES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⏱️ Tiempo máximo de espera para respuestas (en milisegundos)
 * 
 * Valores recomendados:
 * - 30000  (30s)  → Respuestas cortas
 * - 45000  (45s)  → Respuestas medianas (por defecto)
 * - 60000  (60s)  → Respuestas largas con código
 * - 120000 (2min) → Tareas complejas con múltiples tools
 */
export const RESPONSE_TIMEOUT_MS = 45000;

/**
 * ⏱️ Timeout de seguridad para streaming (en milisegundos)
 * Usado en 3.server.ts para evitar que el proceso se quede colgado
 */
export const STREAMING_TIMEOUT_MS = 300000; // 5 minutos

// ═══════════════════════════════════════════════════════════════════════════
// 🌐 CONFIGURACIÓN DE RED
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🖥️ URL del servidor Copilot CLI remoto
 * 
 * Opciones comunes:
 * - "copilot-cli-server:4321" → Dentro del Dev Container (Docker)
 * - "localhost:4321"          → Servidor local
 * - "192.168.1.X:4321"        → Servidor en red local
 * 
 * ⚠️ IMPORTANTE: Asegúrate de que el servidor esté corriendo antes de conectar
 */
export const COPILOT_SERVER_URL = "copilot-cli-server:4321";

// ═══════════════════════════════════════════════════════════════════════════
// 📺 CONFIGURACIÓN DE YOUTUBE (para el ejemplo de tools)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 📺 ID del canal de YouTube para el feed RSS
 * 
 * 💡 Cómo obtener el ID de un canal:
 * 1. Ve al canal en YouTube
 * 2. Mira la URL: youtube.com/channel/UC... → el ID empieza con UC
 * 3. O usa: https://commentpicker.com/youtube-channel-id.php
 */
export const YOUTUBE_CHANNEL_ID = "UC140iBrEZbOtvxWsJ-Tb0lQ";

// ═══════════════════════════════════════════════════════════════════════════
// 🐞 CONFIGURACIÓN DE DEBUG
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🐞 Nivel de logging del cliente Copilot
 * 
 * Opciones:
 * - "all"   → Muestra todo (útil para depuración)
 * - "info"  → Solo información importante
 * - "warn"  → Solo advertencias y errores
 * - "error" → Solo errores
 * - "none"  → Sin logs
 */
export const LOG_LEVEL = "all";

/**
 * 🐞 Mostrar payload completo de las respuestas
 * Útil para entender la estructura de datos del SDK
 */
export const DEBUG_LOG_RESPONSE = false;

// ═══════════════════════════════════════════════════════════════════════════
// 📦 EXPORTACIÓN AGRUPADA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🎁 Objeto con toda la configuración agrupada
 * Útil para importar todo de una vez: import { CONFIG } from './config'
 */
export const CONFIG = {
    // Modelos
    modelName: MODEL_NAME,
    serverModelName: SERVER_MODEL_NAME,

    // Mensajes del sistema
    agentSystemMessage: AGENT_SYSTEM_MESSAGE,
    serverSystemMessage: SERVER_SYSTEM_MESSAGE,

    // Timeouts
    responseTimeoutMs: RESPONSE_TIMEOUT_MS,
    streamingTimeoutMs: STREAMING_TIMEOUT_MS,

    // Red
    copilotServerUrl: COPILOT_SERVER_URL,

    // YouTube
    youtubeChannelId: YOUTUBE_CHANNEL_ID,

    // Debug
    logLevel: LOG_LEVEL,
    debugLogResponse: DEBUG_LOG_RESPONSE,
} as const;

// 💡 Tip: Puedes usar `as const` para que TypeScript infiera tipos literales
// Esto permite autocompletado más preciso en el IDE
