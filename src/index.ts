import { MuninClient } from "@kalera/munin-sdk";

const baseUrl = "https://munin.kalera.dev";
const apiKey = process.env.MUNIN_API_KEY;
const defaultProjectId = process.env.MUNIN_PROJECT;

const extensionClient = new MuninClient({ baseUrl, apiKey });

/**
 * Cleans up raw Munin response for LLM context efficiency.
 * Removes dense vector arrays and formats GraphRAG objects into readable structures.
 */
function formatLlmResponse(rawRes: any): any {
  if (!rawRes || !rawRes.data) return rawRes;

  const data = rawRes.data;

  // Clean single memory retrieve
  if (data.key && data.content) {
    if (data.embedding) delete data.embedding;
    if (data.knowledge_graph) {
      data.knowledge_graph = formatGraph(data.knowledge_graph);
    }
  }

  // Clean search/list results
  if (Array.isArray(data.results)) {
    data.results = data.results.map((mem: any) => {
      if (mem.embedding) delete mem.embedding;
      return mem;
    });
  }

  // Clean graph in search
  if (data.knowledge_graph) {
    data.knowledge_graph = formatGraph(data.knowledge_graph);
  }

  return rawRes;
}

function formatGraph(kg: any): any {
  if (!kg) return kg;
  
  const entities = (kg.entities || []).map((e: any) => {
    if (e.embedding) delete e.embedding;
    return `${e.name} (${e.type}): ${e.description}`;
  });

  const relationships = (kg.relationships || []).map((r: any) => {
    if (r.embedding) delete r.embedding;
    return `${r.source} -[${r.relation}]-> ${r.target}`;
  });

  return {
    summary: "GraphRAG knowledge formatted for readability",
    entities,
    relationships
  };
}


export const tools = [
  {
    name: "munin_store_memory",
    description: "Store or update a memory in Munin Context Core. It will automatically use the active project from environment if projectId is omitted.",
    parameters: {
      type: "object",
      properties: {
        projectId: { type: "string", description: "Optional. Only use if cross-saving to a different Context Core ID." },
        key: { type: "string", description: "Unique identifier for this memory" },
        content: { type: "string", description: "The content to remember" },
        title: { type: "string", description: "Optional title" },
        tags: { 
          type: "array", 
          items: { type: "string" }, 
          description: "List of tags, e.g. ['planning', 'frontend']"
        }
      },
      required: ["key", "content"],
    },
    execute: async (args: any) => {
      const projectId = args.projectId || defaultProjectId;
      const { projectId: _, ...payload } = args;
      if (!projectId) throw new Error("projectId is required in arguments or MUNIN_PROJECT environment variable");
      const raw = await extensionClient.store(projectId, payload);
      return formatLlmResponse(raw);
    },
  },
  {
    name: "munin_retrieve_memory",
    description: "Retrieve a memory by its unique key from the current Munin Context Core.",
    parameters: {
      type: "object",
      properties: {
        projectId: { type: "string", description: "Optional. The Munin Context Core ID." },
        key: { type: "string", description: "Unique identifier" },
      },
      required: ["key"],
    },
    execute: async (args: any) => {
      const projectId = args.projectId || defaultProjectId;
      const { projectId: _, ...payload } = args;
      if (!projectId) throw new Error("projectId is required in arguments or MUNIN_PROJECT environment variable");
      const raw = await extensionClient.retrieve(projectId, payload);
      return formatLlmResponse(raw);
    },
  },
  {
    name: "munin_search_memories",
    description: "Search for memories using semantic search or keywords. Returns formatted, token-efficient GraphRAG context.",
    parameters: {
      type: "object",
      properties: {
        projectId: { type: "string", description: "Optional. The Munin Context Core ID." },
        query: { type: "string", description: "Search query" },
        tags: { type: "array", items: { type: "string" } },
        limit: { type: "number", description: "Max results (default: 10)" },
      },
      required: ["query"],
    },
    execute: async (args: any) => {
      const projectId = args.projectId || defaultProjectId;
      const { projectId: _, ...payload } = args;
      if (!projectId) throw new Error("projectId is required in arguments or MUNIN_PROJECT environment variable");
      const raw = await extensionClient.search(projectId, payload);
      return formatLlmResponse(raw);
    },
  },
];