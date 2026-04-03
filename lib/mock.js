import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load mock data
let mockData;
try {
  mockData = JSON.parse(readFileSync(path.join(__dirname, 'mock-data.json'), 'utf-8'));
} catch {
  mockData = { completions: {}, streaming_chunks: [], embeddings: { dimensions: 256 } };
}

export const MOCK_MODE = !process.env.OPENAI_API_KEY;

const DEMO_LABEL = '[DEMO MODE - simulated response]';

/**
 * Match a prompt to a canned response using keyword matching
 */
function matchResponse(messages) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const systemMessage = messages.find(m => m.role === 'system')?.content?.toLowerCase() || '';
  const allText = (systemMessage + ' ' + lastMessage).toLowerCase();

  const completions = mockData.completions;

  // Keyword matching
  if (allText.includes('pirate')) return completions.pirate_ai;
  if (allText.includes('haiku') || allText.includes('poem')) return completions.haiku_programming;
  if (allText.includes('sky') && allText.includes('blue')) return completions.sky_blue;
  if (allText.includes('weather')) return completions.weather_sf;
  if (allText.includes('calculate') || /\d+\s*[\*×x]\s*\d+/.test(lastMessage)) return completions.calculate;
  if (allText.includes('chain') || allText.includes('step by step')) return completions.chain_of_thought;
  if (allText.includes('extract') && allText.includes('contact')) return completions.extract_contact;
  if (allText.includes('classify') && allText.includes('positive')) return completions.classify_positive;
  if (allText.includes('classify') && allText.includes('negative')) return completions.classify_negative;
  if (allText.includes('classify') || allText.includes('sentiment')) return completions.sentiment_v3;
  if (allText.includes('email')) return completions.email_professional;
  if (allText.includes('rag') || allText.includes('retrieval')) return completions.rag_answer;
  if (allText.includes('agent') || allText.includes('thought:')) return completions.agent_reasoning;
  if (allText.includes('hello') || allText.includes('hi ')) return completions.hello;
  if (allText.includes('what is ai') || allText.includes('explain ai')) return completions.what_is_ai;
  if (allText.includes('name a color') || allText.includes('name a colour')) return completions.name_color;
  if (allText.includes('say hello')) return 'Hello there! Nice to meet you!';
  if (allText.includes('2+2') || allText.includes('2 + 2')) return '2 + 2 equals 4.';

  return completions.default;
}

/**
 * Simulate an LLM completion (non-streaming)
 */
export function mockComplete(options = {}) {
  const { messages = [], model = 'gpt-4o-mini' } = options;

  const content = matchResponse(messages);
  const promptTokens = messages.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0);
  const completionTokens = Math.ceil(content.length / 4);

  return {
    content: `${content}\n\n${DEMO_LABEL}`,
    model,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    },
    latency: 150 + Math.floor(Math.random() * 200),
    finishReason: 'stop',
    raw: null
  };
}

/**
 * Simulate streaming completion as an async generator
 */
export async function* mockStreamComplete(options = {}) {
  const { messages = [], model = 'gpt-4o-mini' } = options;

  const content = matchResponse(messages);
  const words = content.split(/(\s+)/);
  const startTime = Date.now();
  let firstTokenTime = null;
  let tokenCount = 0;

  // Simulate initial latency
  await new Promise(resolve => setTimeout(resolve, 100 + Math.floor(Math.random() * 150)));

  for (const word of words) {
    if (!word) continue;
    tokenCount++;

    if (!firstTokenTime) {
      firstTokenTime = Date.now();
    }

    yield {
      content: word,
      isFirst: !firstTokenTime,
      timeToFirstToken: firstTokenTime ? firstTokenTime - startTime : null
    };

    // Simulate token-by-token delay
    await new Promise(resolve => setTimeout(resolve, 20 + Math.floor(Math.random() * 30)));
  }

  // Yield the demo label
  yield { content: `\n\n${DEMO_LABEL}` };

  yield {
    done: true,
    finishReason: 'stop',
    totalLatency: Date.now() - startTime,
    timeToFirstToken: firstTokenTime - startTime,
    estimatedTokens: tokenCount
  };
}

/**
 * Generate a deterministic pseudo-embedding based on text hash
 */
export function mockEmbed(text, model = 'text-embedding-3-small') {
  const dimensions = 256;

  // Simple deterministic hash-based embedding
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Generate pseudo-random embedding from hash
  const embedding = [];
  let seed = Math.abs(hash);
  for (let i = 0; i < dimensions; i++) {
    seed = (seed * 16807 + 12345) & 0x7fffffff;
    embedding.push((seed / 0x7fffffff) * 2 - 1);
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  const normalized = embedding.map(v => v / magnitude);

  const promptTokens = Math.ceil(text.length / 4);

  return {
    embedding: normalized,
    model,
    usage: {
      promptTokens,
      totalTokens: promptTokens
    },
    dimensions
  };
}

/**
 * Generate batch embeddings
 */
export function mockEmbedBatch(texts, model = 'text-embedding-3-small') {
  const results = texts.map(text => mockEmbed(text, model));

  return {
    embeddings: results.map(r => r.embedding),
    model,
    usage: {
      promptTokens: results.reduce((sum, r) => sum + r.usage.promptTokens, 0),
      totalTokens: results.reduce((sum, r) => sum + r.usage.totalTokens, 0)
    },
    dimensions: results[0]?.dimensions || 256
  };
}

/**
 * Mock structured output (JSON mode)
 */
export function mockJSON(messages) {
  const content = matchResponse(messages);

  // Try to return as JSON if the response looks like JSON
  try {
    JSON.parse(content);
    return {
      content,
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80
      }
    };
  } catch {
    // Wrap in JSON
    return {
      content: JSON.stringify({ result: content }),
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80
      }
    };
  }
}

/**
 * Mock tool call response
 */
export function mockToolCall(messages, tools) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  // Check if any tool matches
  if (tools && tools.length > 0) {
    for (const tool of tools) {
      const name = tool.function?.name || '';
      if (lastMessage.includes('weather') && name.includes('weather')) {
        return {
          message: {
            role: 'assistant',
            content: null,
            tool_calls: [{
              id: 'call_mock_1',
              type: 'function',
              function: {
                name: name,
                arguments: JSON.stringify({ location: 'San Francisco' })
              }
            }]
          },
          usage: { promptTokens: 50, completionTokens: 20, totalTokens: 70 }
        };
      }
    }
  }

  // Default: just answer without tools
  return {
    message: {
      role: 'assistant',
      content: matchResponse(messages) + `\n\n${DEMO_LABEL}`
    },
    usage: { promptTokens: 50, completionTokens: 30, totalTokens: 80 }
  };
}
