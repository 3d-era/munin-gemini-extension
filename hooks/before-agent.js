const fs = require('fs');
const path = require('path');

// Quick check if we should run logic
const projectId = process.env.MUNIN_PROJECT;
const apiKey = process.env.MUNIN_API_KEY;

if (!projectId || !apiKey) {
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  process.exit(0);
}

const chunks = [];
process.stdin.on('data', (chunk) => chunks.push(chunk));
process.stdin.on('end', async () => {
  try {
    const raw = JSON.parse(Buffer.concat(chunks).toString());
    const userPrompt = raw.prompt || '';

    // If there's a prompt, let's do a semantic search instead of just recent
    // This provides HYPER-RELEVANT context directly into the LLM
    const url = 'https://munin.kalera.dev/api/mcp/action';
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        project: projectId,
        action: 'search',
        payload: { query: userPrompt, limit: 3 },
        client: { name: 'munin-gemini-hook', version: '1.0.0' }
      })
    });
    
    if (!resp.ok) {
      process.stdout.write(JSON.stringify({ continue: true }) + '\n');
      return;
    }
    
    const result = await resp.json();
    let contextText = '';
    
    if (result.success && result.data && result.data.results && result.data.results.length > 0) {
      contextText += "<munin_recent_context>\n";
      contextText += "<!-- Injected automatically by Munin Semantic Search. -->\n";
      for (const mem of result.data.results) {
        contextText += `[Key: ${mem.key} | Tags: ${(mem.tags || []).join(',')}] ${mem.title || ''}\n`;
        contextText += `${mem.content}\n`;
        contextText += "---\n";
      }
      contextText += "</munin_recent_context>";
    }

    process.stdout.write(JSON.stringify({ 
      continue: true,
      systemMessage: contextText || undefined
    }) + '\n');

  } catch (e) {
    // Ignore hook errors to avoid crashing agent
    process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  }
});