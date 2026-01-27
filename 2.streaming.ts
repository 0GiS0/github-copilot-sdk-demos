/**
 * ⚡ Demo de Streaming con GitHub Copilot SDK
 * 
 * 📚 PROPÓSITO EDUCATIVO:
 * Este script demuestra cómo recibir respuestas del modelo token a token
 * en tiempo real, en lugar de esperar a que la respuesta completa esté lista.
 * 
 * 🎯 CONCEPTOS CLAVE:
 * - Streaming: Recibir datos progresivamente mientras se generan
 * - Eventos: El SDK emite eventos para cada fragmento de respuesta
 * - UX mejorada: El usuario ve la respuesta "escribiéndose" en tiempo real
 * 
 * 💡 CUÁNDO USAR STREAMING:
 * - Respuestas largas donde quieres feedback inmediato
 * - Interfaces de chat donde la experiencia importa
 * - Cuando no necesitas procesar la respuesta completa antes de mostrarla
 * 
 * 🔄 COMPARACIÓN CON 0.basic.ts:
 * - 0.basic.ts usa sendAndWait() → Espera respuesta completa
 * - Este archivo usa send() + eventos → Recibe token a token
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🔐 VALIDACIÓN DE ENTORNO
// ═══════════════════════════════════════════════════════════════════════════

if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    console.error("\n❌ ERROR: No se encontró token de GitHub");
    console.error("\n📋 Para solucionar esto, configura una de estas variables de entorno:");
    console.error("   • GH_TOKEN=tu_token_aqui");
    console.error("   • GITHUB_TOKEN=tu_token_aqui");
    console.error("\n💡 Puedes obtener un token en: https://github.com/settings/tokens");
    console.error("   Asegúrate de que tenga el scope 'copilot'\n");
    process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 IMPORTACIONES
// ═══════════════════════════════════════════════════════════════════════════

import { CopilotClient } from "@github/copilot-sdk";
import chalk from "chalk";
import ora from "ora";

// ═══════════════════════════════════════════════════════════════════════════
// ⚙️ CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

// 🧠 Modelo a utilizar (puedes cambiarlo según tu suscripción)
const MODEL_NAME = "gpt-5.2";

// 📝 Prompt de ejemplo para demostrar streaming
// Usamos uno que genere una respuesta larga para ver bien el efecto
const DEMO_PROMPT = `Explícame brevemente qué es el streaming en APIs de IA 
y por qué es útil. Incluye un ejemplo simple en pseudocódigo.`;

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 FUNCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
    // 🎉 Banner de bienvenida
    console.log();
    console.log(chalk.cyan("╔════════════════════════════════════════════════════════════╗"));
    console.log(chalk.cyan("║        ⚡ Demo de Streaming - GitHub Copilot SDK           ║"));
    console.log(chalk.cyan("╚════════════════════════════════════════════════════════════╝"));
    console.log();

    // ─────────────────────────────────────────────────────────────────────────
    // PASO 1: Crear el cliente de Copilot
    // ─────────────────────────────────────────────────────────────────────────
    console.log(chalk.yellow("📦 Paso 1: Creando cliente de Copilot..."));

    const client = new CopilotClient({
        logLevel: "warning"  // Menos verbose que "all" para esta demo
    });

    console.log(chalk.green("   ✅ Cliente creado\n"));

    // ─────────────────────────────────────────────────────────────────────────
    // PASO 2: Crear sesión CON streaming habilitado
    // ─────────────────────────────────────────────────────────────────────────
    console.log(chalk.yellow("🔧 Paso 2: Creando sesión con streaming habilitado..."));

    const session = await client.createSession({
        model: MODEL_NAME,
        streaming: true,  // ⚡ CLAVE: Habilita el modo streaming
    });

    console.log(chalk.green(`   ✅ Sesión creada (ID: ${session.sessionId})`));
    console.log(chalk.dim(`   📊 Modelo: ${MODEL_NAME}`));
    console.log(chalk.dim(`   ⚡ Streaming: Habilitado\n`));

    // ─────────────────────────────────────────────────────────────────────────
    // PASO 3: Registrar listeners de eventos ANTES de enviar
    // ─────────────────────────────────────────────────────────────────────────
    console.log(chalk.yellow("🎧 Paso 3: Registrando listeners de eventos...\n"));

    // 📊 Variables para estadísticas educativas
    let tokenCount = 0;
    let startTime: number;
    let firstTokenTime: number | null = null;
    let fullContent = "";

    // 🔄 Promise que se resuelve cuando la respuesta está completa
    let resolveResponse: () => void;
    const responseComplete = new Promise<void>((resolve) => {
        resolveResponse = resolve;
    });

    /**
     * 🎧 Registramos el listener de eventos
     * 
     * El SDK emite diferentes tipos de eventos:
     * - "assistant.message_delta" → Llegó un nuevo fragmento (token)
     * - "assistant.message"       → La respuesta está completa
     * - "error"                   → Ocurrió un error
     */
    session.on((event) => {
        // ─────────────────────────────────────────────────────────────────
        // 📨 EVENTO: Nuevo fragmento de respuesta (streaming)
        // ─────────────────────────────────────────────────────────────────
        if (event.type === "assistant.message_delta") {
            // 📏 Medimos el tiempo hasta el primer token (TTFT)
            if (firstTokenTime === null) {
                firstTokenTime = Date.now();
                const ttft = firstTokenTime - startTime;
                console.log(chalk.dim(`\n   ⏱️  Tiempo hasta primer token (TTFT): ${ttft}ms\n`));
                console.log(chalk.magenta.bold("🤖 Respuesta (streaming):"));
                console.log(chalk.dim("─".repeat(60)));
            }

            // ✍️ Escribimos el fragmento directamente (sin salto de línea)
            // Esto crea el efecto de "escritura en tiempo real"
            const delta = event.data.deltaContent;
            process.stdout.write(chalk.white(delta));

            // 📊 Actualizamos estadísticas
            fullContent += delta;
            tokenCount++;
        }

        // ─────────────────────────────────────────────────────────────────
        // ✅ EVENTO: Respuesta completa
        // ─────────────────────────────────────────────────────────────────
        else if (event.type === "assistant.message") {
            console.log(); // Salto de línea final
            console.log(chalk.dim("─".repeat(60)));
            resolveResponse(); // Continuamos con el flujo principal
        }

        // ─────────────────────────────────────────────────────────────────
        // ❌ EVENTO: Error de sesión
        // ─────────────────────────────────────────────────────────────────
        else if (event.type === "session.error") {
            console.error(chalk.red("\n❌ Error durante streaming:"), event);
            resolveResponse();
        }
    });

    console.log(chalk.green("   ✅ Listeners registrados"));
    console.log(chalk.dim("   📝 Eventos monitoreados: assistant.message_delta, assistant.message\n"));

    // ─────────────────────────────────────────────────────────────────────────
    // PASO 4: Enviar el prompt (sin esperar respuesta completa)
    // ─────────────────────────────────────────────────────────────────────────
    console.log(chalk.yellow("📤 Paso 4: Enviando prompt..."));
    console.log(chalk.dim(`   💬 "${DEMO_PROMPT.replace(/\s+/g, ' ').trim()}"\n`));

    const spinner = ora({
        text: chalk.cyan("🤔 Esperando respuesta del modelo..."),
        stream: process.stdout,
    }).start();

    startTime = Date.now();

    /**
     * 🔑 DIFERENCIA CLAVE CON sendAndWait():
     * 
     * - sendAndWait(): Bloquea hasta tener la respuesta COMPLETA
     * - send(): Envía y retorna inmediatamente, la respuesta llega por eventos
     * 
     * Con send() + eventos obtenemos streaming real
     */
    await session.send({ prompt: DEMO_PROMPT });

    spinner.stop(); // Paramos el spinner cuando empiezan a llegar tokens

    // ─────────────────────────────────────────────────────────────────────────
    // PASO 5: Esperar a que termine el streaming
    // ─────────────────────────────────────────────────────────────────────────
    await responseComplete;

    const totalTime = Date.now() - startTime;

    // ─────────────────────────────────────────────────────────────────────────
    // PASO 6: Mostrar estadísticas educativas
    // ─────────────────────────────────────────────────────────────────────────
    console.log();
    console.log(chalk.cyan("╔════════════════════════════════════════════════════════════╗"));
    console.log(chalk.cyan("║                    📊 ESTADÍSTICAS                         ║"));
    console.log(chalk.cyan("╚════════════════════════════════════════════════════════════╝"));
    console.log();
    console.log(chalk.white(`   📝 Fragmentos recibidos:     ${tokenCount}`));
    console.log(chalk.white(`   📏 Caracteres totales:       ${fullContent.length}`));
    console.log(chalk.white(`   ⏱️  Tiempo total:             ${totalTime}ms`));
    if (firstTokenTime) {
        console.log(chalk.white(`   ⚡ TTFT (Time To First Token): ${firstTokenTime - startTime}ms`));
        console.log(chalk.white(`   📈 Velocidad promedio:        ${Math.round(fullContent.length / (totalTime / 1000))} chars/s`));
    }
    console.log();

    // ─────────────────────────────────────────────────────────────────────────
    // PASO 7: Limpieza
    // ─────────────────────────────────────────────────────────────────────────
    console.log(chalk.yellow("🧹 Limpiando recursos..."));
    await client.stop();
    console.log(chalk.green("   ✅ Cliente detenido correctamente\n"));

    console.log(chalk.dim("💡 Tip: Compara este script con 0.basic.ts para ver la diferencia"));
    console.log(chalk.dim("   entre streaming (send + eventos) y espera completa (sendAndWait)\n"));
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏃 EJECUCIÓN
// ═══════════════════════════════════════════════════════════════════════════

main().catch((error) => {
    console.error(chalk.red("\n❌ Error en la ejecución:"), error);
    process.exit(1);
});
