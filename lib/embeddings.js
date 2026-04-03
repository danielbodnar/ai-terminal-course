import OpenAI from 'openai';
import { MOCK_MODE, mockEmbed, mockEmbedBatch } from './mock.js';

let openaiClient = null;

export function initEmbeddings(apiKey) {
  if (!MOCK_MODE) {
    openaiClient = new OpenAI({ apiKey });
  }
}

/**
 * Generate embeddings for text
 */
export async function embed(text, model = 'text-embedding-3-small') {
  if (MOCK_MODE) return mockEmbed(text, model);
  const response = await openaiClient.embeddings.create({
    model,
    input: text,
    encoding_format: 'float'
  });

  return {
    embedding: response.data[0].embedding,
    model: response.model,
    usage: {
      promptTokens: response.usage.prompt_tokens,
      totalTokens: response.usage.total_tokens
    },
    dimensions: response.data[0].embedding.length
  };
}

/**
 * Embed multiple texts in one call (more efficient)
 */
export async function embedBatch(texts, model = 'text-embedding-3-small') {
  if (MOCK_MODE) return mockEmbedBatch(texts, model);

  const response = await openaiClient.embeddings.create({
    model,
    input: texts,
    encoding_format: 'float'
  });

  return {
    embeddings: response.data.map(d => d.embedding),
    model: response.model,
    usage: {
      promptTokens: response.usage.prompt_tokens,
      totalTokens: response.usage.total_tokens
    },
    dimensions: response.data[0].embedding.length
  };
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same dimensions');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Find most similar texts to query
 */
export async function search(query, documents, topK = 3) {
  // Embed query
  const queryResult = await embed(query);
  const queryEmbedding = queryResult.embedding;

  // Embed all documents
  const docResults = await embedBatch(documents);
  const docEmbeddings = docResults.embeddings;

  // Calculate similarities
  const results = documents.map((doc, idx) => ({
    text: doc,
    similarity: cosineSimilarity(queryEmbedding, docEmbeddings[idx])
  }));

  // Sort by similarity (highest first)
  results.sort((a, b) => b.similarity - a.similarity);

  // Return top K
  return {
    results: results.slice(0, topK),
    usage: {
      promptTokens: queryResult.usage.promptTokens + docResults.usage.promptTokens,
      totalTokens: queryResult.usage.totalTokens + docResults.usage.totalTokens
    }
  };
}

/**
 * Calculate embedding cost
 */
export function calculateEmbeddingCost(tokens, model = 'text-embedding-3-small') {
  const pricing = {
    'text-embedding-3-small': 0.020,  // per 1M tokens
    'text-embedding-3-large': 0.130,
    'text-embedding-ada-002': 0.100
  };

  const pricePerMillion = pricing[model] || pricing['text-embedding-3-small'];
  return (tokens / 1_000_000) * pricePerMillion;
}

/**
 * Visualize embedding as ASCII bar chart (first N dimensions)
 */
export function visualizeEmbedding(embedding, dimensions = 50) {
  const subset = embedding.slice(0, dimensions);
  const maxVal = Math.max(...subset.map(Math.abs));

  const bars = subset.map(val => {
    const normalized = val / maxVal;
    const barLength = Math.abs(Math.round(normalized * 20));
    const char = val >= 0 ? '█' : '▓';
    return char.repeat(barLength);
  });

  return bars;
}

/**
 * Format similarity score with visual bar
 */
export function formatSimilarity(score) {
  const percentage = Math.round(score * 100);
  const barLength = Math.round(score * 20);
  const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);

  return {
    score: score.toFixed(4),
    percentage: `${percentage}%`,
    bar
  };
}

/**
 * Group texts by similarity (clustering)
 */
export async function cluster(texts, threshold = 0.7) {
  const results = await embedBatch(texts);
  const embeddings = results.embeddings;

  const clusters = [];
  const assigned = new Set();

  for (let i = 0; i < texts.length; i++) {
    if (assigned.has(i)) continue;

    const cluster = [i];
    assigned.add(i);

    for (let j = i + 1; j < texts.length; j++) {
      if (assigned.has(j)) continue;

      const similarity = cosineSimilarity(embeddings[i], embeddings[j]);
      if (similarity >= threshold) {
        cluster.push(j);
        assigned.add(j);
      }
    }

    clusters.push(cluster.map(idx => texts[idx]));
  }

  return {
    clusters,
    usage: results.usage
  };
}

/**
 * Find the "odd one out" - text that's least similar to others
 */
export async function findOddOneOut(texts) {
  const results = await embedBatch(texts);
  const embeddings = results.embeddings;

  const avgSimilarities = embeddings.map((embedding, idx) => {
    const similarities = embeddings
      .filter((_, i) => i !== idx)
      .map(other => cosineSimilarity(embedding, other));

    const avg = similarities.reduce((sum, s) => sum + s, 0) / similarities.length;

    return {
      index: idx,
      text: texts[idx],
      avgSimilarity: avg
    };
  });

  // Lowest average similarity = odd one out
  avgSimilarities.sort((a, b) => a.avgSimilarity - b.avgSimilarity);

  return {
    oddOneOut: avgSimilarities[0],
    allScores: avgSimilarities,
    usage: results.usage
  };
}
