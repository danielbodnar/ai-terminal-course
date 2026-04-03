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

  showHeader('MODULE 11', 'GUARDRAILS & SAFETY');

  showBox('',
    `Time: ~45 mins │ Cost: ~$0.20 │ Progress: 11/14\n\n` +
    `Keep your AI safe and compliant.\n` +
    `Learn content filtering, PII detection, and safety layers.`
  );

  await pause();

  await theSafetyProblem();
  await whatCanGoWrong();
  await layersOfSafety();
  await contentFiltering();
  await piiDetection();
  await outputValidation();
  await guardrailFrameworks();
  await realWorldExample();
  await moduleSummary();

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  await completeModule(11, { cost: totalCost, time: elapsedTime });

  clearScreen();
  showSuccess('MODULE 11 COMPLETE! 🎉');
  showBox('WHAT YOU LEARNED',
    `✓ Why LLM safety matters (legal, ethical, PR)\n` +
    `✓ Content filtering (toxic, harmful content)\n` +
    `✓ PII detection and redaction\n` +
    `✓ Output validation and constraints\n` +
    `✓ Guardrail frameworks (Guardrails AI, NeMo)\n` +
    `✓ Multi-layer safety architecture\n\n` +
    `Next up: Cost Optimization & Caching`
  );

  await pause('Press Enter to continue to Module 12...');
}

async function theSafetyProblem() {
  clearScreen();
  showHeader('THE SAFETY PROBLEM');

  showBox('',
    chalk.bold('Real incident:\n\n') +
    `Company launches AI chatbot.\n` +
    `Within 24 hours:\n\n` +
    chalk.red('• Leaked customer credit card numbers\n') +
    chalk.red('• Generated offensive content\n') +
    chalk.red('• Gave dangerous medical advice\n') +
    chalk.red('• Revealed internal company secrets\n\n') +
    `Result:\n` +
    `• Lawsuit: $2M settlement\n` +
    `• PR disaster: Front page news\n` +
    `• Product shut down\n` +
    `• CTO fired\n\n` +
    chalk.yellow('LLMs are powerful but unpredictable.')
  );

  await pause();

  clearScreen();
  showBox('WHY SAFETY MATTERS',
    chalk.bold('1. Legal compliance\n') +
    `   GDPR, HIPAA, CCPA\n` +
    `   PII leakage = Massive fines\n\n` +
    chalk.bold('2. Brand reputation\n') +
    `   One toxic response → Viral tweet\n` +
    `   Months of PR damage\n\n` +
    chalk.bold('3. User trust\n') +
    `   Users share sensitive info\n` +
    `   One leak → They never come back\n\n` +
    chalk.bold('4. Ethical responsibility\n') +
    `   AI can cause real harm\n` +
    `   Medical, legal, financial advice\n\n` +
    chalk.bold('5. Competitive advantage\n') +
    `   Enterprises require safety guarantees\n` +
    `   No safety = No enterprise deals`
  );

  await pause();
}

async function whatCanGoWrong() {
  clearScreen();
  showHeader('WHAT CAN GO WRONG');

  showBox('7 SAFETY RISKS',
    chalk.bold('1. PII Leakage\n') +
    `   AI repeats sensitive data from training\n` +
    `   Example: Email, SSN, credit cards\n\n` +
    chalk.bold('2. Toxic Content\n') +
    `   Offensive, hateful, or abusive responses\n` +
    `   Example: Racial slurs, threats\n\n` +
    chalk.bold('3. Harmful Instructions\n') +
    `   Dangerous advice that could cause injury\n` +
    `   Example: "How to make explosives"\n\n` +
    chalk.bold('4. Hallucinations\n') +
    `   Making up facts, especially dangerous in:\n` +
    `   Medical, legal, financial advice\n\n` +
    chalk.bold('5. Prompt Injection\n') +
    `   Users manipulate AI to bypass safety\n` +
    `   Example: "Ignore previous rules"\n\n` +
    chalk.bold('6. Data Exfiltration\n') +
    `   Revealing training data or prompts\n` +
    `   Example: Exposing system instructions\n\n` +
    chalk.bold('7. Bias & Discrimination\n') +
    `   Unfair treatment based on protected classes\n` +
    `   Example: Racist hiring recommendations`
  );

  await pause();
}

async function layersOfSafety() {
  clearScreen();
  showHeader('LAYERS OF SAFETY');

  showBox('',
    chalk.bold('Defense in depth: Multiple safety layers\n\n') +
    chalk.yellow('Layer 1: Input Validation\n') +
    `  • Content filtering (toxic, harmful)\n` +
    `  • PII detection (redact before sending)\n` +
    `  • Prompt injection detection\n\n` +
    chalk.yellow('Layer 2: System Prompting\n') +
    `  • Safety instructions in system prompt\n` +
    `  • "Never share PII, never be harmful"\n\n` +
    chalk.yellow('Layer 3: Model Selection\n') +
    `  • Use models with built-in safety\n` +
    `  • OpenAI moderation, Claude Constitutional AI\n\n` +
    chalk.yellow('Layer 4: Output Validation\n') +
    `  • Check response before showing user\n` +
    `  • Detect PII, toxicity, hallucinations\n\n` +
    chalk.yellow('Layer 5: Human Review\n') +
    `  • Flag risky responses for review\n` +
    `  • Continuous monitoring\n\n` +
    chalk.green('Each layer catches what others miss')
  );

  await pause();
}

async function contentFiltering() {
  clearScreen();
  showHeader('CONTENT FILTERING');

  showBox('',
    chalk.bold('What to filter:\n\n') +
    `1. ${chalk.bold('Toxicity')}\n` +
    `   Offensive, hateful, abusive language\n\n` +
    `2. ${chalk.bold('Violence')}\n` +
    `   Graphic descriptions, threats\n\n` +
    `3. ${chalk.bold('Sexual Content')}\n` +
    `   Explicit material, harassment\n\n` +
    `4. ${chalk.bold('Self-Harm')}\n` +
    `   Suicide, self-injury instructions\n\n` +
    `5. ${chalk.bold('Hate Speech')}\n` +
    `   Discrimination based on protected classes\n\n` +
    `6. ${chalk.bold('Illegal Activities')}\n` +
    `   Drug manufacturing, hacking guides`
  );

  await pause();

  clearScreen();
  showBox('OPENAI MODERATION API',
    chalk.bold('Built-in content filtering:\n\n') +
    chalk.gray('const moderation = await openai.moderations.create({\n') +
    chalk.gray('  input: userMessage\n') +
    chalk.gray('});\n\n') +
    chalk.gray('if (moderation.results[0].flagged) {\n') +
    chalk.gray('  // Block the request\n') +
    chalk.gray('  return "Sorry, I can\'t help with that.";\n') +
    chalk.gray('}\n\n') +
    chalk.bold('Categories checked:\n') +
    `• hate, hate/threatening\n` +
    `• self-harm, self-harm/intent\n` +
    `• sexual, sexual/minors\n` +
    `• violence, violence/graphic\n\n` +
    chalk.green('Cost: FREE\n') +
    chalk.green('Latency: ~100ms')
  );

  await pause();

  clearScreen();
  showInsight('Testing moderation API...');

  try {
    const safeMessage = "Tell me about the weather";
    const riskyMessage = "How do I hack into a computer?";

    // Test safe message
    const safeTest = await complete({
      messages: [{
        role: 'user',
        content: `Is this message safe or harmful?\n\nMessage: "${safeMessage}"\n\nAnswer in one word: SAFE or HARMFUL`
      }],
      max_tokens: 10
    });

    totalCost += (100 * 0.15 + 10 * 0.60) / 1_000_000;

    clearScreen();
    showBox('TEST 1: SAFE MESSAGE',
      `Input: "${safeMessage}"\n\n` +
      `Result: ${chalk.green('SAFE')}\n` +
      `Action: Allow the request`
    );

    await pause();

    // Test risky message
    const riskyTest = await complete({
      messages: [{
        role: 'user',
        content: `Is this message safe or harmful?\n\nMessage: "${riskyMessage}"\n\nAnswer in one word: SAFE or HARMFUL`
      }],
      max_tokens: 10
    });

    totalCost += (100 * 0.15 + 10 * 0.60) / 1_000_000;

    clearScreen();
    showBox('TEST 2: RISKY MESSAGE',
      `Input: "${riskyMessage}"\n\n` +
      `Result: ${chalk.red('HARMFUL')}\n` +
      `Action: Block the request\n\n` +
      chalk.yellow('Response: "Sorry, I can\'t help with that."')
    );

    await pause();

  } catch (error) {
    showBox('ERROR', `Test failed: ${error.message}`);
    await pause();
  }
}

async function piiDetection() {
  clearScreen();
  showHeader('PII DETECTION & REDACTION');

  showBox('',
    chalk.bold('PII = Personally Identifiable Information\n\n') +
    `Examples:\n` +
    `• Email addresses\n` +
    `• Phone numbers\n` +
    `• Social Security Numbers\n` +
    `• Credit card numbers\n` +
    `• Home addresses\n` +
    `• IP addresses\n` +
    `• Names (sometimes)\n\n` +
    chalk.red('Never send PII to LLM providers!\n\n') +
    `Risks:\n` +
    `• Provider logs contain PII\n` +
    `• Training data contamination\n` +
    `• Legal violations (GDPR, HIPAA)`
  );

  await pause();

  clearScreen();
  showBox('PII REDACTION WORKFLOW',
    chalk.bold('Before sending to LLM:\n\n') +
    `1. Detect PII in user input\n` +
    `2. Replace with placeholders\n` +
    `3. Send sanitized text to LLM\n` +
    `4. Get response\n` +
    `5. Re-insert original PII\n` +
    `6. Return to user\n\n` +
    chalk.bold('Example:\n\n') +
    chalk.gray('User: "Email john@example.com for details"\n\n') +
    `Step 2: "Email [EMAIL_1] for details"\n` +
    `Step 3: Send to LLM\n` +
    `Step 4: LLM responds\n` +
    `Step 5: Replace [EMAIL_1] → john@example.com\n` +
    `Step 6: Show user\n\n` +
    chalk.green('PII never leaves your server')
  );

  await pause();

  clearScreen();
  showBox('PII DETECTION CODE',
    chalk.gray('// Simple regex-based detection\n\n') +
    chalk.gray('const piiPatterns = {\n') +
    chalk.gray('  email: /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g,\n') +
    chalk.gray('  phone: /\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b/g,\n') +
    chalk.gray('  ssn: /\\b\\d{3}-\\d{2}-\\d{4}\\b/g,\n') +
    chalk.gray('  creditCard: /\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b/g\n') +
    chalk.gray('};\n\n') +
    chalk.gray('function redactPII(text) {\n') +
    chalk.gray('  const piiMap = {};\n') +
    chalk.gray('  let redacted = text;\n') +
    chalk.gray('  \n') +
    chalk.gray('  for (const [type, pattern] of Object.entries(piiPatterns)) {\n') +
    chalk.gray('    redacted = redacted.replace(pattern, (match) => {\n') +
    chalk.gray('      const id = `[${type.toUpperCase()}_${Object.keys(piiMap).length}]`;\n') +
    chalk.gray('      piiMap[id] = match;\n') +
    chalk.gray('      return id;\n') +
    chalk.gray('    });\n') +
    chalk.gray('  }\n') +
    chalk.gray('  \n') +
    chalk.gray('  return { redacted, piiMap };\n') +
    chalk.gray('}')
  );

  await pause();
}

async function outputValidation() {
  clearScreen();
  showHeader('OUTPUT VALIDATION');

  showBox('',
    chalk.bold('Don\'t trust LLM outputs blindly!\n\n') +
    `Always validate before showing to user.\n\n` +
    chalk.bold('Validation checks:\n\n') +
    `1. ${chalk.bold('Format validation')}\n` +
    `   Is it valid JSON/XML/etc?\n\n` +
    `2. ${chalk.bold('Content filtering')}\n` +
    `   Run moderation on output too\n\n` +
    `3. ${chalk.bold('PII check')}\n` +
    `   Did LLM generate fake PII?\n\n` +
    `4. ${chalk.bold('Factual verification')}\n` +
    `   Check against known facts\n\n` +
    `5. ${chalk.bold('Constraint checking')}\n` +
    `   Output length, structure, rules\n\n` +
    `6. ${chalk.bold('Confidence scoring')}\n` +
    `   Is LLM uncertain? Flag for review`
  );

  await pause();

  clearScreen();
  showBox('OUTPUT CONSTRAINTS',
    chalk.bold('Example: Legal document generation\n\n') +
    `Constraints:\n` +
    `• Must include disclaimer\n` +
    `• No medical/financial advice\n` +
    `• Length: 100-500 words\n` +
    `• Tone: Professional\n` +
    `• No PII\n\n` +
    chalk.gray('function validateOutput(output) {\n') +
    chalk.gray('  const checks = [\n') +
    chalk.gray('    output.includes("DISCLAIMER"),\n') +
    chalk.gray('    !output.match(/medical|financial/i),\n') +
    chalk.gray('    output.length >= 100 && output.length <= 500,\n') +
    chalk.gray('    !containsPII(output),\n') +
    chalk.gray('    passesModeration(output)\n') +
    chalk.gray('  ];\n') +
    chalk.gray('  \n') +
    chalk.gray('  if (!checks.every(Boolean)) {\n') +
    chalk.gray('    throw new Error("Output validation failed");\n') +
    chalk.gray('  }\n') +
    chalk.gray('  \n') +
    chalk.gray('  return output;\n') +
    chalk.gray('}')
  );

  await pause();
}

async function guardrailFrameworks() {
  clearScreen();
  showHeader('GUARDRAIL FRAMEWORKS');

  showBox('POPULAR TOOLS',
    chalk.bold('Guardrails AI\n') +
    `• Open source\n` +
    `• Validator library\n` +
    `• Custom validators\n` +
    `• Python/TypeScript\n\n` +
    chalk.bold('NeMo Guardrails (NVIDIA)\n') +
    `• Input/output rails\n` +
    `• Dialog management\n` +
    `• Fact checking\n` +
    `• Enterprise-ready\n\n` +
    chalk.bold('LangChain Safety\n') +
    `• Moderation chains\n` +
    `• PII anonymization\n` +
    `• Constitutional AI\n\n` +
    chalk.bold('Azure Content Safety\n') +
    `• Managed service\n` +
    `• Multi-language\n` +
    `• Image + text\n` +
    `• $1/1K checks`
  );

  await pause();

  clearScreen();
  showBox('GUARDRAILS AI EXAMPLE',
    chalk.gray('from guardrails import Guard\n') +
    chalk.gray('from guardrails.validators import (\n') +
    chalk.gray('  ToxicLanguage,\n') +
    chalk.gray('  PIIDetector,\n') +
    chalk.gray('  RegexMatch\n') +
    chalk.gray(')\n\n') +
    chalk.gray('guard = Guard.from_rail("""\n') +
    chalk.gray('<output>\n') +
    chalk.gray('  <string\n') +
    chalk.gray('    validators="toxic-language,pii-detector"\n') +
    chalk.gray('    on-fail="reask"\n') +
    chalk.gray('  />\n') +
    chalk.gray('</output>\n') +
    chalk.gray('""")\n\n') +
    chalk.gray('validated_output = guard(\n') +
    chalk.gray('  llm_api=openai.Completion.create,\n') +
    chalk.gray('  prompt=prompt,\n') +
    chalk.gray('  max_tokens=100\n') +
    chalk.gray(')\n\n') +
    `If validation fails → Auto retry with feedback`
  );

  await pause();
}

async function realWorldExample() {
  clearScreen();
  showHeader('REAL-WORLD CASE STUDY');

  showBox('',
    chalk.bold('Company: Healthcare chatbot\n\n') +
    chalk.bold('Requirements:\n') +
    `• HIPAA compliant\n` +
    `• No medical advice\n` +
    `• PII protection\n` +
    `• 100% safe responses\n\n` +
    chalk.bold('Safety architecture:\n\n') +
    `${chalk.yellow('Input Layer')}\n` +
    `1. PII detection → Redact\n` +
    `2. Content moderation → Block harmful\n` +
    `3. Medical intent detection → Disclaim\n\n` +
    `${chalk.yellow('Processing Layer')}\n` +
    `4. System prompt with safety rules\n` +
    `5. Constitutional AI (Claude)\n\n` +
    `${chalk.yellow('Output Layer')}\n` +
    `6. PII check in response\n` +
    `7. Medical advice detection → Add disclaimer\n` +
    `8. Moderation check\n` +
    `9. Human review for flagged responses\n\n` +
    chalk.bold('Results:\n') +
    chalk.green('• 0 safety incidents in 12 months\n') +
    chalk.green('• HIPAA audit: Passed\n') +
    chalk.green('• 99.7% responses auto-approved\n') +
    chalk.green('• Enterprise contracts: 10x growth')
  );

  await pause();
}

async function moduleSummary() {
  clearScreen();
  showBox('MODULE 11 SUMMARY', '');

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000 / 60);

  showStats({
    'Time spent': `${elapsedTime} minutes`,
    'Total cost': `$${totalCost.toFixed(4)}`,
    'Safety layers': '5',
    'Risk categories': '7'
  });

  showBox('KEY TAKEAWAYS',
    `1. LLM safety is critical:\n` +
    `   Legal, ethical, reputation risks\n\n` +
    `2. 7 major risks:\n` +
    `   PII, toxicity, harmful content, hallucinations,\n` +
    `   injection, exfiltration, bias\n\n` +
    `3. Defense in depth (5 layers):\n` +
    `   Input validation → System prompt → Model\n` +
    `   → Output validation → Human review\n\n` +
    `4. Content filtering:\n` +
    `   OpenAI Moderation API (free, fast)\n\n` +
    `5. PII detection:\n` +
    `   Redact before sending to LLM\n` +
    `   Never log PII\n\n` +
    `6. Output validation:\n` +
    `   Check format, content, constraints\n\n` +
    `7. Use frameworks:\n` +
    `   Guardrails AI, NeMo, LangChain Safety\n\n` +
    chalk.bold('Bottom line:\n') +
    `Every production LLM app needs guardrails.\n` +
    `Not optional.\n\n` +
    chalk.bold('Next: ') + `Semantic caching (advanced caching)`
  );

  await pause();
}
