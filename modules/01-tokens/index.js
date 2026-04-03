import chalk from 'chalk';
import ora from 'ora';
import {
  clearScreen,
  showHeader,
  showBox,
  showTokenTable,
  showInsight,
  showSuccess,
  showError,
  showCost,
  pause,
  askYesNo,
  getInput,
  showChallenge,
  showStars,
  showStats
} from '../../lib/ui.js';
import { tokenize, countTokens, calculateCost } from '../../lib/tokenizer.js';
import { complete, calculateCompletionCost, initLLM } from '../../lib/llm.js';
import { completeModule } from '../../lib/state.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  // Module header
  showHeader('MODULE 6', 'TOKENS, COST & CONTEXT');

  showBox('',
    `Time: ~40 mins │ Cost: ~$0.15 │ Progress: 6/14\n\n` +
    `Understand the currency of AI (tokens),\n` +
    `why LLMs forget everything, and what it costs you.`
  );

  await pause();

  // Introduction
  await introduction();

  // Interactive exploration
  await interactiveTokenization();

  // Pattern discovery
  await patternDiscovery();

  // Challenge
  await tokenGolfChallenge();

  // The brutal truth about memory (merged from context-memory)
  await theBrutalTruth();

  // Cost explosion
  await costExplosion();

  // Memory strategies
  await memoryStrategies();

  // Summary
  await moduleSummary();

  // Complete module
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(6, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 6 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Tokens are NOT words — spaces are part of tokens\n` +
    `✓ Token count = cost & context limits\n` +
    `✓ LLMs are stateless — no memory between calls\n` +
    `✓ Chat works by resending full conversation\n` +
    `✓ Costs scale with conversation length\n` +
    `✓ Memory strategies: full, sliding, summarization\n\n` +
    `Next up: Embeddings & Semantic Search`
  );

  await pause('Press Enter to continue to Module 7...');
}

async function introduction() {
  clearScreen();
  showHeader('WHAT ARE TOKENS?');

  showBox('',
    `LLMs don't see text the way you do.\n` +
    `They see TOKENS.\n\n` +
    `Let's see what that means...`
  );

  await pause();

  clearScreen();
  showBox('YOUR FIRST TOKENIZATION',
    `Type any sentence below.\n` +
    `We'll show you how an LLM "sees" it.`
  );

  const input = await getInput('Your text:', 'Hello, world!');

  const spinner = ora('Tokenizing...').start();
  await new Promise(resolve => setTimeout(resolve, 800));

  const tokens = await tokenize(input);
  spinner.succeed('Tokenized!');

  console.log('\n');
  showBox('INPUT', input);

  console.log('\n');
  showTokenTable(tokens);

  const cost = calculateCost(tokens.length);
  totalCost += cost;

  console.log(chalk.gray(`Total: ${chalk.yellow(tokens.length + ' tokens')}`));
  showCost(tokens.length);

  showInsight(`Notice: "${tokens[2]?.text || ' world'}" (with space) is ONE token`);

  await pause();
}

async function interactiveTokenization() {
  clearScreen();
  showBox('INTERACTIVE EXPLORATION',
    `Try different inputs to discover patterns.\n` +
    `Type 'done' when you're ready to move on.`
  );

  let attempts = 0;
  const patterns = new Set();

  while (attempts < 10) {
    console.log('');
    const input = await getInput(`Try #${attempts + 1}:`, '');

    if (input.toLowerCase() === 'done') {
      break;
    }

    const spinner = ora('Tokenizing...').start();
    await new Promise(resolve => setTimeout(resolve, 300));

    const tokens = await tokenize(input);
    spinner.stop();

    console.log('\n');
    showTokenTable(tokens);
    console.log(chalk.gray(`Tokens: ${chalk.yellow(tokens.length)}`));
    showCost(tokens.length);

    totalCost += calculateCost(tokens.length);
    attempts++;

    // Track patterns discovered
    if (tokens.some(t => t.text.startsWith(' '))) {
      patterns.add('spaces');
    }
    if (tokens.some(t => /[.,!?]/.test(t.text))) {
      patterns.add('punctuation');
    }
    if (tokens.length === 1 && input.split(' ').length > 1) {
      patterns.add('compound');
    }
  }

  console.log('\n');
  showBox('PATTERNS YOU DISCOVERED',
    Array.from(patterns).map(p => {
      const labels = {
        'spaces': '✓ Spaces are part of tokens',
        'punctuation': '✓ Punctuation usually separate',
        'compound': '✓ Common phrases = single tokens'
      };
      return labels[p] || '✓ Pattern detected';
    }).join('\n') || 'Keep exploring to find patterns!'
  );

  await pause();
}

async function patternDiscovery() {
  clearScreen();
  showBox('KEY INSIGHTS',
    `Let's compare some important cases...`
  );

  await pause();

  const comparisons = [
    ['Hello world', 'Hello, world!'],
    ['AI', 'Artificial Intelligence'],
    ['cat', 'cats'],
    ['New York', 'NewYork']
  ];

  for (const [text1, text2] of comparisons) {
    clearScreen();
    showBox('COMPARISON', `"${text1}" vs "${text2}"`);

    const spinner = ora('Tokenizing both...').start();
    await new Promise(resolve => setTimeout(resolve, 500));

    const tokens1 = await tokenize(text1);
    const tokens2 = await tokenize(text2);
    spinner.stop();

    console.log(chalk.cyan('\nFirst:'));
    showTokenTable(tokens1);
    console.log(chalk.gray(`Tokens: ${tokens1.length}`));

    console.log(chalk.cyan('\nSecond:'));
    showTokenTable(tokens2);
    console.log(chalk.gray(`Tokens: ${tokens2.length}`));

    const diff = tokens2.length - tokens1.length;
    if (diff > 0) {
      showInsight(`Second text uses ${diff} more token(s) → costs more!`);
    } else if (diff < 0) {
      showInsight(`Second text uses ${Math.abs(diff)} fewer token(s) → costs less!`);
    } else {
      showInsight(`Both use same number of tokens!`);
    }

    totalCost += calculateCost(tokens1.length + tokens2.length);

    await pause();
  }
}

async function tokenGolfChallenge() {
  clearScreen();

  const challenges = [
    {
      goal: 'Say "AI is powerful"',
      target: 5,
      par: 3
    },
    {
      goal: 'Express "Hello, how are you?"',
      target: 7,
      par: 4
    },
    {
      goal: 'Write "Artificial Intelligence"',
      target: 4,
      par: 2
    }
  ];

  let totalStars = 0;

  for (const challenge of challenges) {
    clearScreen();
    showChallenge('TOKEN GOLF',
      `Goal: ${challenge.goal}\n` +
      `Target: Use fewer than ${challenge.target} tokens\n` +
      `Par: ${challenge.par} tokens\n\n` +
      `Type your attempt below:`
    );

    const attempt = await getInput('Your attempt:', '');

    const spinner = ora('Checking...').start();
    await new Promise(resolve => setTimeout(resolve, 500));

    const tokens = await tokenize(attempt);
    spinner.stop();

    console.log('\n');
    showTokenTable(tokens);

    const count = tokens.length;
    totalCost += calculateCost(count);

    console.log('\n');
    if (count < challenge.target) {
      showSuccess(`SUCCESS! You used ${count} tokens`);

      const stars = count <= challenge.par ? 3 : count < challenge.target - 1 ? 2 : 1;
      totalStars += stars;

      console.log('');
      showStars(stars);

      if (stars === 3) {
        console.log(chalk.yellow('🏆 PERFECT! Beat par!'));
      }
    } else {
      showError(`Try again! You used ${count} tokens (target: <${challenge.target})`);
      console.log(chalk.gray(`\nHint: Try removing unnecessary words or punctuation\n`));

      // Give them another chance
      const retry = await askYesNo('Try again?');
      if (retry) {
        // Recursively retry this challenge
        continue;
      }
    }

    await pause();
  }

  clearScreen();
  showBox('CHALLENGE COMPLETE',
    `Total stars: ${totalStars}/9\n\n` +
    (totalStars >= 7 ? '🏆 Token Master!' :
     totalStars >= 5 ? '⭐ Great job!' :
     '💪 Keep practicing!')
  );

  await pause();
}

async function theBrutalTruth() {
  clearScreen();
  showHeader('THE BRUTAL TRUTH ABOUT MEMORY');

  showBox('',
    `Pop quiz:\n\n` +
    `You: "My name is Alex"\n` +
    `AI: "Nice to meet you, Alex!"\n\n` +
    `[New API call]\n\n` +
    `You: "What's my name?"\n` +
    `AI: "..."\n\n` +
    `What does the AI say?`
  );

  await pause();

  clearScreen();
  console.log(chalk.cyan('\nLet\'s find out...\n'));

  if (process.env.OPENAI_API_KEY) {
    initLLM(process.env.OPENAI_API_KEY);

    const spinner1 = ora('First call: "My name is Alex"').start();

    const response1 = await complete({
      messages: [{ role: 'user', content: 'My name is Alex' }],
      temperature: 0.7
    });

    spinner1.succeed();
    console.log(chalk.white('AI: ') + chalk.yellow(`"${response1.content}"`));

    const cost1 = calculateCompletionCost(response1.usage);
    totalCost += cost1.totalCost;

    await pause('\nPress Enter for second call...');

    const spinner2 = ora('Second call: "What\'s my name?"').start();

    const response2 = await complete({
      messages: [{ role: 'user', content: "What's my name?" }],
      temperature: 0.7
    });

    spinner2.succeed();
    console.log(chalk.white('AI: ') + chalk.red(`"${response2.content}"`));

    const cost2 = calculateCompletionCost(response2.usage);
    totalCost += cost2.totalCost;
  } else {
    console.log(chalk.white('Call 1: "My name is Alex"'));
    console.log(chalk.yellow('AI: "Nice to meet you, Alex!"'));
    await pause('\nPress Enter for second call...');
    console.log(chalk.white('Call 2: "What\'s my name?"'));
    console.log(chalk.red('AI: "I don\'t know your name. Could you tell me?"'));
  }

  console.log('');
  showBox('THE TRUTH',
    chalk.bold.red('LLMs HAVE NO MEMORY.\n\n') +
    `Each API call is completely isolated.\n` +
    `The second call has NO IDEA about the first.\n\n` +
    `ChatGPT seems to remember because it\n` +
    `RESENDS the entire conversation every time.\n\n` +
    chalk.bold('They are STATELESS.')
  );

  await pause();
}

async function costExplosion() {
  clearScreen();
  showHeader('THE COST EXPLOSION');

  showBox('',
    `Since you resend EVERYTHING each turn,\n` +
    `costs grow with conversation length.\n\n` +
    `Let's calculate what this means...`
  );

  await pause();

  const avgTokensPerTurn = 200;
  const costPerMToken = 0.15;

  console.log('');
  console.log(chalk.cyan('COST PROGRESSION\n'));
  console.log(chalk.gray('Average: 200 tokens/turn, gpt-4o-mini pricing\n'));

  const turns = [1, 5, 10, 25, 50, 100];

  for (const turn of turns) {
    const totalTokens = avgTokensPerTurn * turn;
    const cost = (totalTokens / 1_000_000) * costPerMToken;

    console.log(
      chalk.white(`Turn ${turn.toString().padStart(3)}:`) +
      chalk.gray(` ${totalTokens.toLocaleString().padStart(7)} tokens → `) +
      chalk.yellow(`$${cost.toFixed(4)}`)
    );
  }

  console.log('');

  showBox('THE MATH',
    `Cost per turn INCREASES linearly!\n\n` +
    `Scale to 1,000 users → $150\n` +
    `Scale to 10,000 users → $1,500\n\n` +
    chalk.bold.red('Unoptimized chat is EXPENSIVE.')
  );

  await pause();
}

async function memoryStrategies() {
  clearScreen();
  showHeader('MEMORY STRATEGIES');

  showBox('4 APPROACHES TO HANDLE CONTEXT',
    chalk.bold('1. Full History\n') +
    `   Keep entire conversation. Simple but expensive.\n` +
    `   Best for: <20 turns, customer support\n\n` +
    chalk.bold('2. Sliding Window\n') +
    `   Keep last N messages, drop oldest.\n` +
    `   Constant cost but AI "forgets".\n\n` +
    chalk.bold('3. Summarization\n') +
    `   Compress old messages with LLM.\n` +
    `   Retains key info, extra LLM call.\n\n` +
    chalk.bold('4. Hybrid\n') +
    `   Summary + sliding window + key facts.\n` +
    `   Best for production at scale.`
  );

  await pause();

  clearScreen();
  showBox('RECOMMENDATION',
    chalk.bold('Start with:\n') +
    `  Full history (simple)\n\n` +
    chalk.bold('When it breaks:\n') +
    `  Add sliding window (N=20-30)\n\n` +
    chalk.bold('For production:\n') +
    `  Implement summarization\n\n` +
    chalk.bold('Always:\n') +
    `  • Track token usage\n` +
    `  • Set cost alerts\n` +
    `  • Monitor context limits`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 6 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Concepts learned': '8',
    'Hands-on practice': '✓'
  });

  showBox('KEY TAKEAWAYS',
    `1. Tokens ≠ words (spaces matter!)\n` +
    `2. Token count affects COST and CONTEXT LIMITS\n` +
    `3. Shorter prompts = cheaper + more context space\n` +
    `4. LLMs are stateless — each call is isolated\n` +
    `5. Chat memory = resending full conversation\n` +
    `6. Costs scale linearly with conversation length\n` +
    `7. Use memory strategies to control costs at scale\n\n` +
    `${chalk.bold('Why this matters:')}\n` +
    `When you build AI features, you'll need to:\n` +
    `• Estimate costs before calling APIs\n` +
    `• Fit prompts within context windows\n` +
    `• Manage conversation memory for production`
  );

  await pause();
}
