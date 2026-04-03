import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

let openaiClient = null;

export function initStructured(apiKey) {
  openaiClient = new OpenAI({ apiKey });
}

/**
 * Request JSON with prompt engineering (unreliable)
 */
export async function requestJSON(messages, temperature = 0.7) {
  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature
  });

  return {
    content: response.choices[0].message.content,
    usage: response.usage,
    finishReason: response.choices[0].finish_reason
  };
}

/**
 * Request JSON with JSON mode (more reliable)
 */
export async function requestJSONMode(messages, temperature = 0.7) {
  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature,
    response_format: { type: 'json_object' }
  });

  return {
    content: response.choices[0].message.content,
    usage: response.usage,
    finishReason: response.choices[0].finish_reason
  };
}

/**
 * Request structured output with Zod schema (guaranteed)
 */
export async function requestStructured(messages, schema, schemaName, temperature = 0.7) {
  const response = await openaiClient.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages,
    temperature,
    response_format: zodResponseFormat(schema, schemaName)
  });

  return {
    parsed: response.choices[0].message.parsed,
    refusal: response.choices[0].message.refusal,
    usage: response.usage,
    finishReason: response.choices[0].finish_reason
  };
}

/**
 * Try to parse JSON with error handling
 */
export function tryParseJSON(text) {
  try {
    // Try to extract JSON if wrapped in markdown
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[1]) };
    }

    // Try direct parse
    return { success: true, data: JSON.parse(text) };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      text: text.substring(0, 200) + (text.length > 200 ? '...' : '')
    };
  }
}

/**
 * Retry with backoff
 */
export async function retryParse(messages, maxAttempts = 3) {
  const results = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await requestJSON(messages, 0.7);
    const parsed = tryParseJSON(response.content);

    results.push({
      attempt,
      success: parsed.success,
      content: response.content,
      data: parsed.data,
      error: parsed.error,
      usage: response.usage
    });

    if (parsed.success) {
      return { success: true, result: results[results.length - 1], attempts: results };
    }

    // Add correction to next attempt
    if (attempt < maxAttempts) {
      messages.push({
        role: 'assistant',
        content: response.content
      });
      messages.push({
        role: 'user',
        content: `That wasn't valid JSON. Error: ${parsed.error}. Please return ONLY valid JSON.`
      });
    }
  }

  return { success: false, attempts: results };
}

/**
 * Validate against schema
 */
export function validateWithZod(data, schema) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    };
  }
}
