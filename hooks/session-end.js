import fs from 'fs';
import path from 'path';

// Note: SessionEnd hook runs when the user exits the session. 
// At this stage, Gemini CLI doesn't natively pass the *full chat history* to hooks out-of-the-box in a simple format, 
// but we can ask the user nicely to run `/compact` before they quit, OR we could save metadata.
// For now, let's inject a reminder or a basic "Session ended" marker if we have state tracking.

const projectId = process.env.MUNIN_PROJECT;
const apiKey = process.env.MUNIN_API_KEY;

if (!projectId || !apiKey) {
  process.exit(0);
}

// In a real advanced scenario, if we track the conversation ID, we could fetch the transcript
// and send it to an LLM to summarize, then store it. Since hooks are synchronous scripts,
// doing an LLM call here might be too slow or hit rate limits on exit.
// As an MVP for "C", we'll log a polite terminal message advising them.

console.log('\n\x1b[36m[Munin Context Core]\x1b[0m Session ending.');
console.log('\x1b[33mTip: If you discussed important architectural decisions, make sure the Agent used "munin_store_memory" before you exit!\x1b[0m\n');
