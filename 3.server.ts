/**
 * 🖥️ GitHub Copilot CLI Server Mode Demo
 *
 * 📝 Este script demuestra cómo usar el GitHub Copilot SDK en modo servidor.
 * En este modo, el cliente se conecta a un servidor Copilot CLI que corre
 * como un proceso separado (normalmente en Docker o localmente).
 *
 * 🔑 Diferencias con el modo normal:
 * - El cliente se conecta a una URL en vez de usar la autenticación directa
 * - Útil para entornos donde no tienes acceso directo al token de GitHub
 * - Permite compartir una instancia del servidor entre múltiples clientes
  
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🔐 VALIDACIÓN DE ENTORNO
// ═══════════════════════════════════════════════════════════════════════════
// 📝 NOTA: Este script usa modo servidor, así que el token está en el servidor,
// pero aún así validamos que el servidor esté configurado correctamente.

import { CopilotClient } from "@github/copilot-sdk"; // 🤖 Cliente del SDK de Copilot
import * as readline from "readline"; // ⌨️ Para leer entrada del usuario en la terminal
import chalk from "chalk"; // 🎨 Colores bonitos para la terminal
import { marked } from "marked"; // 📄 Parser de Markdown
import { markedTerminal } from "marked-terminal"; // 🖥️ Renderiza Markdown en la terminal
import ora from "ora"; // 🔄 Spinners animados para mostrar que estamos esperando

// 🌐 URL del servidor Copilot CLI (Docker o local)
// ⚠️ Para esta demo necesitas el Dev Container si o si o bien ejecutarlo dentro de un contenedor de Docker y ajustar la url a localhost y el puerto adecuado
const COPILOT_URL = "copilot-cli-server:4321";

// 🎨 Configura marked para renderizar Markdown con colores en la terminal
marked.use(markedTerminal() as any);

// 🚀 Función principal auto-ejecutable (IIFE async)
(async () => {
  // 🎉 Banner de bienvenida
  console.log();
  console.log(chalk.cyan("╔════════════════════════════════════════╗"));
  console.log(chalk.cyan("║   🚀 Remote GitHub Copilot CLI Chat    ║"));
  console.log(chalk.cyan("╚════════════════════════════════════════╝"));
  console.log();

  // 🔧 Crea el cliente de Copilot apuntando al servidor remoto
  // 📡 A diferencia del modo normal, aquí usamos cliUrl en vez de logLevel
  const client = new CopilotClient({
    cliUrl: COPILOT_URL, // 🎯 Conexión al servidor CLI
  });

  // 📊 Muestra información del cliente conectado
  console.log(chalk.green("🔌 Información del Cliente:"));
  console.log(chalk.dim(`  URL: ${chalk.green(COPILOT_URL)}`));
  console.log();

  // 🧵 Crea una sesión de chat con streaming habilitado
  // 💡 streaming: true permite recibir la respuesta token por token
  const session = await client.createSession({
    model: "gpt-5-mini", // 🧠 Modelo a usar
    streaming: true, // ⚡ Habilita respuestas en tiempo real (token a token)
    systemMessage: {
      // 🧠 Mensaje del sistema que define el comportamiento del asistente
      content: `
You are a helpful assistant working in a remote environment. The user cannot see files you create or modify directly. Therefore, when the user asks you to create or modify anything, you MUST:

1. Always provide the complete content/code in your response
2. Use markdown formatting (code blocks, lists, etc.) to make it clear and readable
3. Never just say "I've created the file" or "I've modified it" - show the actual content
4. Include explanations of what you created or changed
5. If asked to create multiple files, show the content of each one

Be direct and show the work, not just confirmations.`,
    },
  });

  // 📋 Muestra información de la sesión creada
  console.log(chalk.blue("📋 Información de la Sesión:"));
  if (session.sessionId) {
    // 🆔 El sessionId permite retomar la conversación más tarde
    console.log(chalk.dim(`  Session ID: ${chalk.blue(session.sessionId)}`));
  }
  console.log();
  console.log(chalk.dim("Escribe tu mensaje y presiona Enter para chatear."));
  console.log(chalk.dim("Escribe 'exit' o presiona Ctrl+C para salir.\n"));

  // ⌨️ Configura readline para leer entrada del usuario
  const rl = readline.createInterface({
    input: process.stdin, // 📥 Lee del stdin
    output: process.stdout, // 📤 Escribe al stdout
  });

  // 🎁 Helper: Promisifica readline.question para usar con async/await
  const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
  };

  // � Variables de estado para el streaming (compartidas entre iteraciones)
  let fullContent = "";
  let responseStarted = false;
  let spinner: ReturnType<typeof ora> | null = null;
  let resolveResponse: (() => void) | null = null;

  // 🎧 Registra el listener UNA sola vez fuera del loop
  session.on((event) => {
    if (event.type === "assistant.message_delta") {
      // 📨 Evento: Llegó un chunk de la respuesta (streaming)
      if (spinner?.isSpinning) {
        spinner.succeed(chalk.green("✓ Respuesta recibida"));
        responseStarted = true;
      }
      // 🏷️ Muestra el header solo la primera vez
      if (fullContent === "") {
        console.log(chalk.magenta.bold("🤖 Copilot:"));
      }
      // ✍️ Escribe el chunk directamente (sin salto de línea)
      process.stdout.write(event.data.deltaContent);
      fullContent += event.data.deltaContent;
    } else if (event.type === "assistant.message") {
      // ✅ Evento: La respuesta está completa
      if (!responseStarted && spinner?.isSpinning) {
        spinner.succeed(chalk.green("✓ Respuesta recibida"));
      }
      console.log();
      // 🎬 Resolvemos la Promise para continuar con el loop
      if (resolveResponse) {
        resolveResponse();
        resolveResponse = null;
      }
    }
  });

  // 🔁 Loop principal del chat - se ejecuta hasta que el usuario escriba "exit"
  while (true) {
    // ❓ Pide input al usuario
    const prompt = await askQuestion(chalk.green.bold("You: "));

    // ⏭️ Si el usuario presiona Enter sin escribir nada, continúa
    if (!prompt.trim()) {
      continue;
    }

    // 🚪 Si el usuario escribe "exit", sale del loop
    if (prompt.toLowerCase() === "exit") {
      break;
    }

    console.log();

    // 🔄 Reinicia el estado para la nueva respuesta
    fullContent = "";
    responseStarted = false;

    // 🔄 Muestra un spinner mientras esperamos la respuesta
    spinner = ora({
      text: chalk.cyan("🤔 Pensando..."),
      stream: process.stdout,
      discardStdin: false,
      hideCursor: false,
    }).start();

    // 💡 Creamos una Promise que se resolverá cuando llegue el evento assistant.message
    const done = new Promise<void>((resolve) => {
      resolveResponse = resolve;

      // ⏱️ Timeout de seguridad: si no recibimos respuesta en 5 minutos, forzamos la salida
      setTimeout(() => {
        if (spinner?.isSpinning) {
          spinner.fail(chalk.red("Timeout esperando respuesta"));
        }
        if (resolveResponse) {
          resolveResponse();
          resolveResponse = null;
        }
      }, 300000);
    });

    // 📤 Envía el prompt al servidor (no esperamos respuesta directa)
    try {
      await session.send({ prompt });
      // ⏳ Espera a que termine el streaming completo
      await done;
    } catch (error: any) {
      if (spinner?.isSpinning) {
        // 🚨 Clasificamos el error para dar mejor feedback al usuario
        if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
          spinner.fail(chalk.red("❌ Error de conexión: No se pudo conectar al servidor"));
          console.error(chalk.yellow("   💡 Verifica que el servidor Copilot esté corriendo en: " + COPILOT_URL));
        } else if (error?.message?.includes('timeout') || error?.message?.includes('ETIMEDOUT')) {
          spinner.fail(chalk.red("⚠️ Timeout: El servidor tardó demasiado en responder"));
          console.error(chalk.yellow("   💡 Intenta con un prompt más corto o verifica la conexión"));
        } else if (error?.status === 401 || error?.message?.includes('unauthorized')) {
          spinner.fail(chalk.red("🔒 Error de autenticación: Token inválido o expirado"));
          console.error(chalk.yellow("   💡 Verifica que el servidor tenga un token de GitHub válido"));
        } else if (error?.status === 429 || error?.message?.includes('rate limit')) {
          spinner.fail(chalk.red("🚫 Rate limit: Demasiadas peticiones"));
          console.error(chalk.yellow("   💡 Espera unos minutos antes de continuar"));
        } else {
          spinner.fail(chalk.red("❌ Error al procesar la petición"));
        }
      }
      console.error(chalk.dim("   Detalles:"), error?.message || error);
    }
  }

  // 👋 Mensaje de despedida
  console.log();
  console.log(chalk.dim("👋 ¡Hasta luego!\n"));

  // 🧹 Limpieza: cierra readline y detiene el cliente
  rl.close();
  await client.stop();
})();
