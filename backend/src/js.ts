export const JS_CONTENT = `
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
