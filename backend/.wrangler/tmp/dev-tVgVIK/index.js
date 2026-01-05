var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-qfO98l/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-qfO98l/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/durable_object.ts
var SessionDO = class {
  state;
  constructor(state, env) {
    this.state = state;
  }
  async fetch(request) {
    const url = new URL(request.url);
    let value = await this.state.storage.get("data") || {};
    if (request.method === "POST") {
      const data = await request.json();
      value = { ...value, ...data };
      await this.state.storage.put("data", value);
    }
    return new Response(JSON.stringify(value), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
__name(SessionDO, "SessionDO");

// src/html.ts
var HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VizThinker AI</title>
    <style>
      :root {
        --primary: #f6821f;
        --bg: #1a1a1a;
        --card: #2d2d2d;
        --text: #ffffff;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background-color: var(--bg);
        color: var(--text);
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      header {
        background-color: var(--card);
        padding: 1rem 2rem;
        border-bottom: 1px solid #444;
        text-align: center;
      }

      header h1 { margin: 0; font-size: 1.5rem; }

      main {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
      }

      #messages {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 20px;
        padding: 10px;
        background: #252525;
        border-radius: 8px;
        border: 1px solid #444;
      }

      .message {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #333;
        line-height: 1.5;
        max-width: 85%;
      }

      .message.user {
        background: #444;
        align-self: flex-end;
        margin-left: auto;
      }

      .message.ai {
        background: #005a9c;
        align-self: flex-start;
        margin-right: auto;
      }

      #input-area {
        display: flex;
        gap: 10px;
      }

      textarea {
        flex: 1;
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #555;
        background: #2d2d2d;
        color: white;
        resize: none;
        height: 50px;
      }

      button {
        width: 100px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      }

      button:hover { opacity: 0.9; }
      
      #status {
        text-align: center;
        font-size: 0.8rem;
        color: #888;
        margin-top: 5px;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>VizThinker AI</h1>
    </header>

    <main>
      <div id="messages">
        <div class="message ai">
          <strong>Are You a VizThinker?</strong><br><br>
          If your brain loves to map ideas like a web\u2014seeing connections everywhere instead of a straight line\u2014you've found your home.<br><br>
          I am here to introduce <strong>VizThinker AI</strong>: The node-based interface that turns your chats into dynamic, interactive thinking maps. Ask me anything about how we break the linear mold!
        </div>
      </div>

      <div id="input-area">
        <textarea id="user-input" placeholder="Type your message..."></textarea>
        <button id="send-btn">Send</button>
      </div>
      <div id="status">Ready</div>
    </main>

    <script src="/app.js"><\/script>
  </body>
</html>`;

// src/js.ts
var JS_CONTENT = `
const sendBtn = document.getElementById('send-btn');
const inputField = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');
const statusDiv = document.getElementById('status');

function addMessage(text, isAi) {
    const div = document.createElement('div');
    div.className = \`message \${isAi ? 'ai' : 'user'}\`;
    div.textContent = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function handleSend() {
    const prompt = inputField.value.trim();
    if (!prompt) return;

    addMessage(prompt, false);
    inputField.value = '';
    statusDiv.textContent = "Thinking...";

    try {
        const response = await fetch(\`/api/visualize\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error("Worker Error");

        const data = await response.json();
        // Llama often returns the text in .response
        const reply = data.response || JSON.stringify(data);
        
        addMessage(reply, true);

    } catch (err) {
        console.error(err);
        addMessage("Error: Could not connect to AI.", true);
    } finally {
        statusDiv.textContent = "Ready";
    }
}

sendBtn.addEventListener('click', handleSend);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});
`;

// src/index.ts
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response(HTML_CONTENT, {
        headers: { "Content-Type": "text/html" }
      });
    }
    if (url.pathname === "/app.js") {
      return new Response(JS_CONTENT, {
        headers: { "Content-Type": "application/javascript" }
      });
    }
    if (url.pathname === "/api/visualize" && request.method === "POST") {
      const body = await request.json();
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
        
        User input: ${body.prompt}`
      });
      return Response.json(response);
    }
    if (url.pathname.startsWith("/api/session/")) {
      const sessionId = url.pathname.split("/")[3] || "default";
      const id = env.SESSION_DO.idFromName(sessionId);
      const stub = env.SESSION_DO.get(id);
      return stub.fetch(request);
    }
    return new Response("Not Found", { status: 404 });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-qfO98l/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-qfO98l/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  SessionDO,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
