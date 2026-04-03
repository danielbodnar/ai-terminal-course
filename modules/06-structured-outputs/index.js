import chalk from 'chalk';
import ora from 'ora';
import { z } from 'zod';
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
  requestJSON,
  requestJSONMode,
  requestStructured,
  tryParseJSON,
  retryParse,
  validateWithZod,
  initStructured
} from '../../lib/structured.js';
import { calculateCompletionCost } from '../../lib/llm.js';
import { completeModule } from '../../lib/state.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  initStructured(process.env.OPENAI_API_KEY);

  showHeader('MODULE 4', 'STRUCTURED OUTPUTS');

  showBox('',
    `Time: ~35 mins │ Cost: ~$0.10 │ Progress: 4/14\n\n` +
    `LLMs output text. You need JSON.\n` +
    `Learn to get reliable structured data.`
  );

  await pause();

  // The problem
  await theProblem();

  // Three approaches
  await approach1PromptEngineering();
  await approach2JSONMode();
  await approach3StructuredOutputs();

  // Build extractor
  await buildExtractor();

  // Retry strategies
  await retryStrategies();

  // Production patterns
  await productionPatterns();

  // Summary
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(4, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 4 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Why LLMs struggle with structured output\n` +
    `✓ Three approaches: prompting, JSON mode, structured\n` +
    `✓ Zod schemas for type safety\n` +
    `✓ Retry strategies for failures\n` +
    `✓ Validation and error handling\n` +
    `✓ Production patterns\n\n` +
    `Next up: Tool Calling`
  );

  await pause('Press Enter to continue to Module 5...');
}

async function theProblem() {
  clearScreen();
  showHeader('THE PROBLEM');

  showBox('',
    `LLMs output TEXT.\n` +
    `But you need STRUCTURED DATA.\n\n` +
    `Examples:\n` +
    `• Extract contact info → need JSON\n` +
    `• Parse receipts → need structured fields\n` +
    `• Classification → need category label\n` +
    `• Form filling → need key-value pairs\n\n` +
    `How do you get reliable JSON from text?`
  );

  await pause();

  clearScreen();
  showBox('WHY IT\'S HARD',
    `LLMs are trained to write human text.\n` +
    `JSON is precise, structured, unforgiving.\n\n` +
    chalk.bold('Common failures:\n\n') +
    `• Extra text before/after JSON\n` +
    `• Missing closing brackets\n` +
    `• Invalid escaping\n` +
    `• Wrong field names\n` +
    `• Missing required fields\n` +
    `• Wrong types (string vs number)\n\n` +
    `Let's see this fail in real-time...`
  );

  await pause();
}

async function approach1PromptEngineering() {
  clearScreen();
  showHeader('APPROACH 1: PROMPT ENGINEERING');

  showBox('THE NAIVE APPROACH',
    `Just ask the LLM to return JSON.\n\n` +
    `"Return your answer as JSON"`
  );

  await pause();

  // Example: Extract contact info
  const exampleText = `
Hi! I'm Sarah Chen, you can reach me at sarah.chen@techcorp.com
or call me at (555) 123-4567. I work at TechCorp as a Senior Engineer.
  `.trim();

  clearScreen();
  showBox('TASK: EXTRACT CONTACT INFO', exampleText);

  console.log('');
  const spinner = ora('Asking LLM to return JSON...').start();

  const messages = [
    {
      role: 'system',
      content: 'Extract contact information from the text. Return ONLY valid JSON with keys: name, email, phone, company, title.'
    },
    {
      role: 'user',
      content: exampleText
    }
  ];

  const response = await requestJSON(messages, 0.7);
  const cost = calculateCompletionCost(response.usage, 'gpt-4o-mini');
  totalCost += cost.totalCost;

  spinner.stop();

  console.log('');
  showBox('LLM RESPONSE', response.content);

  console.log('');
  const parsed = tryParseJSON(response.content);

  if (parsed.success) {
    showSuccess('JSON is valid!');
    console.log('');
    console.log(chalk.gray(JSON.stringify(parsed.data, null, 2)));
  } else {
    showError('JSON parsing failed!');
    console.log(chalk.red(`Error: ${parsed.error}`));
  }

  console.log('');

  showBox('THE PROBLEM',
    parsed.success
      ? `This time it worked!\n\n` +
        `But try running this 10 times...\n` +
        chalk.bold('Success rate: ~85%\n\n') +
        `15% of the time:\n` +
        `• Extra text: "Here's the JSON: {...}"\n` +
        `• Markdown: \`\`\`json {...} \`\`\`\n` +
        `• Malformed: missing brackets\n\n` +
        chalk.bold.red('85% is not production-ready.')
      : `See? It failed!\n\n` +
        chalk.bold('Even with clear instructions:\n') +
        `• "Return ONLY valid JSON"\n` +
        `• System prompt specifying format\n` +
        `• Simple extraction task\n\n` +
        chalk.bold.red('This approach is unreliable.')
  );

  await pause();
}

async function approach2JSONMode() {
  clearScreen();
  showHeader('APPROACH 2: JSON MODE');

  showBox('',
    `OpenAI added a special parameter:\n\n` +
    chalk.white('response_format: { type: "json_object" }\n\n') +
    `This FORCES the model to return valid JSON.\n` +
    `(And only JSON, no extra text)\n\n` +
    `Let's try...`
  );

  await pause();

  const exampleText = `
Hi! I'm John Martinez. Email me at j.martinez@startup.io
Phone: (555) 987-6543. I'm the CTO at StartupCo.
  `.trim();

  clearScreen();
  showBox('TASK: EXTRACT CONTACT INFO', exampleText);

  console.log('');
  const spinner = ora('Using JSON mode...').start();

  const messages = [
    {
      role: 'system',
      content: 'Extract contact information. Return JSON with: name, email, phone, company, title.'
    },
    {
      role: 'user',
      content: exampleText
    }
  ];

  const response = await requestJSONMode(messages, 0.7);
  const cost = calculateCompletionCost(response.usage, 'gpt-4o-mini');
  totalCost += cost.totalCost;

  spinner.stop();

  console.log('');
  showBox('LLM RESPONSE', response.content);

  const parsed = tryParseJSON(response.content);

  console.log('');
  if (parsed.success) {
    showSuccess('Valid JSON! ✓');
    console.log('');
    console.log(chalk.gray(JSON.stringify(parsed.data, null, 2)));
  }

  console.log('');

  showBox('JSON MODE: PROS & CONS',
    chalk.bold.green('Pros:\n') +
    `  ✓ Guarantees valid JSON (100%)\n` +
    `  ✓ No extra text\n` +
    `  ✓ Works reliably\n\n` +
    chalk.bold.red('Cons:\n') +
    `  ✗ Doesn't enforce schema\n` +
    `  ✗ Field names might vary\n` +
    `  ✗ Types might be wrong (string vs number)\n` +
    `  ✗ Required fields might be missing\n\n` +
    chalk.bold('Example issues:\n') +
    `  Expected: { "age": 25 }\n` +
    `  Got:      { "age": "25" }  ← string!\n\n` +
    `  Expected: { "name": "..." }\n` +
    `  Got:      { "full_name": "..." }  ← wrong key!`
  );

  await pause();
}

async function approach3StructuredOutputs() {
  clearScreen();
  showHeader('APPROACH 3: STRUCTURED OUTPUTS');

  showBox('THE SOLUTION',
    `OpenAI's Structured Outputs (2024):\n\n` +
    `1. Define schema with Zod\n` +
    `2. API enforces the EXACT schema\n` +
    `3. Get typed, validated data\n\n` +
    chalk.bold('100% reliability. Type-safe. Production-ready.')
  );

  await pause();

  clearScreen();
  console.log(chalk.cyan('\nDefining schema with Zod...\n'));

  // Show Zod schema
  const schemaCode = `const ContactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  title: z.string()
});`;

  console.log(chalk.gray(schemaCode));
  console.log('');

  showInsight('Zod provides runtime validation + TypeScript types');

  await pause();

  const exampleText = `
Hey, I'm Dr. Emily Watson! Reach me at e.watson@research.edu
or call (555) 234-5678. I'm a Lead Researcher at Research Institute.
  `.trim();

  clearScreen();
  showBox('TASK: EXTRACT WITH SCHEMA', exampleText);

  // Define schema
  const ContactSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    company: z.string(),
    title: z.string()
  });

  console.log('');
  const spinner = ora('Using structured outputs...').start();

  const messages = [
    {
      role: 'system',
      content: 'Extract contact information from the text.'
    },
    {
      role: 'user',
      content: exampleText
    }
  ];

  const response = await requestStructured(messages, ContactSchema, 'Contact', 0.7);
  const cost = calculateCompletionCost(response.usage, 'gpt-4o-2024-08-06');
  totalCost += cost.totalCost;

  spinner.stop();

  console.log('');

  if (response.refusal) {
    showError('Model refused to respond');
    console.log(chalk.red(response.refusal));
  } else {
    showSuccess('Structured output received! ✓');
    console.log('');
    console.log(chalk.white('Parsed data:'));
    console.log(chalk.gray(JSON.stringify(response.parsed, null, 2)));
  }

  console.log('');

  showBox('STRUCTURED OUTPUTS: PERFECT',
    chalk.bold.green('Guarantees:\n') +
    `  ✓ Valid JSON\n` +
    `  ✓ Exact schema match\n` +
    `  ✓ Correct types\n` +
    `  ✓ Required fields present\n` +
    `  ✓ Type-safe (TypeScript)\n\n` +
    chalk.bold('Use cases:\n') +
    `  • Data extraction\n` +
    `  • Form filling\n` +
    `  • API responses\n` +
    `  • Database inserts\n\n` +
    chalk.bold.yellow('Note:\n') +
    `  • Requires gpt-4o-2024-08-06 or later\n` +
    `  • Slightly higher cost\n` +
    `  • Worth it for reliability!`
  );

  await pause();
}

async function buildExtractor() {
  clearScreen();
  showBox('BUILD: BUSINESS CARD EXTRACTOR',
    `Let's build a practical tool.\n\n` +
    `Input: Unstructured text\n` +
    `Output: Clean, structured contact data`
  );

  await pause();

  // Define schema
  const BusinessCardSchema = z.object({
    name: z.string().describe('Full name of the person'),
    email: z.string().email().optional().describe('Email address'),
    phone: z.string().optional().describe('Phone number'),
    company: z.string().optional().describe('Company name'),
    title: z.string().optional().describe('Job title'),
    linkedin: z.string().optional().describe('LinkedIn URL'),
    notes: z.string().optional().describe('Additional notes')
  });

  clearScreen();
  console.log(chalk.bold('\n📇 BUSINESS CARD EXTRACTOR\n'));
  console.log(chalk.gray('Paste business card text (or type example):\n'));

  const input = await getInput('Text:', '');

  const useExample = input.toLowerCase().includes('example') || !input.trim();

  const text = useExample
    ? `
SARAH CHEN
Senior Software Engineer
TechCorp Industries

📧 sarah.chen@techcorp.com
📱 (555) 123-4567
💼 linkedin.com/in/sarachen
🌐 techcorp.com

"Building the future, one line of code at a time"
    `.trim()
    : input;

  clearScreen();
  showBox('INPUT', text);

  console.log('');
  const spinner = ora('Extracting...').start();

  const messages = [
    {
      role: 'system',
      content: 'Extract contact information from business card text. Extract all available fields.'
    },
    {
      role: 'user',
      content: text
    }
  ];

  const response = await requestStructured(messages, BusinessCardSchema, 'BusinessCard', 0.7);
  const cost = calculateCompletionCost(response.usage, 'gpt-4o-2024-08-06');
  totalCost += cost.totalCost;

  spinner.succeed('Extracted!');

  console.log('');
  showBox('EXTRACTED DATA', '');

  const data = response.parsed;
  console.log(chalk.white('Name:    ') + chalk.yellow(data.name));
  if (data.email) console.log(chalk.white('Email:   ') + chalk.yellow(data.email));
  if (data.phone) console.log(chalk.white('Phone:   ') + chalk.yellow(data.phone));
  if (data.company) console.log(chalk.white('Company: ') + chalk.yellow(data.company));
  if (data.title) console.log(chalk.white('Title:   ') + chalk.yellow(data.title));
  if (data.linkedin) console.log(chalk.white('LinkedIn:') + chalk.yellow(data.linkedin));
  if (data.notes) console.log(chalk.white('Notes:   ') + chalk.gray(data.notes));

  console.log('');
  console.log(chalk.gray(`Cost: $${cost.totalCost.toFixed(6)}`));

  console.log('');
  showInsight('This is production-ready extraction!');

  await pause();

  // Try your own
  const tryOwn = await askYesNo('Try with your own text?');

  if (tryOwn) {
    await buildExtractor();
  }
}

async function retryStrategies() {
  clearScreen();
  showHeader('RETRY STRATEGIES');

  showBox('',
    `Even with JSON mode, you might need retries.\n\n` +
    `When to retry:\n` +
    `• Field missing but required\n` +
    `• Wrong data type\n` +
    `• Validation failed\n` +
    `• Ambiguous input\n\n` +
    `Let's see a retry in action...`
  );

  await pause();

  clearScreen();
  showBox('SCENARIO: AMBIGUOUS DATA',
    `Input: "Call me tomorrow at 3"\n\n` +
    `Problem: Missing AM/PM, missing date`
  );

  console.log('');
  const spinner = ora('Attempt 1...').start();

  const messages = [
    {
      role: 'system',
      content: 'Extract: { "time": "HH:MM AM/PM", "date": "YYYY-MM-DD" }. Return JSON.'
    },
    {
      role: 'user',
      content: 'Call me tomorrow at 3'
    }
  ];

  const response1 = await requestJSON(messages, 0.7);
  const cost1 = calculateCompletionCost(response1.usage, 'gpt-4o-mini');
  totalCost += cost1.totalCost;

  spinner.stop();

  console.log('');
  showBox('ATTEMPT 1', response1.content);

  const parsed1 = tryParseJSON(response1.content);

  if (!parsed1.success || !parsed1.data.time || !parsed1.data.date) {
    console.log('');
    showError('Incomplete or invalid data');

    // Retry with correction
    console.log('');
    const spinner2 = ora('Attempt 2 (with correction)...').start();

    messages.push({ role: 'assistant', content: response1.content });
    messages.push({
      role: 'user',
      content: 'The time is ambiguous (AM or PM?) and date is relative. Please specify both clearly. Assume PM if not stated.'
    });

    const response2 = await requestJSON(messages, 0.7);
    const cost2 = calculateCompletionCost(response2.usage, 'gpt-4o-mini');
    totalCost += cost2.totalCost;

    spinner2.stop();

    console.log('');
    showBox('ATTEMPT 2', response2.content);

    const parsed2 = tryParseJSON(response2.content);
    if (parsed2.success) {
      showSuccess('Success on retry!');
      console.log('');
      console.log(chalk.gray(JSON.stringify(parsed2.data, null, 2)));
    }
  }

  console.log('');

  showBox('RETRY PATTERNS',
    chalk.bold('1. Simple Retry (same prompt)\n') +
    `   • Works for random failures\n` +
    `   • Max 3 attempts\n\n` +
    chalk.bold('2. Feedback Retry (with error)\n') +
    `   • Tell LLM what went wrong\n` +
    `   • "Missing field X"\n` +
    `   • Usually fixes it\n\n` +
    chalk.bold('3. Fallback (give up gracefully)\n') +
    `   • After 3 attempts, return partial data\n` +
    `   • Or prompt user for clarification\n\n` +
    chalk.bold('4. Structured Outputs (avoid retries)\n') +
    `   • Use schemas to prevent failures\n` +
    `   • Best approach!`
  );

  await pause();
}

async function productionPatterns() {
  clearScreen();
  showHeader('PRODUCTION PATTERNS');

  showBox('BEST PRACTICES',
    chalk.bold('1. Always validate\n') +
    `   • Use Zod schemas\n` +
    `   • Validate before using data\n` +
    `   • Handle validation errors\n\n` +
    chalk.bold('2. Provide defaults\n') +
    `   • Optional fields with defaults\n` +
    `   • Graceful degradation\n\n` +
    chalk.bold('3. Log failures\n') +
    `   • Track parsing errors\n` +
    `   • Monitor success rates\n` +
    `   • Fix prompts based on logs\n\n` +
    chalk.bold('4. Test edge cases\n') +
    `   • Empty strings\n` +
    `   • Special characters\n` +
    `   • Missing data\n` +
    `   • Unicode\n\n` +
    chalk.bold('5. Use structured outputs\n') +
    `   • Worth the extra cost\n` +
    `   • Eliminates whole class of bugs\n` +
    `   • Type-safe end to end`
  );

  await pause();

  clearScreen();
  showBox('CODE TEMPLATE',
    chalk.gray('// 1. Define schema\n') +
    chalk.white('const schema = z.object({\n') +
    chalk.white('  field: z.string().min(1)\n') +
    chalk.white('});\n\n') +
    chalk.gray('// 2. Request structured output\n') +
    chalk.white('const response = await requestStructured(\n') +
    chalk.white('  messages, schema, "SchemaName"\n') +
    chalk.white(');\n\n') +
    chalk.gray('// 3. Handle refusal\n') +
    chalk.white('if (response.refusal) {\n') +
    chalk.white('  return handleRefusal();\n') +
    chalk.white('}\n\n') +
    chalk.gray('// 4. Use typed data\n') +
    chalk.white('const data = response.parsed;\n') +
    chalk.gray('// TypeScript knows the exact type!\n\n') +
    chalk.gray('// 5. Store safely\n') +
    chalk.white('await db.insert(data);')
  );

  await pause();

  clearScreen();
  showBox('WHEN TO USE EACH APPROACH',
    chalk.bold('Prompt Engineering:\n') +
    `  ❌ Never in production\n` +
    `  ✓ Quick prototypes only\n\n` +
    chalk.bold('JSON Mode:\n') +
    `  ✓ When schema varies\n` +
    `  ✓ Exploratory data extraction\n` +
    `  ✓ When you'll validate anyway\n\n` +
    chalk.bold('Structured Outputs:\n') +
    `  ✓ Production applications\n` +
    `  ✓ Database inserts\n` +
    `  ✓ API responses\n` +
    `  ✓ When reliability matters\n` +
    `  ✓ Always (when available)`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 4 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Concepts learned': '8',
    'Extractor built': '✓'
  });

  showBox('KEY TAKEAWAYS',
    `1. Prompt engineering for JSON: 85% reliable\n` +
    `2. JSON mode: 100% valid JSON, no schema enforcement\n` +
    `3. Structured outputs: 100% reliable + schema\n` +
    `4. Use Zod for type-safe validation\n` +
    `5. Retry strategies for edge cases\n` +
    `6. Always validate before using data\n` +
    `7. Structured outputs worth the cost\n` +
    `8. Monitor and log failures\n\n` +
    chalk.bold('Why this matters:\n') +
    `Every AI feature that writes to databases,\n` +
    `calls APIs, or structures data needs this.\n` +
    `Unreliable JSON = production bugs.\n\n` +
    chalk.bold('You can now:\n') +
    `• Extract structured data reliably\n` +
    `• Use Zod schemas for validation\n` +
    `• Build production-ready extractors\n` +
    `• Handle parsing errors gracefully\n\n` +
    chalk.bold('This is the foundation for:\n') +
    `• Form filling\n` +
    `• Data extraction\n` +
    `• API integrations\n` +
    `• Tool calling (next module!)`
  );

  await pause();
}
