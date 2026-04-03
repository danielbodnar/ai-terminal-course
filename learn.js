#!/usr/bin/env node

import { config } from 'dotenv';
import chalk from 'chalk';
import { clearScreen, showHeader, showBox, pause, askYesNo, showError } from './lib/ui.js';
import { initOpenAI } from './lib/tokenizer.js';
import { loadState, getProgress, startModule } from './lib/state.js';
import { loginWithGitHub, isAuthenticated, getCurrentUser } from './lib/auth.js';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from home directory or local directory
const homeEnvPath = path.join(os.homedir(), '.ai-terminal-course', '.env');
const localEnvPath = path.join(__dirname, '.env');

if (existsSync(homeEnvPath)) {
  config({ path: homeEnvPath });
} else if (existsSync(localEnvPath)) {
  config({ path: localEnvPath });
} else {
  config(); // Try default locations
}

// Detect demo mode
const DEMO_MODE = !process.env.OPENAI_API_KEY;

async function checkEnvironment() {
  if (DEMO_MODE) {
    clearScreen();
    showBox('DEMO MODE',
      `No API key found. Running in demo mode.\n\n` +
      `You'll see simulated API responses.\n` +
      `To use real APIs, set OPENAI_API_KEY.\n\n` +
      `Demo mode is great for exploring the course.\n` +
      `Real mode (~$10) gives you the full experience.\n\n` +
      `Setup: export OPENAI_API_KEY=sk-your-key-here\n` +
      `  Or:  mkdir -p ~/.ai-terminal-course\n` +
      `       echo "OPENAI_API_KEY=sk-..." > ~/.ai-terminal-course/.env`
    );
    await pause();
  } else {
    // Initialize OpenAI
    initOpenAI(process.env.OPENAI_API_KEY);
  }
}

async function showWelcome() {
  clearScreen();

  showHeader('AI ENGINEERING', 'BOOTCAMP');

  showBox('',
    `From Software Engineer → AI Engineer\n` +
    `Terminal-Only │ 14 Modules │ 30 min/day\n\n` +
    `Learn by DOING, not reading.`
  );

  await pause();
}

async function promptForTracking() {
  // Check if already authenticated
  if (await isAuthenticated()) {
    const user = await getCurrentUser();
    console.log(chalk.dim(`  Tracking progress as ${user.username}`));
    console.log('');
    return true;
  }

  clearScreen();
  showBox('OPTIONAL: TRACK YOUR PROGRESS',
    `Join the global leaderboard! (completely optional)\n\n` +
    `Benefits:\n` +
    `• See how you compare with other engineers\n` +
    `• Get completion certificate\n` +
    `• Track your learning journey\n\n` +
    `What we track:\n` +
    `✓ Module completions & time spent\n` +
    `✓ Your GitHub username (public)\n\n` +
    `What we DON'T track:\n` +
    `✗ Your code or commands\n` +
    `✗ Your API keys\n` +
    `✗ Any private data`
  );

  console.log('');
  const wantsTracking = await askYesNo('Login to start learning AI from terminal?');

  if (wantsTracking) {
    const authData = await loginWithGitHub();

    if (authData) {
      return true;
    }
  } else {
    console.log(chalk.gray('\nNo problem! You can enable tracking later.'));
    console.log(chalk.gray('Your progress will still be saved locally.\n'));
    await pause();
  }

  return false;
}

async function showProgressScreen() {
  clearScreen();

  const progress = await getProgress();

  showBox('YOUR PROGRESS',
    `Modules: ${progress.completed.length}/${progress.total} complete\n` +
    `Progress: ${'█'.repeat(Math.floor(progress.percentage / 5))}${'░'.repeat(20 - Math.floor(progress.percentage / 5))} ${progress.percentage}%\n` +
    `Time: ${Math.floor(progress.totalTime / 60)}h ${progress.totalTime % 60}m\n` +
    `Cost: $${progress.totalCost.toFixed(2)}\n` +
    `Streak: ${progress.streak} day${progress.streak !== 1 ? 's' : ''} ${progress.streak > 0 ? '🔥' : ''}`
  );

  console.log('');

  if (progress.current === 0) {
    console.log(chalk.yellow('Start with Module 1: Your First LLM Call'));
  } else if (progress.completed.includes(progress.current - 1)) {
    console.log(chalk.green(`✓ Last completed: Module ${progress.current - 1}`));
    console.log(chalk.yellow(`\nContinue to Module ${progress.current}`));
  } else {
    console.log(chalk.yellow(`Resume: Module ${progress.current}`));
  }

  console.log('');
}

async function runModule(moduleNumber) {
  const moduleNames = {
    1: '02-llm-call',
    2: '08-prompt-engineering',
    3: '03-streaming',
    4: '06-structured-outputs',
    5: '07-tool-calling',
    6: '01-tokens',              // merged with 05-context-memory
    7: '04-embeddings',
    8: '09-rag-basics',          // merged with 10-chunking-strategies
    9: '14-agentic-patterns',
    10: '13-evals-testing',
    11: '17-guardrails-safety',
    12: '12-cost-optimization',  // merged with 18-semantic-caching
    13: '11-observability',      // merged with 19-production-monitoring
    14: '20-capstone'
  };

  const moduleName = moduleNames[moduleNumber];
  if (!moduleName) {
    showError(`Module ${moduleNumber} not available!`);
    console.log(chalk.gray(`Available modules: 1-14`));
    process.exit(1);
  }

  const modulePath = path.join(__dirname, 'modules', moduleName, 'index.js');

  try {
    await fs.access(modulePath);
  } catch {
    showError(`Module ${moduleNumber} not implemented yet!`);
    console.log(chalk.gray(`Available modules: 1-14`));
    process.exit(1);
  }

  // Track module start
  await startModule(moduleNumber);

  const module = await import(modulePath);
  await module.runModule();
}

async function main() {
  try {
    await checkEnvironment();

    const args = process.argv.slice(2);

    if (args.length > 0) {
      // If it's a number, try to run the module
      const moduleNum = parseInt(args[0]);
      if (!isNaN(moduleNum)) {
        if (moduleNum < 1 || moduleNum > 14) {
          showError('Invalid module number!');
          console.log(chalk.gray('Usage: npm start [module-number]'));
          console.log(chalk.gray('Example: npm start 1'));
          process.exit(1);
        }

        await runModule(moduleNum);
        return;
      }
    }

    // Check if first time
    const state = await loadState();
    const isFirstTime = state.completedModules.length === 0;

    if (isFirstTime) {
      await showWelcome();

      // Prompt for optional tracking
      await promptForTracking();

      clearScreen();
      showBox('BEFORE WE BEGIN',
        `This bootcamp is different:\n\n` +
        `• No videos to watch\n` +
        `• No markdown to read\n` +
        `• Just you and the terminal\n\n` +
        `You'll TYPE every command.\n` +
        `You'll SEE real API responses.\n` +
        `You'll BUILD real tools.\n\n` +
        `Each module takes ~30 minutes.\n` +
        (DEMO_MODE
          ? `Running in DEMO MODE (simulated responses).`
          : `Total cost: ~$10 in API calls.`)
      );

      await pause();

      const ready = await askYesNo('Ready to start Module 1?');

      if (!ready) {
        console.log(chalk.yellow('\nNo problem! Run again when ready.'));
        console.log(chalk.gray('Command: npm start'));
        process.exit(0);
      }

      await runModule(1);
    } else {
      // Check if user is authenticated
      if (await isAuthenticated()) {
        const user = await getCurrentUser();
        console.log(chalk.dim(`Welcome back, ${user.username}!`));
      }

      await showProgressScreen();

      const progress = await getProgress();
      const continueModule = await askYesNo(`Continue to Module ${progress.current}?`);

      if (continueModule) {
        await runModule(progress.current);
      } else {
        console.log(chalk.yellow('\nTo start a specific module:'));
        console.log(chalk.gray('npm start <module-number>'));
      }
    }

  } catch (error) {
    console.error(chalk.red('\nError:'), error.message);
    process.exit(1);
  }
}

main();
