
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

    // Default
    return new Response("Cloudflare VizThinker Backend Online");
  },
};
