export const HTML_CONTENT = `<!DOCTYPE html>
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
          Hello! I am your AI assistant running on Cloudflare Workers. Ask me anything!
        </div>
      </div>

      <div id="input-area">
        <textarea id="user-input" placeholder="Type your message..."></textarea>
        <button id="send-btn">Send</button>
      </div>
      <div id="status">Ready</div>
    </main>

    <script src="/app.js"></script>
  </body>
</html>`;
