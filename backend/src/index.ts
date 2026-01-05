

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
        prompt: `You are a data visualization assistant. user input: ${body.prompt}. return only json configuration for a web charting library.`,
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

