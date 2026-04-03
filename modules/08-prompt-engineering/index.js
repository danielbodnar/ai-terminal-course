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
  calculateCompletionCost,
  initLLM
} from '../../lib/llm.js';
import { completeModule } from '../../lib/state.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  initLLM(process.env.OPENAI_API_KEY);

  showHeader('MODULE 2', 'PROMPT ENGINEERING');

  showBox('',
    `Time: ~40 mins │ Cost: ~$0.20 │ Progress: 2/14\n\n` +
    `Master the art of talking to AI.\n` +
    `Turn mediocre prompts into excellent ones.`
  );

  await pause();

  // Introduction
  await introduction();

  // Bad vs good prompts
  await badVsGood();

  // Zero-shot vs few-shot
  await zeroShotVsFewShot();

  // Chain of thought
  await chainOfThought();

  // Prompt templates
  await promptTemplates();

  // Iterative refinement
  await iterativeRefinement();

  // Advanced techniques
  await advancedTechniques();

  // Summary
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(2, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 2 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Elements of effective prompts\n` +
    `✓ Few-shot learning techniques\n` +
    `✓ Chain-of-thought reasoning\n` +
    `✓ Prompt templates and variables\n` +
    `✓ Iterative refinement process\n` +
    `✓ Advanced patterns for production\n\n` +
    `Next up: Streaming Responses`
  );

  await pause('Press Enter to continue to Module 3...');
}

async function introduction() {
  clearScreen();
  showHeader('WHAT IS PROMPT ENGINEERING?');

  showBox('',
    `Prompting is the primary way to program LLMs.\n\n` +
    `Instead of writing code:\n` +
    chalk.gray('  if (input == "classify") { ... }\n\n') +
    `You write instructions:\n` +
    chalk.yellow('  "Classify this text as positive or negative"\n\n') +
    chalk.bold('The prompt IS the code.')
  );

  await pause();

  clearScreen();
  showBox('WHY IT MATTERS',
    `Same model, different prompts:\n\n` +
    chalk.red('Bad prompt: 20% accuracy\n') +
    chalk.green('Good prompt: 95% accuracy\n\n') +
    `Prompt engineering is the difference between:\n` +
    `  • Working vs broken AI features\n` +
    `  • $100/month vs $10,000/month\n` +
    `  • Shipping vs debugging forever\n\n` +
    chalk.bold('This is THE most important skill.')
  );

  await pause();
}

async function badVsGood() {
  clearScreen();
  showHeader('BAD VS GOOD PROMPTS');

  showBox('',
    `Let's see the difference...\n\n` +
    `Task: Classify movie reviews as positive or negative`
  );

  await pause();

  const review = "The cinematography was stunning and the performances were excellent, but the plot dragged in the middle.";

  // Bad prompt
  clearScreen();
  showBox('BAD PROMPT', 'Classify this review');

  console.log('');
  console.log(chalk.gray('Review: ') + chalk.white(review));
  console.log('');

  const spinner1 = ora('Testing bad prompt...').start();

  const response1 = await complete({
    messages: [
      { role: 'user', content: `Classify this review\n\n${review}` }
    ],
    temperature: 0.7
  });

  spinner1.stop();

  const cost1 = calculateCompletionCost(response1.usage);
  totalCost += cost1.totalCost;

  console.log('');
  showBox('RESULT', response1.content);

  console.log('');
  showError('Issues: Ambiguous task, no format specified, unclear criteria');

  await pause();

  // Good prompt
  clearScreen();
  showBox('GOOD PROMPT',
    `Classify this movie review as either "positive" or "negative".\n\n` +
    `Consider:\n` +
    `- Overall sentiment\n` +
    `- Balance of positive vs negative points\n\n` +
    `Return ONLY one word: "positive" or "negative"`
  );

  console.log('');
  console.log(chalk.gray('Review: ') + chalk.white(review));
  console.log('');

  const spinner2 = ora('Testing good prompt...').start();

  const response2 = await complete({
    messages: [
      {
        role: 'user',
        content: `Classify this movie review as either "positive" or "negative".\n\nConsider:\n- Overall sentiment\n- Balance of positive vs negative points\n\nReturn ONLY one word: "positive" or "negative"\n\nReview: ${review}`
      }
    ],
    temperature: 0.7
  });

  spinner2.stop();

  const cost2 = calculateCompletionCost(response2.usage);
  totalCost += cost2.totalCost;

  console.log('');
  showBox('RESULT', response2.content);

  console.log('');
  showSuccess('Clear, actionable, formatted output!');

  await pause();

  clearScreen();
  showBox('WHAT MADE IT BETTER?',
    chalk.bold('1. Clear task\n') +
    `   "Classify as positive or negative"\n` +
    `   Not just "classify this"\n\n` +
    chalk.bold('2. Explicit criteria\n') +
    `   "Consider overall sentiment..."\n` +
    `   Guides the reasoning\n\n` +
    chalk.bold('3. Format specification\n') +
    `   "Return ONLY one word"\n` +
    `   Easy to parse\n\n` +
    chalk.bold('4. Constraints\n') +
    `   Two options only\n` +
    `   Prevents rambling`
  );

  await pause();
}

async function zeroShotVsFewShot() {
  clearScreen();
  showHeader('ZERO-SHOT VS FEW-SHOT');

  showBox('',
    chalk.bold('Zero-shot: ') + `Instructions only\n` +
    chalk.bold('Few-shot: ') + `Instructions + examples\n\n` +
    `Examples teach better than instructions.`
  );

  await pause();

  const task = "Extract product name and price";
  const input = "Buy the new iPhone 15 Pro for just $999!";

  // Zero-shot
  clearScreen();
  showBox('ZERO-SHOT (NO EXAMPLES)', task);

  console.log('');
  console.log(chalk.gray('Input: ') + chalk.white(input));
  console.log('');

  const spinner1 = ora('Testing zero-shot...').start();

  const response1 = await complete({
    messages: [
      {
        role: 'user',
        content: `${task}\n\nInput: ${input}\n\nReturn JSON with {product, price}`
      }
    ],
    temperature: 0
  });

  spinner1.stop();

  const cost1 = calculateCompletionCost(response1.usage);
  totalCost += cost1.totalCost;

  console.log('');
  showBox('RESULT', response1.content);

  await pause();

  // Few-shot
  clearScreen();
  showBox('FEW-SHOT (WITH EXAMPLES)', task);

  const prompt = `Extract product name and price from text.

Examples:

Input: "Get the new MacBook Air for $1299"
Output: {"product": "MacBook Air", "price": 1299}

Input: "PS5 console on sale for $499.99!"
Output: {"product": "PS5 console", "price": 499.99}

Now extract from this:

Input: "${input}"
Output:`;

  console.log('');
  console.log(chalk.gray(prompt));
  console.log('');

  const spinner2 = ora('Testing few-shot...').start();

  const response2 = await complete({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0
  });

  spinner2.stop();

  const cost2 = calculateCompletionCost(response2.usage);
  totalCost += cost2.totalCost;

  console.log('');
  showBox('RESULT', response2.content);

  console.log('');
  showSuccess('More accurate and consistent!');

  await pause();

  clearScreen();
  showBox('WHY FEW-SHOT WORKS',
    chalk.bold('Examples show:\n\n') +
    `• Exact input/output format\n` +
    `• Edge cases handling\n` +
    `• Expected precision\n` +
    `• Tone and style\n\n` +
    chalk.bold('Guidelines:\n\n') +
    `• 3-5 examples is optimal\n` +
    `• Cover diverse cases\n` +
    `• Show edge cases\n` +
    `• Keep examples concise\n\n` +
    chalk.yellow('Tip: ') + `Examples > instructions`
  );

  await pause();
}

async function chainOfThought() {
  clearScreen();
  showHeader('CHAIN-OF-THOUGHT REASONING');

  showBox('',
    `For complex tasks, make the LLM "think out loud"\n\n` +
    `Instead of jumping to an answer,\n` +
    `ask it to show its reasoning step-by-step.`
  );

  await pause();

  const problem = "A store sells apples for $3 per bag. If you buy 3 bags, you get 20% off. How much do 5 bags cost?";

  // Without CoT
  clearScreen();
  showBox('WITHOUT CHAIN-OF-THOUGHT', 'Direct answer');

  console.log('');
  console.log(chalk.white(problem));
  console.log('');

  const spinner1 = ora('Asking for direct answer...').start();

  const response1 = await complete({
    messages: [
      { role: 'user', content: `${problem}\n\nAnswer:` }
    ],
    temperature: 0
  });

  spinner1.stop();

  const cost1 = calculateCompletionCost(response1.usage);
  totalCost += cost1.totalCost;

  console.log('');
  showBox('RESULT', response1.content);

  console.log('');
  showError('May be wrong - no visible reasoning');

  await pause();

  // With CoT
  clearScreen();
  showBox('WITH CHAIN-OF-THOUGHT', 'Step-by-step reasoning');

  console.log('');
  console.log(chalk.white(problem));
  console.log('');

  const spinner2 = ora('Asking for step-by-step...').start();

  const response2 = await complete({
    messages: [
      {
        role: 'user',
        content: `${problem}\n\nLet's solve this step by step:\n1.`
      }
    ],
    temperature: 0
  });

  spinner2.stop();

  const cost2 = calculateCompletionCost(response2.usage);
  totalCost += cost2.totalCost;

  console.log('');
  showBox('RESULT', '1.' + response2.content);

  console.log('');
  showSuccess('Clear reasoning! Can verify each step.');

  await pause();

  clearScreen();
  showBox('CHAIN-OF-THOUGHT PATTERNS',
    chalk.bold('Trigger phrases:\n\n') +
    `• "Let's think step by step"\n` +
    `• "First, let's break this down"\n` +
    `• "Let's solve this systematically"\n` +
    `• "Show your work"\n\n` +
    chalk.bold('When to use:\n\n') +
    `✓ Math problems\n` +
    `✓ Logic puzzles\n` +
    `✓ Multi-step reasoning\n` +
    `✓ Complex analysis\n\n` +
    chalk.bold('Benefits:\n\n') +
    `• Higher accuracy\n` +
    `• Explainable reasoning\n` +
    `• Easier to debug\n` +
    `• Catches mistakes`
  );

  await pause();
}

async function promptTemplates() {
  clearScreen();
  showHeader('PROMPT TEMPLATES');

  showBox('',
    `Don't hardcode prompts.\n` +
    `Use templates with variables.\n\n` +
    `This makes prompts:\n` +
    `  • Reusable\n` +
    `  • Testable\n` +
    `  • Maintainable`
  );

  await pause();

  clearScreen();
  showBox('EXAMPLE: EMAIL TEMPLATE',
    chalk.gray('const template = `\n') +
    chalk.white('Write a {{tone}} email to {{recipient}}\n') +
    chalk.white('about {{topic}}.\n\n') +
    chalk.white('Keep it {{length}}.\n') +
    chalk.gray('`;')
  );

  console.log('');
  console.log(chalk.cyan('Usage:\n'));

  const examples = [
    { tone: 'professional', recipient: 'client', topic: 'project delay', length: 'brief' },
    { tone: 'friendly', recipient: 'colleague', topic: 'lunch plans', length: 'casual' },
    { tone: 'formal', recipient: 'executive', topic: 'quarterly results', length: 'detailed' }
  ];

  for (const vars of examples) {
    console.log(chalk.white('→ ') + chalk.gray(JSON.stringify(vars)));
  }

  console.log('');
  showInsight('One template, infinite variations');

  await pause();

  // Try it
  clearScreen();
  showBox('BUILD YOUR TEMPLATE', '');

  console.log('');
  const tone = await getInput('Tone:', 'professional');
  const recipient = await getInput('Recipient:', 'team');
  const topic = await getInput('Topic:', 'new feature launch');
  const length = await getInput('Length:', 'concise');

  const prompt = `Write a ${tone} email to ${recipient} about ${topic}. Keep it ${length}.`;

  console.log('');
  showBox('GENERATED PROMPT', prompt);

  console.log('');
  const spinner = ora('Generating email...').start();

  const response = await complete({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  spinner.stop();

  const cost = calculateCompletionCost(response.usage);
  totalCost += cost.totalCost;

  console.log('');
  showBox('RESULT', response.content);

  await pause();

  clearScreen();
  showBox('TEMPLATE BEST PRACTICES',
    chalk.bold('1. Use clear variable names\n') +
    `   {{tone}}, {{recipient}} not {{x}}, {{y}}\n\n` +
    chalk.bold('2. Provide defaults\n') +
    `   tone = tone || "professional"\n\n` +
    chalk.bold('3. Validate inputs\n') +
    `   assert(tone in ["professional", "casual"])\n\n` +
    chalk.bold('4. Version your templates\n') +
    `   email_template_v2.txt\n\n` +
    chalk.bold('5. Test with edge cases\n') +
    `   Empty strings, very long inputs, etc.`
  );

  await pause();
}

async function iterativeRefinement() {
  clearScreen();
  showHeader('ITERATIVE REFINEMENT');

  showBox('',
    `Prompts are code.\n` +
    `They need testing and iteration.\n\n` +
    chalk.bold('The process:\n\n') +
    `1. Write initial prompt\n` +
    `2. Test with examples\n` +
    `3. Find failures\n` +
    `4. Refine prompt\n` +
    `5. Test again\n` +
    `6. Repeat until 95%+ success`
  );

  await pause();

  clearScreen();
  showBox('LIVE REFINEMENT', 'Sentiment classification');

  const testCases = [
    { text: "This product is amazing!", expected: "positive" },
    { text: "Terrible experience, never again", expected: "negative" },
    { text: "It's okay, nothing special", expected: "neutral" },
    { text: "Best purchase I've made this year!", expected: "positive" },
    { text: "Meh", expected: "neutral" }
  ];

  const prompts = [
    {
      version: 'v1',
      prompt: 'Classify sentiment of: {{text}}'
    },
    {
      version: 'v2',
      prompt: 'Classify sentiment as positive, negative, or neutral: {{text}}\nAnswer:'
    },
    {
      version: 'v3',
      prompt: `Classify the sentiment of this text as exactly one of: "positive", "negative", or "neutral".

Return ONLY the classification, nothing else.

Text: {{text}}
Classification:`
    }
  ];

  for (const promptDef of prompts) {
    clearScreen();
    showBox(`PROMPT ${promptDef.version.toUpperCase()}`, promptDef.prompt);

    console.log('');
    console.log(chalk.cyan('Testing...'));
    console.log('');

    let correct = 0;

    for (const test of testCases.slice(0, 3)) { // Test first 3
      const prompt = promptDef.prompt.replace('{{text}}', test.text);

      const spinner = ora(chalk.gray(`"${test.text.substring(0, 30)}..."`)).start();

      const response = await complete({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        maxTokens: 20
      });

      const cost = calculateCompletionCost(response.usage);
      totalCost += cost.totalCost;

      const result = response.content.toLowerCase().trim();
      const isCorrect = result.includes(test.expected);

      if (isCorrect) correct++;

      spinner.succeed(
        isCorrect
          ? chalk.green(`✓ ${test.expected}`)
          : chalk.red(`✗ Expected ${test.expected}, got: ${result}`)
      );

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('');
    console.log(chalk.white(`Accuracy: ${Math.round((correct / 3) * 100)}%`));

    await pause();
  }

  clearScreen();
  showBox('REFINEMENT RESULTS',
    `v1: ~60% accuracy (too vague)\n` +
    `v2: ~80% accuracy (better but inconsistent format)\n` +
    `v3: ~95% accuracy (clear, constrained, formatted)\n\n` +
    chalk.bold('Each iteration improved the prompt!\n\n') +
    `This is how you get production-quality prompts.`
  );

  await pause();
}

async function advancedTechniques() {
  clearScreen();
  showHeader('ADVANCED TECHNIQUES');

  showBox('1. ROLE PROMPTING',
    `Give the LLM a role/persona.\n\n` +
    chalk.yellow('Example:\n') +
    `"You are an expert Python developer with 10 years\n` +
    `of experience in data science..."\n\n` +
    chalk.bold('Effect: ') + `More focused, expert-level responses`
  );

  await pause();

  showBox('2. CONSTRAINED OUTPUT',
    `Limit what the LLM can say.\n\n` +
    chalk.yellow('Example:\n') +
    `"Your response must be:\n` +
    `- Under 50 words\n` +
    `- Use bullet points\n` +
    `- Include exactly 3 examples\n` +
    `- End with a question"\n\n` +
    chalk.bold('Effect: ') + `Predictable, parseable output`
  );

  await pause();

  showBox('3. NEGATIVE PROMPTING',
    `Tell it what NOT to do.\n\n` +
    chalk.yellow('Example:\n') +
    `"Do NOT:\n` +
    `- Use jargon\n` +
    `- Exceed 100 words\n` +
    `- Include opinions\n` +
    `- Make assumptions"\n\n` +
    chalk.bold('Effect: ') + `Avoids common mistakes`
  );

  await pause();

  showBox('4. META-PROMPTING',
    `Ask LLM to improve your prompt.\n\n` +
    chalk.yellow('Example:\n') +
    `"Here's my prompt: [prompt]\n` +
    `Suggest 3 ways to improve it for:\n` +
    `- Clarity\n` +
    `- Specificity\n` +
    `- Consistency"\n\n` +
    chalk.bold('Effect: ') + `LLM helps you write better prompts`
  );

  await pause();

  showBox('5. SELF-CONSISTENCY',
    `Run same prompt multiple times (temp > 0).\n` +
    `Take majority vote of answers.\n\n` +
    chalk.yellow('Example:\n') +
    `Run 5 times:\n` +
    `  positive, positive, positive, negative, positive\n` +
    `Result: positive (4/5 votes)\n\n` +
    chalk.bold('Effect: ') + `Higher accuracy, costs 5x more`
  );

  await pause();

  showBox('6. PROMPT CHAINING',
    `Break complex task into multiple prompts.\n\n` +
    chalk.yellow('Example:\n') +
    `Prompt 1: "Summarize this article"\n` +
    `Prompt 2: "Extract key facts from: [summary]"\n` +
    `Prompt 3: "Convert facts to bullet points: [facts]"\n\n` +
    chalk.bold('Effect: ') + `Better quality, more controllable`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 2 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Prompts tested': '~20',
    'Techniques learned': '10+'
  });

  showBox('KEY TAKEAWAYS',
    `1. Clear prompts > vague prompts\n` +
    `2. Few-shot > zero-shot (examples teach)\n` +
    `3. Chain-of-thought for complex reasoning\n` +
    `4. Use templates with variables\n` +
    `5. Iterate: test → find failures → refine\n` +
    `6. Constrain outputs for reliability\n` +
    `7. Negative prompting prevents mistakes\n` +
    `8. Meta-prompting for improvement\n\n` +
    chalk.bold('Elements of good prompts:\n\n') +
    `• Clear task definition\n` +
    `• Explicit criteria\n` +
    `• Output format specified\n` +
    `• Examples provided\n` +
    `• Constraints stated\n` +
    `• Edge cases covered\n\n` +
    chalk.bold('Why this matters:\n') +
    `Prompt engineering is THE skill.\n` +
    `Same model, 5x performance difference.\n` +
    `This determines if your AI feature works.\n\n` +
    chalk.bold('You can now:\n') +
    `• Write production-quality prompts\n` +
    `• Debug and improve prompts systematically\n` +
    `• Use advanced techniques\n` +
    `• Build prompt libraries\n\n` +
    chalk.yellow('Remember: ') + `Prompting is programming.`
  );

  await pause();
}
