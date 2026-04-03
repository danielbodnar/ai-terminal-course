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
  embed,
  embedBatch,
  cosineSimilarity,
  search,
  calculateEmbeddingCost,
  visualizeEmbedding,
  formatSimilarity,
  findOddOneOut,
  initEmbeddings
} from '../../lib/embeddings.js';
import { completeModule } from '../../lib/state.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  // Initialize embeddings client
  initEmbeddings(process.env.OPENAI_API_KEY);

  // Module header
  showHeader('MODULE 7', 'EMBEDDINGS & SEMANTIC SEARCH');

  showBox('',
    `Time: ~30 mins │ Cost: ~$0.05 │ Progress: 7/14\n\n` +
    `Discover how AI "understands" meaning.\n` +
    `Build your first semantic search engine.`
  );

  await pause();

  // Introduction
  await introduction();

  // First embedding
  await firstEmbedding();

  // Similarity comparison
  await similarityComparison();

  // Semantic search
  await semanticSearchDemo();

  // Build search engine
  await buildSearchEngine();

  // Odd one out game
  await oddOneOutGame();

  // Why embeddings matter
  await whyEmbeddingsMatter();

  // Summary
  await moduleSummary();

  // Complete module
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(7, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 7 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Text → Vector (embeddings)\n` +
    `✓ Cosine similarity (semantic matching)\n` +
    `✓ Semantic search (no keywords needed)\n` +
    `✓ Building a search engine from scratch\n` +
    `✓ Why embeddings ≠ LLM responses\n` +
    `✓ Cost optimization for embeddings\n\n` +
    `Next up: RAG — Chat With Your Data`
  );

  await pause('Press Enter to continue to Module 8...');
}

async function introduction() {
  clearScreen();
  showHeader('WHAT ARE EMBEDDINGS?');

  showBox('',
    `LLMs can't "understand" text directly.\n` +
    `They convert text to NUMBERS.\n\n` +
    `Embeddings = text represented as vectors\n\n` +
    `"AI is powerful" → [0.023, -0.451, 0.892, ...]\n\n` +
    `Similar meanings → Similar vectors\n` +
    `Different meanings → Different vectors`
  );

  await pause();

  clearScreen();
  showBox('THE MAGIC',
    `Once text is vectors, you can:\n\n` +
    `• Measure "similarity" mathematically\n` +
    `• Search by MEANING, not keywords\n` +
    `• Find related concepts\n` +
    `• Build recommendation systems\n` +
    `• Power RAG (Retrieval-Augmented Generation)\n\n` +
    `This is how ChatGPT "searches" your docs.`
  );

  await pause();
}

async function firstEmbedding() {
  clearScreen();
  showBox('YOUR FIRST EMBEDDING',
    `Let's turn text into a vector...`
  );

  const text = await getInput('Enter text:', 'AI is powerful');

  const spinner = ora('Generating embedding...').start();

  const result = await embed(text);
  const cost = calculateEmbeddingCost(result.usage.totalTokens);
  totalCost += cost;

  spinner.succeed('Embedding generated!');

  console.log('');
  showBox('INPUT', text);

  console.log('');
  showBox('EMBEDDING VECTOR',
    `Dimensions: ${result.dimensions}\n\n` +
    `First 10 values:\n` +
    result.embedding.slice(0, 10).map(v => v.toFixed(6)).join(', ') + ', ...\n\n' +
    chalk.gray(`(${result.dimensions} total numbers)`)
  );

  console.log('');
  console.log(chalk.cyan('Visualized (first 50 dimensions):'));
  const viz = visualizeEmbedding(result.embedding);
  viz.forEach((bar, idx) => {
    if (idx % 10 === 0) console.log('');
    process.stdout.write(chalk.yellow(bar.padEnd(22)));
  });
  console.log('\n');

  showStats({
    'Model': result.model,
    'Dimensions': result.dimensions,
    'Tokens used': result.usage.totalTokens,
    'Cost': `$${cost.toFixed(6)}`
  });

  showInsight('Each number captures a different "feature" of meaning');

  await pause();
}

async function similarityComparison() {
  clearScreen();
  showHeader('MEASURING SIMILARITY');

  showBox('',
    `Cosine similarity = how "similar" two vectors are\n\n` +
    `Score: -1 to 1\n` +
    `  1.0  = identical meaning\n` +
    `  0.0  = unrelated\n` +
    ` -1.0  = opposite (rare)\n\n` +
    `Let's compare some sentences...`
  );

  await pause();

  const comparisons = [
    ['AI is powerful', 'Machine learning is strong'],
    ['AI is powerful', 'I love pizza'],
    ['The cat sat on the mat', 'A feline rested on the rug'],
    ['Python is a programming language', 'Python is a type of snake']
  ];

  for (const [text1, text2] of comparisons) {
    clearScreen();
    showBox('COMPARISON',
      `"${text1}"\n\nvs\n\n"${text2}"`
    );

    const spinner = ora('Computing similarity...').start();

    const result1 = await embed(text1);
    const result2 = await embed(text2);
    const similarity = cosineSimilarity(result1.embedding, result2.embedding);

    const cost = calculateEmbeddingCost(
      result1.usage.totalTokens + result2.usage.totalTokens
    );
    totalCost += cost;

    spinner.stop();

    console.log('');
    const formatted = formatSimilarity(similarity);

    showBox('SIMILARITY SCORE',
      `${formatted.score} (${formatted.percentage})\n\n` +
      `${chalk.yellow(formatted.bar)}\n\n` +
      (similarity > 0.85 ? chalk.green('→ Highly similar! (semantically related)') :
       similarity > 0.70 ? chalk.blue('→ Somewhat similar') :
       similarity > 0.50 ? chalk.gray('→ Loosely related') :
       chalk.red('→ Not similar (different concepts)'))
    );

    await pause();
  }

  clearScreen();
  showBox('KEY INSIGHT',
    `Notice:\n\n` +
    `"AI is powerful" vs "Machine learning is strong"\n` +
    `  → High similarity (0.87+)\n` +
    `  → NO shared words!\n\n` +
    `This is SEMANTIC matching.\n` +
    `Understanding MEANING, not keywords.`
  );

  await pause();
}

async function semanticSearchDemo() {
  clearScreen();
  showHeader('SEMANTIC SEARCH');

  showBox('',
    `Traditional search: Keyword matching\n` +
    `  Query: "NYC weather"\n` +
    `  Finds: Documents with "NYC" AND "weather"\n\n` +
    `Semantic search: Meaning matching\n` +
    `  Query: "NYC weather"\n` +
    `  Finds: "New York temperature forecast"\n` +
    `         "Manhattan climate today"\n` +
    `         "Big Apple atmospheric conditions"\n\n` +
    `Same meaning, different words!`
  );

  await pause();

  clearScreen();
  showBox('DEMO: SEARCH WITHOUT KEYWORDS', '');

  // Sample documents
  const documents = [
    'The Eiffel Tower is in Paris, France',
    'Python is a popular programming language',
    'Machine learning models need training data',
    'Paris is known for its beautiful architecture',
    'JavaScript runs in web browsers',
    'Neural networks are inspired by the brain',
    'The Louvre museum is located in Paris',
    'TypeScript adds types to JavaScript'
  ];

  console.log(chalk.cyan('\nDocument collection:'));
  documents.forEach((doc, idx) => {
    console.log(chalk.gray(`  ${idx + 1}. ${doc}`));
  });

  console.log('');
  const query = await getInput('Search query:', 'French landmarks');

  const spinner = ora('Searching...').start();

  const searchResult = await search(query, documents, 3);
  const cost = calculateEmbeddingCost(searchResult.usage.totalTokens);
  totalCost += cost;

  spinner.succeed('Search complete!');

  console.log('');
  showBox('TOP 3 RESULTS',
    searchResult.results.map((r, idx) => {
      const formatted = formatSimilarity(r.similarity);
      return `${idx + 1}. ${r.text}\n   Similarity: ${formatted.percentage} ${formatted.bar}`;
    }).join('\n\n')
  );

  showInsight(
    `Query: "${query}"\n` +
    `No documents contain those exact words,\n` +
    `but we found semantically related results!`
  );

  await pause();
}

async function buildSearchEngine() {
  clearScreen();
  showBox('BUILD YOUR OWN SEARCH ENGINE',
    `Let's build a search engine for your own data.`
  );

  // Get documents from user
  const documents = [];

  console.log('');
  console.log(chalk.cyan('Enter 5-10 sentences (or "done" to finish):'));
  console.log(chalk.gray('Example: facts about different topics\n'));

  let count = 0;
  while (count < 10) {
    const doc = await getInput(`Document ${count + 1}:`, '');

    if (doc.toLowerCase() === 'done' && count >= 5) {
      break;
    }

    if (doc.toLowerCase() === 'done') {
      console.log(chalk.yellow('Need at least 5 documents. Keep going...\n'));
      continue;
    }

    if (doc.trim()) {
      documents.push(doc.trim());
      count++;
    }
  }

  clearScreen();
  showBox('YOUR SEARCH ENGINE',
    `Indexed ${documents.length} documents.\n\n` +
    `Try searching by meaning...`
  );

  // Let user search
  let keepSearching = true;

  while (keepSearching) {
    console.log('');
    const query = await getInput('Search:', '');

    if (!query.trim()) continue;

    const spinner = ora('Searching...').start();

    const searchResult = await search(query, documents, 3);
    const cost = calculateEmbeddingCost(searchResult.usage.totalTokens);
    totalCost += cost;

    spinner.stop();

    console.log('');
    console.log(chalk.cyan('Results:'));
    searchResult.results.forEach((r, idx) => {
      const formatted = formatSimilarity(r.similarity);
      console.log('');
      console.log(chalk.white(`${idx + 1}. ${r.text}`));
      console.log(chalk.gray(`   ${formatted.percentage} ${chalk.yellow(formatted.bar)}`));
    });

    console.log('');
    keepSearching = await askYesNo('Search again?');
  }

  clearScreen();
  showBox('WHAT YOU JUST BUILT',
    `A functional semantic search engine!\n\n` +
    `This is the foundation of:\n` +
    `• RAG (Retrieval-Augmented Generation)\n` +
    `• Document Q&A systems\n` +
    `• Recommendation engines\n` +
    `• Knowledge bases\n\n` +
    `You'll use this in Module 9.`
  );

  await pause();
}

async function oddOneOutGame() {
  clearScreen();
  showBox('GAME: FIND THE ODD ONE OUT',
    `Which text doesn't belong?\n` +
    `Embeddings will tell us...`
  );

  await pause();

  const examples = [
    {
      texts: [
        'Dogs are loyal pets',
        'Cats are independent animals',
        'Birds can fly and sing',
        'Python is a programming language',
        'Fish live in water'
      ],
      hint: 'One is about programming, not animals'
    },
    {
      texts: [
        'Machine learning requires data',
        'Neural networks learn patterns',
        'AI can solve complex problems',
        'I love eating pizza',
        'Deep learning uses multiple layers'
      ],
      hint: 'One is about food, not AI'
    }
  ];

  for (const example of examples) {
    clearScreen();
    console.log(chalk.cyan('\nWhich one doesn\'t belong?\n'));
    example.texts.forEach((text, idx) => {
      console.log(chalk.white(`  ${idx + 1}. ${text}`));
    });

    console.log('');
    const spinner = ora('Analyzing with embeddings...').start();

    const result = await findOddOneOut(example.texts);
    const cost = calculateEmbeddingCost(result.usage.totalTokens);
    totalCost += cost;

    await new Promise(resolve => setTimeout(resolve, 1500));
    spinner.succeed('Analysis complete!');

    console.log('');
    showBox('THE ODD ONE OUT',
      `"${result.oddOneOut.text}"\n\n` +
      `Average similarity to others: ${result.oddOneOut.avgSimilarity.toFixed(4)}\n\n` +
      chalk.gray(example.hint)
    );

    console.log('');
    console.log(chalk.cyan('All scores:'));
    result.allScores.forEach((score, idx) => {
      const bar = '█'.repeat(Math.round(score.avgSimilarity * 20));
      const isOdd = idx === 0;
      console.log(
        (isOdd ? chalk.red('→ ') : '  ') +
        chalk.white(score.text) +
        chalk.gray(` (${score.avgSimilarity.toFixed(4)}) `) +
        chalk.yellow(bar)
      );
    });

    await pause();
  }
}

async function whyEmbeddingsMatter() {
  clearScreen();
  showHeader('WHY EMBEDDINGS MATTER');

  showBox('EMBEDDINGS vs LLM CALLS',
    chalk.bold('LLM Call (gpt-4o-mini):\n') +
    `  • Generates TEXT\n` +
    `  • Cost: $0.15 per 1M input tokens\n` +
    `  • Speed: ~2s latency\n` +
    `  • Use: When you need a response\n\n` +
    chalk.bold('Embeddings:\n') +
    `  • Generates VECTORS\n` +
    `  • Cost: $0.02 per 1M tokens (7.5x cheaper!)\n` +
    `  • Speed: ~200ms latency\n` +
    `  • Use: When you need to search/match`
  );

  await pause();

  clearScreen();
  showBox('REAL-WORLD USE CASES',
    chalk.bold('1. RAG (Retrieval-Augmented Generation)\n') +
    `   • User asks: "What's our refund policy?"\n` +
    `   • Embed query → find relevant docs\n` +
    `   • Send docs + query to LLM\n` +
    `   • LLM answers with YOUR data\n\n` +
    chalk.bold('2. Semantic Search\n') +
    `   • Search docs by meaning, not keywords\n` +
    `   • "How do I cancel?" matches "Cancellation process"\n\n` +
    chalk.bold('3. Recommendation Systems\n') +
    `   • "Users who liked X also liked Y"\n` +
    `   • Find similar items by embedding\n\n` +
    chalk.bold('4. Duplicate Detection\n') +
    `   • Find similar support tickets\n` +
    `   • Cluster related issues\n\n` +
    chalk.bold('5. Classification\n') +
    `   • Embed incoming message\n` +
    `   • Find closest category by similarity`
  );

  await pause();

  clearScreen();
  showBox('PRODUCTION TIPS',
    chalk.bold('1. Cache embeddings\n') +
    `   • Don't re-embed same text\n` +
    `   • Store in database with text\n\n` +
    chalk.bold('2. Batch when possible\n') +
    `   • Embed 100 docs in one call\n` +
    `   • Much faster than 100 separate calls\n\n` +
    chalk.bold('3. Choose the right model\n') +
    `   • text-embedding-3-small: Fast, cheap (1536 dims)\n` +
    `   • text-embedding-3-large: Better accuracy (3072 dims)\n` +
    `   • 6.5x cost difference!\n\n` +
    chalk.bold('4. Use vector databases\n') +
    `   • Pinecone, Chroma, Qdrant, Weaviate\n` +
    `   • Fast similarity search at scale\n` +
    `   • You'll learn this in Module 9`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 7 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Embeddings generated': '~50',
    'Concepts learned': '7'
  });

  showBox('KEY TAKEAWAYS',
    `1. Embeddings = text as vectors (numbers)\n` +
    `2. Similar meaning → similar vectors\n` +
    `3. Cosine similarity measures semantic closeness\n` +
    `4. Semantic search = meaning-based, not keywords\n` +
    `5. Embeddings are 7.5x cheaper than LLM calls\n` +
    `6. Use embeddings for search, RAG, recommendations\n` +
    `7. Cache embeddings, batch when possible\n\n` +
    chalk.bold('Why this matters:\n') +
    `RAG (Module 9) is impossible without embeddings.\n` +
    `Every "chat with your docs" feature uses this.\n` +
    `This is how you give LLMs knowledge of YOUR data.\n\n` +
    chalk.bold('You can now:\n') +
    `• Build semantic search engines\n` +
    `• Find similar content\n` +
    `• Measure text similarity\n` +
    `• Understand the foundation of RAG`
  );

  await pause();
}
