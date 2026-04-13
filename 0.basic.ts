// 📦 Importa el cliente del SDK de Copilot
import { approveAll, CopilotClient } from "@github/copilot-sdk";
// ⏱️ Spinner visual para esperas
import ora from "ora";

// 🧼 Normaliza prompts a una línea (visual friendly)
const formatPromptInline = (prompt: string) => prompt.replace(/\s+/g, " ").trim();

// 🛠️ Inicializa el cliente con logging detallado
const copilotClient = new CopilotClient({ logLevel: "all" });

// 🚀 Crea una sesión con el modelo seleccionado
// Modelos disponibles (si tuvieras habilitados todos):
// - gpt-4.1 (x0)
// - gpt-5-mini (x0)
// - claude-sonnet-4.5 (1x)
// - claude-haiku-4.5 (0.33x)
// - claude-opus-4.5 (3x)
// - claude-sonnet-4 (1x)
// - etc
const copilotSession = await copilotClient.createSession({ model: "gpt-5.2", onPermissionRequest: approveAll });

// Con el Id de la sesión podemos continuar la conversación más adelante o en otro proceso.
const copilotSessionId = copilotSession.sessionId; // 🧾 Guarda el ID para retomar luego
console.log(`🆔 Sesión creada con ID: ${copilotSession.sessionId}`);

// 🧮 Envía un prompt sencillo y espera la respuesta
const initialPrompt = `¿Cuál sería la estructura recomendada para un proyecto web en Spring Boot? 
        Pintamelo en formato tree y añade un comentario al lado de cada carpeta y archivo 
        con un emoji que represente su función.`;
const initialPromptSpinner = ora({ text: `⏳ Esperando respuesta para: "${formatPromptInline(initialPrompt)}"`, spinner: "dots" }).start();
const initialResponse = await copilotSession.sendAndWait({ prompt: initialPrompt });
initialPromptSpinner.succeed(`✅ Respuesta recibida para: "${formatPromptInline(initialPrompt)}"`);

// 🖨️ Muestra el contenido de la respuesta (si existe)
console.log("🧠 Respuesta:", initialResponse?.data.content);

// 📴 Detiene el cliente para liberar recursos
await copilotClient.stop();


// 🔄 Para confirmar que podemos retomar la conversación más adelante
const resumedCopilotClient = new CopilotClient({ logLevel: "all" });
const resumedCopilotSession = await resumedCopilotClient.resumeSession(copilotSessionId, { onPermissionRequest: approveAll });

const recapPrompt = `¿De qué habíamos hablado?`;
const recapPromptSpinner = ora({ text: `⏳ Retomando conversación: "${formatPromptInline(recapPrompt)}"`, spinner: "dots" }).start();
const recapResponse = await resumedCopilotSession.sendAndWait({ prompt: recapPrompt });
recapPromptSpinner.succeed(`✅ Respuesta retomada: "${formatPromptInline(recapPrompt)}"`);
console.log("🧠 Respuesta retomada:", recapResponse?.data.content);

// ✅ Finaliza el proceso explícitamente
process.exit(0);