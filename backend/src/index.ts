
import { SessionDO } from "./durable_object";

export { SessionDO };

export interface Env {
  AI: any;
  DB: D1Database;
  SESSION_DO: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle Preflight Options
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Helper to wrap response with CORS
    const respond = (response: Response) => {
      const newHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(corsHeaders)) {
        newHeaders.set(key, value);
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    };

    let response: Response;

    // AI Endpoint
    if (url.pathname === "/api/visualize" && request.method === "POST") {
      const body = await request.json() as { prompt: string };
      const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        prompt: `You are a data visualization assistant. user input: ${body.prompt}. return only json configuration for a web charting library.`,
      });
      response = Response.json(aiResponse);
    }
    
    // Session State (Durable Object)
    else if (url.pathname.startsWith("/api/session/")) {
        const sessionId = url.pathname.split("/")[3] || "default";
        const id = env.SESSION_DO.idFromName(sessionId);
        const stub = env.SESSION_DO.get(id);
        response = await stub.fetch(request);
    }

    // Default
    else {
        response = new Response("Cloudflare VizThinker Backend Online");
    }

    return respond(response);
  },
};
