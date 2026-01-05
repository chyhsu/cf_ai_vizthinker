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
        --primary: #f6821f; /* Cloudflare Orange */
        --bg: #1a1a1a;
        --card: #2d2d2d;
        --text: #ffffff;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      header h1 {
        margin: 0;
        font-size: 1.5rem;
      }
      header img {
        height: 40px;
        margin-right: 10px;
      }

      main {
        flex: 1;
        display: flex;
        overflow: hidden;
      }

      #chat-panel {
        width: 350px;
        background-color: var(--card);
        border-right: 1px solid #444;
        display: flex;
        flex-direction: column;
        padding: 1rem;
      }

      #canvas-panel {
        flex: 1;
        position: relative;
        background-image: radial-gradient(#444 1px, transparent 1px);
        background-size: 20px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      input,
      textarea,
      button {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #444;
        background: #1a1a1a;
        color: white;
      }

      button {
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        font-weight: bold;
      }

      button:hover {
        opacity: 0.9;
      }

      .message {
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 4px;
        background: #444;
        font-size: 0.9rem;
      }

      .message.ai {
        background: #004d7a;
      } /* Blueish for AI */

      #messages {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 1rem;
      }

      #chart-container {
        width: 80%;
        height: 600px;
        background: white;
        border-radius: 8px;
        padding: 20px;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #status {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: #333;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        opacity: 0.7;
      }
    </style>
  </head>
  <body>
    <header>
      <div style="display: flex; align-items: center">
        <!-- Logo placeholder -->
        <h1>VizThinker AI</h1>
      </div>
      <div id="session-info">Session: <span id="session-id">New</span></div>
    </header>

    <main>
      <aside id="chat-panel">
        <div id="messages">
          <div class="message ai">
            Hi! Describe your data or upload a CSV, and I'll visualize it for
            you.
          </div>
        </div>
        <textarea
          id="user-input"
          rows="3"
          placeholder="E.g., Show me a bar chart of sales for Q1-Q4: 100, 150, 200, 180"
        ></textarea>
        <button id="send-btn">Visualize</button>
      </aside>

      <section id="canvas-panel">
        <div id="chart-container">
          <p style="color: #666">Chart will appear here</p>
        </div>
        <div id="status">Ready</div>
      </section>
    </main>

    <!-- Chart.js for rendering -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
    <script src="/app.js"><\/script>
  </body>
</html>`;

// src/js.ts
var JS_CONTENT = `
// Configuration
// Since we are served from the SAME worker, we can just use relative paths!
const WORKER_URL = ""; 

const sendBtn = document.getElementById('send-btn');
const inputField = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');
const chartContainer = document.getElementById('chart-container');
const statusDiv = document.getElementById('status');
let currentChart = null;

function addMessage(text, isAi = false) {
    const div = document.createElement('div');
    div.className = \`message \${isAi ? 'ai' : ''}\`;
    div.textContent = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Extract JSON from response if it's wrapped in text
function parseJsonFromText(text) {
    try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        if (start !== -1 && end !== -1) {
            return JSON.parse(text.substring(start, end));
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON", e);
        return null;
    }
}

function renderChart(config) {
    const ctx = document.createElement('canvas');
    chartContainer.innerHTML = ''; // Clear previous
    chartContainer.appendChild(ctx);

    if (currentChart) {
        currentChart.destroy();
    }

    try {
        currentChart = new Chart(ctx, config);
    } catch (e) {
        chartContainer.innerHTML = \`<p style="color:red">Error rendering chart: \${e.message}</p>\`;
    }
}

async function handleVisualize() {
    const prompt = inputField.value.trim();
    if (!prompt) return;

    addMessage(prompt, false);
    inputField.value = '';
    statusDiv.textContent = "Thinking...";

    try {
        // Just call /api/visualize relative to root
        const response = await fetch(\`/api/visualize\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error("Worker Error");

        const data = await response.json();
        const aiText = data.response || JSON.stringify(data);
        
        statusDiv.textContent = "Processing...";
        
        const chartConfig = parseJsonFromText(aiText);
        
        if (chartConfig) {
            renderChart(chartConfig);
            addMessage("Chart generated! (See canvas)", true);
        } else {
            addMessage("I couldn't generate a valid chart configuration. " + aiText, true);
        }

    } catch (err) {
        console.error(err);
        addMessage("Error connecting to backend.", true);
    } finally {
        statusDiv.textContent = "Ready";
    }
}

sendBtn.addEventListener('click', handleVisualize);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleVisualize();
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
        prompt: `You are a data visualization assistant. user input: ${body.prompt}. return only json configuration for a web charting library.`
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
