#!/bin/bash
# backend/test_runner.sh

echo ">>> Starting Cloudflare Worker (Wrangler Dev)..."
# Start wrangler in background
# nohup prevents it from dying if shell closes, though not strictly needed here
# We redirect output to a file to keep the terminal clean and for debugging
npx wrangler dev --port 8787 > server.log 2>&1 &
WRANGLER_PID=$!

echo ">>> Waiting 8 seconds for startup..."
sleep 8

echo ">>> TEST 1: Root Endpoint (Hello World)"
RESPONSE_ROOT=$(curl -s http://localhost:8787/)
echo "Response: $RESPONSE_ROOT"

if [[ "$RESPONSE_ROOT" == *"Cloudflare VizThinker"* ]]; then
    echo "✅ Root Endpoint Passed"
else
    echo "❌ Root Endpoint Failed"
fi

echo "------------------------------------------------"

echo ">>> TEST 2: AI Visualization Endpoint (Llama 3)"
# Using a simple prompt
RESPONSE_AI=$(curl -s -X POST -H "Content-Type: application/json" -d '{"prompt": "Show me sales data for 2024"}' http://localhost:8787/api/visualize)

# Check if response contains JSON structure (simple check)
if [[ "$RESPONSE_AI" == *"{"* ]]; then
    echo "✅ AI Endpoint returned JSON response"
    echo "Sample (First 100 chars): ${RESPONSE_AI:0:100}..."
else
    echo "❌ AI Endpoint Failed"
    echo "Raw Response: $RESPONSE_AI"
fi

echo "------------------------------------------------"
echo ">>> Server Log (Last 5 lines):"
tail -n 5 server.log

echo ">>> Cleaning up..."
kill $WRANGLER_PID
echo ">>> Done."
