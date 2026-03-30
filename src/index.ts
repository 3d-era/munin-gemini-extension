import { MuninClient } from "@kalera/munin-sdk";

const baseUrl = "https://munin.kalera.dev";
const apiKey = process.env.MUNIN_API_KEY;
const defaultProjectId = process.env.MUNIN_PROJECT;

const extensionClient = new MuninClient({ baseUrl, apiKey });

export const tools = [
  {
    name: "munin_store_memory",
    description: "Store or update a memory in Munin. Requires a unique key and the content.",
    parameters: {
      type: "object",
      properties: {
        projectId: { type: "string", description: "The Munin Context Core ID (optional if set in env)" },
        key: { type: "string", description: "Unique identifier for this memory" },
        content: { type: "string", description: "The content to remember" },
        title: { type: "string", description: "Optional title" },
        tags: { 
          type: "array", 
          items: { type: "string" }, 
          description: "List of tags, e.g. [\\planning\, \\frontend\]"
        }
      },
      required: ["key", "content"],
    },
    execute: async (args: any) => {
      const projectId = args.projectId || defaultProjectId;
      const { projectId: _, ...payload } = args;
      if (!projectId) throw new Error("projectId is required in arguments or MUNIN_PROJECT environment variable");
      return await extensionClient.store(projectId, payload);
    },
  },
  {
    name: "munin_retrieve_memory",
    description: "Retrieve a memory by its unique key from Munin.",
    parameters: {
      type: "object",
      properties: {
        projectId: { type: "string", description: "The Munin Context Core ID" },
        key: { type: "string", description: "Unique identifier" },
      },
      required: ["key"],
    },
    execute: async (args: any) => {
      const projectId = args.projectId || defaultProjectId;
      const { projectId: _, ...payload } = args;
      if (!projectId) throw new Error("projectId is required");
      return await extensionClient.retrieve(projectId, payload);
    },
  },
  {
    name: "munin_search_memories",
    description: "Search for memories using semantic search or keywords. Returns GraphRAG entities and relationships if available.",
    parameters: {
      type: "object",
      properties: {
        projectId: { type: "string", description: "The Munin Context Core ID" },
        query: { type: "string", description: "Search query" },
        tags: { type: "array", items: { type: "string" } },
        limit: { type: "number", description: "Max results (default: 10)" },
      },
      required: ["query"],
    },
    execute: async (args: any) => {
      const projectId = args.projectId || defaultProjectId;
      const { projectId: _, ...payload } = args;
      if (!projectId) throw new Error("projectId is required");
      return await extensionClient.search(projectId, payload);
    },
  },
];
