export const JS_CONTENT = `
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
