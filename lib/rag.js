import { embed, embedBatch, cosineSimilarity } from './embeddings.js';
import { complete } from './llm.js';

/**
 * Simple in-memory vector store
 */
export class VectorStore {
  constructor() {
    this.documents = [];
    this.embeddings = [];
  }

  async add(documents) {
    const newDocs = Array.isArray(documents) ? documents : [documents];
    const result = await embedBatch(newDocs);

    this.documents.push(...newDocs);
    this.embeddings.push(...result.embeddings);

    return { count: newDocs.length, usage: result.usage };
  }

  async search(query, topK = 3) {
    if (this.documents.length === 0) {
      return { results: [], usage: { totalTokens: 0 } };
    }

    const queryResult = await embed(query);
    const queryEmbedding = queryResult.embedding;

    const similarities = this.embeddings.map((embedding, idx) => ({
      document: this.documents[idx],
      similarity: cosineSimilarity(queryEmbedding, embedding),
      index: idx
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    return {
      results: similarities.slice(0, topK),
      usage: queryResult.usage
    };
  }

  clear() {
    this.documents = [];
    this.embeddings = [];
  }

  get size() {
    return this.documents.length;
  }
}

/**
 * RAG pipeline
 */
export async function ragQuery(query, vectorStore, options = {}) {
  const {
    topK = 3,
    systemPrompt = 'You are a helpful assistant. Answer based on the provided context.',
    temperature = 0.7,
    includeContext = true
  } = options;

  // Retrieve relevant documents
  const searchResult = await vectorStore.search(query, topK);

  if (searchResult.results.length === 0) {
    return {
      answer: "I don't have any information to answer this question.",
      context: [],
      usage: searchResult.usage
    };
  }

  // Build context from retrieved docs
  const context = searchResult.results
    .map((r, idx) => `[${idx + 1}] ${r.document}`)
    .join('\n\n');

  // Generate answer
  const messages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: includeContext
        ? `Context:\n${context}\n\nQuestion: ${query}\n\nAnswer based on the context above:`
        : query
    }
  ];

  const response = await complete({ messages, temperature });

  return {
    answer: response.content,
    context: searchResult.results,
    usage: {
      search: searchResult.usage,
      generation: response.usage
    }
  };
}

/**
 * Chunk text into smaller pieces
 */
export function chunkText(text, options = {}) {
  const {
    chunkSize = 500,
    chunkOverlap = 50,
    separator = '\n\n'
  } = options;

  // Split by separator first
  const sections = text.split(separator).filter(s => s.trim());

  const chunks = [];
  let currentChunk = '';

  for (const section of sections) {
    if ((currentChunk + section).length <= chunkSize) {
      currentChunk += (currentChunk ? separator : '') + section;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      if (section.length > chunkSize) {
        // Split long section
        const words = section.split(' ');
        currentChunk = '';

        for (const word of words) {
          if ((currentChunk + ' ' + word).length <= chunkSize) {
            currentChunk += (currentChunk ? ' ' : '') + word;
          } else {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          }
        }
      } else {
        currentChunk = section;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Recursive character splitting
 */
export function recursiveChunk(text, chunkSize = 500, separators = ['\n\n', '\n', '. ', ' ']) {
  if (text.length <= chunkSize) {
    return [text];
  }

  for (const separator of separators) {
    if (text.includes(separator)) {
      const parts = text.split(separator);
      const chunks = [];
      let currentChunk = '';

      for (const part of parts) {
        const testChunk = currentChunk + (currentChunk ? separator : '') + part;

        if (testChunk.length <= chunkSize) {
          currentChunk = testChunk;
        } else {
          if (currentChunk) {
            chunks.push(currentChunk);
          }

          if (part.length > chunkSize) {
            // Recursively chunk this part
            chunks.push(...recursiveChunk(part, chunkSize, separators.slice(1)));
            currentChunk = '';
          } else {
            currentChunk = part;
          }
        }
      }

      if (currentChunk) {
        chunks.push(currentChunk);
      }

      return chunks.filter(c => c.trim());
    }
  }

  // Fallback: character split
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}
