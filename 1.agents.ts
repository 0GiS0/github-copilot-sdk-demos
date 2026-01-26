import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { CopilotClient, defineTool } from "@github/copilot-sdk";
import chalk from "chalk";
import ora from "ora";

const client = new CopilotClient({ logLevel: "all" });

const YOUTUBE_CHANNEL_ID = "UC140iBrEZbOtvxWsJ-Tb0lQ"

const getDate = defineTool("get_date", {
    description: "If you need to know what day is today",
    parameters: {
        handler: async () => {
            return new Date().getUTCDate();
        }
    },
    handler: async () => {
    }
})


// recupera el rss de mi canal de youtube
const getYouTubeRSSFeed = defineTool("get_youtube_feed", {
    description: "Si te pide por videos de youtube",
    parameters: {
    },
    handler: async () => {
        const spinner = ora(chalk.cyan("📥 Obteniendo feed de YouTube...")).start();
        try {
            let videos = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`);
            spinner.succeed(chalk.green("✓ Feed de YouTube obtenido"));
            return videos;
        } catch (error) {
            spinner.fail(chalk.red("✗ Error al obtener feed de YouTube"));
            throw error;
        }
    },
})



const session = await client.createSession(
    {
        systemMessage: {
            content: `Eres un asistente que me ayuda a buscar vídeos en el canal de YouTube de returngis. Como parte de la respuesta debes incluir la fecha actual.
            Para preguntas relacioandas con GitHub usa el MCP Server.
            Indica si has usado alguna tool para conseguir la respuesta y cuál ha sido.` },
        model: "claude-opus-4.5",
        streaming: true,
        tools: [getDate, getYouTubeRSSFeed],
        mcpServers: {
            github: {
                type: "http",
                url: "https://api.githubcopilot.com/mcp/",
                tools: ["*"],
            },
        },
        customAgents: [{
            name: "the-suggester",
            displayName: "The suggester",
            description: "Suggests improments related with wow demos for a given repo",
            prompt: "You are an expert in suggesting wow demos for a given repo"
        }]
    }
);

marked.use(new markedTerminal());

const questions: Array<{
    text: string;
    emoji: string;
    usesMCP?: boolean;
    attachments?: Array<{ type: "file" | "directory"; path: string }>;
}> = [
        { text: "¿Cuál es el último vídeo en el canal de returngis?", emoji: "📹" },
        { text: "Cuál es el último repo que he creado en GitHub?", emoji: "📦" },
        { text: "¿Qué ves en esta imagen?", emoji: "👀", attachments: [{ type: "file" as const, path: "Gis.png" }] },
    ];

async function executeQuestion(question: typeof questions[0]) {
    const spinner = ora(chalk.cyan(`${question.emoji} Procesando: ${question.text}`)).start();

    const response = await session.sendAndWait({
        prompt: question.text,
        ...(question.attachments && { attachments: question.attachments })
    });

    spinner.succeed(chalk.green(`✓ Respuesta recibida`));
    console.log(chalk.bgBlue.white(`\n${"=".repeat(50)}\n${question.emoji} RESPUESTA:\n${"=".repeat(50)}\n`));
    console.log(await marked.parse(response?.data.content || ""));
    console.log(`${"=".repeat(50)}\n`);
}

console.log(chalk.bold.blue("\n=== EJECUTANDO PREGUNTAS ===\n"));
for (const question of questions) {
    await executeQuestion(question);
}

const stopSpinner = ora(chalk.cyan("🛑 Deteniendo cliente...")).start();
await client.stop();
stopSpinner.succeed(chalk.green("Cliente detenido correctamente"));
