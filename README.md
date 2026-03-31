# 🧠 Munin Extension for Gemini CLI

[![Status: Published](https://img.shields.io/badge/Status-Published-success)]()
[![Powered by: GraphRAG](https://img.shields.io/badge/Powered_by-GraphRAG-blue)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)]()

**Give your Gemini CLI Agent a robust, Long-Term Memory.** 

Have you ever been frustrated when your AI agent forgets the architectural decisions you made yesterday? Or when it repeats the exact same bug it fixed in the previous session? 

**Meet Munin.** 

[Munin](https://www.kalera.app) is a Full-Stack Long-Term Memory manager powered by **GraphRAG**. This official extension connects Gemini CLI to your Munin Context Cores, allowing your AI to build, query, and maintain a persistent knowledge graph of your entire project across endless sessions.

---

## ✨ Feature Highlights

Munin isn't just a database; it's a cognitive layer for your AI agents:

- 🛡️ **AI Memory Guard:** Detects semantic contradictions in your agent's memory to ensure consistency.
- 🕸️ **GraphRAG Visualizer:** Auto-extracts entities and relationships into interactive 2D neural knowledge graphs and Mermaid-compatible diagrams.
- ⚡ **Lower Token Costs:** Semantic hybrid search (Vector + Keyword) ensures Gemini pulls only the most relevant snippets, keeping your prompts lean and fast.
- 🔐 **E2EE With GraphRAG:** Industry-leading security. Encrypt your memory end-to-end while maintaining the ability to perform high-performance semantic search (Elite Tier).
- 🕒 **Temporal Search:** Search by time context—ask "what did we decide last Tuesday?" and get exact answers.
- 📌 **Dynamic Pinning:** Force-inject critical project context (like coding standards or core architecture) so Gemini never loses the "big picture".
- 🤝 **Cross-Project Sharing:** Share selected memories across different projects to reuse logic and context without manual copy-pasting.
- ⌛ **Memory TTL:** Set expiration windows for temporary context to keep your memory cores clean and noise-free.

---

## 🌟 Why Munin?

When you integrate Munin with Gemini CLI, your AI transforms from a stateless assistant into a core team member who *remembers*:

- 🧠 **Infinite Persistence:** Context isn't lost when you close your terminal. Munin remembers project architecture, conventions, and business logic forever.
- ⚡ **Precision Recall:** Instead of dumping raw documentation into the prompt and wasting tokens, Gemini semantically searches Munin for the exact context it needs right now.
- 🛡️ **Error Cataloging:** When Gemini fixes a bug, Munin records the *Root Cause* and *Solution*. It learns from mistakes and doesn't repeat them.

## 🚀 Setup as an Extension

Supercharge your Gemini CLI in 3 simple steps:

1. **Get your API Key:** Head over to [Kalera.app](https://www.kalera.app), create a free account, and generate your API Key.
2. **Install the Extension:** Run the following command in your terminal:
   ```bash
   gemini extensions install https://github.com/3d-era/munin-gemini-extension
   ```
   *You will be prompted to provide your API key during installation.*

3. **Configure your Workspace:** Add these environment variables to your project's root `.env` file to link Gemini to your specific project's Context Core:
   ```bash
   export MUNIN_API_KEY="your-api-key"
   export MUNIN_PROJECT="your-context-core-id"
   ```

## 🛠️ Programmatic Usage (Adapter)

If you are building custom tooling and want to use the Munin adapter directly in your code:

```ts
import { createGeminiCliMuninAdapter } from "@kalera/munin-gemini";

const adapter = createGeminiCliMuninAdapter({
  baseUrl: process.env.MUNIN_BASE_URL ?? "https://munin.kalera.dev",
  apiKey: process.env.MUNIN_API_KEY,
  project: process.env.MUNIN_PROJECT ?? "default-core",
});

// Example: Retrieve recent memories
await adapter.callTool("your-context-core-id", "list", { limit: 10 });
```

---
Built with ❤️ by [Kalera](https://www.kalera.app) for the AI Engineering community.
