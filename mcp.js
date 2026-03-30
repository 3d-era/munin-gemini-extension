#!/usr/bin/env node
import { startMcpServer } from "@kalera/munin-runtime";

// Start the MCP Server using stdio
startMcpServer().catch(err => {
    console.error(err);
    process.exit(1);
});
