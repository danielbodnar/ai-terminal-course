import chalk from 'chalk';
import ora from 'ora';
import {
  clearScreen,
  showHeader,
  showBox,
  showInsight,
  showSuccess,
  showError,
  pause,
  askYesNo,
  getInput,
  showStats
} from '../../lib/ui.js';
import {
  complete,
  streamComplete,
  calculateCompletionCost,
  initLLM
} from '../../lib/llm.js';
import { completeModule } from '../../lib/state.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  // Initialize LLM client
  initLLM(process.env.OPENAI_API_KEY);

  // Module header
  showHeader('MODULE 1', 'YOUR FIRST LLM CALL');

  showBox('',
    `Time: ~30 mins │ Cost: ~$0.10 │ Progress: 1/14\n\n` +
    `You're about to make REAL API calls.\n` +
    `See exactly how LLMs work under the hood.`
  );

  await pause();

  // Introduction
  await introduction();

  // First API call
  await firstAPICall();

  // Understanding the response
  await understandingResponse();

  // Parameter playground
  await parameterPlayground();

  // Non-determinism demo
  await nonDeterminismDemo();

  // System prompts
  await systemPrompts();

  // Summary
  await moduleSummary();

  // Complete module
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(1, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 1 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ How to structure LLM API requests\n` +
    `✓ Request/response anatomy\n` +
    `✓ Temperature, max_tokens, and other parameters\n` +
    `✓ Why LLMs are non-deterministic\n` +
    `✓ System prompts vs user prompts\n\n` +
    `Next up: Prompt Engineering`
  );

  await pause('Press Enter to continue to Module 2...');
}

async function introduction() {
  clearScreen();
  showHeader('THE ANATOMY OF AN LLM CALL');

  showBox('',
    `An LLM API call has 3 parts:\n\n` +
    `1. MODEL - Which AI to use (gpt-4, claude, etc)\n` +
    `2. MESSAGES - The conversation history\n` +
    `3. PARAMETERS - How it should respond\n\n` +
    `Let's build one from scratch...`
  );

  await pause();
}

async function firstAPICall() {
  clearScreen();
  showBox('YOUR FIRST CALL', 'We\'ll send the simplest possible request');

  console.log('');
  console.log(chalk.cyan('REQUEST STRUCTURE:'));
  console.log('');

  const requestStructure = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: 'Say hello in 5 words'
      }
    ],
    temperature: 0.7
  };

  console.log(chalk.gray(JSON.stringify(requestStructure, null, 2)));
  console.log('');

  showInsight('This is what gets sent to OpenAI\'s servers');

  const ready = await askYesNo('Ready to execute this call?');

  if (!ready) {
    console.log(chalk.yellow('\nNo problem, let\'s continue when you\'re ready...'));
    await pause();
  }

  clearScreen();
  const spinner = ora('Calling OpenAI API...').start();

  try {
    const response = await complete({
      messages: [
        { role: 'user', content: 'Say hello in 5 words' }
      ],
      temperature: 0.7
    });

    spinner.succeed('Response received!');

    console.log('');
    showBox('RESPONSE', response.content);

    const cost = calculateCompletionCost(response.usage);
    totalCost += cost.totalCost;

    console.log('');
    showStats({
      'Model': response.model,
      'Tokens In': response.usage.promptTokens,
      'Tokens Out': response.usage.completionTokens,
      'Cost': `$${cost.totalCost.toFixed(6)}`,
      'Latency': `${response.latency}ms`
    });

    showInsight('You just made your first LLM API call!');

    await pause();

  } catch (error) {
    spinner.fail('API call failed!');
    showError(error.message);
    await pause();
  }
}

async function understandingResponse() {
  clearScreen();
  showBox('NOW YOU TRY', 'Type your own prompt and see the response');

  console.log('');
  const userPrompt = await getInput('Your prompt:', 'Explain AI in one sentence');

  const spinner = ora('Calling API...').start();

  const response = await complete({
    messages: [
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7
  });

  spinner.stop();

  console.log('');
  showBox('AI RESPONSE', response.content);

  const cost = calculateCompletionCost(response.usage);
  totalCost += cost.totalCost;

  console.log('');
  showBox('UNDER THE HOOD',
    `Your prompt: ${response.usage.promptTokens} tokens ($${cost.inputCost.toFixed(6)})\n` +
    `AI response: ${response.usage.completionTokens} tokens ($${cost.outputCost.toFixed(6)})\n` +
    `Total: $${cost.totalCost.toFixed(6)}\n` +
    `Time: ${response.latency}ms`
  );

  showInsight('Output tokens cost MORE than input tokens (4x for gpt-4o-mini)');

  await pause();

  // Let them try a few more
  const tryMore = await askYesNo('Try another prompt?');

  if (tryMore) {
    await understandingResponse();
  }
}

async function parameterPlayground() {
  clearScreen();
  showHeader('PARAMETER PLAYGROUND');

  showBox('',
    `LLMs have knobs you can turn:\n\n` +
    `• TEMPERATURE: 0 = deterministic, 2 = chaotic\n` +
    `• MAX_TOKENS: Limit response length\n` +
    `• TOP_P: Alternative to temperature\n` +
    `• FREQUENCY_PENALTY: Reduce repetition\n\n` +
    `Let's experiment...`
  );

  await pause();

  // Temperature experiment
  await temperatureExperiment();

  // Max tokens experiment
  await maxTokensExperiment();
}

async function temperatureExperiment() {
  clearScreen();
  showBox('TEMPERATURE SLIDER',
    `Same prompt, different temperatures.\n` +
    `Watch how creativity changes...`
  );

  console.log('');

  const prompt = 'Name a color';
  const temperatures = [0.0, 0.5, 1.0, 1.5, 2.0];

  for (const temp of temperatures) {
    console.log(chalk.cyan(`\nTemperature: ${temp.toFixed(1)}`));
    console.log(chalk.gray('─'.repeat(40)));

    const results = [];

    for (let i = 0; i < 3; i++) {
      const spinner = ora(`Run ${i + 1}/3...`).start();

      const response = await complete({
        messages: [{ role: 'user', content: prompt }],
        temperature: temp,
        maxTokens: 10
      });

      spinner.stop();

      results.push(response.content.trim());

      const cost = calculateCompletionCost(response.usage);
      totalCost += cost.totalCost;
    }

    results.forEach((result, idx) => {
      console.log(chalk.yellow(`  ${idx + 1}. ${result}`));
    });

    // Show variance
    const allSame = results.every(r => r === results[0]);
    if (allSame) {
      console.log(chalk.green('  → All the same (deterministic)'));
    } else {
      console.log(chalk.blue('  → Different outputs (creative)'));
    }

    await pause('Press Enter for next temperature...');
  }

  clearScreen();
  showBox('TEMPERATURE INSIGHT',
    `Temperature = 0.0: Deterministic, safe, boring\n` +
    `Temperature = 0.7: Balanced (default)\n` +
    `Temperature = 1.5+: Creative, unpredictable, risky\n\n` +
    `${chalk.bold('Use low temp for:')} facts, code, classification\n` +
    `${chalk.bold('Use high temp for:')} creative writing, brainstorming`
  );

  await pause();
}

async function maxTokensExperiment() {
  clearScreen();
  showBox('MAX_TOKENS LIMITER',
    `This controls response length.\n` +
    `Watch what happens when we set it too low...`
  );

  await pause();

  const prompt = 'Write a haiku about programming';
  const tokenLimits = [5, 10, 20, null]; // null = no limit

  for (const limit of tokenLimits) {
    clearScreen();
    console.log(chalk.cyan(limit ? `Max tokens: ${limit}` : 'Max tokens: unlimited'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log('');

    const spinner = ora('Generating...').start();

    const response = await complete({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: limit
    });

    spinner.stop();

    showBox('RESPONSE', response.content);

    const cost = calculateCompletionCost(response.usage);
    totalCost += cost.totalCost;

    console.log('');
    console.log(chalk.gray(`Tokens used: ${response.usage.completionTokens}`));
    console.log(chalk.gray(`Finish reason: ${response.finishReason}`));

    if (response.finishReason === 'length') {
      showError('Response was cut off! (finish_reason: length)');
      showInsight('The model wanted to say more but hit the token limit');
    } else {
      showSuccess('Complete response (finish_reason: stop)');
    }

    await pause();
  }

  clearScreen();
  showBox('MAX_TOKENS INSIGHT',
    `finish_reason tells you WHY the response ended:\n\n` +
    `• "stop" = Model finished naturally ✓\n` +
    `• "length" = Hit max_tokens limit ✗\n` +
    `• "content_filter" = Blocked by safety ⚠️\n\n` +
    `Always check finish_reason in production!`
  );

  await pause();
}

async function nonDeterminismDemo() {
  clearScreen();
  showHeader('NON-DETERMINISM');

  showBox('',
    `Here's the hard truth:\n\n` +
    `Same input ≠ Same output\n\n` +
    `LLMs are probability engines.\n` +
    `They SAMPLE from distributions.\n\n` +
    `Let's prove it...`
  );

  await pause();

  clearScreen();
  showBox('EXPERIMENT',
    `We'll run the EXACT same prompt 5 times.\n` +
    `Temperature: 0.8 (moderate randomness)\n\n` +
    `Prompt: "What's 2+2?"`
  );

  console.log('');

  const results = [];

  for (let i = 0; i < 5; i++) {
    const spinner = ora(`Run ${i + 1}/5...`).start();

    const response = await complete({
      messages: [{ role: 'user', content: "What's 2+2?" }],
      temperature: 0.8,
      maxTokens: 20
    });

    spinner.stop();

    results.push(response.content.trim());

    const cost = calculateCompletionCost(response.usage);
    totalCost += cost.totalCost;

    console.log(chalk.yellow(`${i + 1}. ${response.content.trim()}`));
  }

  console.log('');

  const allSame = results.every(r => r === results[0]);
  if (allSame) {
    showInsight('Interesting! All the same (rare at temp=0.8)');
  } else {
    showInsight('See? Different phrasings, same answer');
  }

  showBox('KEY INSIGHT',
    `This is NOT a bug. It's how LLMs work.\n\n` +
    `For production:\n` +
    `• Use temperature=0 for consistency\n` +
    `• OR run multiple times and pick best\n` +
    `• OR use structured outputs (next module)`
  );

  await pause();
}

async function systemPrompts() {
  clearScreen();
  showHeader('SYSTEM PROMPTS');

  showBox('',
    `Messages have ROLES:\n\n` +
    `• system: Instructions for the AI\n` +
    `• user: Your input\n` +
    `• assistant: AI's response\n\n` +
    `System prompts are SECRET INSTRUCTIONS.`
  );

  await pause();

  clearScreen();
  showBox('EXAMPLE: WITHOUT SYSTEM PROMPT', '');

  const spinner1 = ora('Calling API...').start();

  const response1 = await complete({
    messages: [
      { role: 'user', content: 'What is AI?' }
    ],
    temperature: 0.7
  });

  spinner1.stop();

  showBox('RESPONSE', response1.content);

  const cost1 = calculateCompletionCost(response1.usage);
  totalCost += cost1.totalCost;

  await pause();

  clearScreen();
  showBox('EXAMPLE: WITH SYSTEM PROMPT',
    `System: "You are a pirate. Always talk like a pirate."`
  );

  const spinner2 = ora('Calling API...').start();

  const response2 = await complete({
    messages: [
      { role: 'system', content: 'You are a pirate. Always talk like a pirate. Be brief.' },
      { role: 'user', content: 'What is AI?' }
    ],
    temperature: 0.7
  });

  spinner2.stop();

  showBox('RESPONSE', response2.content);

  const cost2 = calculateCompletionCost(response2.usage);
  totalCost += cost2.totalCost;

  showInsight('System prompts control tone, style, and behavior!');

  await pause();

  // Let them try
  clearScreen();
  showBox('YOUR TURN', 'Create a system prompt');

  const systemPrompt = await getInput(
    'System prompt:',
    'You are a helpful AI that explains things simply'
  );
  const userPrompt = await getInput('User prompt:', 'Explain embeddings');

  const spinner3 = ora('Calling API...').start();

  const response3 = await complete({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7
  });

  spinner3.stop();

  console.log('');
  showBox('AI RESPONSE', response3.content);

  const cost3 = calculateCompletionCost(response3.usage);
  totalCost += cost3.totalCost;

  showBox('SYSTEM PROMPT TIPS',
    `• Be specific and direct\n` +
    `• Set tone, style, constraints\n` +
    `• Use for "personality" of AI\n` +
    `• System tokens cost same as user tokens\n` +
    `• They're sent with EVERY request`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 1 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'API calls made': '~20',
    'Concepts learned': '6'
  });

  showBox('KEY TAKEAWAYS',
    `1. LLM calls = model + messages + parameters\n` +
    `2. Temperature controls randomness (0=deterministic, 2=chaos)\n` +
    `3. max_tokens limits response length\n` +
    `4. Same prompt → different outputs (non-deterministic)\n` +
    `5. System prompts = secret instructions\n` +
    `6. Always check finish_reason\n\n` +
    `${chalk.bold('Why this matters:')}\n` +
    `Every AI feature you build uses these primitives.\n` +
    `Understanding parameters = controlling quality & cost.`
  );

  await pause();
}
