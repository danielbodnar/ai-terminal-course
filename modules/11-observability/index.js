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
import { complete } from '../../lib/llm.js';
import { completeModule } from '../../lib/state.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  showHeader('MODULE 13', 'MONITORING & OBSERVABILITY');

  showBox('',
    `Time: ~45 mins │ Cost: ~$0.20 │ Progress: 13/14\n\n` +
    `See what your AI is doing in production\n` +
    `and know when it breaks before users do.`
  );

  await pause();

  // Why observability matters
  await whyObservability();

  // The blind spot
  await theBlindSpot();

  // What to track
  await whatToTrack();

  // Simple logging
  await simpleLogging();

  // Request tracing
  await requestTracing();

  // Cost analytics
  await costAnalytics();

  // Error monitoring
  await errorMonitoring();

  // Observability platforms
  await observabilityPlatforms();

  // Production patterns
  await productionPatterns();

  // Summary
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(13, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 13 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Why observability is critical\n` +
    `✓ 5 key metrics to track\n` +
    `✓ Request/response logging\n` +
    `✓ Cost tracking and analytics\n` +
    `✓ Error monitoring patterns\n` +
    `✓ Using observability platforms\n` +
    `✓ Production best practices\n\n` +
    `Next up: Capstone — Ship It!`
  );

  await pause('Press Enter to continue to Module 14...');
}

async function whyObservability() {
  clearScreen();
  showHeader('WHY OBSERVABILITY?');

  showBox('',
    `In production, LLM apps are BLACK BOXES.\n\n` +
    chalk.bold('You need to know:\n\n') +
    `• Is the app working?\n` +
    `• How much is it costing?\n` +
    `• Where are the bottlenecks?\n` +
    `• What queries fail?\n` +
    `• Are users happy?\n\n` +
    chalk.yellow("Without observability, you're flying blind.")
  );

  await pause();

  clearScreen();
  showBox('THE PRODUCTION REALITY',
    chalk.bold('Scenario: Your AI feature is live\n\n') +
    chalk.red('Week 1:\n') +
    `  • Users complain: "It's slow"\n` +
    `  • You have no latency data\n` +
    `  • Can't reproduce the issue\n\n` +
    chalk.red('Week 2:\n') +
    `  • AWS bill: $5,000 (expected: $500)\n` +
    `  • No idea which endpoints cost most\n` +
    `  • Can't debug without logs\n\n` +
    chalk.red('Week 3:\n') +
    `  • 30% of requests failing\n` +
    `  • No error tracking\n` +
    `  • Boss asks: "What's going on?"\n` +
    `  • You: "I don't know..."\n\n` +
    chalk.bold.red('This is why observability matters.')
  );

  await pause();
}

async function theBlindSpot() {
  clearScreen();
  showHeader('THE BLIND SPOT');

  showBox('',
    `Traditional monitoring tools miss LLM-specific issues:\n\n` +
    chalk.bold('Server monitoring (DataDog, New Relic):\n') +
    chalk.gray('  ✓ CPU, memory, uptime\n') +
    chalk.red('  ✗ Token usage\n') +
    chalk.red('  ✗ LLM latency\n') +
    chalk.red('  ✗ Prompt costs\n') +
    chalk.red('  ✗ Response quality\n\n') +
    chalk.bold('Need LLM-specific observability:\n') +
    chalk.green('  ✓ Every prompt & response\n') +
    chalk.green('  ✓ Token counts & costs\n') +
    chalk.green('  ✓ Model performance\n') +
    chalk.green('  ✓ User feedback\n') +
    chalk.green('  ✓ Quality metrics')
  );

  await pause();
}

async function whatToTrack() {
  clearScreen();
  showHeader('WHAT TO TRACK');

  showBox('THE 5 KEY METRICS',
    chalk.bold('1. LATENCY\n') +
    `   • Time to first token (TTFB)\n` +
    `   • Total generation time\n` +
    `   • P50, P95, P99 percentiles\n` +
    `   ${chalk.yellow('Target:')} <2s for most queries\n\n` +

    chalk.bold('2. COST\n') +
    `   • Per-request cost\n` +
    `   • Daily/monthly totals\n` +
    `   • Cost by endpoint\n` +
    `   ${chalk.yellow('Target:')} <$0.01 per query\n\n` +

    chalk.bold('3. ERRORS\n') +
    `   • Rate limit errors\n` +
    `   • Timeout errors\n` +
    `   • Invalid responses\n` +
    `   ${chalk.yellow('Target:')} <1% error rate\n\n` +

    chalk.bold('4. USAGE\n') +
    `   • Requests per second\n` +
    `   • Active users\n` +
    `   • Most used features\n` +
    `   ${chalk.yellow('Target:')} Know your patterns\n\n` +

    chalk.bold('5. QUALITY\n') +
    `   • User thumbs up/down\n` +
    `   • Task completion rate\n` +
    `   • Response accuracy\n` +
    `   ${chalk.yellow('Target:')} >90% satisfaction`
  );

  await pause();
}

async function simpleLogging() {
  clearScreen();
  showBox('DEMO: SIMPLE LOGGING',
    `Let's track a request manually...\n\n` +
    `We'll log: prompt, response, tokens, cost, latency`
  );

  await pause();

  clearScreen();
  console.log(chalk.cyan('\n📝 MAKING TRACKED REQUEST\n'));

  const prompt = "Explain quantum computing in one sentence.";
  console.log(chalk.gray('Prompt:'), chalk.white(prompt));
  console.log('');

  const spinner = ora('Calling LLM...').start();
  const requestStart = Date.now();

  const result = await complete({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  const latency = Date.now() - requestStart;
  spinner.succeed(`Response received in ${latency}ms`);

  console.log('');
  console.log(chalk.cyan('Response:'));
  console.log(chalk.white(result.content));

  console.log('');
  console.log(chalk.cyan('═'.repeat(60)));
  console.log(chalk.bold('\nREQUEST LOG\n'));

  const logEntry = {
    timestamp: new Date().toISOString(),
    prompt: prompt.substring(0, 50) + '...',
    response: result.content.substring(0, 50) + '...',
    model: 'gpt-4o-mini',
    promptTokens: result.usage.promptTokens,
    completionTokens: result.usage.completionTokens,
    totalTokens: result.usage.totalTokens,
    latencyMs: latency,
    cost: (result.usage.promptTokens * 0.15 / 1_000_000) + (result.usage.completionTokens * 0.60 / 1_000_000)
  };

  console.log(chalk.gray(JSON.stringify(logEntry, null, 2)));

  console.log('');
  showInsight(
    'This is the minimum you should log.\n' +
    'Store these logs for debugging and analytics.'
  );

  await pause();

  clearScreen();
  showBox('STRUCTURED LOGGING',
    chalk.bold('Store logs in a database:\n\n') +
    `CREATE TABLE llm_requests (\n` +
    `  id UUID PRIMARY KEY,\n` +
    `  timestamp TIMESTAMP,\n` +
    `  user_id VARCHAR,\n` +
    `  endpoint VARCHAR,\n` +
    `  model VARCHAR,\n` +
    `  prompt TEXT,\n` +
    `  response TEXT,\n` +
    `  prompt_tokens INT,\n` +
    `  completion_tokens INT,\n` +
    `  latency_ms INT,\n` +
    `  cost_usd DECIMAL(10,6),\n` +
    `  error TEXT,\n` +
    `  metadata JSONB\n` +
    `);\n\n` +
    chalk.bold('Benefits:\n') +
    `  • Query by user, time, endpoint\n` +
    `  • Calculate aggregates (avg cost, p95 latency)\n` +
    `  • Debug user issues\n` +
    `  • Analyze usage patterns`
  );

  await pause();
}

async function requestTracing() {
  clearScreen();
  showHeader('REQUEST TRACING');

  showBox('',
    `Trace requests through your system:\n\n` +
    chalk.cyan('User Request\n') +
    `  ↓\n` +
    chalk.yellow('API Gateway') + chalk.gray(' (10ms)\n') +
    `  ↓\n` +
    chalk.yellow('Auth Middleware') + chalk.gray(' (5ms)\n') +
    `  ↓\n` +
    chalk.yellow('Rate Limiter') + chalk.gray(' (2ms)\n') +
    `  ↓\n` +
    chalk.yellow('RAG Search') + chalk.gray(' (50ms)\n') +
    `  ↓\n` +
    chalk.yellow('LLM Call') + chalk.gray(' (1200ms)\n') +
    `  ↓\n` +
    chalk.yellow('Response Processing') + chalk.gray(' (3ms)\n') +
    `  ↓\n` +
    chalk.cyan('User Response\n\n') +
    chalk.bold('Total: 1270ms\n\n') +
    chalk.red('Bottleneck: LLM call (94% of time)')
  );

  await pause();

  clearScreen();
  showBox('DISTRIBUTED TRACING',
    chalk.bold('Add trace IDs to every request:\n\n') +
    `const traceId = generateId();\n\n` +
    `log({ traceId, event: 'request_start' });\n` +
    `log({ traceId, event: 'auth', duration: 5 });\n` +
    `log({ traceId, event: 'rag_search', duration: 50 });\n` +
    `log({ traceId, event: 'llm_call', duration: 1200 });\n` +
    `log({ traceId, event: 'request_complete' });\n\n` +
    chalk.bold('Benefits:\n') +
    `  • Follow request through entire system\n` +
    `  • Find bottlenecks\n` +
    `  • Debug failures\n` +
    `  • Visualize request flow\n\n` +
    chalk.yellow('Tool: ') + `OpenTelemetry for distributed tracing`
  );

  await pause();
}

async function costAnalytics() {
  clearScreen();
  showHeader('COST ANALYTICS');

  showBox('',
    `Track costs at every level...\n\n` +
    chalk.bold('Daily costs (last 7 days):\n\n') +
    `  Mon: $45.23  ████████████░░░░\n` +
    `  Tue: $52.10  ███████████████░\n` +
    `  Wed: $89.45  █████████████████████\n` +
    `  Thu: $91.20  █████████████████████░\n` +
    `  Fri: $78.90  ███████████████████░\n` +
    `  Sat: $34.20  ████████░░░░\n` +
    `  Sun: $28.50  ███████░░░░\n\n` +
    chalk.bold('Total this week: $419.58\n') +
    chalk.yellow('Trend: ') + chalk.red('↑ 23% vs last week')
  );

  await pause();

  clearScreen();
  showBox('COST BREAKDOWN',
    chalk.bold('By endpoint:\n\n') +
    `  /chat         $245.30  (58%)  ████████████\n` +
    `  /summarize    $102.15  (24%)  █████\n` +
    `  /search       $ 45.80  (11%)  ██\n` +
    `  /translate    $ 26.33  ( 6%)  █\n\n` +
    chalk.bold('By user:\n\n') +
    `  user_123      $125.40  (30%)  Heavy user\n` +
    `  user_456      $ 89.20  (21%)\n` +
    `  user_789      $ 67.30  (16%)\n` +
    `  Others        $137.68  (33%)\n\n` +
    chalk.bold('By model:\n\n') +
    `  gpt-4o-mini   $380.50  (91%)  ← Most usage\n` +
    `  gpt-4o        $ 39.08  ( 9%)  ← Expensive calls\n\n` +
    chalk.yellow('Action: ') + `Review gpt-4o usage, consider mini`
  );

  await pause();

  clearScreen();
  showBox('COST ALERTS',
    chalk.bold('Set up automatic alerts:\n\n') +
    chalk.yellow('⚠️  Warning Alerts:\n') +
    `  • Daily cost > $100\n` +
    `  • Single request > $1\n` +
    `  • User exceeds quota\n\n` +
    chalk.red('🚨 Critical Alerts:\n') +
    `  • Daily cost > $500\n` +
    `  • Unexpected spike (>200%)\n` +
    `  • Runway < 3 days\n\n` +
    chalk.bold('Example alert:\n\n') +
    `  Subject: Cost Alert - Daily limit exceeded\n` +
    `  \n` +
    `  Today's cost: $523.45 (limit: $500)\n` +
    `  Top spender: user_123 ($145.20)\n` +
    `  Spike: /chat endpoint (+350%)\n` +
    `  \n` +
    `  Action: Investigate user_123 usage`
  );

  await pause();
}

async function errorMonitoring() {
  clearScreen();
  showHeader('ERROR MONITORING');

  showBox('',
    chalk.bold('Track all errors:\n\n') +
    chalk.red('Rate Limit Errors (429):\n') +
    `  • OpenAI API rate limit hit\n` +
    `  • Solution: Implement exponential backoff\n` +
    `  • Prevention: Track TPM/RPM usage\n\n` +
    chalk.red('Timeout Errors:\n') +
    `  • LLM took >30s to respond\n` +
    `  • Solution: Set timeout + retry\n` +
    `  • Prevention: Use streaming\n\n` +
    chalk.red('Invalid Response:\n') +
    `  • JSON parsing failed\n` +
    `  • Solution: Use structured outputs\n` +
    `  • Prevention: Better prompting\n\n` +
    chalk.red('Context Length Exceeded:\n') +
    `  • Prompt + history > 128K tokens\n` +
    `  • Solution: Implement summarization\n` +
    `  • Prevention: Track context size`
  );

  await pause();

  clearScreen();
  showBox('ERROR DASHBOARD',
    chalk.bold('Error rate (last 24h):\n\n') +
    `  00:00-06:00:  0.5%  ░\n` +
    `  06:00-12:00:  1.2%  ██\n` +
    `  12:00-18:00:  3.8%  ███████░  ← Investigation needed\n` +
    `  18:00-00:00:  0.8%  █\n\n` +
    chalk.bold('Top errors:\n\n') +
    `  1. RateLimitError       125 (45%)  ← Fix urgently\n` +
    `  2. TimeoutError          89 (32%)\n` +
    `  3. InvalidJSONError      45 (16%)\n` +
    `  4. ContextLengthError    18 ( 6%)\n\n` +
    chalk.yellow('Action: ') + `Implement better rate limiting`
  );

  await pause();

  clearScreen();
  showBox('ERROR TRACKING CODE',
    chalk.bold('Log errors with context:\n\n') +
    `try {\n` +
    `  const result = await complete({\n` +
    `    messages,\n` +
    `    temperature: 0.7\n` +
    `  });\n` +
    `\n` +
    `  logSuccess({\n` +
    `    traceId,\n` +
    `    userId,\n` +
    `    endpoint: '/chat',\n` +
    `    latency,\n` +
    `    cost\n` +
    `  });\n` +
    `\n` +
    `} catch (error) {\n` +
    `  logError({\n` +
    `    traceId,\n` +
    `    userId,\n` +
    `    endpoint: '/chat',\n` +
    `    error: error.message,\n` +
    `    errorType: error.constructor.name,\n` +
    `    stack: error.stack,\n` +
    `    context: { messages, temperature }\n` +
    `  });\n` +
    `\n` +
    `  // Alert if critical\n` +
    `  if (isCritical(error)) {\n` +
    `    sendAlert(error);\n` +
    `  }\n` +
    `}`
  );

  await pause();
}

async function observabilityPlatforms() {
  clearScreen();
  showHeader('OBSERVABILITY PLATFORMS');

  showBox('',
    `Don't build from scratch. Use existing tools.\n\n` +
    chalk.bold('Popular platforms:')
  );

  await pause();

  clearScreen();
  showBox('HELICONE',
    chalk.bold('Open source LLM observability\n\n') +
    chalk.green('Pros:\n') +
    `  ✓ Free tier (10K requests/month)\n` +
    `  ✓ One-line integration\n` +
    `  ✓ OpenAI/Anthropic support\n` +
    `  ✓ Cost tracking\n` +
    `  ✓ Request logs\n` +
    `  ✓ User analytics\n\n` +
    chalk.bold('Setup:\n\n') +
    `  import OpenAI from 'openai';\n\n` +
    `  const client = new OpenAI({\n` +
    `    apiKey: process.env.OPENAI_API_KEY,\n` +
    `    baseURL: "https://oai.helicone.ai/v1",\n` +
    `    defaultHeaders: {\n` +
    `      "Helicone-Auth": "Bearer " + process.env.HELICONE_API_KEY\n` +
    `    }\n` +
    `  });\n\n` +
    chalk.yellow("That's it! ") + `All requests now tracked.\n\n` +
    chalk.gray('helicone.ai')
  );

  await pause();

  clearScreen();
  showBox('PORTKEY',
    chalk.bold('AI gateway with observability\n\n') +
    chalk.green('Pros:\n') +
    `  ✓ Multi-provider support\n` +
    `  ✓ Load balancing\n` +
    `  ✓ Fallbacks\n` +
    `  ✓ Caching\n` +
    `  ✓ A/B testing\n` +
    `  ✓ Advanced analytics\n\n` +
    chalk.bold('Setup:\n\n') +
    `  import Portkey from 'portkey-ai';\n\n` +
    `  const portkey = new Portkey({\n` +
    `    apiKey: process.env.PORTKEY_API_KEY,\n` +
    `    virtualKey: process.env.OPENAI_VIRTUAL_KEY\n` +
    `  });\n\n` +
    `  const response = await portkey.chat.completions.create({\n` +
    `    messages: [...],\n` +
    `    model: "gpt-4o-mini"\n` +
    `  });\n\n` +
    chalk.gray('portkey.ai')
  );

  await pause();

  clearScreen();
  showBox('LANGSMITH',
    chalk.bold('From LangChain team\n\n') +
    chalk.green('Pros:\n') +
    `  ✓ Deep LangChain integration\n` +
    `  ✓ Trace visualization\n` +
    `  ✓ Dataset management\n` +
    `  ✓ Prompt playground\n` +
    `  ✓ Evaluation tools\n\n` +
    chalk.yellow('Best for: ') + `LangChain users\n\n` +
    chalk.gray('smith.langchain.com')
  );

  await pause();

  clearScreen();
  showBox('ARIZE AI / PHOENIX',
    chalk.bold('ML observability platform\n\n') +
    chalk.green('Pros:\n') +
    `  ✓ Open source option (Phoenix)\n` +
    `  ✓ Embedding visualization\n` +
    `  ✓ Drift detection\n` +
    `  ✓ Model evaluation\n` +
    `  ✓ Production monitoring\n\n` +
    chalk.yellow('Best for: ') + `ML teams, advanced analytics\n\n` +
    chalk.gray('arize.com / phoenix.arize.com')
  );

  await pause();

  clearScreen();
  showBox('COMPARISON',
    chalk.bold('Which to choose?\n\n') +
    `${chalk.cyan('Helicone:')}\n` +
    `  • Just want request logging\n` +
    `  • Small team / side project\n` +
    `  • Need free tier\n\n` +
    `${chalk.cyan('Portkey:')}\n` +
    `  • Multi-provider setup\n` +
    `  • Need fallbacks & load balancing\n` +
    `  • Production-critical apps\n\n` +
    `${chalk.cyan('LangSmith:')}\n` +
    `  • Using LangChain\n` +
    `  • Need prompt management\n` +
    `  • Building eval pipelines\n\n` +
    `${chalk.cyan('Phoenix:')}\n` +
    `  • ML team\n` +
    `  • Need self-hosted\n` +
    `  • Advanced analytics\n\n` +
    chalk.yellow('Recommendation: ') + `Start with Helicone (free, simple)`
  );

  await pause();
}

async function productionPatterns() {
  clearScreen();
  showHeader('PRODUCTION PATTERNS');

  showBox('OBSERVABILITY STACK',
    chalk.bold('Layer 1: Application Logs\n') +
    `  • Winston, Pino, or built-in console\n` +
    `  • Log every LLM request/response\n` +
    `  • Include: user, endpoint, cost, latency\n\n` +
    chalk.bold('Layer 2: LLM Gateway\n') +
    `  • Helicone or Portkey\n` +
    `  • Automatic request tracking\n` +
    `  • Cost analytics\n` +
    `  • Error monitoring\n\n` +
    chalk.bold('Layer 3: Infrastructure\n') +
    `  • DataDog, New Relic, or Grafana\n` +
    `  • Server metrics (CPU, memory)\n` +
    `  • API latency\n` +
    `  • Uptime monitoring\n\n` +
    chalk.bold('Layer 4: Alerts\n') +
    `  • PagerDuty or Slack\n` +
    `  • Cost spikes\n` +
    `  • Error rate increases\n` +
    `  • Performance degradation`
  );

  await pause();

  clearScreen();
  showBox('METRICS TO DASHBOARD',
    chalk.bold('Essential dashboard widgets:\n\n') +
    `1. Request Rate\n` +
    `   • Requests/second over time\n` +
    `   • Identify usage patterns\n\n` +
    `2. Latency Distribution\n` +
    `   • P50, P95, P99 latency\n` +
    `   • Detect slowdowns\n\n` +
    `3. Error Rate\n` +
    `   • % of failed requests\n` +
    `   • Break down by error type\n\n` +
    `4. Cost Tracking\n` +
    `   • Daily spend\n` +
    `   • Cost per endpoint\n` +
    `   • Burn rate\n\n` +
    `5. Model Usage\n` +
    `   • Requests by model\n` +
    `   • Cost by model\n` +
    `   • Identify optimization opportunities\n\n` +
    `6. Top Users\n` +
    `   • Highest usage\n` +
    `   • Quota violations\n` +
    `   • Support priorities`
  );

  await pause();

  clearScreen();
  showBox('RETENTION & PRIVACY',
    chalk.bold('Data retention policy:\n\n') +
    `${chalk.yellow('Hot data')} (Last 7 days):\n` +
    `  • Full request/response logs\n` +
    `  • Fast queries\n` +
    `  • Debugging recent issues\n\n` +
    `${chalk.cyan('Warm data')} (7-90 days):\n` +
    `  • Aggregated metrics only\n` +
    `  • No PII\n` +
    `  • Analytics & trends\n\n` +
    `${chalk.gray('Cold data')} (90+ days):\n` +
    `  • Archive or delete\n` +
    `  • Compliance requirements\n` +
    `  • Cost optimization\n\n` +
    chalk.bold('Privacy considerations:\n') +
    `  • Hash user IDs\n` +
    `  • Redact PII from logs\n` +
    `  • Follow GDPR/CCPA\n` +
    `  • Encrypt at rest\n` +
    `  • Access controls`
  );

  await pause();

  clearScreen();
  showBox('BEST PRACTICES',
    chalk.bold('1. Log everything from day 1\n') +
    `   You can't debug what you didn't log\n\n` +
    chalk.bold('2. Set up alerts early\n') +
    `   Don't wait for problems to find you\n\n` +
    chalk.bold('3. Monitor costs daily\n') +
    `   Surprises are expensive\n\n` +
    chalk.bold('4. Track user satisfaction\n') +
    `   Metrics don't tell the full story\n\n` +
    chalk.bold('5. Use correlation IDs\n') +
    `   Connect logs across services\n\n` +
    chalk.bold('6. Automate incident response\n') +
    `   Error → Alert → Auto-retry → Escalate\n\n` +
    chalk.bold('7. Review dashboards weekly\n') +
    `   Find issues before users do\n\n` +
    chalk.bold('8. Document your runbooks\n') +
    `   "What to do when X happens"`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 13 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Concepts learned': '8',
    'Tools discovered': '4'
  });

  showBox('KEY TAKEAWAYS',
    `1. Observability is not optional in production\n` +
    `2. Track 5 key metrics: latency, cost, errors, usage, quality\n` +
    `3. Log every LLM request with full context\n` +
    `4. Use observability platforms (Helicone recommended)\n` +
    `5. Set up cost and error alerts\n` +
    `6. Implement distributed tracing\n` +
    `7. Dashboard the metrics that matter\n` +
    `8. Review logs and metrics regularly\n\n` +
    chalk.bold('The 3 layers:\n\n') +
    `• Application logs (your code)\n` +
    `• LLM gateway (Helicone/Portkey)\n` +
    `• Infrastructure (DataDog/Grafana)\n\n` +
    chalk.bold('Why this matters:\n') +
    `Without observability:\n` +
    `• Can't debug issues\n` +
    `• Can't control costs\n` +
    `• Can't optimize performance\n` +
    `• Can't prove ROI\n\n` +
    chalk.bold('You can now:\n') +
    `• Set up production monitoring\n` +
    `• Track costs and performance\n` +
    `• Debug issues quickly\n` +
    `• Make data-driven decisions\n\n` +
    chalk.bold('Next: ') + `Cost optimization & caching\n` +
    `(Make your LLM app 10x cheaper)`
  );

  await pause();
}
