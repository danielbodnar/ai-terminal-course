import OpenAI from 'openai';

let openaiClient = null;

export function initOpenAI(apiKey) {
  openaiClient = new OpenAI({ apiKey });
}

/**
 * Tokenize text using BPE-style approximation
 * This is a simplified implementation - in production use: import { encoding_for_model } from 'tiktoken'
 *
 * Key behavior: Spaces are grouped with the START of words (like OpenAI's tiktoken)
 * Example: "Hello world" → ["Hello", " world"] (not ["Hello", " ", "world"])
 */
export async function tokenize(text) {
  // For now, we'll use a simple approximation
  // In production, use: import { encoding_for_model } from 'tiktoken'

  // BPE-style tokenization approximation
  // Key: spaces are attached to the word that follows them
  const tokens = [];
  let currentPos = 0;

  // Patterns that mimic BPE behavior (spaces grouped with following words)
  const patterns = [
    /\s+[a-zA-Z]+/,  // space(s) + word (e.g., " world")
    /\s+[0-9]+/,     // space(s) + number
    /[a-zA-Z]+/,     // word without leading space (first word)
    /[0-9]+/,        // number without leading space
    /[^\s\w]+/,      // punctuation
    /\s+/,           // remaining whitespace (fallback)
  ];

  while (currentPos < text.length) {
    let matched = false;

    for (const pattern of patterns) {
      const regex = new RegExp('^' + pattern.source);
      const match = text.slice(currentPos).match(regex);

      if (match) {
        const tokenText = match[0];
        const bytes = Array.from(new TextEncoder().encode(tokenText));

        tokens.push({
          text: tokenText,
          id: generateTokenId(tokenText),
          bytes: bytes,
          start: currentPos,
          end: currentPos + tokenText.length
        });

        currentPos += tokenText.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Single character fallback
      const char = text[currentPos];
      const bytes = Array.from(new TextEncoder().encode(char));
      tokens.push({
        text: char,
        id: generateTokenId(char),
        bytes: bytes,
        start: currentPos,
        end: currentPos + 1
      });
      currentPos++;
    }
  }

  return tokens;
}

/**
 * Generate a pseudo token ID (for demonstration)
 * Real implementation would use tiktoken's actual token IDs
 */
function generateTokenId(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % 50000; // Keep it reasonable
}

/**
 * Count tokens (approximation)
 */
export async function countTokens(text) {
  const tokens = await tokenize(text);
  return tokens.length;
}

/**
 * Compare tokenization across different inputs
 */
export async function compareTokenization(texts) {
  const results = [];

  for (const text of texts) {
    const tokens = await tokenize(text);
    results.push({
      text,
      tokens,
      count: tokens.length
    });
  }

  return results;
}

/**
 * Calculate cost based on token count
 * Pricing as of 2025 (per 1M tokens)
 */
export function calculateCost(tokenCount, model = 'gpt-4o-mini', type = 'input') {
  const pricing = {
    'gpt-4o-mini': { input: 0.15, output: 0.60 },     // $0.15/$0.60 per 1M tokens
    'gpt-4o': { input: 3.00, output: 10.00 },         // $3.00/$10.00 per 1M tokens
    'gpt-4-turbo': { input: 10.00, output: 30.00 },   // $10.00/$30.00 per 1M tokens
    'gpt-4': { input: 30.00, output: 60.00 },         // $30.00/$60.00 per 1M tokens (legacy)
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 }    // $0.50/$1.50 per 1M tokens
  };

  const prices = pricing[model] || pricing['gpt-4o-mini'];
  const pricePerMillion = type === 'input' ? prices.input : prices.output;

  return (tokenCount / 1_000_000) * pricePerMillion;
}
