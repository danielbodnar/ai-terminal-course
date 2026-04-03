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
  VectorStore,
  ragQuery,
  chunkText
} from '../../lib/rag.js';
import { initEmbeddings, calculateEmbeddingCost } from '../../lib/embeddings.js';
import { calculateCompletionCost } from '../../lib/llm.js';
import { completeModule } from '../../lib/state.js';

const startTime = Date.now();
let totalCost = 0;

export async function runModule() {
  clearScreen();

  initEmbeddings(process.env.OPENAI_API_KEY);

  showHeader('MODULE 8', 'RAG: CHAT WITH YOUR DATA');

  showBox('',
    `Time: ~50 mins │ Cost: ~$0.35 │ Progress: 8/14\n\n` +
    `Build AI that knows YOUR data, and learn\n` +
    `why chunking makes or breaks it.`
  );

  await pause();

  // The problem
  await theProblem();

  // What is RAG
  await whatIsRAG();

  // RAG pipeline
  await ragPipeline();

  // Build document store
  await buildDocumentStore();

  // First RAG query
  await firstRAGQuery();

  // Interactive Q&A
  await interactiveQA();

  // Quality evaluation
  await qualityEvaluation();

  // Production considerations
  await productionConsiderations();

  // Summary
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(8, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 8 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Why LLMs need external knowledge\n` +
    `✓ How RAG works (retrieve + generate)\n` +
    `✓ Building vector stores\n` +
    `✓ Semantic search for retrieval\n` +
    `✓ Context injection patterns\n` +
    `✓ Quality evaluation techniques\n` +
    `✓ Production RAG patterns\n\n` +
    `Next up: Agentic Patterns`
  );

  await pause('Press Enter to continue to Module 9...');
}

async function theProblem() {
  clearScreen();
  showHeader('THE PROBLEM');

  showBox('',
    `LLMs are trained on public data up to a cutoff date.\n\n` +
    chalk.bold("They DON'T know:\n\n") +
    `• Your company's internal docs\n` +
    `• Your product specifications\n` +
    `• Recent news (after training cutoff)\n` +
    `• Your personal data\n` +
    `• Anything proprietary\n\n` +
    `How do you give them this knowledge?`
  );

  await pause();

  clearScreen();
  showBox('OPTION 1: FINE-TUNING',
    chalk.bold('Re-train the model on your data\n\n') +
    chalk.red('Cons:\n') +
    `  ✗ Expensive ($1000s)\n` +
    `  ✗ Slow (days to weeks)\n` +
    `  ✗ Can't update quickly\n` +
    `  ✗ Risk of overfitting\n` +
    `  ✗ Requires ML expertise\n\n` +
    chalk.gray('Fine-tuning is for behavior, not knowledge.')
  );

  await pause();

  showBox('OPTION 2: PROMPTING',
    chalk.bold('Put all your data in the prompt\n\n') +
    chalk.red('Cons:\n') +
    `  ✗ Context window limits (128K tokens max)\n` +
    `  ✗ Expensive (send all data every time)\n` +
    `  ✗ Slow (process huge context)\n` +
    `  ✗ Information overload\n\n` +
    chalk.gray('Works for small docs, not scalable.')
  );

  await pause();

  showBox('OPTION 3: RAG',
    chalk.bold('Retrieve relevant docs, then generate\n\n') +
    chalk.green('Pros:\n') +
    `  ✓ Works with any amount of data\n` +
    `  ✓ Update knowledge instantly\n` +
    `  ✓ Cost-effective\n` +
    `  ✓ Fast responses\n` +
    `  ✓ Explainable (show sources)\n\n` +
    chalk.bold.yellow('This is the solution.')
  );

  await pause();
}

async function whatIsRAG() {
  clearScreen();
  showHeader('WHAT IS RAG?');

  showBox('',
    chalk.bold('Retrieval-Augmented Generation\n\n') +
    `A two-step process:\n\n` +
    chalk.yellow('1. RETRIEVAL\n') +
    `   Find relevant documents from your data\n\n` +
    chalk.yellow('2. GENERATION\n') +
    `   Use those docs to answer the question`
  );

  await pause();

  clearScreen();
  showBox('HOW IT WORKS',
    chalk.bold('Setup (once):\n') +
    `  1. Split documents into chunks\n` +
    `  2. Create embeddings for each chunk\n` +
    `  3. Store in vector database\n\n` +
    chalk.bold('Query (every time):\n') +
    `  1. User asks: "What's the refund policy?"\n` +
    `  2. Embed the question\n` +
    `  3. Search for similar chunks (semantic search)\n` +
    `  4. Get top 3 most relevant chunks\n` +
    `  5. Put chunks in prompt as "context"\n` +
    `  6. LLM generates answer using context\n\n` +
    chalk.bold('Result: ') + `LLM answers using YOUR data!`
  );

  await pause();

  clearScreen();
  showBox('THE MAGIC',
    `Traditional search:\n` +
    chalk.gray('  Query: "refund policy"\n') +
    chalk.gray('  Finds: Documents with "refund" AND "policy"\n\n') +
    `RAG search:\n` +
    chalk.yellow('  Query: "Can I get my money back?"\n') +
    chalk.yellow('  Finds: Refund policy docs\n') +
    chalk.yellow('         (even without those words!)\n\n') +
    chalk.bold('Semantic matching = understands meaning.')
  );

  await pause();
}

async function ragPipeline() {
  clearScreen();
  showHeader('RAG PIPELINE');

  showBox('STEP-BY-STEP',
    chalk.cyan('INDEXING PHASE (Setup)\n\n') +
    `┌─────────────┐\n` +
    `│  Documents  │\n` +
    `└──────┬──────┘\n` +
    `       │\n` +
    `       ▼\n` +
    `┌─────────────┐\n` +
    `│   Chunking  │ ← Split into pieces\n` +
    `└──────┬──────┘\n` +
    `       │\n` +
    `       ▼\n` +
    `┌─────────────┐\n` +
    `│  Embeddings │ ← Convert to vectors\n` +
    `└──────┬──────┘\n` +
    `       │\n` +
    `       ▼\n` +
    `┌─────────────┐\n` +
    `│ Vector Store│ ← Store for search\n` +
    `└─────────────┘`
  );

  await pause();

  clearScreen();
  showBox('',
    chalk.cyan('QUERY PHASE (Every request)\n\n') +
    `┌─────────────┐\n` +
    `│    Query    │ "What's the refund policy?"\n` +
    `└──────┬──────┘\n` +
    `       │\n` +
    `       ▼\n` +
    `┌─────────────┐\n` +
    `│   Embed     │ ← Convert query to vector\n` +
    `└──────┬──────┘\n` +
    `       │\n` +
    `       ▼\n` +
    `┌─────────────┐\n` +
    `│   Search    │ ← Find similar chunks\n` +
    `└──────┬──────┘\n` +
    `       │\n` +
    `       ▼\n` +
    `┌─────────────┐\n` +
    `│ Top 3 Chunks│ ← Retrieve relevant docs\n` +
    `└──────┬──────┘\n` +
    `       │\n` +
    `       ▼\n` +
    `┌─────────────┐\n` +
    `│  LLM + Context │ ← Generate answer\n` +
    `└──────┬──────┘\n` +
    `       │\n` +
    `       ▼\n` +
    `┌─────────────┐\n` +
    `│   Answer    │ "You can request a refund..."\n` +
    `└─────────────┘`
  );

  await pause();
}

async function buildDocumentStore() {
  clearScreen();
  showBox('BUILD: DOCUMENT STORE',
    `Let's create a knowledge base about AI.\n\n` +
    `We'll add documents and make them searchable.`
  );

  await pause();

  // Sample documents about AI
  const documents = [
    "Machine learning is a subset of artificial intelligence that enables computers to learn from data without being explicitly programmed. It uses algorithms to identify patterns and make decisions.",

    "Deep learning is a type of machine learning that uses neural networks with multiple layers. It's particularly effective for image recognition, natural language processing, and speech recognition tasks.",

    "Natural Language Processing (NLP) allows computers to understand, interpret, and generate human language. Applications include chatbots, translation services, and sentiment analysis.",

    "Computer vision enables machines to interpret and understand visual information from the world. It powers facial recognition, autonomous vehicles, and medical image analysis.",

    "Reinforcement learning is a machine learning paradigm where agents learn to make decisions by interacting with an environment and receiving rewards or penalties.",

    "Transfer learning allows models trained on one task to be adapted for related tasks. This saves time and computational resources by leveraging pre-trained models.",

    "Transformers are a neural network architecture that revolutionized NLP. They use attention mechanisms to process sequential data and power models like GPT and BERT.",

    "Large Language Models (LLMs) like GPT-4 are trained on massive amounts of text data. They can generate human-like text, answer questions, write code, and more.",

    "Embeddings are vector representations of data that capture semantic meaning. They enable similarity search and are fundamental to modern AI applications.",

    "AI ethics focuses on ensuring AI systems are fair, transparent, and beneficial. Key concerns include bias, privacy, accountability, and societal impact."
  ];

  clearScreen();
  console.log(chalk.cyan('\n📚 CREATING KNOWLEDGE BASE\n'));

  console.log(chalk.white('Documents to index:'));
  documents.slice(0, 3).forEach((doc, idx) => {
    console.log(chalk.gray(`  ${idx + 1}. ${doc.substring(0, 60)}...`));
  });
  console.log(chalk.gray(`  ... and ${documents.length - 3} more\n`));

  showInsight('Total: 10 documents about AI concepts');

  await pause();

  clearScreen();
  const spinner = ora('Creating vector store...').start();

  const vectorStore = new VectorStore();

  await new Promise(resolve => setTimeout(resolve, 500));
  spinner.text = 'Generating embeddings...';

  const result = await vectorStore.add(documents);

  const embeddingCost = calculateEmbeddingCost(result.usage.totalTokens);
  totalCost += embeddingCost;

  spinner.succeed('Knowledge base created!');

  console.log('');
  showStats({
    'Documents indexed': documents.length,
    'Embeddings generated': documents.length,
    'Vector dimensions': '1536',
    'Storage': 'In-memory',
    'Cost': `$${embeddingCost.toFixed(6)}`
  });

  console.log('');
  showInsight('This happens ONCE. Now we can query it many times!');

  await pause();

  return vectorStore;
}

async function firstRAGQuery(vectorStore) {
  if (!vectorStore) {
    vectorStore = await buildDocumentStore();
  }

  clearScreen();
  showBox('YOUR FIRST RAG QUERY',
    `Let's ask a question about the documents...`
  );

  await pause();

  const query = "What is deep learning?";

  clearScreen();
  showBox('QUERY', query);

  console.log('');
  console.log(chalk.cyan('STEP 1: RETRIEVAL\n'));

  const spinner1 = ora('Searching for relevant documents...').start();

  const searchResult = await vectorStore.search(query, 3);

  const searchCost = calculateEmbeddingCost(searchResult.usage.totalTokens);
  totalCost += searchCost;

  spinner1.succeed('Found relevant documents!');

  console.log('');
  searchResult.results.forEach((result, idx) => {
    console.log(chalk.yellow(`[${idx + 1}] Similarity: ${(result.similarity * 100).toFixed(1)}%`));
    console.log(chalk.white(`    ${result.document.substring(0, 80)}...`));
    console.log('');
  });

  await pause('Press Enter for STEP 2: GENERATION...');

  console.log('');
  console.log(chalk.cyan('STEP 2: GENERATION\n'));

  const spinner2 = ora('Generating answer with context...').start();

  const ragResult = await ragQuery(query, vectorStore, {
    topK: 3,
    systemPrompt: 'You are a helpful AI assistant. Answer questions based on the provided context. Be concise and accurate.'
  });

  const genCost = calculateCompletionCost(ragResult.usage.generation);
  totalCost += genCost.totalCost;

  spinner2.succeed('Answer generated!');

  console.log('');
  showBox('ANSWER', ragResult.answer);

  console.log('');
  showBox('SOURCES',
    ragResult.context.map((ctx, idx) =>
      `[${idx + 1}] ${(ctx.similarity * 100).toFixed(0)}% match: ${ctx.document.substring(0, 60)}...`
    ).join('\n\n')
  );

  console.log('');
  showStats({
    'Retrieval cost': `$${searchCost.toFixed(6)}`,
    'Generation cost': `$${genCost.totalCost.toFixed(6)}`,
    'Total': `$${(searchCost + genCost.totalCost).toFixed(6)}`
  });

  console.log('');
  showInsight('The LLM used the retrieved documents to answer!');

  await pause();

  return vectorStore;
}

async function interactiveQA(vectorStore) {
  if (!vectorStore) {
    vectorStore = await buildDocumentStore();
  }

  clearScreen();
  showBox('INTERACTIVE Q&A',
    `Ask questions about AI concepts.\n\n` +
    `The system will:\n` +
    `  1. Find relevant documents\n` +
    `  2. Show which ones it found\n` +
    `  3. Generate an answer\n\n` +
    `Type "quit" to exit.`
  );

  await pause();

  clearScreen();
  console.log(chalk.bold('\n🤖 AI KNOWLEDGE BASE Q&A\n'));
  console.log(chalk.gray('Ask questions about: ML, NLP, computer vision, etc.\n'));

  let questionCount = 0;

  while (questionCount < 5) {
    const question = await getInput('Question:', '');

    if (question.toLowerCase() === 'quit' || !question.trim()) {
      break;
    }

    questionCount++;
    console.log('');

    const spinner = ora('Searching & generating...').start();

    const result = await ragQuery(question, vectorStore, {
      topK: 3,
      temperature: 0.7
    });

    const searchCost = calculateEmbeddingCost(result.usage.search.totalTokens);
    const genCost = calculateCompletionCost(result.usage.generation);
    totalCost += searchCost + genCost.totalCost;

    spinner.stop();

    console.log(chalk.cyan('Answer: ') + chalk.white(result.answer));
    console.log('');

    console.log(chalk.gray('Sources:'));
    result.context.forEach((ctx, idx) => {
      console.log(chalk.gray(
        `  [${idx + 1}] ${(ctx.similarity * 100).toFixed(0)}% - ${ctx.document.substring(0, 50)}...`
      ));
    });

    console.log('');
    console.log(chalk.gray(`Cost: $${(searchCost + genCost.totalCost).toFixed(6)}\n`));
  }

  if (questionCount > 0) {
    console.log('');
    showBox('Q&A SESSION COMPLETE',
      `Questions answered: ${questionCount}\n` +
      `Average cost: $${(totalCost / questionCount).toFixed(6)} per question\n\n` +
      chalk.bold('Notice:\n') +
      `• Answers are based on YOUR documents\n` +
      `• Sources are cited\n` +
      `• Consistent cost per query\n` +
      `• Fast responses`
    );

    await pause();
  }

  return vectorStore;
}

async function qualityEvaluation() {
  clearScreen();
  showHeader('QUALITY EVALUATION');

  showBox('',
    `RAG quality depends on retrieval accuracy.\n\n` +
    chalk.bold('Key metrics:\n\n') +
    `1. Retrieval precision\n` +
    `   → Are retrieved docs actually relevant?\n\n` +
    `2. Retrieval recall\n` +
    `   → Did we find all relevant docs?\n\n` +
    `3. Answer accuracy\n` +
    `   → Is the final answer correct?\n\n` +
    `4. Citation quality\n` +
    `   → Can we trace answer to sources?`
  );

  await pause();

  clearScreen();
  showBox('WHAT CAN GO WRONG',
    chalk.bold('Problem 1: Poor retrieval\n') +
    `  Query: "How do I cancel?"\n` +
    `  Retrieved: Shipping policy (irrelevant!)\n` +
    `  Result: Wrong answer\n\n` +
    chalk.bold('Problem 2: Missing context\n') +
    `  Retrieved docs don't contain the answer\n` +
    `  Result: LLM hallucinates or says "I don't know"\n\n` +
    chalk.bold('Problem 3: Conflicting info\n') +
    `  Doc 1: "Refunds within 30 days"\n` +
    `  Doc 2: "Refunds within 14 days"\n` +
    `  Result: Confused or contradictory answer\n\n` +
    chalk.bold('Problem 4: Context overload\n') +
    `  Too many documents (>5)\n` +
    `  Result: LLM loses focus, slow, expensive`
  );

  await pause();

  clearScreen();
  showBox('IMPROVING RAG QUALITY',
    chalk.bold('1. Better chunking\n') +
    `   • Optimal chunk size (500-1000 chars)\n` +
    `   • Preserve context (don't split mid-sentence)\n` +
    `   • Add metadata (source, date, section)\n\n` +
    chalk.bold('2. Query optimization\n') +
    `   • Rephrase vague queries\n` +
    `   • Expand acronyms\n` +
    `   • Add context from chat history\n\n` +
    chalk.bold('3. Retrieval tuning\n') +
    `   • Adjust topK (3-5 is sweet spot)\n` +
    `   • Set similarity threshold (>0.7)\n` +
    `   • Use hybrid search (keyword + semantic)\n\n` +
    chalk.bold('4. Prompt engineering\n') +
    `   • Clear instructions: "Answer ONLY from context"\n` +
    `   • Handle no-matches: "Say you don't know"\n` +
    `   • Cite sources: "Include [1], [2] references"`
  );

  await pause();

  clearScreen();
  showBox('TESTING RAG SYSTEMS',
    chalk.bold('Build test suite:\n\n') +
    `1. Golden Q&A pairs\n` +
    `   Question → Expected answer\n\n` +
    `2. Negative tests\n` +
    `   Questions with no answer in docs\n` +
    `   Expected: "I don't know"\n\n` +
    `3. Edge cases\n` +
    `   Ambiguous questions\n` +
    `   Multi-hop reasoning\n` +
    `   Recent vs old info\n\n` +
    chalk.bold('Measure:\n') +
    `• % correct answers\n` +
    `• % with proper citations\n` +
    `• % false positives (made up info)\n` +
    `• Average response time\n\n` +
    chalk.yellow('Tip: ') + `Start with 20-50 test cases`
  );

  await pause();
}

async function productionConsiderations() {
  clearScreen();
  showHeader('PRODUCTION RAG');

  showBox('ARCHITECTURE',
    chalk.bold('Components you need:\n\n') +
    `1. Vector Database\n` +
    `   • Pinecone, Qdrant, Chroma, Weaviate\n` +
    `   • Handles millions of vectors\n` +
    `   • Fast similarity search (<50ms)\n\n` +
    `2. Document Pipeline\n` +
    `   • Upload → Process → Chunk → Embed → Store\n` +
    `   • Handle updates/deletions\n` +
    `   • Deduplication\n\n` +
    `3. Query API\n` +
    `   • Rate limiting\n` +
    `   • Caching (same question)\n` +
    `   • Error handling\n\n` +
    `4. Monitoring\n` +
    `   • Track retrieval quality\n` +
    `   • Log failed queries\n` +
    `   • Cost per query\n` +
    `   • Response times`
  );

  await pause();

  clearScreen();
  showBox('COST BREAKDOWN',
    chalk.bold('One-time costs:\n') +
    `  Indexing: $0.02 per 1M tokens\n` +
    `  Example: 1000 docs (500K tokens) = $0.01\n\n` +
    chalk.bold('Per-query costs:\n') +
    `  Embedding query: ~$0.000004\n` +
    `  LLM generation: ~$0.0003 (gpt-4o-mini)\n` +
    `  Total: ~$0.0003 per query\n\n` +
    chalk.bold('At scale:\n') +
    `  1K queries/day = $0.30/day = $9/month\n` +
    `  10K queries/day = $3/day = $90/month\n` +
    `  100K queries/day = $30/day = $900/month\n\n` +
    chalk.green('RAG is cost-effective at scale!')
  );

  await pause();

  clearScreen();
  showBox('WHEN TO USE RAG',
    chalk.bold.green('✓ Use RAG for:\n\n') +
    `• Customer support (company docs)\n` +
    `• Legal/compliance Q&A\n` +
    `• Internal knowledge bases\n` +
    `• Product documentation\n` +
    `• Research assistants\n` +
    `• Code documentation search\n\n` +
    chalk.bold.red("✗ Don't use RAG for:\n\n") +
    `• General knowledge (GPT already knows)\n` +
    `• Real-time data (use APIs + tool calling)\n` +
    `• Small datasets (<10 docs, just use prompts)\n` +
    `• Frequently changing data (caching issues)\n\n` +
    chalk.bold('Rule of thumb:\n') +
    `If data > 20 docs and stable → RAG\n` +
    `If data changes by the second → Tools\n` +
    `If public knowledge → Just ask GPT`
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 8 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Documents indexed': '10',
    'Queries answered': '~10'
  });

  showBox('KEY TAKEAWAYS',
    `1. RAG = Retrieval + Generation\n` +
    `2. Semantic search finds relevant docs\n` +
    `3. Context injection gives LLM knowledge\n` +
    `4. Vector databases enable scale\n` +
    `5. Quality depends on retrieval accuracy\n` +
    `6. Cost: ~$0.0003 per query\n` +
    `7. Test with golden Q&A pairs\n\n` +
    chalk.bold('The RAG pipeline:\n\n') +
    `Index: Docs → Chunks → Embeddings → Store\n` +
    `Query: Question → Embed → Search → Context → Answer\n\n` +
    chalk.bold('Why this matters:\n') +
    `RAG powers 80% of AI products:\n` +
    `• "Chat with your docs"\n` +
    `• Customer support bots\n` +
    `• Internal knowledge bases\n` +
    `• Legal/compliance assistants\n\n` +
    chalk.bold('You can now:\n') +
    `• Build document Q&A systems\n` +
    `• Give LLMs access to your data\n` +
    `• Create searchable knowledge bases\n` +
    `• Evaluate RAG quality\n\n` +
    chalk.bold('Next: ') + `Document chunking strategies\n` +
    `(The secret to high-quality RAG)`
  );

  await pause();
}
