# Munin Adapter for Gemini CLI

## Status

- Phase: published
- Dispatch style: `callTool(name, args)`

## Usage

```ts
import { createGeminiCliMuninAdapter } from "@kalera/munin-gemini";

const adapter = createGeminiCliMuninAdapter({
  baseUrl: process.env.MUNIN_BASE_URL ?? "https://munin.kalera.dev",
  apiKey: process.env.MUNIN_API_KEY,
  project: process.env.MUNIN_PROJECT ?? "default-core",
});

await adapter.callTool("your-context-core-id", "list", { limit: 10 });
```

## Setup as Extension

To use this adapter as an extension for Gemini CLI:

1. Create a free account here: https://www.kalera.app and obtain an API Key
2. Run this command
```bash
gemini extensions install https://github.com/3d-era/munin-gemini-extension
``` 
Provide the API key during installation.
3. Set up environment variables: (you can define them in the `.env` file located at the project's root)
```bash
export MUNIN_API_KEY="your-api-key"
export MUNIN_PROJECT="your-context-core-id"
```
