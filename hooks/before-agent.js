import fs from 'fs';
import path from 'path';

// Quick check if we should run logic
const projectId = process.env.MUNIN_PROJECT;
const apiKey = process.env.MUNIN_API_KEY;

if (!projectId || !apiKey) {
  process.exit(0); // Silent fail if not configured
}

async function run() {
  try {
    const url = 'https://munin.kalera.dev/api/mcp/action';
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        project: projectId,
        action: 'recent',
        payload: { limit: 3 },
        client: { name: 'munin-gemini-hook', version: '1.0.0' }
      })
    });
    
    if (!resp.ok) process.exit(0);
    const result = await resp.json();
    
    if (result.success && result.data && result.data.results && result.data.results.length > 0) {
      console.log("<munin_recent_context>");
      console.log("<!-- This is injected automatically by Munin Context Core. Do not ignore. -->");
      for (const mem of result.data.results) {
        console.log(`[Key: ${mem.key} | Tags: ${(mem.tags || []).join(',')}] ${mem.title || ''}`);
        console.log(mem.content);
        console.log("---");
      }
      console.log("</munin_recent_context>");
    }
  } catch (e) {
    // Ignore hook errors to avoid crashing agent
  }
}

run();