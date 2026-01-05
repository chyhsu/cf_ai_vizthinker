

import { SessionDO } from "./durable_object";
import { HTML_CONTENT } from "./html";
import { JS_CONTENT } from "./js";

export { SessionDO };

export interface Env {
  AI: any;
  DB: D1Database;
  SESSION_DO: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Serve HTML (Frontend)
    if (url.pathname === "/") {
      return new Response(HTML_CONTENT, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Serve JS (Frontend)
    if (url.pathname === "/app.js") {
      return new Response(JS_CONTENT, {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    // AI Endpoint
    if (url.pathname === "/api/visualize" && request.method === "POST") {
      const body = await request.json() as { prompt: string };
      const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        prompt: `You are the lead ambassador for VizThinker AI (https://viz-thinker.com).
        
        MISSION:
        Introduce users to VizThinker, a node-based AI chat interface that transforms conversations into dynamic thinking maps.
        
        CORE PHILOSOPHY:
        "Map ideas like a web, not a straight line." Traditional linear chat (like ChatGPT) restricts thought. VizThinker allows branching, tangents, and connecting ideas on an infinite canvas.

        KEY FEATURES TO HIGHLIGHT:
        1. Node-Based Conversations: Every response is a node. Branch off anywhere without losing context.
        2. Visual Branching: Solid lines for deep dives, dotted lines for tangents.
        3. Multi-Provider: Supports Gemini, GPT, Claude, Grok, and local Ollama.
        4. Exports: HTML (interactive web page), PNG (image), and Markdown (summary).
        5. Privacy: Persistent sessions, secure auth.

        TONE:
        Enthusiastic, insightful, and focused on "Visual Thinking." If the user asks about features, explain them using the graph analogy.
        
        User input: ${body.prompt}`,
      });
      return Response.json(response);
    }

    // Session State (Durable Object)
    if (url.pathname.startsWith("/api/session/")) {
        const sessionId = url.pathname.split("/")[3] || "default";
        const id = env.SESSION_DO.idFromName(sessionId);
        const stub = env.SESSION_DO.get(id);
        return stub.fetch(request);
    }

    // Default 404
    return new Response("Not Found", { status: 404 });
  },
};

