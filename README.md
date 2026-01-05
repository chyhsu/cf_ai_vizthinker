# Cloudflare VizThinker

A serverless implementation of VizThinker, built for the Cloudflare AI Internship assignment.

## Architecture
This project uses a split architecture to demonstrate proficiency with the Cloudflare ecosystem:

-   **Backend**: Cloudflare Workers
    -   **AI**: Workers AI (Llama 3.3 / `@cf/meta/llama-3-8b-instruct`)
    -   **Database**: Cloudflare D1 (`vizthinker-db`)
    -   **State**: Durable Objects (Session management)
-   **Frontend**: Cloudflare Pages (Static HTML/JS)

## Project Structure
```text
cf_ai_vizthinker/
├── backend/        # Cloudflare Worker (API & Logic)
├── frontend/       # Cloudflare Pages (UI)
└── legacy_gcp/     # Archived Docker/GCP implementation
```

## How to Run & Deploy

### 1. Backend (Workers)
The backend handles AI inference and state.

```bash
cd backend
npm install
npm run deploy
```
*Note the URL output (e.g., `https://cf-ai-vizthinker-backend.<your-subdomain>.workers.dev`).*

### 2. Frontend (Pages)
The frontend connects to the backend.

1.  Open `frontend/public/app.js`.
2.  Update `const WORKER_URL` with your deployed Backend URL.
3.  Deploy:
    ```bash
    cd frontend
    npx wrangler pages deploy public
    ```

## Development
To run locally:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend (Preview)
cd frontend
npx wrangler pages dev public
```
