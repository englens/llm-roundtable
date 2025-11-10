# LLM Roundtable

LLM Roundtable is a local-first web application for orchestrating structured, multi-agent conversations across large language models (LLMs) exposed through the [OpenRouter](https://openrouter.ai/) API. The application coordinates a cast of specialized bots, tracks their discussion, and surfaces an interaction graph so humans can audit or intervene in the flow of ideas.

> **Status:** This repository now ships a first-pass experience with a React front end (Vite + Tailwind CSS) and an Express-based backend. The backend talks directly to OpenRouter for live roundtable generation.

## Architecture Overview

| Layer      | Stack / Location         | Responsibilities |
|------------|--------------------------|------------------|
| Front end  | React 18, Vite, Tailwind (`frontend/`) | Render the conversation transcript, interaction graph, and roundtable list. Communicates with the backend through a REST API and keeps data fresh with React Query. |
| Backend    | Node.js, Express (`server/`) | Exposes JSON endpoints for listing and creating conversations, coordinates (future) OpenRouter requests via a dedicated service, and persists conversations as JSON files. |
| Persistence | File-based (`server/data/conversations/`) | Each conversation is stored as a standalone JSON document so histories can be inspected or versioned directly from disk. |

### API Surface

The backend mounts all endpoints under `/api`.

- `GET /api/conversations` — Returns `{ conversations: ConversationSummary[] }` from the file store.
- `POST /api/conversations` — Accepts `{ topic: string, prompt: string }`, requests a fresh roundtable from OpenRouter via `openRouterService`, persists it to disk, and responds with the saved conversation payload.
- `GET /api/health` — Lightweight health check returning `{ status: "ok" }`.

The OpenRouter service lives in `server/src/services/openRouterService.js`. All remote model interactions (and future authentication, validation, retry logic) should flow through this module to simplify testing and mocking.

### Data Model

Conversations are stored on disk using the following JSON contract:

```json
{
  "id": "string",
  "topic": "string",
  "summary": "string",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp",
  "messages": [
    {
      "id": "string",
      "author": "string",
      "content": "string",
      "timestamp": "ISO-8601 timestamp"
    }
  ]
}
```

Additional metadata (e.g., bot roster, control modes) can be added later without breaking the current UI as long as the required fields above remain present.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install Dependencies

```bash
cd frontend && npm install
cd ../server && npm install
```

### Run the Development Servers

In one terminal, start the API:

```bash
npm --prefix server run dev
```

> **Environment variables:** The API requires `OPENROUTER_API_KEY` to be present in the environment before new conversations can be created. Optional overrides include `OPENROUTER_MODEL`, `OPENROUTER_API_URL`, `OPENROUTER_REFERRER`, and `OPENROUTER_TITLE`. You can export these in your shell or create a `.env` file that your process manager loads.

In a second terminal, start the front end:

```bash
npm --prefix frontend run dev
```

The React app will be available at [http://localhost:5173](http://localhost:5173) and proxies API calls to `http://localhost:4000`.

## Front-End Walkthrough

The React application renders three primary regions:

1. **Conversation List** — Displays the available roundtables and highlights the active one.
2. **Conversation Pane** — Shows the transcript for the selected conversation, including participant names and timestamps.
3. **Interaction Graph Preview** — Presents a scaffold for visualizing agent relationships (currently rendered as summary cards).

React Query handles data fetching and caching, while Axios wraps REST calls in `frontend/src/services/apiClient.ts`.

## Backend Walkthrough

- `server/src/index.js` wires up Express, CORS, JSON parsing, and logging.
- `server/src/routes/conversations.js` exposes REST handlers for listing and creating conversations.
- `server/src/storage/conversationStore.js` persists conversations to `server/data/conversations/` using deterministic filenames and ISO timestamps.
- `server/src/services/openRouterService.js` is the single integration point for OpenRouter. It orchestrates real API calls, validates responses, and normalises the conversation payload before persistence.

## Testing & Future Work

- Add automated tests around the conversation store and API routes.
- Implement full OpenRouter connectivity with schema validation for JSON outputs.
- Extend the interaction graph with a dynamic visualization library (e.g., D3, VisX).
- Introduce user controls for adding agents, stepping through conversations, and exporting histories.

## Screenshots

UI changes require updated screenshots; see the `docs/` directory (to be added in subsequent updates) for the most recent captures.

## Contributing

Contributions are welcome! Please follow the conventions outlined in `AGENTS.md`, add tests where possible, and keep documentation current with any workflow changes.
