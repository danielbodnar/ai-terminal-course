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

  showHeader('MODULE 10', 'EVALS & TESTING');

  showBox('',
    `Time: ~45 mins │ Cost: ~$0.30 │ Progress: 10/14\n\n` +
    `How do you know your LLM app works?\n` +
    `Learn to test and measure LLM quality.`
  );

  await pause();

  await theTestingCrisis();
  await whyEvalsAreDifferent();
  await typesOfEvals();
  await simpleEvalDemo();
  await qualityMetrics();
  await evalFrameworks();
  await regressionTesting();
  await abTesting();
  await realWorldExample();
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(10, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 10 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Why traditional testing doesn't work for LLMs\n` +
    `✓ Types of evals (deterministic, model-based, human)\n` +
    `✓ Building custom eval functions\n` +
    `✓ Quality metrics (accuracy, relevance, safety)\n` +
    `✓ Using eval frameworks (Braintrust)\n` +
    `✓ Regression testing and A/B testing\n\n` +
    `Next up: Guardrails & Safety`
  );

  await pause('Press Enter to continue to Module 11...');
}

async function theTestingCrisis() {
  clearScreen();
  showHeader('THE TESTING CRISIS');

  showBox('',
    chalk.bold('Your traditional tests are useless.\n\n') +
    `You write a test:\n` +
    chalk.gray(`  expect(response).toBe("Paris")\n\n`) +
    `LLM returns:\n` +
    chalk.yellow(`  "The capital of France is Paris."\n\n`) +
    chalk.red('Test fails. ') + `But the answer is correct!\n\n` +
    `The problem: ${chalk.bold('LLMs are non-deterministic')}\n` +
    `Same input → Different outputs\n` +
    `You need a new approach.`
  );

  await pause();

  clearScreen();
  showBox('WHAT CAN GO WRONG',
    chalk.bold('Real production issues:\n\n') +
    `1. Hallucinations\n` +
    `   AI makes up facts\n` +
    `   Example: "Einstein invented the iPhone"\n\n` +
    `2. Inconsistent formatting\n` +
    `   Expected JSON, got markdown\n` +
    `   Breaking your parser\n\n` +
    `3. Prompt drift\n` +
    `   Works today, fails tomorrow\n` +
    `   Model updates changed behavior\n\n` +
    `4. Safety issues\n` +
    `   AI says something offensive\n` +
    `   Legal/PR nightmare\n\n` +
    `5. Latency regression\n` +
    `   Response time went from 2s → 20s\n` +
    `   Users leave`
  );

  await pause();
}

async function whyEvalsAreDifferent() {
  clearScreen();
  showHeader('WHY EVALS ARE DIFFERENT');

  showBox('TRADITIONAL TESTS VS EVALS',
    chalk.bold('Traditional tests:\n') +
    `• Deterministic (same input = same output)\n` +
    `• Exact matching (toBe, toEqual)\n` +
    `• Fast (milliseconds)\n` +
    `• Binary pass/fail\n\n` +
    chalk.bold('LLM evals:\n') +
    `• Non-deterministic (same input ≠ same output)\n` +
    `• Semantic matching (is meaning correct?)\n` +
    `• Slow (seconds per eval)\n` +
    `• Scored 0-1 (not just pass/fail)`
  );

  await pause();

  clearScreen();
  showBox('THE 3 TYPES OF EVALS',
    chalk.bold('1. Deterministic evals\n') +
    `   Check structure, not content\n` +
    `   Example: Is output valid JSON?\n` +
    `   Fast, reliable\n\n` +
    chalk.bold('2. Model-based evals\n') +
    `   Use another LLM to judge quality\n` +
    `   Example: "Is this answer helpful?"\n` +
    `   Slow, but scalable\n\n` +
    chalk.bold('3. Human evals\n') +
    `   Real humans rate outputs\n` +
    `   Gold standard\n` +
    `   Expensive, slow`
  );

  await pause();
}

async function typesOfEvals() {
  clearScreen();
  showHeader('WHAT TO EVALUATE');

  showBox('KEY METRICS',
    chalk.bold('1. Accuracy\n') +
    `   Is the answer factually correct?\n` +
    `   Example: Capital of France = Paris ✓\n\n` +
    chalk.bold('2. Relevance\n') +
    `   Does it answer the question?\n` +
    `   Example: Q: "What's 2+2?" A: "Math is fun!" ✗\n\n` +
    chalk.bold('3. Completeness\n') +
    `   Does it cover all required points?\n` +
    `   Example: Missing key information\n\n` +
    chalk.bold('4. Tone\n') +
    `   Is the style appropriate?\n` +
    `   Example: Too casual for legal docs\n\n` +
    chalk.bold('5. Safety\n') +
    `   No harmful/offensive content?\n` +
    `   Example: No PII leakage\n\n` +
    chalk.bold('6. Format\n') +
    `   Correct structure?\n` +
    `   Example: Valid JSON, proper markdown`
  );

  await pause();
}

async function simpleEvalDemo() {
  clearScreen();
  showHeader('LIVE DEMO: SIMPLE EVAL');

  showBox('',
    `Let's build a simple eval function.\n` +
    `Task: Summarize text in 1 sentence.\n\n` +
    `We'll check:\n` +
    `1. Is it 1-2 sentences? (deterministic)\n` +
    `2. Does it capture main point? (model-based)`
  );

  await pause();

  clearScreen();
  showInsight('Testing summarization quality...');

  const testText = `
    The Roman Empire was one of the largest empires in ancient history.
    At its peak, it controlled territories around the Mediterranean Sea.
    The empire lasted over 1,000 years before falling in 476 CE.
  `.trim();

  showBox('INPUT TEXT', testText);
  await pause();

  try {
    const summary = await complete({
      messages: [{
        role: 'user',
        content: `Summarize in exactly 1 sentence:\n\n${testText}`
      }],
      max_tokens: 50
    });

    totalCost += (200 * 0.15 + 50 * 0.60) / 1_000_000;

    clearScreen();
    showBox('GENERATED SUMMARY', summary.content);
    await pause();

    // Deterministic eval: count sentences
    const sentenceCount = (summary.content.match(/[.!?]+/g) || []).length;
    const passedLength = sentenceCount <= 2;

    clearScreen();
    showBox('EVAL 1: LENGTH CHECK',
      `Sentences: ${sentenceCount}\n` +
      `Expected: 1-2 sentences\n` +
      `Result: ${passedLength ? chalk.green('✓ PASS') : chalk.red('✗ FAIL')}`
    );

    await pause();

    // Model-based eval: check quality
    showInsight('Running model-based eval...');

    const evalResponse = await complete({
      messages: [{
        role: 'user',
        content: `Original text: ${testText}\n\nSummary: ${summary.content}\n\nDoes this summary accurately capture the main point? Answer only "yes" or "no" with brief reason.`
      }],
      max_tokens: 50
    });

    totalCost += (300 * 0.15 + 50 * 0.60) / 1_000_000;

    clearScreen();
    showBox('EVAL 2: QUALITY CHECK',
      chalk.bold('Model judgment:\n\n') +
      evalResponse.content + '\n\n' +
      `Result: ${evalResponse.content.toLowerCase().includes('yes') ? chalk.green('✓ PASS') : chalk.red('✗ FAIL')}`
    );

    await pause();

  } catch (error) {
    showBox('ERROR', `Eval failed: ${error.message}`);
    await pause();
  }
}

async function qualityMetrics() {
  clearScreen();
  showHeader('MEASURING QUALITY');

  showBox('SCORING METHODS',
    chalk.bold('1. Binary (Pass/Fail)\n') +
    `   Simple: Did it work?\n` +
    `   Example: Valid JSON? Yes/No\n\n` +
    chalk.bold('2. Numeric Score (0-1)\n') +
    `   How good is it?\n` +
    `   Example: Relevance = 0.85\n\n` +
    chalk.bold('3. Multi-dimensional\n') +
    `   Score multiple aspects\n` +
    `   Example:\n` +
    `     Accuracy: 0.9\n` +
    `     Tone: 0.7\n` +
    `     Completeness: 0.8\n` +
    `     Overall: 0.8`
  );

  await pause();

  clearScreen();
  showBox('AGGREGATE METRICS',
    chalk.bold('Track over time:\n\n') +
    `Pass rate: 87/100 = 87%\n` +
    `Average score: 0.82\n` +
    `P50 latency: 1.2s\n` +
    `P95 latency: 3.5s\n` +
    `Cost per eval: $0.0015\n\n` +
    chalk.yellow('Goal: Improve without breaking existing tests')
  );

  await pause();
}

async function evalFrameworks() {
  clearScreen();
  showHeader('EVAL FRAMEWORKS');

  showBox('POPULAR TOOLS',
    chalk.bold('Braintrust\n') +
    `• Full eval platform\n` +
    `• Dataset management\n` +
    `• Side-by-side comparison\n` +
    `• CI/CD integration\n` +
    `• Great for teams\n\n` +
    chalk.bold('Weights & Biases\n') +
    `• MLOps platform\n` +
    `• Experiment tracking\n` +
    `• Prompt versioning\n\n` +
    chalk.bold('LangSmith\n') +
    `• LangChain integration\n` +
    `• Tracing + evals\n` +
    `• Dataset curation\n\n` +
    chalk.bold('OpenAI Evals\n') +
    `• Open source\n` +
    `• Community datasets\n` +
    `• Model benchmarking`
  );

  await pause();

  clearScreen();
  showBox('BRAINTRUST WORKFLOW',
    chalk.bold('1. Create dataset\n') +
    chalk.gray(`   const dataset = [\n`) +
    chalk.gray(`     { input: "2+2", expected: "4" },\n`) +
    chalk.gray(`     { input: "3*3", expected: "9" }\n`) +
    chalk.gray(`   ];\n\n`) +
    chalk.bold('2. Run evals\n') +
    chalk.gray(`   for (const test of dataset) {\n`) +
    chalk.gray(`     const output = await myLLM(test.input);\n`) +
    chalk.gray(`     const score = eval(output, test.expected);\n`) +
    chalk.gray(`     braintrust.log({ ...test, output, score });\n`) +
    chalk.gray(`   }\n\n`) +
    chalk.bold('3. Compare runs\n') +
    `   See: Which prompt/model performed better?\n` +
    `   Track: Regressions over time`
  );

  await pause();
}

async function regressionTesting() {
  clearScreen();
  showHeader('REGRESSION TESTING');

  showBox('',
    chalk.bold('The problem:\n\n') +
    `You improve prompt for one case\n` +
    `Accidentally break 3 other cases\n\n` +
    chalk.bold('The solution: Golden datasets\n\n') +
    `1. Collect 50-100 real examples\n` +
    `2. Human-verify expected outputs\n` +
    `3. Run eval suite before every change\n` +
    `4. Track: Did score improve or regress?\n\n` +
    chalk.green('Catch regressions before production')
  );

  await pause();

  clearScreen();
  showBox('EXAMPLE: EMAIL CLASSIFIER',
    `Golden dataset: 100 emails\n\n` +
    chalk.bold('Baseline (v1):\n') +
    `  Accuracy: 92%\n` +
    `  Latency: 0.8s\n` +
    `  Cost: $0.002/email\n\n` +
    chalk.bold('New prompt (v2):\n') +
    `  Accuracy: 94% ${chalk.green('↑ +2%')}\n` +
    `  Latency: 0.9s ${chalk.yellow('↑ +0.1s')}\n` +
    `  Cost: $0.0025/email ${chalk.yellow('↑ +25%')}\n\n` +
    `Decision: Ship it?\n` +
    chalk.gray('Trade-off: Better accuracy, slightly more expensive')
  );

  await pause();
}

async function abTesting() {
  clearScreen();
  showHeader('A/B TESTING PROMPTS');

  showBox('',
    chalk.bold('Production A/B test:\n\n') +
    `Variant A (control): 50% traffic\n` +
    `Variant B (new): 50% traffic\n\n` +
    `Run for 1 week, measure:\n` +
    `• User satisfaction (thumbs up/down)\n` +
    `• Task completion rate\n` +
    `• Average rating\n` +
    `• Cost per request\n\n` +
    chalk.bold('Example results:\n\n') +
    `Variant A: 4.2/5 rating, $0.003/request\n` +
    `Variant B: 4.5/5 rating, $0.004/request\n\n` +
    chalk.green('Winner: Variant B (7% better, worth 33% cost increase)')
  );

  await pause();

  clearScreen();
  showBox('RUNNING A/B TESTS',
    chalk.gray('// Simple A/B test implementation\n\n') +
    chalk.gray('const variant = Math.random() < 0.5 ? "A" : "B";\n\n') +
    chalk.gray('const prompt = variant === "A"\n') +
    chalk.gray('  ? "Summarize concisely:"\n') +
    chalk.gray('  : "Provide a brief summary:";\n\n') +
    chalk.gray('const response = await llm(prompt + text);\n\n') +
    chalk.gray('// Log to analytics\n') +
    chalk.gray('analytics.track("llm_response", {\n') +
    chalk.gray('  variant,\n') +
    chalk.gray('  userId,\n') +
    chalk.gray('  satisfied: userThumbsUp\n') +
    chalk.gray('});\n\n') +
    `Track for 1000+ requests, analyze`
  );

  await pause();
}

async function realWorldExample() {
  clearScreen();
  showHeader('REAL-WORLD CASE STUDY');

  showBox('',
    chalk.bold('Company: ChatPDF\n\n') +
    `Problem: Random quality issues\n` +
    `Users complaining about wrong answers\n\n` +
    chalk.bold('Solution: Built eval suite\n\n') +
    `1. Collected 200 real questions\n` +
    `2. Human experts verified answers\n` +
    `3. Automated eval: 3 metrics\n` +
    `   • Factual accuracy\n` +
    `   • Completeness\n` +
    `   • Citation quality\n\n` +
    chalk.bold('Results:\n\n') +
    `• Found 15% of responses were incomplete\n` +
    `• Improved prompt → 95% pass rate\n` +
    `• Now runs on every deploy\n` +
    `• Caught 3 regressions in first month\n\n` +
    chalk.green('User complaints dropped 80%')
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 10 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Eval types learned': '3',
    'Frameworks covered': '4'
  });

  showBox('KEY TAKEAWAYS',
    `1. Traditional tests don't work for LLMs\n` +
    `2. Three eval types:\n` +
    `   • Deterministic (structure)\n` +
    `   • Model-based (quality)\n` +
    `   • Human (gold standard)\n` +
    `3. Measure multiple dimensions\n` +
    `4. Use eval frameworks (Braintrust)\n` +
    `5. Build golden datasets for regression testing\n` +
    `6. A/B test in production\n\n` +
    chalk.bold('Real impact:\n') +
    `Catch bugs before users do\n` +
    `Ship improvements confidently\n` +
    `Track quality over time\n\n` +
    chalk.bold('Next: ') + `Agentic patterns (autonomous AI)`
  );

  await pause();
}
