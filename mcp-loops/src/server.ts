import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const LOOPS_API_BASE = "https://app.loops.so/api/v1";

function getApiKey(): string {
  const key = process.env.LOOPS_API_KEY;
  if (!key) {
    throw new Error("LOOPS_API_KEY environment variable is required");
  }
  return key;
}

async function loopsRequest(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>,
  queryParams?: Record<string, string>
): Promise<unknown> {
  const url = new URL(`${LOOPS_API_BASE}${path}`);
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${getApiKey()}`,
    Accept: "application/json",
  };

  const options: RequestInit = { method, headers };

  if (body && (method === "POST" || method === "PUT")) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { rawResponse: text, status: response.status };
  }
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "mcp-loops",
    version: "1.0.0",
  });

  // --- API Key ---

  server.tool("test_api_key", "Test if your Loops API key is valid", {}, async () => {
    const result = await loopsRequest("/api-key");
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  // --- Contacts ---

  server.tool(
    "create_contact",
    "Create a new contact in Loops",
    {
      email: z.string().email().describe("Contact email address"),
      firstName: z.string().optional().describe("First name"),
      lastName: z.string().optional().describe("Last name"),
      source: z.string().optional().describe("Source of the contact"),
      subscribed: z.boolean().optional().describe("Whether contact is subscribed (default true)"),
      userGroup: z.string().optional().describe("User group to assign"),
      userId: z.string().optional().describe("Unique user ID"),
      mailingLists: z
        .record(z.boolean())
        .optional()
        .describe("Mailing list subscriptions as {listId: true/false}"),
      customProperties: z
        .record(z.union([z.string(), z.number(), z.boolean()]))
        .optional()
        .describe("Custom contact properties"),
    },
    async (params) => {
      const { customProperties, ...rest } = params;
      const body = { ...rest, ...customProperties };
      const result = await loopsRequest("/contacts", "POST", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_contact",
    "Update an existing contact in Loops",
    {
      email: z.string().email().describe("Contact email address"),
      firstName: z.string().optional().describe("First name"),
      lastName: z.string().optional().describe("Last name"),
      subscribed: z.boolean().optional().describe("Whether contact is subscribed"),
      userGroup: z.string().optional().describe("User group"),
      userId: z.string().optional().describe("Unique user ID"),
      mailingLists: z
        .record(z.boolean())
        .optional()
        .describe("Mailing list subscriptions as {listId: true/false}"),
      customProperties: z
        .record(z.union([z.string(), z.number(), z.boolean()]))
        .optional()
        .describe("Custom contact properties to update"),
    },
    async (params) => {
      const { customProperties, ...rest } = params;
      const body = { ...rest, ...customProperties };
      const result = await loopsRequest("/contacts", "PUT", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "find_contact",
    "Find a contact by email or userId",
    {
      email: z.string().optional().describe("Contact email to search for"),
      userId: z.string().optional().describe("User ID to search for"),
    },
    async (params) => {
      const query: Record<string, string> = {};
      if (params.email) query.email = params.email;
      if (params.userId) query.userId = params.userId;
      const result = await loopsRequest("/contacts", "GET", undefined, query);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_contact",
    "Delete a contact from Loops",
    {
      email: z.string().optional().describe("Contact email to delete"),
      userId: z.string().optional().describe("User ID to delete"),
    },
    async (params) => {
      const query: Record<string, string> = {};
      if (params.email) query.email = params.email;
      if (params.userId) query.userId = params.userId;
      const result = await loopsRequest("/contacts", "DELETE", undefined, query);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // --- Contact Suppression ---

  server.tool(
    "check_suppression",
    "Check if a contact is suppressed",
    {
      email: z.string().email().describe("Contact email to check"),
    },
    async (params) => {
      const result = await loopsRequest("/contacts/suppression", "GET", undefined, {
        email: params.email,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "remove_suppression",
    "Remove suppression from a contact",
    {
      email: z.string().email().describe("Contact email to unsuppress"),
    },
    async (params) => {
      const result = await loopsRequest("/contacts/suppression/remove", "POST", {
        email: params.email,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // --- Contact Properties ---

  server.tool(
    "create_contact_property",
    "Create a custom contact property in Loops",
    {
      name: z.string().describe("Property name (camelCase recommended)"),
      type: z.enum(["string", "number", "boolean", "date"]).describe("Property data type"),
    },
    async (params) => {
      const result = await loopsRequest("/contact-properties", "POST", {
        name: params.name,
        type: params.type,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_contact_properties",
    "List all custom contact properties",
    {},
    async () => {
      const result = await loopsRequest("/contact-properties");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // --- Mailing Lists ---

  server.tool("list_mailing_lists", "List all mailing lists in Loops", {}, async () => {
    const result = await loopsRequest("/mailing-lists");
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  // --- Events ---

  server.tool(
    "send_event",
    "Send/trigger an event in Loops for a contact",
    {
      eventName: z.string().describe("Name of the event to trigger"),
      email: z.string().email().optional().describe("Contact email (required if no userId)"),
      userId: z.string().optional().describe("User ID (required if no email)"),
      eventProperties: z
        .record(z.union([z.string(), z.number(), z.boolean()]))
        .optional()
        .describe("Event-specific properties"),
      mailingLists: z
        .record(z.boolean())
        .optional()
        .describe("Mailing list subscriptions to update"),
      contactProperties: z
        .record(z.union([z.string(), z.number(), z.boolean()]))
        .optional()
        .describe("Contact properties to update when sending the event"),
    },
    async (params) => {
      const { contactProperties, ...rest } = params;
      const body = { ...rest, ...contactProperties };
      const result = await loopsRequest("/events/send", "POST", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // --- Transactional Emails ---

  server.tool(
    "list_transactional_emails",
    "List published transactional email templates",
    {
      perPage: z.number().min(10).max(50).optional().describe("Results per page (10-50, default 20)"),
      cursor: z.string().optional().describe("Pagination cursor from previous response"),
    },
    async (params) => {
      const query: Record<string, string> = {};
      if (params.perPage) query.perPage = String(params.perPage);
      if (params.cursor) query.cursor = params.cursor;
      const result = await loopsRequest("/transactional", "GET", undefined, query);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "send_transactional_email",
    "Send a transactional email via Loops",
    {
      email: z.string().email().describe("Recipient email address"),
      transactionalId: z.string().describe("ID of the transactional email template"),
      addToAudience: z
        .boolean()
        .optional()
        .describe("Add recipient as a contact if not already (default false)"),
      dataVariables: z
        .record(z.string())
        .optional()
        .describe("Template variables as key-value pairs"),
      attachments: z
        .array(
          z.object({
            filename: z.string().describe("File name"),
            contentType: z.string().describe("MIME type"),
            data: z.string().describe("Base64-encoded file content"),
          })
        )
        .optional()
        .describe("File attachments"),
    },
    async (params) => {
      const result = await loopsRequest("/transactional/send", "POST", params as Record<string, unknown>);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  return server;
}
