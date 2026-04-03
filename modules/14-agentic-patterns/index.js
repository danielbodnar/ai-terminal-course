import chalk from 'chalk';
import {
  clearScreen,
  showHeader,
  showBox,
  showInsight,
  showSuccess,
  pause,
  showStats
} from '../../lib/ui.js';
import { completeModule } from '../../lib/state.js';
import { complete } from '../../lib/llm.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  showHeader('MODULE 9', 'AGENTIC PATTERNS');

  showBox('',
    `Time: ~50 mins │ Cost: ~$0.40 │ Progress: 9/14\n\n` +
    `Make your AI autonomous.\n` +
    `Learn to build agents that think and act.`
  );

  await pause();

  await whatAreAgents();
  await whyAgents();
  await reactPattern();
  await reactDemo();
  await toolLoops();
  await agentFrameworks();
  await realWorldAgents();
  await whenNotToUseAgents();
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(9, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 9 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ What agents are and why they matter\n` +
    `✓ ReAct pattern (Reasoning + Acting)\n` +
    `✓ Tool loops and multi-step reasoning\n` +
    `✓ Agent frameworks (LangGraph, AutoGPT)\n` +
    `✓ Real-world agent architectures\n` +
    `✓ When NOT to use agents\n\n` +
    `Next up: Evals & Testing`
  );

  await pause('Press Enter to continue to Module 10...');
}

async function whatAreAgents() {
  clearScreen();
  showHeader('WHAT ARE AGENTS?');

  showBox('',
    chalk.bold('Simple LLM:\n') +
    `User: "What's the weather?"\n` +
    `AI: "I don't have access to weather data."\n` +
    chalk.red('Dead end.\n\n') +
    chalk.bold('LLM Agent:\n') +
    `User: "What's the weather?"\n` +
    chalk.gray(`AI thinks: "I need to call a weather API"\n`) +
    chalk.gray(`AI calls: getWeather("San Francisco")\n`) +
    chalk.gray(`API returns: {temp: 65, condition: "sunny"}\n`) +
    `AI: "It's 65°F and sunny in San Francisco."\n` +
    chalk.green('Success!')
  );

  await pause();

  clearScreen();
  showBox('AGENT = LLM + TOOLS + LOOP',
    chalk.bold('Key components:\n\n') +
    `1. ${chalk.bold('LLM')}\n` +
    `   The "brain" that decides what to do\n\n` +
    `2. ${chalk.bold('Tools')}\n` +
    `   Functions the agent can call\n` +
    `   Examples: search, calculator, database\n\n` +
    `3. ${chalk.bold('Loop')}\n` +
    `   Agent keeps thinking and acting\n` +
    `   Until task is complete\n\n` +
    chalk.yellow('Think of it as: AI with superpowers')
  );

  await pause();
}

async function whyAgents() {
  clearScreen();
  showHeader('WHY USE AGENTS?');

  showBox('WHAT AGENTS CAN DO',
    chalk.bold('1. Multi-step tasks\n') +
    `   "Research X, summarize findings, email me"\n` +
    `   Agent breaks it down and executes\n\n` +
    chalk.bold('2. Dynamic problem solving\n') +
    `   "Fix this bug"\n` +
    `   Agent: reads code → identifies issue → writes fix\n\n` +
    chalk.bold('3. Real-world interactions\n') +
    `   "Book me a flight to NYC next week"\n` +
    `   Agent: searches flights → compares prices → books\n\n` +
    chalk.bold('4. Autonomous workflows\n') +
    `   "Monitor Twitter, summarize daily"\n` +
    `   Agent runs continuously, no human in loop`
  );

  await pause();

  clearScreen();
  showBox('SIMPLE LLM VS AGENT',
    chalk.bold('Question: "What are the top 3 AI papers this week?"\n\n') +
    chalk.bold('Simple LLM:\n') +
    chalk.red(`  "I don't have access to current papers."\n\n`) +
    chalk.bold('Agent:\n') +
    chalk.green(`  1. Search ArXiv for papers (last 7 days)\n`) +
    chalk.green(`  2. Filter by citations\n`) +
    chalk.green(`  3. Read abstracts\n`) +
    chalk.green(`  4. Rank by relevance\n`) +
    chalk.green(`  5. Return top 3 with summaries\n\n`) +
    `Agents can ${chalk.bold('DO')} things, not just ${chalk.bold('TALK')} about them`
  );

  await pause();
}

async function reactPattern() {
  clearScreen();
  showHeader('REACT: REASONING + ACTING');

  showBox('',
    chalk.bold('The ReAct pattern:\n\n') +
    `1. ${chalk.cyan('Thought')}: Reason about what to do\n` +
    `2. ${chalk.yellow('Action')}: Call a tool\n` +
    `3. ${chalk.green('Observation')}: See the result\n` +
    `4. Repeat until done\n\n` +
    chalk.gray('Example flow:\n\n') +
    chalk.cyan('Thought: "I need current weather data"\n') +
    chalk.yellow('Action: getWeather("Seattle")\n') +
    chalk.green('Observation: {temp: 52, rain: true}\n') +
    chalk.cyan('Thought: "Now I can answer"\n') +
    chalk.white('Answer: "It\'s 52°F and rainy in Seattle"')
  );

  await pause();

  clearScreen();
  showBox('REACT IN PRACTICE',
    chalk.bold('User: "What\'s 157 * 392?"\n\n') +
    chalk.cyan('Thought: ') + 'This requires precise calculation\n' +
    chalk.yellow('Action: ') + 'calculator("157 * 392")\n' +
    chalk.green('Observation: ') + '61,544\n' +
    chalk.cyan('Thought: ') + 'I have the answer\n' +
    chalk.white('Answer: ') + '"157 × 392 = 61,544"\n\n' +
    `${chalk.bold('Why it works:')}\n` +
    `• LLM knows WHEN to use tools\n` +
    `• Tools provide accurate data\n` +
    `• LLM interprets results for user`
  );

  await pause();
}

async function reactDemo() {
  clearScreen();
  showHeader('LIVE DEMO: SIMPLE AGENT');

  showBox('',
    `Let's build a mini agent.\n` +
    `Task: Answer "What's 234 + 567?"\n\n` +
    `Tools available:\n` +
    `• calculator(expression)\n\n` +
    `Watch the agent think and act...`
  );

  await pause();

  clearScreen();
  showInsight('Running agent...');

  const tools = [{
    name: 'calculator',
    description: 'Performs mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Math expression to evaluate' }
      },
      required: ['expression']
    }
  }];

  try {
    const userMessage = "What's 234 + 567?";

    showBox('USER REQUEST', userMessage);
    await pause();

    // First LLM call: decide what to do
    const step1 = await complete({
      messages: [{
        role: 'user',
        content: `You are an agent. You can call tools to help answer questions.\n\nAvailable tools:\n- calculator(expression): Performs math\n\nUser: ${userMessage}\n\nThink step by step. What tool should you call?`
      }],
      max_tokens: 150
    });

    totalCost += (300 * 0.15 + 150 * 0.60) / 1_000_000;

    clearScreen();
    showBox('AGENT REASONING', chalk.cyan(step1.content));
    await pause();

    // Simulate tool call
    showInsight('Agent calling: calculator("234 + 567")');
    await new Promise(r => setTimeout(r, 1000));

    const toolResult = 234 + 567;

    clearScreen();
    showBox('TOOL RESULT', chalk.green(`${toolResult}`));
    await pause();

    // Second LLM call: answer with result
    const step2 = await complete({
      messages: [{
        role: 'user',
        content: `User asked: ${userMessage}\n\nYou called calculator("234 + 567") and got: ${toolResult}\n\nNow provide a clear answer to the user.`
      }],
      max_tokens: 100
    });

    totalCost += (250 * 0.15 + 100 * 0.60) / 1_000_000;

    clearScreen();
    showBox('AGENT ANSWER', chalk.white(step2.content));
    await pause();

    clearScreen();
    showBox('AGENT FLOW RECAP',
      chalk.bold('What just happened:\n\n') +
      `1. ${chalk.cyan('Thought')}: "Need to calculate 234 + 567"\n` +
      `2. ${chalk.yellow('Action')}: calculator("234 + 567")\n` +
      `3. ${chalk.green('Observation')}: 801\n` +
      `4. ${chalk.white('Answer')}: "${step2.content.trim()}"\n\n` +
      `This is the ${chalk.bold('ReAct pattern')} in action!`
    );

    await pause();

  } catch (error) {
    showBox('ERROR', `Agent failed: ${error.message}`);
    await pause();
  }
}

async function toolLoops() {
  clearScreen();
  showHeader('TOOL LOOPS & MULTI-STEP');

  showBox('',
    chalk.bold('Complex task: "Find cheapest hotel in Paris for next weekend"\n\n') +
    chalk.bold('Agent loop:\n\n') +
    chalk.cyan('1. Thought: ') + 'Need to know date of next weekend\n' +
    chalk.yellow('   Action: ') + 'getDate()\n' +
    chalk.green('   Observation: ') + 'Next weekend is Dec 14-15\n\n' +
    chalk.cyan('2. Thought: ') + 'Search for hotels in Paris\n' +
    chalk.yellow('   Action: ') + 'searchHotels("Paris", "2024-12-14")\n' +
    chalk.green('   Observation: ') + 'Found 150 hotels\n\n' +
    chalk.cyan('3. Thought: ') + 'Sort by price, get cheapest\n' +
    chalk.yellow('   Action: ') + 'sortByPrice(hotels)\n' +
    chalk.green('   Observation: ') + 'Cheapest: Hotel ABC, $89/night\n\n' +
    chalk.cyan('4. Thought: ') + 'I have the answer\n' +
    chalk.white('   Answer: ') + '"Hotel ABC is $89/night"\n\n' +
    `${chalk.yellow('4 steps, 3 tool calls, 1 answer')}`
  );

  await pause();

  clearScreen();
  showBox('AGENT LOOP PSEUDOCODE',
    chalk.gray('async function agentLoop(userQuery) {\n') +
    chalk.gray('  let maxSteps = 10;\n') +
    chalk.gray('  let messages = [{ role: "user", content: userQuery }];\n\n') +
    chalk.gray('  for (let i = 0; i < maxSteps; i++) {\n') +
    chalk.gray('    // 1. LLM decides what to do\n') +
    chalk.gray('    const response = await llm(messages);\n\n') +
    chalk.gray('    // 2. Check if done\n') +
    chalk.gray('    if (response.finishReason === "stop") {\n') +
    chalk.gray('      return response.content; // Done!\n') +
    chalk.gray('    }\n\n') +
    chalk.gray('    // 3. Call tool\n') +
    chalk.gray('    const toolResult = await callTool(response.toolCall);\n\n') +
    chalk.gray('    // 4. Add to context, loop again\n') +
    chalk.gray('    messages.push({ role: "tool", content: toolResult });\n') +
    chalk.gray('  }\n') +
    chalk.gray('}\n\n') +
    chalk.yellow('Key: Loop until task is done or max steps')
  );

  await pause();
}

async function agentFrameworks() {
  clearScreen();
  showHeader('AGENT FRAMEWORKS');

  showBox('POPULAR FRAMEWORKS',
    chalk.bold('LangGraph (Recommended)\n') +
    `• Visual workflow builder\n` +
    `• State management\n` +
    `• Human-in-loop support\n` +
    `• Production-ready\n` +
    `• From LangChain team\n\n` +
    chalk.bold('AutoGPT\n') +
    `• Fully autonomous\n` +
    `• Task decomposition\n` +
    `• Memory management\n` +
    `• Can be unpredictable\n\n` +
    chalk.bold('CrewAI\n') +
    `• Multi-agent teams\n` +
    `• Role-based agents\n` +
    `• Collaborative workflows\n\n` +
    chalk.bold('Custom (DIY)\n') +
    `• Full control\n` +
    `• Simpler than you think\n` +
    `• ~100 lines of code`
  );

  await pause();

  clearScreen();
  showBox('LANGGRAPH WORKFLOW',
    chalk.bold('Define agent graph:\n\n') +
    chalk.gray('const graph = new StateGraph({\n') +
    chalk.gray('  nodes: {\n') +
    chalk.gray('    agent: callLLM,\n') +
    chalk.gray('    tools: callTools,\n') +
    chalk.gray('    human: askHuman\n') +
    chalk.gray('  },\n') +
    chalk.gray('  edges: {\n') +
    chalk.gray('    agent -> tools (if tool needed)\n') +
    chalk.gray('    agent -> human (if approval needed)\n') +
    chalk.gray('    tools -> agent (continue loop)\n') +
    chalk.gray('    human -> agent (after approval)\n') +
    chalk.gray('  }\n') +
    chalk.gray('});\n\n') +
    `Handles complexity:\n` +
    `• State management\n` +
    `• Error handling\n` +
    `• Checkpointing\n` +
    `• Parallel execution`
  );

  await pause();
}

async function realWorldAgents() {
  clearScreen();
  showHeader('REAL-WORLD AGENTS');

  showBox('EXAMPLE 1: CUSTOMER SUPPORT AGENT',
    chalk.bold('Capabilities:\n\n') +
    `1. Understand customer issue\n` +
    `2. Search knowledge base\n` +
    `3. Check order status (API call)\n` +
    `4. Draft response\n` +
    `5. Human reviews before sending\n\n` +
    chalk.bold('Tools:\n') +
    `• searchDocs(query)\n` +
    `• getOrderStatus(orderId)\n` +
    `• sendEmail(to, subject, body)\n\n` +
    chalk.green('Result: 60% of tickets handled automatically')
  );

  await pause();

  clearScreen();
  showBox('EXAMPLE 2: CODE REVIEW AGENT',
    chalk.bold('Workflow:\n\n') +
    `1. Monitor: Watch for new PRs\n` +
    `2. Analyze: Read code changes\n` +
    `3. Check: Run tests, linting\n` +
    `4. Search: Look for similar issues\n` +
    `5. Comment: Suggest improvements\n\n` +
    chalk.bold('Tools:\n') +
    `• readPR(prId)\n` +
    `• runTests()\n` +
    `• searchCodebase(query)\n` +
    `• postComment(prId, comment)\n\n` +
    chalk.green('Result: Catches 40% more bugs before merge')
  );

  await pause();

  clearScreen();
  showBox('EXAMPLE 3: RESEARCH AGENT',
    chalk.bold('Task: "Summarize latest AI safety papers"\n\n') +
    `Agent workflow:\n` +
    `1. Search ArXiv for "AI safety" (last 30 days)\n` +
    `2. Filter papers by citations (>10)\n` +
    `3. Download and read abstracts\n` +
    `4. Identify key themes\n` +
    `5. Generate executive summary\n` +
    `6. Email to researcher\n\n` +
    chalk.bold('Runs daily at 9am, fully autonomous\n\n') +
    chalk.green('Saves 2 hours/day of manual research')
  );

  await pause();
}

async function whenNotToUseAgents() {
  clearScreen();
  showHeader('WHEN NOT TO USE AGENTS');

  showBox('AGENTS ARE OVERKILL FOR:',
    chalk.bold('1. Simple, single-step tasks\n') +
    chalk.red('   ✗ "Summarize this text"\n') +
    chalk.green('   → Just use regular LLM call\n\n') +
    chalk.bold('2. Deterministic workflows\n') +
    chalk.red('   ✗ "Always do A, then B, then C"\n') +
    chalk.green('   → Write a simple script\n\n') +
    chalk.bold('3. Real-time requirements\n') +
    chalk.red('   ✗ "Must respond in <100ms"\n') +
    chalk.green('   → Agents are too slow (2-10s)\n\n') +
    chalk.bold('4. High-stakes, zero-error tolerance\n') +
    chalk.red('   ✗ "Execute financial transactions"\n') +
    chalk.green('   → Agents can make mistakes\n\n') +
    chalk.bold('5. Simple Q&A\n') +
    chalk.red('   ✗ "What is X?"\n') +
    chalk.green('   → Use RAG, not an agent')
  );

  await pause();

  clearScreen();
  showBox('AGENT RISKS',
    chalk.bold('1. Unpredictability\n') +
    `   Agent might take unexpected path\n\n` +
    chalk.bold('2. Cost\n') +
    `   Multiple LLM calls per task\n` +
    `   Can get expensive fast\n\n` +
    chalk.bold('3. Latency\n') +
    `   Tool loops take time\n` +
    `   2-30 seconds typical\n\n` +
    chalk.bold('4. Debugging difficulty\n') +
    `   Hard to trace agent decisions\n\n` +
    chalk.bold('5. Infinite loops\n') +
    `   Agent might get stuck\n` +
    `   ${chalk.yellow('Always set max steps!')}\n\n` +
    `Use agents wisely: ${chalk.bold('complex, multi-step tasks only')}`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 9 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Patterns learned': 'ReAct + loops',
    'Frameworks covered': '4'
  });

  showBox('KEY TAKEAWAYS',
    `1. Agents = LLM + Tools + Loop\n` +
    `2. ReAct pattern: Think → Act → Observe → Repeat\n` +
    `3. Tool loops enable multi-step reasoning\n` +
    `4. Use frameworks (LangGraph) for complex agents\n` +
    `5. Real-world: Customer support, code review, research\n` +
    `6. Don't use for simple tasks (overkill)\n` +
    `7. Always set max steps (avoid infinite loops)\n\n` +
    chalk.bold('Rule of thumb:\n') +
    `Single-step task? Regular LLM.\n` +
    `Multi-step with tools? Agent.\n\n` +
    chalk.bold('Next: ') + `Context engineering (advanced prompting)`
  );

  await pause();
}
