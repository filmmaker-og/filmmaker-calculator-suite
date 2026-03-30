import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server.js";

const app = express();
app.use(express.json());

// Map to track active transports by session ID
const transports = new Map<string, StreamableHTTPServerTransport>();

app.all("/mcp", async (req, res) => {
  // Handle session-based MCP over HTTP
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (req.method === "GET" || req.method === "DELETE") {
    // GET = SSE stream for notifications, DELETE = close session
    const transport = sessionId ? transports.get(sessionId) : undefined;
    if (!transport) {
      res.status(400).json({ error: "No active session. Send a POST first." });
      return;
    }
    if (req.method === "DELETE") {
      await transport.close();
      transports.delete(sessionId!);
      res.status(200).json({ message: "Session closed" });
      return;
    }
    // GET - SSE stream
    await transport.handleRequest(req, res);
    return;
  }

  if (req.method === "POST") {
    // Check for existing session
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.handleRequest(req, res);
      return;
    }

    // New session — create transport + server
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      onsessioninitialized: (id) => {
        transports.set(id, transport);
      },
    });

    transport.onclose = () => {
      const id = [...transports.entries()].find(([, t]) => t === transport)?.[0];
      if (id) transports.delete(id);
    };

    const server = createServer();
    await server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", server: "mcp-loops" });
});

const PORT = parseInt(process.env.PORT || "3001", 10);
app.listen(PORT, () => {
  console.log(`MCP Loops HTTP server running on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});
