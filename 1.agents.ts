/**
 * ✨ Chat demo del GitHub Copilot SDK
 *
 * 💬 Preguntas de ejemplo (copia y pega):
 * - ¿Cuál es el último vídeo en el canal de returngis que no sea un short?
 * - Dame sugerencias para mejorar este código de este repo.
 * - ¿Cuál es el último repo que he creado en GitHub?
 * - ¿Qué ves en esta imagen? #Gis.png
 * 
 * 🎮 Comandos disponibles:
 * - /help  → Muestra ayuda y herramientas disponibles
 * - /exit  → Sale del chat
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🔐 VALIDACIÓN DE ENTORNO
// ═══════════════════════════════════════════════════════════════════════════
// Verificamos que las variables de entorno necesarias estén configuradas
// antes de continuar. Esto evita errores crípticos más adelante.
if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    console.error("\n❌ ERROR: No se encontró token de GitHub");
    console.error("\n📋 Para solucionar esto, configura una de estas variables de entorno:");
    console.error("   • GH_TOKEN=tu_token_aqui");
    console.error("   • GITHUB_TOKEN=tu_token_aqui");
    console.error("\n💡 Puedes obtener un token en: https://github.com/settings/tokens");
    console.error("   Asegúrate de que tenga el scope 'copilot'\n");
    process.exit(1);
}

import { marked } from "marked";
import { markedTerminal } from "marked-terminal"
import { CopilotClient, defineTool, SessionConfig } from "@github/copilot-sdk";
import chalk from "chalk";
import ora from "ora";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

marked.use(new markedTerminal());

// 🔧 Configuración general
const DEFAULT_MODEL = "gpt-5.2"; // 🧠 Modelo por defecto (ajusta según disponibilidad)
const YOUTUBE_CHANNEL_ID = "UC140iBrEZbOtvxWsJ-Tb0lQ" as const; // 📺 Canal de YouTube
let DEBUG_LOG_RESPONSE = false; // 🐞 Cambia a true para depurar el payload (o usa /debug)

// 🧰 Helpers (azúcar sintáctico con spinner y colorines)
const withSpinner = async <T>(text: string, action: () => Promise<T>) => {
    const spinner = ora({
        text: chalk.cyan(text),
        spinner: "dots",
        stream: process.stdout,
        discardStdin: false,
    }).start();
    try {
        const result = await action();
        spinner.succeed(chalk.green(`✓ ${text}`));
        return result;
    } catch (error) {
        spinner.fail(chalk.red(`✗ ${text}`));
        throw error;
    }
};

// 🛠️ Tools de ejemplo

// 🗓️ Tool simple que devuelve la fecha actual en formato ISO (UTC)
const getUtcDateTool = defineTool("get_utc_date", {
    description: "Devuelve la fecha actual en formato ISO (UTC).",
    parameters: {
        type: "object",
        properties: {},
    },
    handler: async () => new Date().toISOString(),
});

// 📡 Tool que obtiene el feed RSS de un canal de YouTube (simplificada, sin parsear XML)
const getYouTubeRSSFeedTool = defineTool("get_youtube_feed", {
    description: "Obtiene el feed RSS del canal de YouTube configurado.",
    parameters: {
        type: "object",
        properties: {
            limit: {
                type: "number",
                description: "Número máximo de videos a devolver (opcional).",
            },
        },
    },
    handler: async ({ limit }: { limit?: number }) => {
        return await withSpinner("📥 Obteniendo feed de YouTube...", async () => {
            const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`);
            const feedText = await response.text();
            if (limit && Number.isFinite(limit)) {
                // ✂️ Recortar resultados si se indica límite
                return feedText.split("<entry>").slice(0, limit + 1).join("<entry>");
            }
            return feedText;
        });
    },
});

// 🤖 Tool que lista los modelos disponibles en el cliente Copilot
const listAvailableModelsTool = defineTool("list_available_models", {
    description: "Lista todos los modelos disponibles en el cliente Copilot con sus características, límites y información de billing.",
    parameters: {
        type: "object",
        properties: {},
    },
    handler: async () => {
        const models = await copilotClient.listModels();
        return JSON.stringify(models, null, 2);
    },
});

// 💬 Tool que lista las sesiones activas del cliente Copilot
const listActiveSessionsTool = defineTool("list_active_sessions", {
    description: "Lista todas las sesiones activas en el cliente Copilot con información sobre el resumen de cada sesión.",
    parameters: {
        type: "object",
        properties: {},
    },
    handler: async () => {
        const sessions = await copilotClient.listSessions();
        return JSON.stringify(sessions, null, 2);
    },
});

// 🤖 Cliente Copilot 
const copilotClient = new CopilotClient({ logLevel: "all" });

copilotClient.start().then(() => {
    console.log(chalk.green("✓ Cliente Copilot iniciado correctamente"));
});

// ⚙️ Opciones de sesión (educativo: aquí puedes jugar con todo)
const sessionOptions: SessionConfig = {
    systemMessage: {
        content: `Eres un asistente que me ayuda a buscar vídeos en el canal de YouTube de returngis. Como parte de la respuesta debes incluir la fecha actual si te preguntan sobre videos.
Para preguntas relacionadas con GitHub usa el MCP Server. Indica si has usado alguna tool para conseguir la respuesta y cuál ha sido.

IMPORTANTE: Cuando uses las tools 'list_available_models' o 'list_active_sessions', formatea la respuesta de manera clara y visual con emojis. NO uses markdown (no uses # ni **). Estructura la información de forma que sea fácil de leer en una terminal. Omite fechas y horas en la información de sesiones.`,
    },
    model: DEFAULT_MODEL,
    tools: [getUtcDateTool, getYouTubeRSSFeedTool, listAvailableModelsTool, listActiveSessionsTool],
    mcpServers: {
        filesystem: {
            type: "local",
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-filesystem", "/workspaces/github-copilot-cli-server-mode/images"],
            tools: ["*"],
        }
    },
};

// 🖨️ Render de respuestas
async function printResponse(promptText: string, response: any) {
    console.log(chalk.bgBlue.white(`\n${"=".repeat(50)}\n💬 RESPUESTA A: ${promptText}\n${"=".repeat(50)}\n`));
    console.log(await marked.parse(response?.data.content || "⚠️ Sin contenido")); // 🧾 Render Markdown bonico
    if (DEBUG_LOG_RESPONSE) {
        console.dir(response, { depth: 4, colors: true });
    }
    console.log(`${"=".repeat(50)}\n`);
}

// 🚦 Manejo de cada prompt
async function handlePrompt(session: any, promptText: string) {
    console.log(chalk.gray(`Pregunta: ${promptText}`));
    // 🎡 Spinner por prompt
    // ⚠️ Importante: discardStdin: false para no interferir con readline
    const spinner = ora({
        text: chalk.cyan(`🤔 Pensando...`),
        stream: process.stdout,
        discardStdin: false,  // 🔑 Cambio clave: no descartar stdin para no bloquear readline
        hideCursor: false
    }).start();
    try {
        const response = await session.sendAndWait({
            prompt: promptText,
            timeoutMs: 45000,
            // attachments: [{ type: "file", path: "Gis.png" }], // opcional: añade archivos aquí
        });
        spinner.succeed(chalk.green(`✅ Respuesta recibida`));
        await printResponse(promptText, response);
        return { ok: true };
    } catch (error: any) {
        // 🚨 Clasificamos el error para dar mejor feedback al usuario
        if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
            spinner.fail(chalk.red(`❌ Error de conexión`));
            console.error(chalk.yellow("   💡 Verifica tu conexión a internet"));
        } else if (error?.message?.includes('timeout') || error?.message?.includes('idle')) {
            spinner.fail(chalk.red(`⚠️ Timeout: La sesión expiró por inactividad`));
        } else if (error?.status === 401 || error?.message?.includes('unauthorized')) {
            spinner.fail(chalk.red(`🔒 Error de autenticación`));
            console.error(chalk.yellow("   💡 Verifica que tu token GH_TOKEN sea válido"));
        } else if (error?.status === 429 || error?.message?.includes('rate limit')) {
            spinner.fail(chalk.red(`🚫 Rate limit: Demasiadas peticiones`));
            console.error(chalk.yellow("   💡 Espera unos minutos antes de continuar"));
        } else {
            spinner.fail(chalk.red(`❌ Error procesando la petición`));
        }
        console.error(chalk.dim("   Detalles:"), error?.message || error);
        return { ok: false, error };
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📖 COMANDO DE AYUDA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 📖 Muestra la ayuda del chat con comandos y herramientas disponibles
 * Esta función es útil para que los usuarios descubran las capacidades del bot
 */
function showHelp() {
    console.log(chalk.cyan("\n╔════════════════════════════════════════════════════════════╗"));
    console.log(chalk.cyan("║              📖 AYUDA DEL CHAT COPILOT                     ║"));
    console.log(chalk.cyan("╚════════════════════════════════════════════════════════════╝\n"));

    // Comandos disponibles
    console.log(chalk.yellow("🎮 COMANDOS DISPONIBLES:"));
    console.log(chalk.white("   /help   → Muestra esta ayuda"));
    console.log(chalk.white("   /debug  → Activa/desactiva modo debug"));
    console.log(chalk.white("   /exit   → Sale del chat\n"));

    // Herramientas (tools) disponibles
    console.log(chalk.yellow("🛠️  HERRAMIENTAS DISPONIBLES:"));
    console.log(chalk.white("   📅 get_utc_date          → Devuelve la fecha actual en UTC"));
    console.log(chalk.white("   📺 get_youtube_feed      → Obtiene el feed RSS de YouTube"));
    console.log(chalk.white("   🤖 list_available_models → Lista los modelos de Copilot disponibles"));
    console.log(chalk.white("   💬 list_active_sessions  → Lista las sesiones activas\n"));

    // MCP Servers
    console.log(chalk.yellow("🌐 SERVIDORES MCP CONECTADOS:"));
    console.log(chalk.white("   📁 filesystem → Acceso a archivos del proyecto"));
    console.log(chalk.white("   🐙 github     → API de GitHub (repos, issues, PRs...)\n"));

    // Ejemplos de uso
    console.log(chalk.yellow("💬 EJEMPLOS DE PREGUNTAS:"));
    console.log(chalk.gray("   • ¿Cuál es el último vídeo en el canal de returngis?"));
    console.log(chalk.gray("   • Dame sugerencias para mejorar el código de este repo"));
    console.log(chalk.gray("   • ¿Qué modelos tengo disponibles?"));
    console.log(chalk.gray("   • Lista mis sesiones activas\n"));
}

// 💬 Chat loop
async function chat() {

    // 🧵 Creamos la sesión antes del loop para mantener el contexto. 
    // Si quieres reiniciar sesión tras cada prompt, mueve esta línea dentro del loop.
    let session = await copilotClient.createSession(sessionOptions);

    console.log(session);

    session.on((event) => {

        if (DEBUG_LOG_RESPONSE)
            console.log("Evento de sesión:", event);
    });

    // ⌨️ readline.createInterface: sencillo loop de chat; para más fancy, mira Inquirer, Blessed o Ink.
    const rl = readline.createInterface({ input, output });

    console.log(chalk.bold.blue("\n=== MODO CHAT ==="));
    console.log(chalk.gray("Escribe tu pregunta, /help para ayuda o /exit para salir."));

    while (true) {
        const userInput = (await rl.question(chalk.magenta("> "))).trim();
        if (!userInput) continue;

        // 🎮 Manejo de comandos especiales
        const command = userInput.toLowerCase();
        if (command === "/exit" || command === "/salir") break;
        if (command === "/help" || command === "/ayuda") {
            showHelp();
            continue;
        }
        if (command === "/debug") {
            DEBUG_LOG_RESPONSE = !DEBUG_LOG_RESPONSE;
            const status = DEBUG_LOG_RESPONSE ? "🟢 ACTIVADO" : "🔴 DESACTIVADO";
            console.log(chalk.yellow(`\n🐞 Modo debug: ${status}\n`));
            if (DEBUG_LOG_RESPONSE) {
                console.log(chalk.dim("   Ahora verás los payloads completos de las respuestas"));
                console.log(chalk.dim("   y los eventos de sesión en la consola.\n"));
            }
            continue;
        }

        const result = await handlePrompt(session, userInput);
        if (!result.ok && result.error?.message?.includes?.('idle')) {
            console.log(chalk.yellow("🔄 Reconectando: Reiniciando sesión tras timeout..."));
            session = await copilotClient.createSession(sessionOptions);
            console.log(chalk.green("✅ Sesión reiniciada correctamente"));
        }
        // 🧽 Limpieza de línea: vuelve a mostrar el prompt limpio tras cada respuesta
        output.write("\n");
    }

    rl.close();
}

chat()
    .catch((error) => {
        console.error(chalk.red("Error en la ejecución principal"), error);
        process.exitCode = 1;
    })
    .finally(async () => {
        const stopSpinner = ora(chalk.cyan("🛑 Deteniendo cliente...")).start();
        await copilotClient.stop();
        stopSpinner.succeed(chalk.green("Cliente detenido correctamente"));
    });
