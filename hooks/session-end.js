const fs = require('fs');
const path = require('path');

const projectId = process.env.MUNIN_PROJECT;
const apiKey = process.env.MUNIN_API_KEY;

if (!projectId || !apiKey) {
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  process.exit(0);
}

// In a real advanced scenario, if we track the conversation ID, we could fetch the transcript
// and send it to an LLM to summarize, then store it. Since hooks are synchronous scripts,
// doing an LLM call here might be too slow or hit rate limits on exit.
// As an MVP for "C", we'll log a polite terminal message advising them.

const chunks = [];
process.stdin.on('data', (chunk) => chunks.push(chunk));
process.stdin.on('end', () => {
  console.error('\n\x1b[36m[Munin Context Core]\x1b[0m Session ending.');
  console.error('\x1b[33mTip: If you discussed important architectural decisions, make sure the Agent used "munin_store_memory" before you exit!\x1b[0m\n');
  
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
});