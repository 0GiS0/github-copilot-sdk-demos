import { CopilotClient } from "@github/copilot-sdk";
import * as readline from "readline";
import chalk from "chalk";

const COPILOT_URL = "localhost:8080";

const client = new CopilotClient({
  cliUrl: COPILOT_URL,
});

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

console.log();
console.log(chalk.cyan("╔════════════════════════════════════════╗"));
console.log(chalk.cyan("║     🚀 GitHub Copilot CLI Chat         ║"));
console.log(chalk.cyan("╚════════════════════════════════════════╝"));
console.log();
console.log(chalk.dim(`Connected to: ${chalk.cyan(COPILOT_URL)}`));
console.log();
console.log(chalk.dim("Type your message and press Enter to chat."));
console.log(chalk.dim("Type 'exit' or press Ctrl+C to quit.\n"));

const session = await client.createSession();

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

  console.log(
    chalk.magenta.bold("🤖 Copilot: ") + `${response?.data.content}\n`,
  );
}

console.log();
console.log(chalk.dim("👋 Goodbye!\n"));
rl.close();
await client.stop();
