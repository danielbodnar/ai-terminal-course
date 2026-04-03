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

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  showHeader('MODULE 12', 'COST OPTIMIZATION & CACHING');

  showBox('',
    `Time: ~50 mins │ Cost: ~$0.15 │ Progress: 12/14\n\n` +
    `Cut your AI bill by 90% with smart model\n` +
    `routing and semantic caching.`
  );

  await pause();

  await theCostCrisis();
  await whereMoneyGoes();
  await modelSelection();
  await promptOptimization();
  await cachingStrategies();
  await batchProcessing();
  await budgetControls();
  await realWorldExample();
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(12, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 12 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Cost breakdown and optimization levers\n` +
    `✓ Model selection (10x cost difference)\n` +
    `✓ Prompt compression (50% savings)\n` +
    `✓ Caching strategies (90% reduction)\n` +
    `✓ Batch processing (50% cheaper)\n` +
    `✓ Budget controls and alerts\n\n` +
    `Next up: Monitoring & Observability`
  );

  await pause('Press Enter to continue to Module 13...');
}

async function theCostCrisis() {
  clearScreen();
  showHeader('THE COST CRISIS');

  showBox('',
    chalk.bold('Real story:\n\n') +
    `"We launched our AI feature on Monday.\n` +
    `By Friday, we got a $10,000 AWS bill.\n` +
    `Expected: $200.\n\n` +
    `We had to shut it down.\n` +
    `Our startup almost died."\n\n` +
    chalk.red('This happens more often than you think.')
  );

  await pause();

  clearScreen();
  showBox('WHY COSTS EXPLODE',
    chalk.bold('Common mistakes:\n\n') +
    `1. Using gpt-4 for everything\n` +
    `   gpt-4: $0.045 per 1K tokens (avg)\n` +
    `   gpt-4o-mini: $0.000375 per 1K tokens (avg)\n` +
    `   ${chalk.red('120x more expensive!')}\n\n` +
    `2. No caching\n` +
    `   Same questions asked repeatedly\n` +
    `   Paying full price every time\n` +
    `   Caching can save 70-90% of costs\n\n` +
    `3. Verbose prompts\n` +
    `   Using 1000 tokens when 200 would work\n` +
    `   5x more expensive than needed\n\n` +
    `4. No rate limiting\n` +
    `   One user makes 10,000 requests\n` +
    `   No budget controls\n\n` +
    `5. Inefficient context\n` +
    `   Sending 50K tokens every request\n` +
    `   When only 2K are needed`
  );

  await pause();
}

async function whereMoneyGoes() {
  clearScreen();
  showHeader('WHERE MONEY GOES');

  showBox('COST BREAKDOWN',
    chalk.bold('Example: 10,000 requests/day\n\n') +
    `Scenario 1: Unoptimized\n` +
    chalk.red(`  Model: gpt-4 ($30/1M input, $60/1M output)\n`) +
    chalk.red(`  Prompt: 1,000 tokens\n`) +
    chalk.red(`  Response: 500 tokens\n`) +
    chalk.red(`  Cost per request: $0.06\n`) +
    chalk.red(`  Daily: $600\n`) +
    chalk.red(`  Monthly: $18,000\n\n`) +
    `Scenario 2: Optimized\n` +
    chalk.green(`  Model: gpt-4o-mini ($0.15/1M input, $0.60/1M output)\n`) +
    chalk.green(`  Prompt: 250 tokens (75% reduction)\n`) +
    chalk.green(`  Response: 200 tokens\n`) +
    chalk.green(`  Prompt caching: 70% hit rate\n`) +
    chalk.green(`  Semantic cache: 30% hit rate\n`) +
    chalk.green(`  Cost per request: $0.0001\n`) +
    chalk.green(`  Daily: $1\n`) +
    chalk.green(`  Monthly: $30\n\n`) +
    chalk.bold('Savings: $17,970/month (99.8% reduction!)')
  );

  await pause();
}

async function modelSelection() {
  clearScreen();
  showBox('MODEL COMPARISON',
    chalk.bold('Cost per 1M tokens (2025 pricing):\n\n') +
    `gpt-4o:        $3.00 (input)  $10.00 (output)\n` +
    `gpt-4o-mini:   $0.15 (input)   $0.60 (output)\n` +
    `gpt-4-turbo:  $10.00 (input)  $30.00 (output)\n` +
    `gpt-3.5-turbo: $0.50 (input)   $1.50 (output)\n\n` +
    chalk.bold('Cost comparison (1000 tokens):\n') +
    `gpt-4o-mini: $0.00015 → ${chalk.green('BEST VALUE')}\n` +
    `gpt-4o:      $0.003 (20x more expensive)\n` +
    `gpt-4-turbo: $0.01 (67x more expensive)\n\n` +
    chalk.bold('Rule of thumb:\n\n') +
    `Use gpt-4o-mini for:\n` +
    `• Simple summaries\n` +
    `• Data extraction\n` +
    `• Classification\n` +
    `• Basic Q&A\n\n` +
    `Use gpt-4o for:\n` +
    `• Complex reasoning\n` +
    `• Long-form writing\n` +
    `• Critical decisions\n\n` +
    chalk.green('80/20 rule: Use mini for 80% of tasks')
  );

  await pause();
}

async function promptOptimization() {
  clearScreen();
  showHeader('PROMPT OPTIMIZATION');

  showBox('BEFORE: VERBOSE',
    chalk.gray('"Please help me summarize this text. Make it concise."\n\n') +
    chalk.red('65 tokens')
  );

  await pause();

  showBox('AFTER: OPTIMIZED',
    chalk.white('"Summarize concisely:"\n\n') +
    chalk.green('8 tokens (87% reduction!)')
  );

  await pause();
}

async function cachingStrategies() {
  clearScreen();
  showHeader('CACHING STRATEGIES');

  showBox('',
    chalk.bold('Strategy 1: Exact Match Cache\n\n') +
    `Hit rate: 10-20%\n` +
    `Implementation: Redis + hash\n\n` +
    chalk.bold('Strategy 2: Semantic Cache\n\n') +
    `Hit rate: 60-80%\n` +
    `Implementation: Embeddings + vector search\n\n` +
    chalk.bold('Economics:\n\n') +
    `10K queries/day, 80% cache hit:\n` +
    `Savings: $2.38/day = $71/month\n` +
    `ROI: 79% cost reduction`
  );

  await pause();
}

async function batchProcessing() {
  clearScreen();
  showHeader('BATCH PROCESSING');

  showBox('',
    `Batch API: 50% cheaper\n\n` +
    `Good for:\n` +
    `• Nightly reports\n` +
    `• Bulk processing\n` +
    `• Email summaries\n\n` +
    chalk.yellow('Trade latency for cost savings')
  );

  await pause();
}

async function budgetControls() {
  clearScreen();
  showHeader('BUDGET CONTROLS');

  showBox('',
    chalk.bold('1. Per-user limits\n') +
    `   Max requests/day\n\n` +
    chalk.bold('2. Cost tracking\n') +
    `   Monitor spend per user/endpoint\n\n` +
    chalk.bold('3. Emergency shutoff\n') +
    `   If daily cost > $500, disable service\n\n` +
    chalk.bold('4. Alerts\n') +
    chalk.yellow(`   Warning: Daily cost > $100\n`) +
    chalk.red(`   Critical: Daily cost > $500`)
  );

  await pause();
}

async function realWorldExample() {
  clearScreen();
  showHeader('REAL-WORLD CASE STUDY');

  showBox('',
    chalk.bold('DocChat optimization:\n\n') +
    `Before: $450/day\n` +
    `After:  $18/day\n\n` +
    chalk.bold('96% cost reduction\n\n') +
    `Changes made:\n` +
    `• Model: gpt-4 → gpt-4o-mini (80%)\n` +
    `• Added semantic caching (75% hit)\n` +
    `• Compressed prompts (60% reduction)\n` +
    `• Smart routing by complexity\n\n` +
    chalk.green('Savings: $12,960/month')
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 12 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Techniques learned': '6',
    'Potential savings': '>90%'
  });

  showBox('KEY TAKEAWAYS',
    `1. Caching = biggest saver (90%)\n` +
    `2. Use gpt-4o-mini for 80% of tasks\n` +
    `3. Optimize prompts (50% reduction)\n` +
    `4. Smart routing by complexity\n` +
    `5. Batch API for async work\n` +
    `6. Implement budget controls\n\n` +
    chalk.bold('Real impact:\n') +
    `90-95% cost reduction possible\n` +
    `$10K+ monthly savings common\n\n` +
    chalk.bold('Next: ') + `Evals & testing`
  );

  await pause();
}
