# Repository Guidelines

## Documentation Expectations
- Keep the README up to date with the overall product vision, setup steps, and architectural notes.
- Document the JSON contract for LLM responses and the conversation persistence format as they are implemented.

## Code Style
- Favor clear, self-documenting names for bots, participants, and conversation state.
- When adding TypeScript or JavaScript, prefer modern ES modules and lint-friendly patterns.
- Avoid wrapping import statements in try/catch blocks.

## Front-End Notes
- The UI will include a conversation pane and a graph visualization. Keep components modular to support future real-time updates.
- Any UI change MUST be accompanied by a current screenshot (captured via the provided tooling) that reflects the new state of the interface. Take the time to stage the app so the screenshot highlights the change clearly.

## Backend Notes
- Centralize OpenRouter API interactions in dedicated service modules to simplify mocking and future rate-limit handling.
- Validate and sanitize JSON payloads returned by models before persisting or rendering them.
- Persist data strictly as files under the `server/` directory. Do not rely on localStorage, in-memory caches, or other storage backends so that all conversations and configuration can be inspected directly via the filesystem.
- Do not add mocked network integrations or placeholder responses in production code paths—surface explicit errors when upstream services are unavailable instead.

## Testing & Tooling
- Add automated tests alongside new features where feasible (unit, integration, or end-to-end).
- Ensure new commands or scripts are described in documentation and reproducible via package scripts or Make targets.
