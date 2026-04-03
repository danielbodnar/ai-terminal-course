import OpenAI from 'openai';
import { MOCK_MODE, mockComplete, mockStreamComplete } from './mock.js';

let openaiClient = null;

export function initLLM(apiKey) {
  if (!MOCK_MODE) {
    openaiClient = new OpenAI({ apiKey });
  }
}

/**
 * Make a completion call to OpenAI
 */
export async function complete(options = {}) {
  if (MOCK_MODE) return mockComplete(options);

  const {
    model = 'gpt-4o-mini',
    messages = [],
    temperature = 0.7,
    maxTokens = null,
    stream = false,
    topP = 1.0,
    frequencyPenalty = 0,
    presencePenalty = 0
  } = options;

  const startTime = Date.now();

  const params = {
    model,
    messages,
    temperature,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    ...(maxTokens && { max_tokens: maxTokens })
  };

  if (stream) {
    return openaiClient.chat.completions.create({
      ...params,
      stream: true
    });
  }

  const response = await openaiClient.chat.completions.create(params);

  const latency = Date.now() - startTime;

  return {
    content: response.choices[0].message.content,
    model: response.model,
    usage: {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens
    },
    latency,
    finishReason: response.choices[0].finish_reason,
    raw: response
  };
}

/**
 * Stream a completion
 */
export async function* streamComplete(options = {}) {
  if (MOCK_MODE) {
    yield* mockStreamComplete(options);
    return;
  }

  const {
    model = 'gpt-4o-mini',
    messages = [],
    temperature = 0.7,
    maxTokens = null,
    topP = 1.0,
    frequencyPenalty = 0,
    presencePenalty = 0
  } = options;

  const startTime = Date.now();
  let firstTokenTime = null;
  let totalTokens = 0;

  const params = {
    model,
    messages,
    temperature,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stream: true,
    ...(maxTokens && { max_tokens: maxTokens })
  };

  const stream = await openaiClient.chat.completions.create(params);

  for await (const chunk of stream) {
    if (!firstTokenTime && chunk.choices[0]?.delta?.content) {
      firstTokenTime = Date.now();
    }

    if (chunk.choices[0]?.delta?.content) {
      totalTokens++;
      yield {
        content: chunk.choices[0].delta.content,
        isFirst: firstTokenTime === Date.now(),
        timeToFirstToken: firstTokenTime ? firstTokenTime - startTime : null
      };
    }

    if (chunk.choices[0]?.finish_reason) {
      yield {
        done: true,
        finishReason: chunk.choices[0].finish_reason,
        totalLatency: Date.now() - startTime,
        timeToFirstToken: firstTokenTime - startTime,
        estimatedTokens: totalTokens
      };
    }
  }
}

/**
 * Calculate cost for a completion
 * Pricing as of 2025 (per 1M tokens)
 */
export function calculateCompletionCost(usage, model = 'gpt-4o-mini') {
  const pricing = {
    'gpt-4o-mini': { input: 0.15, output: 0.60 },      // $0.15/$0.60 per 1M tokens
    'gpt-4o': { input: 3.00, output: 10.00 },          // $3.00/$10.00 per 1M tokens
    'gpt-4-turbo': { input: 10.00, output: 30.00 },    // $10.00/$30.00 per 1M tokens
    'gpt-4': { input: 30.00, output: 60.00 },          // $30.00/$60.00 per 1M tokens (legacy)
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 }     // $0.50/$1.50 per 1M tokens
  };

  const prices = pricing[model] || pricing['gpt-4o-mini'];

  const inputCost = (usage.promptTokens / 1_000_000) * prices.input;
  const outputCost = (usage.completionTokens / 1_000_000) * prices.output;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost
  };
}

/**
 * Format request as curl command for display
 */
export function formatAsCurl(options) {
  const {
    model = 'gpt-4o-mini',
    messages = [],
    temperature = 0.7,
    maxTokens = null
  } = options;

  const body = {
    model,
    messages,
    temperature,
    ...(maxTokens && { max_tokens: maxTokens })
  };

  return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '${JSON.stringify(body, null, 2)}'`;
}

/**
 * Format messages for display
 */
export function formatMessages(messages) {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}
