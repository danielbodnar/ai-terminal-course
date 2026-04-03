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
  initTools,
  callWithTools,
  executeTool,
  handleToolLoop,
  getCommonTools,
  getCommonFunctions,
  defineTool
} from '../../lib/tools.js';
import { calculateCompletionCost } from '../../lib/llm.js';
import { completeModule } from '../../lib/state.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  initTools(process.env.OPENAI_API_KEY);

  showHeader('MODULE 5', 'TOOL CALLING');

  showBox('',
    `Time: ~40 mins │ Cost: ~$0.15 │ Progress: 5/14\n\n` +
    `Transform LLMs from chat to AGENTS.\n` +
    `Learn how AI can DO things, not just SAY things.`
  );

  await pause();

  // The revelation
  await theRevelation();

  // How it works
  await howItWorks();

  // First tool call
  await firstToolCall();

  // Multiple tools
  await multipleTools();

  // Parallel execution
  await parallelExecution();

  // Build CLI assistant
  await buildCLIAssistant();

  // Error handling
  await errorHandling();

  // Production patterns
  await productionPatterns();

  // Summary
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(5, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 5 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Tool calling = LLMs taking actions\n` +
    `✓ How LLMs choose which tool to use\n` +
    `✓ Defining tools with JSON schemas\n` +
    `✓ Executing tool calls safely\n` +
    `✓ Multi-step reasoning with tools\n` +
    `✓ Parallel tool execution\n` +
    `✓ Error handling and fallbacks\n\n` +
    `Next up: Tokens, Cost & Context`
  );

  await pause('Press Enter to continue to Module 6...');
}

async function theRevelation() {
  clearScreen();
  showHeader('THE REVELATION');

  showBox('',
    `So far, LLMs just generate TEXT.\n\n` +
    `User: "What's the weather in SF?"\n` +
    `AI: "I don't have real-time weather data..."\n\n` +
    `But what if the AI could CALL A FUNCTION\n` +
    `to get real data?\n\n` +
    `That's tool calling.`
  );

  await pause();

  clearScreen();
  showBox('THE MAGIC',
    `You give the LLM:\n` +
    `  • A conversation\n` +
    `  • A list of available "tools"\n\n` +
    `The LLM:\n` +
    `  • Decides which tool to use\n` +
    `  • Generates the arguments\n` +
    `  • Returns a "function call" request\n\n` +
    `You:\n` +
    `  • Execute the actual function\n` +
    `  • Send results back to LLM\n` +
    `  • Get final answer\n\n` +
    chalk.bold('This is how ChatGPT plugins work.')
  );

  await pause();

  clearScreen();
  showBox('',
    `Let's see this in action...\n\n` +
    `Watch the AI decide to use a tool.`
  );

  await pause();
}

async function howItWorks() {
  clearScreen();
  showHeader('HOW IT WORKS');

  showBox('THE FLOW',
    chalk.bold('1. Define tools\n') +
    `   Tell LLM what functions exist\n\n` +
    chalk.bold('2. LLM analyzes request\n') +
    `   "Do I need a tool for this?"\n\n` +
    chalk.bold('3. LLM returns tool_calls\n') +
    `   { function: "get_weather", args: {city: "SF"} }\n\n` +
    chalk.bold('4. You execute the function\n') +
    `   Actually call the weather API\n\n` +
    chalk.bold('5. Send results back\n') +
    `   LLM incorporates the data\n\n` +
    chalk.bold('6. LLM generates final answer\n') +
    `   "It's 72°F and sunny in SF"`
  );

  await pause();

  clearScreen();
  showBox('IMPORTANT',
    chalk.bold.red('THE LLM DOES NOT EXECUTE FUNCTIONS.\n\n') +
    `The LLM only:\n` +
    `  • Chooses which function to call\n` +
    `  • Generates the arguments\n\n` +
    chalk.bold('YOU execute the actual function.\n\n') +
    `This means:\n` +
    `  ✓ You control what runs\n` +
    `  ✓ You handle permissions\n` +
    `  ✓ You validate inputs\n` +
    `  ✓ You return safe data\n\n` +
    `The LLM is the "brain" that decides.\n` +
    `You are the "hands" that execute.`
  );

  await pause();
}

async function firstToolCall() {
  clearScreen();
  showBox('YOUR FIRST TOOL CALL',
    `Let's build a weather assistant...`
  );

  await pause();

  // Define weather tool
  const tools = getCommonTools();
  const functions = getCommonFunctions();

  clearScreen();
  console.log(chalk.cyan('\n📋 TOOL DEFINITION\n'));
  console.log(chalk.gray(JSON.stringify(tools.weather, null, 2)));

  console.log('');
  showInsight('This tells the LLM: "You can call get_weather(location)"');

  await pause();

  clearScreen();
  const userQuery = 'What\'s the weather like in San Francisco?';

  showBox('USER QUERY', userQuery);

  console.log('');
  const spinner = ora('LLM analyzing query...').start();

  const messages = [
    { role: 'user', content: userQuery }
  ];

  const response = await callWithTools(messages, [tools.weather]);

  spinner.stop();

  console.log('');

  if (response.message.tool_calls) {
    showSuccess('LLM wants to call a tool!');

    console.log('');
    showBox('TOOL CALL REQUEST',
      `Function: ${chalk.yellow(response.message.tool_calls[0].function.name)}\n` +
      `Arguments: ${chalk.gray(response.message.tool_calls[0].function.arguments)}`
    );

    const cost1 = calculateCompletionCost(response.usage);
    totalCost += cost1.totalCost;

    await pause('\nPress Enter to execute the function...');

    // Execute the tool
    const spinner2 = ora('Executing get_weather...').start();

    const toolResult = await executeTool(response.message.tool_calls[0], functions);

    spinner2.succeed('Function executed!');

    console.log('');
    showBox('FUNCTION RESULT', toolResult.content);

    await pause('\nPress Enter to send result back to LLM...');

    // Send result back to LLM
    messages.push(response.message);
    messages.push(toolResult);

    const spinner3 = ora('LLM processing result...').start();

    const finalResponse = await callWithTools(messages, [tools.weather]);

    spinner3.stop();

    const cost2 = calculateCompletionCost(finalResponse.usage);
    totalCost += cost2.totalCost;

    console.log('');
    showBox('FINAL ANSWER', finalResponse.message.content);

    console.log('');
    showInsight('The LLM incorporated the real weather data into its response!');

  } else {
    showError('LLM chose not to use a tool');
  }

  await pause();

  clearScreen();
  showBox('WHAT JUST HAPPENED',
    `1. User asked about weather\n` +
    `2. LLM recognized it needs real-time data\n` +
    `3. LLM chose to call "get_weather"\n` +
    `4. LLM extracted "San Francisco" as the argument\n` +
    `5. We executed the actual function\n` +
    `6. LLM used real data to answer\n\n` +
    chalk.bold('This is the foundation of AI agents.')
  );

  await pause();
}

async function multipleTools() {
  clearScreen();
  showHeader('MULTIPLE TOOLS');

  showBox('',
    `Give the LLM multiple tools.\n` +
    `It will choose the right one.\n\n` +
    `Available:\n` +
    `  • get_weather\n` +
    `  • calculate\n` +
    `  • search_web`
  );

  await pause();

  const tools = getCommonTools();
  const functions = getCommonFunctions();

  const queries = [
    'What\'s 234 * 567?',
    'What\'s the weather in Tokyo?',
    'Search for information about quantum computing'
  ];

  for (const query of queries) {
    clearScreen();
    showBox('USER QUERY', query);

    console.log('');
    const spinner = ora('LLM choosing tool...').start();

    const result = await handleToolLoop(
      [{ role: 'user', content: query }],
      [tools.weather, tools.calculator, tools.search],
      functions,
      3
    );

    spinner.stop();

    const cost = calculateCompletionCost(result.usage);
    totalCost += cost.totalCost;

    console.log('');

    // Show which tool was chosen
    const toolCallMessage = result.history.find(m => m.tool_calls);
    if (toolCallMessage) {
      const toolName = toolCallMessage.tool_calls[0].function.name;
      showSuccess(`LLM chose: ${chalk.yellow(toolName)}`);
    }

    console.log('');
    showBox('FINAL ANSWER', result.finalMessage);

    await pause();
  }

  clearScreen();
  showBox('INTELLIGENT ROUTING',
    `The LLM correctly chose:\n\n` +
    `  "234 * 567" → calculator\n` +
    `  "weather in Tokyo" → get_weather\n` +
    `  "quantum computing" → search_web\n\n` +
    chalk.bold('No if/else logic. No hardcoded rules.\n') +
    chalk.bold('The LLM reasons about which tool to use.')
  );

  await pause();
}

async function parallelExecution() {
  clearScreen();
  showHeader('PARALLEL TOOL CALLS');

  showBox('',
    `LLMs can call multiple tools at once.\n\n` +
    `Query: "Compare weather in SF and NYC"\n\n` +
    `LLM will call:\n` +
    `  • get_weather("San Francisco")\n` +
    `  • get_weather("New York")\n\n` +
    `Both execute in parallel!`
  );

  await pause();

  const tools = getCommonTools();
  const functions = getCommonFunctions();

  clearScreen();
  const query = 'Compare the weather in San Francisco and New York';
  showBox('USER QUERY', query);

  console.log('');
  const spinner = ora('LLM analyzing...').start();

  const messages = [{ role: 'user', content: query }];
  const response = await callWithTools(messages, [tools.weather]);

  spinner.stop();

  const cost1 = calculateCompletionCost(response.usage);
  totalCost += cost1.totalCost;

  if (response.message.tool_calls && response.message.tool_calls.length > 1) {
    console.log('');
    showSuccess(`LLM wants to call ${response.message.tool_calls.length} tools in parallel!`);

    console.log('');
    response.message.tool_calls.forEach((call, idx) => {
      console.log(
        chalk.white(`${idx + 1}. `) +
        chalk.yellow(call.function.name) +
        chalk.gray(`(${call.function.arguments})`)
      );
    });

    await pause('\nPress Enter to execute both...');

    // Execute all in parallel
    const spinner2 = ora('Executing functions in parallel...').start();

    const results = await Promise.all(
      response.message.tool_calls.map(call => executeTool(call, functions))
    );

    spinner2.succeed('Both executed!');

    console.log('');
    results.forEach((result, idx) => {
      console.log(chalk.cyan(`Result ${idx + 1}:`));
      console.log(chalk.gray(result.content));
      console.log('');
    });

    await pause('Press Enter to see final answer...');

    // Send back to LLM
    messages.push(response.message);
    messages.push(...results);

    const spinner3 = ora('LLM comparing results...').start();

    const finalResponse = await callWithTools(messages, [tools.weather]);

    spinner3.stop();

    const cost2 = calculateCompletionCost(finalResponse.usage);
    totalCost += cost2.totalCost;

    console.log('');
    showBox('FINAL ANSWER', finalResponse.message.content);

    console.log('');
    showInsight('LLM used both results to make a comparison!');

  } else {
    showError('LLM only called one tool (try different wording)');
  }

  await pause();
}

async function buildCLIAssistant() {
  clearScreen();
  showBox('BUILD: CLI ASSISTANT',
    `Let's build a terminal assistant.\n\n` +
    `It can:\n` +
    `  • Answer questions\n` +
    `  • Get weather\n` +
    `  • Do calculations\n` +
    `  • Execute safe shell commands\n\n` +
    `Type "quit" to exit.`
  );

  await pause();

  const tools = getCommonTools();
  const functions = getCommonFunctions();

  const allTools = [tools.weather, tools.calculator, tools.command, tools.search];

  clearScreen();
  console.log(chalk.bold('\n🤖 CLI ASSISTANT\n'));
  console.log(chalk.gray('Available commands: weather, calculator, shell (ls/pwd/date), search\n'));
  console.log(chalk.gray('Type "quit" to exit\n'));

  const conversation = [];

  while (true) {
    const userInput = await getInput('You:', '');

    if (userInput.toLowerCase() === 'quit') {
      break;
    }

    if (!userInput.trim()) continue;

    conversation.push({ role: 'user', content: userInput });

    const spinner = ora('Thinking...').start();

    try {
      const result = await handleToolLoop(conversation, allTools, functions, 5);

      spinner.stop();

      console.log(chalk.cyan('Assistant: ') + chalk.white(result.finalMessage));
      console.log('');

      conversation.push({ role: 'assistant', content: result.finalMessage });

      const cost = calculateCompletionCost(result.usage);
      totalCost += cost.totalCost;

      // Show tool usage
      const toolCalls = result.history.filter(m => m.tool_calls);
      if (toolCalls.length > 0) {
        console.log(chalk.gray(`[Used tools: ${toolCalls.flatMap(m =>
          m.tool_calls.map(t => t.function.name)
        ).join(', ')}]`));
        console.log('');
      }

    } catch (error) {
      spinner.stop();
      console.log(chalk.red(`Error: ${error.message}`));
      console.log('');
    }
  }

  console.log('');
  showBox('CLI ASSISTANT DEMO COMPLETE',
    `You just built a functional AI assistant!\n\n` +
    `It can:\n` +
    `  ✓ Reason about which tool to use\n` +
    `  ✓ Execute multiple steps\n` +
    `  ✓ Handle errors gracefully\n` +
    `  ✓ Maintain conversation context\n\n` +
    `This is the foundation of AI agents.`
  );

  await pause();
}

async function errorHandling() {
  clearScreen();
  showHeader('ERROR HANDLING');

  showBox('WHAT CAN GO WRONG',
    `Tool calling can fail:\n\n` +
    `1. LLM hallucinates a function name\n` +
    `   → "call_weather" instead of "get_weather"\n\n` +
    `2. Invalid arguments\n` +
    `   → Missing required field\n` +
    `   → Wrong type (string vs number)\n\n` +
    `3. Function execution fails\n` +
    `   → API timeout\n` +
    `   → Permission denied\n` +
    `   → Resource not found\n\n` +
    `4. LLM gets stuck in a loop\n` +
    `   → Keeps calling same function\n` +
    `   → Never returns final answer`
  );

  await pause();

  clearScreen();
  showBox('PRODUCTION PATTERNS',
    chalk.bold('1. Validate function names\n') +
    `   if (!availableFunctions[name]) {\n` +
    `     return error("Function not found")\n` +
    `   }\n\n` +
    chalk.bold('2. Validate arguments with Zod\n') +
    `   const schema = z.object({ city: z.string() });\n` +
    `   schema.parse(args);\n\n` +
    chalk.bold('3. Wrap in try/catch\n') +
    `   try {\n` +
    `     result = await executeFunction(args);\n` +
    `   } catch (error) {\n` +
    `     return { error: error.message };\n` +
    `   }\n\n` +
    chalk.bold('4. Set max iterations\n') +
    `   let iterations = 0;\n` +
    `   while (iterations < MAX_ITERATIONS) { ... }\n\n` +
    chalk.bold('5. Timeout on long-running tools\n') +
    `   Promise.race([execute(), timeout(30000)])`
  );

  await pause();
}

async function productionPatterns() {
  clearScreen();
  showHeader('PRODUCTION PATTERNS');

  showBox('BEST PRACTICES',
    chalk.bold('1. Tool Security\n') +
    `   • Whitelist allowed functions\n` +
    `   • Validate ALL arguments\n` +
    `   • Never pass user input directly to shell\n` +
    `   • Use least-privilege execution\n\n` +
    chalk.bold('2. Cost Control\n') +
    `   • Each tool call = 2x API calls minimum\n` +
    `   • Set max iterations\n` +
    `   • Cache tool results when possible\n\n` +
    chalk.bold('3. Observability\n') +
    `   • Log every tool call\n` +
    `   • Track success/failure rates\n` +
    `   • Monitor which tools are used\n` +
    `   • Alert on unusual patterns\n\n` +
    chalk.bold('4. User Experience\n') +
    `   • Show "thinking..." states\n` +
    `   • Explain which tools are being used\n` +
    `   • Provide fallbacks for failures\n` +
    `   • Set clear expectations`
  );

  await pause();

  clearScreen();
  showBox('REAL-WORLD USE CASES',
    chalk.bold('1. Customer Support Bots\n') +
    `   Tools: lookup_order, cancel_order, refund\n` +
    `   → AI handles routine requests automatically\n\n` +
    chalk.bold('2. Data Analysis Agents\n') +
    `   Tools: query_db, plot_chart, export_csv\n` +
    `   → Natural language to SQL to visualization\n\n` +
    chalk.bold('3. DevOps Assistants\n') +
    `   Tools: check_status, restart_service, view_logs\n` +
    `   → Chat-based server management\n\n` +
    chalk.bold('4. Research Agents\n') +
    `   Tools: search_papers, summarize, cite\n` +
    `   → Autonomous research and synthesis\n\n` +
    chalk.bold('5. Code Assistants\n') +
    `   Tools: read_file, write_file, run_tests\n` +
    `   → AI that can actually modify code`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 5 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Tool calls made': '~15',
    'CLI assistant': '✓'
  });

  showBox('KEY TAKEAWAYS',
    `1. Tool calling = LLMs can take actions\n` +
    `2. LLM chooses which tool, you execute it\n` +
    `3. Define tools with JSON schemas\n` +
    `4. LLMs can call multiple tools in parallel\n` +
    `5. Validate everything (names, args, results)\n` +
    `6. Set max iterations to prevent loops\n` +
    `7. This is how AI agents work\n\n` +
    chalk.bold('Why this matters:\n') +
    `Tool calling transforms LLMs from chat to agents.\n` +
    `Every AI assistant, automation, and plugin uses this.\n` +
    `This is the difference between:\n` +
    `  "Let me tell you about the weather" (useless)\n` +
    `  vs\n` +
    `  "I checked, it's 72°F and sunny" (useful)\n\n` +
    chalk.bold('You can now:\n') +
    `• Build AI agents that DO things\n` +
    `• Integrate LLMs with APIs\n` +
    `• Create chat-based automation\n` +
    `• Handle multi-step reasoning\n\n` +
    chalk.bold('This unlocks:\n') +
    `• Customer support automation\n` +
    `• Data analysis agents\n` +
    `• DevOps assistants\n` +
    `• Research agents\n` +
    `• Code generation tools`
  );

  await pause();
}
