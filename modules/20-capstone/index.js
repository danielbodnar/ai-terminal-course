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

  showHeader('MODULE 14', 'CAPSTONE: SHIP IT');

  showBox('',
    `Time: Self-paced │ Cost: Variable │ Progress: 14/14\n\n` +
    `You've learned everything.\n` +
    `Now: Ship your first AI feature.`
  );

  await pause();

  await theJourney();
  await whatYouKnow();
  await projectIdeas();
  await planningFramework();
  await implementationChecklist();
  await productionReadiness();
  await nextSteps();
  await finalWords();
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(14, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('🎉 BOOTCAMP COMPLETE! 🎉');
  showBox('YOU ARE NOW AN AI ENGINEER',
    `You completed all 14 modules.\n` +
    `You learned:\n\n` +
    `✓ Fundamentals (tokens → embeddings)\n` +
    `✓ Production patterns (RAG, tool calling, structured outputs)\n` +
    `✓ Advanced techniques (agents, context engineering, caching)\n` +
    `✓ Production ops (monitoring, safety, cost optimization)\n\n` +
    chalk.bold("What's next:\n\n") +
    `1. Ship your capstone project\n` +
    `2. Join AI engineering communities\n` +
    `3. Keep building\n` +
    `4. Share what you learn\n\n` +
    chalk.green('Welcome to the future of software engineering. 🚀')
  );

  await pause('Press Enter to exit...');
}

async function theJourney() {
  clearScreen();
  showHeader('YOUR JOURNEY');

  showBox('',
    chalk.bold('You started with zero AI knowledge.\n\n') +
    `Module 1: "What is a token?"\n` +
    `Module 2: Your first LLM call\n` +
    `Module 3: Streaming responses\n\n` +
    chalk.bold('You learned production patterns.\n\n') +
    `Module 4-6: Embeddings, memory, structured outputs\n` +
    `Module 7-9: Tool calling, prompts, RAG\n` +
    `Module 10-11: Chunking, observability\n\n` +
    chalk.bold('You mastered advanced techniques.\n\n') +
    `Module 12-15: Cost, evals, agents, context\n` +
    `Module 16-19: Gateways, safety, caching, monitoring\n\n` +
    chalk.bold('Now: Module 20.\n\n') +
    chalk.green('You are ready to ship.')
  );

  await pause();
}

async function whatYouKnow() {
  clearScreen();
  showHeader('WHAT YOU KNOW NOW');

  showBox('TECHNICAL SKILLS',
    chalk.bold('Week 1: Foundations\n') +
    `✓ Tokenization and cost calculation\n` +
    `✓ LLM API calls (sync + streaming)\n` +
    `✓ Embeddings and semantic search\n` +
    `✓ Context windows and memory management\n` +
    `✓ Structured outputs with schemas\n\n` +
    chalk.bold('Week 2: Production Patterns\n') +
    `✓ Tool calling / function calling\n` +
    `✓ Prompt engineering techniques\n` +
    `✓ RAG (Retrieval-Augmented Generation)\n` +
    `✓ Document chunking strategies\n` +
    `✓ Observability and logging\n` +
    `✓ Cost optimization and caching\n\n` +
    chalk.bold('Week 3: Advanced\n') +
    `✓ Evals and testing\n` +
    `✓ Agentic patterns (ReAct)\n` +
    `✓ Context engineering\n` +
    `✓ LLM gateways and fallbacks\n` +
    `✓ Guardrails and safety\n\n` +
    chalk.bold('Week 4: Production\n') +
    `✓ Semantic caching\n` +
    `✓ Production monitoring\n` +
    `✓ Incident response`
  );

  await pause();

  clearScreen();
  showBox('PRODUCTION KNOWLEDGE',
    chalk.bold('You understand:\n\n') +
    `${chalk.green('Cost')}\n` +
    `• Model selection (10x price difference)\n` +
    `• Prompt optimization (50% savings)\n` +
    `• Caching strategies (90% reduction)\n` +
    `• Budget controls\n\n` +
    `${chalk.green('Quality')}\n` +
    `• Testing LLM outputs\n` +
    `• Building eval suites\n` +
    `• A/B testing prompts\n` +
    `• Quality metrics\n\n` +
    `${chalk.green('Reliability')}\n` +
    `• Fallback strategies\n` +
    `• Load balancing\n` +
    `• Error handling\n` +
    `• Monitoring and alerts\n\n` +
    `${chalk.green('Safety')}\n` +
    `• Content filtering\n` +
    `• PII detection\n` +
    `• Output validation\n` +
    `• Compliance (GDPR, HIPAA)`
  );

  await pause();
}

async function projectIdeas() {
  clearScreen();
  showHeader('CAPSTONE PROJECT IDEAS');

  showBox('',
    chalk.bold('Pick a project that excites you!\n\n') +
    chalk.bold('Beginner-friendly (1-2 days):\n\n') +
    `1. ${chalk.yellow('Smart FAQ Bot')}\n` +
    `   RAG over your docs, semantic search\n` +
    `   Tech: Embeddings, RAG, caching\n\n` +
    `2. ${chalk.yellow('Email Classifier')}\n` +
    `   Auto-categorize and route emails\n` +
    `   Tech: Structured outputs, tool calling\n\n` +
    `3. ${chalk.yellow('Meeting Summarizer')}\n` +
    `   Upload transcript, get summary\n` +
    `   Tech: Streaming, chunking, prompts\n\n` +
    `4. ${chalk.yellow('Code Explainer')}\n` +
    `   Paste code, get explanation\n` +
    `   Tech: Context windows, prompts`
  );

  await pause();

  clearScreen();
  showBox('MORE PROJECT IDEAS',
    chalk.bold('Intermediate (3-5 days):\n\n') +
    `5. ${chalk.yellow('Document Chat')}\n` +
    `   Upload PDFs, ask questions\n` +
    `   Tech: RAG, chunking, semantic caching\n\n` +
    `6. ${chalk.yellow('AI Writing Assistant')}\n` +
    `   Tone adjustment, grammar fixes\n` +
    `   Tech: Prompts, streaming, quality evals\n\n` +
    `7. ${chalk.yellow('Customer Support Agent')}\n` +
    `   Auto-respond to tickets\n` +
    `   Tech: RAG, tool calling, guardrails\n\n` +
    chalk.bold('Advanced (1-2 weeks):\n\n') +
    `8. ${chalk.yellow('Research Assistant')}\n` +
    `   Multi-step web research\n` +
    `   Tech: Agents, tool loops, evals\n\n` +
    `9. ${chalk.yellow('Code Review Bot')}\n` +
    `   Analyze PRs, suggest improvements\n` +
    `   Tech: Agents, structured outputs, monitoring\n\n` +
    `10. ${chalk.yellow('Your own idea!')}\n` +
    `    Solve a problem you care about`
  );

  await pause();
}

async function planningFramework() {
  clearScreen();
  showHeader('PLANNING YOUR PROJECT');

  showBox('THE 5-STEP FRAMEWORK',
    chalk.bold('Step 1: Define the problem\n') +
    `What are you building and why?\n` +
    `Who is it for?\n` +
    `What does success look like?\n\n` +
    chalk.bold('Step 2: Design the flow\n') +
    `User inputs → Processing → Output\n` +
    `Which LLM capabilities do you need?\n` +
    `Tool calling? RAG? Agents?\n\n` +
    chalk.bold('Step 3: Choose your stack\n') +
    `Model: gpt-4o-mini vs gpt-4o?\n` +
    `Tools: Embeddings? Vector DB?\n` +
    `Caching: Semantic cache?\n\n` +
    chalk.bold('Step 4: Build MVP\n') +
    `Start simple, add complexity later\n` +
    `Get something working end-to-end\n\n` +
    chalk.bold('Step 5: Production-ize\n') +
    `Add monitoring, caching, safety\n` +
    `Deploy and share`
  );

  await pause();

  clearScreen();
  showBox('EXAMPLE: DOCUMENT CHAT APP',
    chalk.bold('Step 1: Problem\n') +
    `"I want to chat with my PDFs"\n` +
    `Users: Knowledge workers\n` +
    `Success: Answer questions accurately\n\n` +
    chalk.bold('Step 2: Flow\n') +
    `1. Upload PDF\n` +
    `2. Chunk and embed documents\n` +
    `3. Store in vector DB\n` +
    `4. User asks question\n` +
    `5. Semantic search for relevant chunks\n` +
    `6. LLM answers with context\n\n` +
    chalk.bold('Step 3: Stack\n') +
    `Model: gpt-4o-mini (cheap, good enough)\n` +
    `Embeddings: text-embedding-3-small\n` +
    `Vector DB: In-memory (start simple)\n` +
    `Caching: Semantic cache (60% hit rate)\n\n` +
    chalk.bold('Step 4: MVP (Day 1)\n') +
    `• Upload 1 PDF\n` +
    `• Basic chunking\n` +
    `• Simple RAG\n` +
    `• No caching yet\n\n` +
    chalk.bold('Step 5: Production (Day 2-3)\n') +
    `• Add semantic caching\n` +
    `• Add monitoring (Helicone)\n` +
    `• Add PII detection\n` +
    `• Deploy to Vercel`
  );

  await pause();
}

async function implementationChecklist() {
  clearScreen();
  showHeader('IMPLEMENTATION CHECKLIST');

  showBox('MUST-HAVES',
    chalk.green('✓ Core functionality works\n') +
    `  The main feature actually works\n\n` +
    chalk.green('✓ Error handling\n') +
    `  Graceful failures, user-friendly errors\n\n` +
    chalk.green('✓ Cost tracking\n') +
    `  Know how much each request costs\n\n` +
    chalk.green('✓ Basic testing\n') +
    `  At least manual testing, ideally automated\n\n` +
    chalk.green('✓ Environment variables\n') +
    `  API keys in .env, not hardcoded\n\n` +
    chalk.green('✓ README\n') +
    `  How to setup and run your project`
  );

  await pause();

  clearScreen();
  showBox('NICE-TO-HAVES',
    chalk.yellow('○ Caching\n') +
    `  Semantic cache for repeated queries\n\n` +
    chalk.yellow('○ Monitoring\n') +
    `  Helicone or basic logging\n\n` +
    chalk.yellow('○ Safety\n') +
    `  Content moderation, PII detection\n\n` +
    chalk.yellow('○ Evals\n') +
    `  Automated quality checks\n\n` +
    chalk.yellow('○ Multiple models\n') +
    `  Fallback to different provider\n\n` +
    chalk.yellow('○ Deployment\n') +
    `  Actually deployed and accessible\n\n` +
    chalk.bold('Start with must-haves.\n') +
    chalk.bold('Add nice-to-haves as you go.')
  );

  await pause();
}

async function productionReadiness() {
  clearScreen();
  showHeader('PRODUCTION READINESS');

  showBox('',
    chalk.bold('Before you ship to real users:\n\n') +
    `${chalk.yellow('Performance')}\n` +
    `✓ Response time <3s (P95)\n` +
    `✓ Handles concurrent requests\n` +
    `✓ Caching works (>50% hit rate)\n\n` +
    `${chalk.yellow('Reliability')}\n` +
    `✓ Error rate <2%\n` +
    `✓ Graceful degradation\n` +
    `✓ Fallback for provider outages\n\n` +
    `${chalk.yellow('Safety')}\n` +
    `✓ Content moderation\n` +
    `✓ PII protection\n` +
    `✓ Rate limiting (prevent abuse)\n\n` +
    `${chalk.yellow('Observability')}\n` +
    `✓ Logging (errors, requests)\n` +
    `✓ Cost tracking\n` +
    `✓ Basic metrics dashboard\n\n` +
    `${chalk.yellow('Cost')}\n` +
    `✓ Cost per request calculated\n` +
    `✓ Daily budget set\n` +
    `✓ Alert if cost spikes`
  );

  await pause();

  clearScreen();
  showBox('DEPLOYMENT CHECKLIST',
    chalk.bold('Pre-launch:\n\n') +
    `□ Test with real data\n` +
    `□ Load test (can it handle 100 users?)\n` +
    `□ Set up monitoring\n` +
    `□ Configure alerts\n` +
    `□ Write runbook (how to fix common issues)\n` +
    `□ Set daily cost budget\n` +
    `□ Add rate limiting\n` +
    `□ Test error scenarios\n\n` +
    chalk.bold('Launch day:\n\n') +
    `□ Deploy to production\n` +
    `□ Smoke test (does it work?)\n` +
    `□ Monitor for 1 hour\n` +
    `□ Share with 5-10 beta users\n` +
    `□ Watch metrics closely\n\n` +
    chalk.bold('Post-launch:\n\n') +
    `□ Gather user feedback\n` +
    `□ Check cost vs budget\n` +
    `□ Review error logs\n` +
    `□ Iterate based on learnings`
  );

  await pause();
}

async function nextSteps() {
  clearScreen();
  showHeader('WHAT\'S NEXT?');

  showBox('',
    chalk.bold('You finished the bootcamp. Now what?\n\n') +
    chalk.bold('1. Ship your capstone\n') +
    `   Don't let it sit on your laptop\n` +
    `   Deploy it, share it, get feedback\n\n` +
    chalk.bold('2. Join communities\n') +
    `   • AI Engineer World\'s Fair\n` +
    `   • LangChain Discord\n` +
    `   • r/LLMDevs on Reddit\n` +
    `   • Twitter (follow AI builders)\n\n` +
    chalk.bold('3. Keep learning\n') +
    `   New techniques emerge weekly\n` +
    `   Follow: Simon Willison, Swyx, Eugene Yan\n` +
    `   Read: Papers with Code, Hugging Face\n\n` +
    chalk.bold('4. Build more projects\n') +
    `   Best way to learn: Build and ship\n` +
    `   Share your learnings publicly\n\n` +
    chalk.bold('5. Contribute back\n') +
    `   Open source AI tools\n` +
    `   Write blog posts\n` +
    `   Help others learn`
  );

  await pause();

  clearScreen();
  showBox('RESOURCES FOR CONTINUED LEARNING',
    chalk.bold('Newsletters:\n') +
    `• The Batch (Andrew Ng)\n` +
    `• TLDR AI\n` +
    `• Ben\'s Bites\n\n` +
    chalk.bold('Blogs:\n') +
    `• Lilian Weng (OpenAI)\n` +
    `• Eugene Yan\n` +
    `• Hamel Husain\n\n` +
    chalk.bold('Courses (advanced):\n') +
    `• fast.ai\n` +
    `• deeplearning.ai\n` +
    `• Full Stack Deep Learning\n\n` +
    chalk.bold('Communities:\n') +
    `• LangChain Discord\n` +
    `• AI Stack Devs\n` +
    `• Latent Space Discord\n\n` +
    chalk.bold('Conferences:\n') +
    `• AI Engineer Summit\n` +
    `• NeurIPS (research)\n` +
    `• Local AI meetups`
  );

  await pause();
}

async function finalWords() {
  clearScreen();
  showHeader('FINAL WORDS');

  showBox('',
    chalk.bold('When you started:\n\n') +
    `You didn't know what a token was.\n` +
    `You had never called an LLM API.\n` +
    `RAG, embeddings, agents - all foreign.\n\n` +
    chalk.bold('Now:\n\n') +
    `You understand tokens, costs, context windows.\n` +
    `You can build RAG systems, agents, chatbots.\n` +
    `You know production patterns that work.\n` +
    `You can ship AI features confidently.\n\n` +
    chalk.bold('The field is moving fast.\n\n') +
    `New models every month.\n` +
    `New techniques every week.\n` +
    `That is exciting, not scary.\n\n` +
    chalk.bold('You have the fundamentals.\n\n') +
    `Models will change.\n` +
    `Frameworks will evolve.\n` +
    `But core patterns stay the same:\n` +
    `• Prompt engineering\n` +
    `• RAG and retrieval\n` +
    `• Cost optimization\n` +
    `• Production safety\n\n` +
    chalk.green('You are ready.')
  );

  await pause();

  clearScreen();
  showBox('',
    chalk.bold.cyan('                                         \n') +
    chalk.bold.cyan('   ██╗   ██╗ ██████╗ ██╗   ██╗        \n') +
    chalk.bold.cyan('   ╚██╗ ██╔╝██╔═══██╗██║   ██║        \n') +
    chalk.bold.cyan('    ╚████╔╝ ██║   ██║██║   ██║        \n') +
    chalk.bold.cyan('     ╚██╔╝  ██║   ██║██║   ██║        \n') +
    chalk.bold.cyan('      ██║   ╚██████╔╝╚██████╔╝        \n') +
    chalk.bold.cyan('      ╚═╝    ╚═════╝  ╚═════╝         \n') +
    chalk.bold.cyan('                                        \n') +
    chalk.bold.cyan('          ███╗   ███╗ █████╗ ██████╗ ███████╗\n') +
    chalk.bold.cyan('          ████╗ ████║██╔══██╗██╔══██╗██╔════╝\n') +
    chalk.bold.cyan('          ██╔████╔██║███████║██║  ██║█████╗  \n') +
    chalk.bold.cyan('          ██║╚██╔╝██║██╔══██║██║  ██║██╔══╝  \n') +
    chalk.bold.cyan('          ██║ ╚═╝ ██║██║  ██║██████╔╝███████╗\n') +
    chalk.bold.cyan('          ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝\n') +
    chalk.bold.cyan('                                        \n') +
    chalk.bold.cyan('              ██╗████████╗             \n') +
    chalk.bold.cyan('              ██║╚══██╔══╝             \n') +
    chalk.bold.cyan('              ██║   ██║                \n') +
    chalk.bold.cyan('              ██║   ██║                \n') +
    chalk.bold.cyan('              ██║   ██║                \n') +
    chalk.bold.cyan('              ╚═╝   ╚═╝                \n') +
    chalk.bold.cyan('                                        \n') +
    '\n' +
    chalk.bold('From Software Engineer to AI Engineer.\n') +
    chalk.bold('You did it. 🎉\n\n') +
    chalk.gray('Now go build the future.')
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('BOOTCAMP COMPLETE', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time in Module 14': `${elapsedTime} minutes`,
    'Total modules': '14/14 ✓',
    'Status': 'GRADUATED',
    'Next step': 'Ship your project!'
  });

  showBox('YOUR ACHIEVEMENT',
    chalk.bold('You completed:\n\n') +
    `• 14 hands-on modules\n` +
    `• ~7 hours of learning\n` +
    `• Dozens of live demos\n` +
    `• Production-ready knowledge\n\n` +
    chalk.bold('You learned:\n\n') +
    `• Build Something Now (5 modules)\n` +
    `• Understand the Engine (4 modules)\n` +
    `• Ship to Production (4 modules)\n` +
    `• Capstone (1 module)\n\n` +
    chalk.bold('You can now:\n\n') +
    `✓ Build RAG systems\n` +
    `✓ Create AI agents\n` +
    `✓ Optimize for cost (90% savings)\n` +
    `✓ Deploy safely to production\n` +
    `✓ Monitor and maintain AI features\n\n` +
    chalk.green.bold('Welcome to AI engineering. 🚀\n\n') +
    chalk.gray('Star the repo if you found this valuable!\n') +
    chalk.gray('Share your capstone project on Twitter.')
  );

  await pause();
}
