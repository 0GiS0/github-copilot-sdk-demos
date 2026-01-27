/**
 * ✨ Chat demo del GitHub Copilot SDK
 *
 * 💬 Preguntas de ejemplo (copia y pega):
 * - ¿Cuál es el último vídeo en el canal de returngis que no sea un short?
 * - Dame sugerencias para mejorar este código de este repo.
 * - ¿Cuál es el último repo que he creado en GitHub?
 * - ¿Qué ves en esta imagen? #Gis.png
 */

import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { CopilotClient, defineTool, SessionConfig } from "@github/copilot-sdk";
import chalk from "chalk";
import ora from "ora";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

marked.use(new markedTerminal());

// 🔧 Configuración general
const DEFAULT_MODEL = "gpt-5.2"; // 🧠 Modelo por defecto (ajusta según disponibilidad)
const YOUTUBE_CHANNEL_ID = "UC140iBrEZbOtvxWsJ-Tb0lQ" as const; // 📺 Canal de YouTube
const DEBUG_LOG_RESPONSE = false; // 🐞 Cambia a true para depurar el payload

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

// 🤖 Cliente Copilot 
const copilotClient = new CopilotClient({ logLevel: "all" });

const GH_TOKEN = process.env.GH_TOKEN;

// ⚙️ Opciones de sesión (educativo: aquí puedes jugar con todo)
const sessionOptions: SessionConfig = {
    systemMessage: {
        content: `Eres un asistente que me ayuda a buscar vídeos en el canal de YouTube de returngis. Como parte de la respuesta debes incluir la fecha actual si te preguntan sobre videos.
Para preguntas relacionadas con GitHub usa el MCP Server. Indica si has usado alguna tool para conseguir la respuesta y cuál ha sido.`,
    },
    model: DEFAULT_MODEL,
    tools: [getUtcDateTool, getYouTubeRSSFeedTool],
    mcpServers: {
        filesystem: {
            type: "local",
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
            tools: ["*"],
        },
        // Remote MCP server (HTTP)
        "github": {
            type: "http",
            url: "https://api.githubcopilot.com/mcp/",
            headers: { "Authorization": `Bearer ${GH_TOKEN}` },
            tools: ["*"],
        },
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
        spinner.succeed(chalk.green(`✓ Respuesta recibida`));
        await printResponse(promptText, response);
        return { ok: true };
    } catch (error: any) {
        spinner.fail(chalk.red(`✗ Error procesando`));
        console.error(error);
        return { ok: false, error };
    }
}

// 💬 Chat loop
async function chat() {

    // 🧵 Creamos la sesión antes del loop para mantener el contexto. Si quieres reiniciar sesión tras cada prompt, mueve esta línea dentro del loop.
    let session = await copilotClient.createSession(sessionOptions);

    console.log(session);

    session.on((event) => {
        switch (event.type) {
            case "assistant.message":
                console.log("Assistant:", event.data.content);
                break;
            case "session.error":
                console.error("Error:", event.data.message);
                break;
            default:
                console.log("default:", event.data);
                break;
        }
    });

    // ⌨️ readline.createInterface: sencillo loop de chat; para más fancy, mira Inquirer, Blessed o Ink.
    const rl = readline.createInterface({ input, output });

    console.log(chalk.bold.blue("\n=== MODO CHAT ==="));
    console.log(chalk.gray("Escribe tu pregunta o /exit para salir."));

    while (true) {
        const userInput = (await rl.question(chalk.magenta("> "))).trim();
        if (!userInput) continue;
        if (userInput.toLowerCase() === "/exit") break;
        const result = await handlePrompt(session, userInput);
        if (!result.ok && result.error?.message?.includes?.("idle")) {
            console.log(chalk.yellow("🔁 Reiniciando sesión tras timeout..."));
            session = await copilotClient.createSession(sessionOptions);
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
