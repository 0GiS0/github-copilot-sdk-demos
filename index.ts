import { CopilotClient } from "@github/copilot-sdk";
import * as readline from "readline";
import chalk from "chalk";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";

const COPILOT_URL = "copilot-cli-server:4321";

// Configure marked for terminal output with colors
marked.use(markedTerminal());

// Spinner for thinking animation
const spinner = {
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  interval: 80,
  currentFrame: 0,
  timer: null as NodeJS.Timeout | null,

  start(message: string) {
    this.currentFrame = 0;
    process.stdout.write(chalk.yellow(`${this.frames[0]} ${message}`));
    this.timer = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      process.stdout.write(
        `\r${chalk.yellow(`${this.frames[this.currentFrame]} ${message}`)}`,
      );
    }, this.interval);
  },

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    process.stdout.write("\r\x1b[K"); // Clear line
  },
};

(async () => {
  console.log();
  console.log(chalk.cyan("╔════════════════════════════════════════╗"));
  console.log(chalk.cyan("║     🚀 GitHub Copilot CLI Chat         ║"));
  console.log(chalk.cyan("╚════════════════════════════════════════╝"));
  console.log();

  const client = new CopilotClient({
    cliUrl: COPILOT_URL,
  });

  // Display client information
  console.log(chalk.green("🔌 Client Information:"));
  console.log(chalk.dim(`  URL: ${chalk.green(COPILOT_URL)}`));
  console.log();

  const session = await client.createSession({
    systemMessage: {
      content: `
You are a helpful assistant working in a remote environment. The user cannot see files you create or modify directly. Therefore, when the user asks you to create or modify anything, you MUST:

1. Always provide the complete content/code in your response
2. Use markdown formatting (code blocks, lists, etc.) to make it clear and readable
3. Never just say "I've created the file" or "I've modified it" - show the actual content
4. Include explanations of what you created or changed
5. If asked to create multiple files, show the content of each one

Be direct and show the work, not just confirmations.`
    },
  });

  // Display session information
  console.log(chalk.blue("📋 Session Information:"));
  if (session.sessionId) {
    console.log(chalk.dim(`  Session ID: ${chalk.blue(session.sessionId)}`));
  }
  console.log();
  console.log(chalk.dim("Type your message and press Enter to chat."));
  console.log(chalk.dim("Type 'exit' or press Ctrl+C to quit.\n"));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
  };

  while (true) {
    const prompt = await askQuestion(chalk.green.bold("You: "));

    if (!prompt.trim()) {
      continue;
    }

    if (prompt.toLowerCase() === "exit") {
      break;
    }

    console.log();
    spinner.start("Thinking...");
    const response = await session.sendAndWait({ prompt });
    spinner.stop();

    const renderedContent = await marked(response?.data.content || "");
    console.log(chalk.magenta.bold("🤖 Copilot:"));
    console.log(renderedContent);
  }

  console.log();
  console.log(chalk.dim("👋 Goodbye!\n"));
  rl.close();
  await client.stop();
})();
