# Quick Start Guide

## For YOU (Testing/Development)

### Option 1: Full User Experience (RECOMMENDED)
```bash
npm start 10
```
This runs Module 10 exactly as a user would experience it:
- Full terminal UI with colors and animations
- Interactive prompts (you type inputs)
- Live API calls with real responses
- Costs ~$0.40 and takes ~50 minutes if you go through everything
- Press Ctrl+C to exit anytime

### Option 2: Quick Technical Test
```bash
npm test 10
```
This just verifies the module runs without errors:
- Shows if module loads correctly
- Displays execution time
- Good for debugging
- Still interactive (you'll need to press Enter at prompts)

### Option 3: Test Multiple Modules
```bash
# Test RAG modules
npm test 9-10

# Test all Week 2 modules
npm test 7-10

# Test everything (expensive! ~$3 total)
npm test all
```

## For END USERS (Production)

### First Time Setup
```bash
# 1. Clone the repo
git clone <repo-url>
cd ai-engineering-bootcamp

# 2. Install dependencies
npm install

# 3. Add API key
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=sk-...

# 4. Start learning!
npm start
```

### Daily Usage
```bash
# Continue where you left off
npm start

# Or jump to specific module
npm start 5
```

## What You'll Experience

Each module is **fully interactive**:

```
┌──────────────────────────────────────────────────────────┐
│ MODULE 10: DOCUMENT CHUNKING STRATEGIES                  │
├──────────────────────────────────────────────────────────┤
│ Time: ~50 mins │ Cost: ~$0.40 │ Progress: 10/20          │
│                                                           │
│ Chunking is THE most important part of RAG.              │
│ Bad chunking = Bad retrieval = Bad answers.              │
└──────────────────────────────────────────────────────────┘

Press Enter to continue...
```

Then you'll go through:
1. **Problem explanation** with live examples
2. **Three chunking strategies** with real demos
3. **Interactive playground** where YOU chunk text
4. **Production best practices** with real-world examples

## Cost Breakdown

| Module | Time | Cost | What You Build |
|--------|------|------|----------------|
| 1 | 30m | $0.10 | Token visualizer |
| 2 | 30m | $0.15 | LLM playground |
| 3 | 25m | $0.20 | Streaming demo |
| 4 | 35m | $0.25 | Semantic search |
| 5 | 40m | $0.50 | Chatbot with memory |
| 6 | 35m | $0.30 | Data extractor |
| 7 | 40m | $0.35 | CLI assistant |
| 8 | 35m | $0.25 | Prompt optimizer |
| 9 | 45m | $0.30 | RAG Q&A system |
| 10 | 50m | $0.40 | Chunking pipeline |

**Total**: ~6 hours, ~$3.00

## Testing Tips

### Test One Module Thoroughly
```bash
# Start fresh
rm -rf .state/

# Run the full experience
npm start 10

# Try different inputs:
# - Enter your own text in the playground
# - Try different chunk sizes
# - Compare strategies
```

### Test User Journey
```bash
# Test the progression: 9 → 10
npm start 9    # Learn RAG
# Complete it...
npm start 10   # Learn chunking (builds on RAG)
```

### Test Error Handling
```bash
npm start 10

# Try:
# - Empty inputs
# - Very large inputs
# - Invalid numbers
# - Pressing Ctrl+C to quit
```

## Progress Tracking

Your progress is saved in `.state/progress.json`:

```json
{
  "completedModules": [1, 2, 3, 9, 10],
  "currentModule": 11,
  "stats": {
    "totalCost": 2.85,
    "totalTime": 385
  }
}
```

## Reset Progress
```bash
# Start completely fresh
rm -rf .state/
npm start
```

## Common Workflows

### As a Developer (Testing)
```bash
# Quick check after code changes
npm test 10

# Full UX test
npm start 10

# Test range of related modules
npm test 9-10
```

### As a User (Learning)
```bash
# Daily practice (30 min/day)
npm start          # Resume where you left off

# Review a module
npm start 5        # Go back to Module 5
```

### As a Contributor
```bash
# Test before committing
npm test 10               # Quick validation
npm start 10              # Full UX check
git commit -m "Add Module 10"
```

## Pro Tips

1. **Use `npm start`** for the real experience
2. **Use `npm test`** for quick validation
3. **Start fresh** with `rm -rf .state/` to test first-time user experience
4. **Budget API costs** - each module costs $0.10-$0.50
5. **Press Ctrl+C** anytime to exit
6. **Read TESTING.md** for advanced testing scenarios

## Troubleshooting

### "Module not found"
```bash
npm run test:list  # See which modules exist
```

### "API key not found"
```bash
cat .env           # Check if OPENAI_API_KEY is set
```

### "Import error"
```bash
rm -rf node_modules
npm install
```

### Module feels broken
```bash
npm test 10        # See if there are JS errors
```

---

**Ready to test?**

```bash
# Experience Module 10 as a user would
npm start 10
```

This is the real deal - full interactive terminal experience with live API calls! 🚀
