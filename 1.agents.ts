import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { CopilotClient, defineTool } from "@github/copilot-sdk";

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

        console.log('Ejecutada la tool')

        let videos = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`);
        return videos;
    },
})



const session = await client.createSession(
    {
        systemMessage: {
            content: `Eres un asistente que me ayuda a buscar vídeos en el canal de YouTube de returngis. Como parte de la respuesta debes incluir la fecha actual.
            Para preguntas relacioandas con GitHub usa el MCP Server` },
        model: "claude-opus-4.5",
        streaming: true,
        tools: [getDate, getYouTubeRSSFeed],
        mcpServers: {
            github: {
                type: "http",
                url: "https://api.githubcopilot.com/mcp/",

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

let response = await session.sendAndWait({ prompt: "¿Cuál es el último vídeo en el canal de returngis?" });
console.log(response?.data.content);

response = await session.sendAndWait({ prompt: "Cuál es el último repo que he creado?" });
console.log(response?.data.content);


await client.stop();
