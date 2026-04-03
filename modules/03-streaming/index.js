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
import { createInterface } from 'readline';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  // Initialize LLM client
  initLLM(process.env.OPENAI_API_KEY);

  // Module header
  showHeader('MODULE 3', 'STREAMING');

  showBox('',
    `Time: ~30 mins │ Cost: ~$0.15 │ Progress: 3/14\n\n` +
    `Discover why ChatGPT feels instant.\n` +
    `Learn the secret to great AI UX.`
  );

  await pause();

  // Introduction
  await introduction();

  // The big demo - side by side
  await sideBySideDemo();

  // Metrics breakdown
  await metricsBreakdown();

  // How streaming works
  await howStreamingWorks();

  // Hands-on implementation
  await handsOnStreaming();

  // Error handling
  await errorHandling();

  // When to use streaming
  await whenToStream();

  // Summary
  await moduleSummary();

  // Complete module
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(3, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 3 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Blocking vs streaming responses\n` +
    `✓ Why streaming feels 5-10x faster\n` +
    `✓ Time to first token (TTFB) matters most\n` +
    `✓ How to implement streaming properly\n` +
    `✓ Error handling in streams\n` +
    `✓ When to use streaming vs blocking\n\n` +
    `Next up: Structured Outputs`
  );

  await pause('Press Enter to continue to Module 4...');
}

async function introduction() {
  clearScreen();
  showHeader('WHY STREAMING?');

  showBox('THE PROBLEM',
    `Traditional API call:\n\n` +
    `1. You send request\n` +
    `2. You wait... ⏳\n` +
    `3. You wait... ⏳\n` +
    `4. You wait... ⏳\n` +
    `5. You get full response (6 seconds later)\n\n` +
    `User experience: SLOW`
  );

  await pause();

  clearScreen();
  showBox('THE SOLUTION',
    `Streaming API call:\n\n` +
    `1. You send request\n` +
    `2. First word arrives (0.3s) ✓\n` +
    `3. More words arrive... (streaming)\n` +
    `4. More words arrive... (streaming)\n` +
    `5. Complete (6 seconds later)\n\n` +
    `User experience: FAST`
  );

  showInsight('Total time is THE SAME, but streaming FEELS 10x faster!');

  await pause();

  clearScreen();
  showBox('',
    `This is ChatGPT's secret.\n\n` +
    `Not faster models.\n` +
    `Not better servers.\n\n` +
    `Just streaming.\n\n` +
    `Let's see the difference...`
  );

  await pause();
}

async function sideBySideDemo() {
  clearScreen();
  showBox('SIDE-BY-SIDE COMPARISON',
    `We'll call the SAME prompt two ways.\n` +
    `Watch carefully...`
  );

  await pause();

  const prompt = 'Explain why the sky is blue in 3 sentences';

  clearScreen();
  console.log(chalk.bold('\n🔄 SIDE-BY-SIDE DEMO\n'));
  console.log(chalk.gray('Prompt: "') + chalk.white(prompt) + chalk.gray('"'));
  console.log('');

  // Draw the boxes
  const width = 35;
  console.log(
    chalk.cyan('┌' + '─'.repeat(width) + '┐') + '  ' +
    chalk.cyan('┌' + '─'.repeat(width) + '┐')
  );
  console.log(
    chalk.cyan('│') + chalk.bold(' BLOCKING').padEnd(width + 1) + chalk.cyan('│') + '  ' +
    chalk.cyan('│') + chalk.bold(' STREAMING').padEnd(width + 1) + chalk.cyan('│')
  );
  console.log(
    chalk.cyan('├' + '─'.repeat(width) + '┤') + '  ' +
    chalk.cyan('├' + '─'.repeat(width) + '┤')
  );

  // Store cursor position
  const startRow = 7;

  // Start both at the same time
  const blockingPromise = complete({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  const streamingPromise = (async () => {
    let fullText = '';
    let tokenCount = 0;
    let firstTokenTime = null;
    const startTime = Date.now();

    const stream = streamComplete({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    for await (const chunk of stream) {
      if (chunk.done) {
        return {
          content: fullText,
          timeToFirstToken: firstTokenTime - startTime,
          totalTime: Date.now() - startTime,
          tokenCount
        };
      }

      if (chunk.content) {
        if (!firstTokenTime) {
          firstTokenTime = Date.now();
        }
        fullText += chunk.content;
        tokenCount++;
      }
    }
  })();

  // Show streaming in real-time
  let streamingText = '';
  let blockingDone = false;
  let streamingDone = false;
  let blockingText = '';
  let blockingTime = 0;
  let streamingTime = 0;
  let streamingFirstToken = 0;

  const updateDisplay = () => {
    // Move cursor to starting position
    process.stdout.write(`\x1b[${startRow};0H`);

    // Blocking side
    const blockingLines = blockingDone
      ? wrapText(blockingText, width - 2)
      : [chalk.gray('⏳ Waiting...')];

    // Streaming side
    const streamingLines = streamingText
      ? wrapText(streamingText + chalk.yellow('▊'), width - 2)
      : [chalk.gray('⏳ Waiting...')];

    // Display lines
    const maxLines = 8;
    for (let i = 0; i < maxLines; i++) {
      const blockingLine = blockingLines[i] || '';
      const streamingLine = streamingLines[i] || '';

      console.log(
        chalk.cyan('│') + ' ' + blockingLine.padEnd(width - 1) + chalk.cyan('│') + '  ' +
        chalk.cyan('│') + ' ' + streamingLine.padEnd(width - 1) + chalk.cyan('│')
      );
    }

    // Bottom border
    console.log(
      chalk.cyan('└' + '─'.repeat(width) + '┘') + '  ' +
      chalk.cyan('└' + '─'.repeat(width) + '┘')
    );

    // Stats
    console.log('');
    if (streamingFirstToken > 0) {
      console.log(
        chalk.gray('TTFB:     ') + chalk.red('waiting...').padEnd(20) +
        chalk.green(`${streamingFirstToken}ms ✓`)
      );
    }

    if (blockingDone || streamingDone) {
      const blockingStatus = blockingDone ? chalk.green(`${blockingTime}ms ✓`) : chalk.yellow('waiting...');
      const streamingStatus = streamingDone ? chalk.green(`${streamingTime}ms ✓`) : chalk.yellow('streaming...');
      console.log(
        chalk.gray('Total:    ') + blockingStatus.padEnd(28) + streamingStatus
      );
    }
  };

  // Stream the streaming response
  const streamStart = Date.now();
  let ftbShown = false;

  const streamInterval = setInterval(async () => {
    const result = await Promise.race([
      streamingPromise.then(r => ({ type: 'streaming', result: r })),
      new Promise(resolve => setTimeout(() => resolve({ type: 'timeout' }), 50))
    ]);

    if (result.type === 'streaming') {
      streamingText = result.result.content;
      streamingDone = true;
      streamingTime = result.result.totalTime;
      streamingFirstToken = result.result.timeToFirstToken;
      clearInterval(streamInterval);
      updateDisplay();
    } else {
      // Update with partial text
      streamingPromise.then(r => {
        if (!streamingDone && r.content.length > streamingText.length) {
          streamingText = r.content;
          if (!ftbShown && streamingText.length > 0) {
            streamingFirstToken = Date.now() - streamStart;
            ftbShown = true;
          }
          updateDisplay();
        }
      }).catch(() => {});
    }
  }, 50);

  // Wait for blocking
  const blockingResult = await blockingPromise;
  blockingDone = true;
  blockingText = blockingResult.content;
  blockingTime = blockingResult.latency;

  // Wait for streaming to finish
  const streamingResult = await streamingPromise;
  streamingDone = true;
  streamingText = streamingResult.content;
  streamingTime = streamingResult.totalTime;
  streamingFirstToken = streamingResult.timeToFirstToken;

  clearInterval(streamInterval);
  updateDisplay();

  // Calculate costs
  const blockingCost = calculateCompletionCost(blockingResult.usage);
  totalCost += blockingCost.totalCost;

  // Estimate streaming cost (same tokens)
  totalCost += blockingCost.totalCost;

  console.log('');
  console.log('');

  showBox('RESULTS',
    `Blocking:\n` +
    `  TTFB: ${blockingTime}ms (you wait the full time)\n` +
    `  Total: ${blockingTime}ms\n\n` +
    `Streaming:\n` +
    `  TTFB: ${streamingFirstToken}ms (content appears fast!)\n` +
    `  Total: ${streamingTime}ms\n\n` +
    chalk.bold(`Streaming feels ${Math.round(blockingTime / streamingFirstToken)}x faster!`)
  );

  showInsight('Same total time. Drastically better user experience.');

  await pause();
}

function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

async function metricsBreakdown() {
  clearScreen();
  showHeader('THE METRICS THAT MATTER');

  showBox('',
    `Two key metrics:\n\n` +
    `1. TTFB (Time To First Byte)\n` +
    `   → How long until SOMETHING appears\n` +
    `   → User perception of speed\n\n` +
    `2. Total Time\n` +
    `   → How long until response complete\n` +
    `   → Actual processing time\n\n` +
    chalk.bold(`TTFB matters MORE than total time!`)
  );

  await pause();

  clearScreen();
  showBox('PERCEIVED PERFORMANCE',
    `Study: Users rate experiences based on TTFB, not total time.\n\n` +
    `Option A: Wait 5s, then get full response\n` +
    `Option B: Wait 0.3s for first word, 5s total\n\n` +
    `Users consistently rate Option B as "faster"\n` +
    `even though both take 5 seconds!\n\n` +
    `This is why ChatGPT feels so fast.`
  );

  await pause();

  clearScreen();

  const examples = [
    { name: 'Chat assistant', blocking: '❌ 3s wait, feels slow', streaming: '✓ 0.3s TTFB, feels instant' },
    { name: 'Code generation', blocking: '❌ 8s wait, user gives up', streaming: '✓ 0.4s TTFB, user stays' },
    { name: 'Search results', blocking: '❌ 2s wait, feels broken', streaming: '✓ 0.2s TTFB, feels snappy' },
    { name: 'Classification', blocking: '✓ 0.5s, acceptable', streaming: '❌ Overkill for short response' }
  ];

  console.log(chalk.bold('\nREAL-WORLD SCENARIOS\n'));

  examples.forEach(ex => {
    console.log(chalk.cyan(`\n${ex.name}:`));
    console.log(`  Blocking:  ${ex.blocking}`);
    console.log(`  Streaming: ${ex.streaming}`);
  });

  console.log('');
  showInsight('Use streaming for anything the user watches happen');

  await pause();
}

async function howStreamingWorks() {
  clearScreen();
  showHeader('HOW STREAMING WORKS');

  showBox('UNDER THE HOOD',
    `Blocking:\n` +
    `  1. LLM generates ALL tokens\n` +
    `  2. Sends complete response\n` +
    `  3. You receive everything at once\n\n` +
    `Streaming:\n` +
    `  1. LLM generates tokens\n` +
    `  2. Sends EACH token immediately\n` +
    `  3. You receive tokens as they're created\n\n` +
    `Protocol: Server-Sent Events (SSE)`
  );

  await pause();

  clearScreen();
  showBox('STREAMING RESPONSE FORMAT',
    `Each chunk looks like:\n\n` +
    chalk.gray(`{`) + `\n` +
    chalk.gray(`  "choices": [{`) + `\n` +
    chalk.gray(`    "delta": {`) + `\n` +
    chalk.yellow(`      "content": "The"`) + chalk.gray(`  ← One token`) + `\n` +
    chalk.gray(`    }`) + `\n` +
    chalk.gray(`  }]`) + `\n` +
    chalk.gray(`}`) + `\n\n` +
    `You concatenate chunks to build the full response.`
  );

  await pause();
}

async function handsOnStreaming() {
  clearScreen();
  showBox('HANDS-ON: WATCH THE STREAM',
    `You'll see each token arrive in real-time.`
  );

  const prompt = await getInput('Your prompt:', 'Tell me a short joke');

  clearScreen();
  console.log(chalk.cyan('\n📡 STREAMING...\n'));
  console.log(chalk.gray('─'.repeat(60)));
  console.log('');

  let fullText = '';
  let tokenCount = 0;
  let firstTokenTime = null;
  const streamStart = Date.now();

  process.stdout.write(chalk.white(''));

  const stream = streamComplete({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  for await (const chunk of stream) {
    if (chunk.done) {
      console.log(chalk.yellow('\n\n[DONE]'));
      console.log('');
      console.log(chalk.gray('─'.repeat(60)));
      console.log('');

      showStats({
        'First token': `${chunk.timeToFirstToken}ms`,
        'Total time': `${chunk.totalLatency}ms`,
        'Tokens': `~${chunk.estimatedTokens}`,
        'Avg per token': `${Math.round(chunk.totalLatency / chunk.estimatedTokens)}ms`
      });

      // Estimate cost
      const estimatedCost = (chunk.estimatedTokens * 2) / 1_000_000 * 0.60; // Rough estimate
      totalCost += estimatedCost;

      break;
    }

    if (chunk.content) {
      if (!firstTokenTime) {
        firstTokenTime = Date.now();
        console.log(chalk.green(`\n✓ First token: ${firstTokenTime - streamStart}ms\n`));
      }

      process.stdout.write(chalk.white(chunk.content));
      fullText += chunk.content;
      tokenCount++;

      // Small delay to make it visible
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }

  showInsight('Each token arrived as soon as it was generated');

  await pause();
}

async function errorHandling() {
  clearScreen();
  showHeader('ERROR HANDLING');

  showBox('STREAMS CAN BREAK',
    `What happens if:\n\n` +
    `• Network connection drops?\n` +
    `• User closes tab/cancels?\n` +
    `• API rate limit hit mid-stream?\n` +
    `• Content filter triggered?\n\n` +
    `You need to handle these gracefully.`
  );

  await pause();

  clearScreen();
  showBox('PRODUCTION PATTERNS',
    chalk.bold(`1. Always track finish_reason:\n`) +
    `   • "stop" = completed naturally ✓\n` +
    `   • "length" = hit max_tokens\n` +
    `   • "content_filter" = safety triggered\n` +
    `   • null = stream interrupted ✗\n\n` +
    chalk.bold(`2. Buffer partial responses:\n`) +
    `   • Store tokens as they arrive\n` +
    `   • If stream breaks, you have partial result\n` +
    `   • Can retry from last good state\n\n` +
    chalk.bold(`3. Set timeouts:\n`) +
    `   • If no data for 30s, abort\n` +
    `   • Prevents hanging streams\n\n` +
    chalk.bold(`4. Clean up connections:\n`) +
    `   • Always close stream when done\n` +
    `   • Prevent memory leaks`
  );

  await pause();
}

async function whenToStream() {
  clearScreen();
  showHeader('WHEN TO USE STREAMING');

  showBox('',
    chalk.bold(chalk.green('✓ USE STREAMING FOR:\n\n')) +
    `• Chat interfaces (users read as it types)\n` +
    `• Long-form content generation\n` +
    `• Code generation (developers read as it writes)\n` +
    `• Anything >100 tokens\n` +
    `• When user is watching the response\n\n` +
    chalk.bold(chalk.red('✗ DON\'T USE STREAMING FOR:\n\n')) +
    `• Classification (just need the label)\n` +
    `• Embeddings (no text output)\n` +
    `• Structured JSON output (need complete object)\n` +
    `• Anything <50 tokens (overhead not worth it)\n` +
    `• Background processing (no user watching)`
  );

  await pause();

  clearScreen();
  showBox('RULE OF THUMB',
    chalk.bold(`If a human is watching:\n`) +
    `  → Use streaming\n\n` +
    chalk.bold(`If processing in background:\n`) +
    `  → Use blocking\n\n` +
    chalk.bold(`When in doubt:\n`) +
    `  → Use streaming (better UX)`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 3 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'API calls made': '~5',
    'Concepts learned': '6'
  });

  showBox('KEY TAKEAWAYS',
    `1. Streaming = better UX, same total time\n` +
    `2. TTFB matters more than total latency\n` +
    `3. Users perceive streaming as 5-10x faster\n` +
    `4. Use streaming for anything users watch\n` +
    `5. Handle stream errors gracefully\n` +
    `6. Always check finish_reason\n\n` +
    chalk.bold('Why this matters:\n') +
    `Every chat interface, code generator, and AI assistant\n` +
    `uses streaming. This is the difference between\n` +
    `a product that feels fast vs one that feels broken.\n\n` +
    chalk.bold('ChatGPT isn\'t fast because of better models.\n') +
    chalk.bold('It\'s fast because it streams.')
  );

  await pause();
}
