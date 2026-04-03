# AI Terminal Course

> Understand what your AI tools are actually doing.
> 14 hands-on modules. Terminal only. No videos, no slides.

## Quick Start

```bash
# Works instantly — no API key needed:
npx ai-terminal-course

# Or install globally:
npm install -g ai-terminal-course
ai-terminal
```

That's it. The course runs in **demo mode** by default with simulated API responses. To use real OpenAI APIs (optional, ~$10 total):

```bash
mkdir -p ~/.ai-terminal-course
echo "OPENAI_API_KEY=sk-your-key" > ~/.ai-terminal-course/.env
```

Get an API key: https://platform.openai.com/api-keys

## What You'll Learn

### Tier 1 — Build Something Now
1. **Your First LLM Call** — Make a real API call, understand what comes back
2. **Prompt Engineering** — Few-shot, chain-of-thought, templates that work
3. **Streaming Responses** — Real-time token-by-token output
4. **Structured Outputs** — Get JSON back, validate with schemas
5. **Tool Calling** — Let LLMs call your functions

### Tier 2 — Understand the Engine
6. **Tokens, Cost & Context** — How LLMs see text, what it costs, why they forget
7. **Embeddings & Semantic Search** — Turn text into vectors, find similar things
8. **RAG: Chat With Your Data** — Retrieval-augmented generation + chunking strategies
9. **Agentic Patterns** — ReAct, planning, multi-step reasoning

### Tier 3 — Ship to Production
10. **Evals & Testing** — Test suites, quality metrics, LLM-as-judge
11. **Guardrails & Safety** — PII detection, content filtering, prompt injection defense
12. **Cost Optimization & Caching** — Model routing, semantic caching, 90% cost reduction
13. **Monitoring & Observability** — Logs, traces, alerts, incident response

### Tier 4 — Graduate
14. **Capstone: Ship It** — Build a complete Document Q&A system

## Who This Is For

- You can code (any language)
- You're comfortable with the terminal
- You have zero AI/LLM knowledge (perfect starting point)

## Demo Mode vs Real Mode

| | Demo Mode | Real Mode |
|---|---|---|
| **Setup** | `npx ai-terminal-course` | Set `OPENAI_API_KEY` |
| **Cost** | Free | ~$10 total |
| **Responses** | Simulated (labeled) | Real OpenAI API |
| **Best for** | Exploring the course | Full learning experience |

Demo mode responses are clearly labeled `[DEMO MODE - simulated response]` so you always know what's real.

## Time & Cost

- **Duration**: ~7 hours (14 modules, ~30 min each)
- **API cost**: Free (demo mode) or ~$10 (real APIs)
- **Prerequisites**: Node.js 18+

## Commands

```bash
# Start the course:
ai-terminal-course

# Jump to a specific module:
ai-terminal-course 5

# See your progress:
ai-terminal-course
```

## Progress Tracking

Progress saves locally to `~/.ai-terminal-course/progress.json`. Optionally sign in with GitHub to back it up.

## Development

```bash
git clone https://github.com/josharsh/ai-terminal-course.git
cd ai-terminal-course
npm install
npm start
```

## License

MIT

---

**Stop reading. Start building.**

```bash
npx ai-terminal-course
```
