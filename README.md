# LLM Roundtable

LLM Roundtable is a local-first web application for orchestrating structured, multi-agent conversations across large language models (LLMs) exposed through the [OpenRouter](https://openrouter.ai/) API. The app lets you define a cast of bots—each with its own persona and system prompt—then observe or intervene as they exchange messages, request responses from one another, and optionally involve a moderator model that curates the flow of discussion.

## Core Concepts

### Bots
- **Identity**: Each bot has a human-friendly name.
- **Model**: Each bot is powered by an OpenRouter model, referenced by its model ID string.
- **System prompt**: A persona and role description that frames the bot's behavior when generating responses.
- **Output contract**: Bots respond in JSON, specifying message content, intended recipients, optional private asides, and suggestions for the next speaker.

### Conversation Flow Modes
1. **Step Mode** (default): After a bot speaks, the user manually advances the conversation to the next participant based on the bot's suggested recipient list.
2. **Auto Mode**: The application automatically advances the conversation following the suggested recipients without requiring user confirmation between turns.
3. **Moderator Mode**: A dedicated moderator bot (also configured with a model ID and system prompt) inspects each bot's JSON output and authoritatively selects the next participant. Suggestions in bot outputs become advisory; the moderator's decision controls the turn order.

### Interaction Surface
- **Top Bar**
  - Save and load conversations (including bot definitions and full history) to enable perfect replay.
  - Access bot setup, persona editing, and management tools.
- **Main Content**
  - **Conversation Column**: A group-chat style transcript showing messages, recipients, and metadata.
  - **Interaction Graph**: A dynamic visualization of active participants (including the user) with directional edges indicating who addressed whom during the conversation.
- **Bottom Bar**
  - User input box and send button for joining the dialogue.
  - Controls for revealing system prompts, previewing the exact payloads sent to OpenRouter, choosing conversation mode, and triggering manual "Step" advances.

## Data Model & Persistence
- Conversations encapsulate:
  - Bot roster (names, model IDs, system prompts, order of play).
  - Message history, including JSON metadata and timestamps.
  - Configuration for control mode (step, auto, moderator) and moderator settings if applicable.
- Saved conversation files should be sufficient to fully reconstruct the state of the UI and resume or replay any session.
- All persisted artifacts live under the `server/` directory as human-readable files so settings and history can be audited outside the app.

## Planned Functionality
- Local web UI built with modern front-end tooling (framework TBD).
- Backend service for coordinating API calls to OpenRouter and normalizing JSON responses.
- Visualization layer for rendering the conversation graph in real time.
- Error handling for malformed JSON outputs and recovery prompts to keep the roundtable on track.
- Hooks for user intervention, allowing the human to step in, send manual messages, or override turn order.

## Getting Started
Implementation work has not yet begun. Early tasks include:
1. Select the front-end stack (e.g., React, Svelte, Vue) and initialize the project scaffold.
2. Define the backend architecture for OpenRouter interactions and conversation state management.
3. Formalize the JSON response schema and validation strategy for bot outputs.
4. Design the save/load file format for conversations.

Refer to `AGENTS.md` for repository-specific contribution guidelines (coding conventions, tooling expectations, and screenshot requirements for UI changes).

As the codebase evolves, this README should expand to cover installation steps, development workflows, API documentation, and testing guidance.

## Contributing
Contributions are welcome once the project skeleton is in place. Please include clear documentation, adhere to repository coding standards, and add tests where applicable.

## License
License information has not been specified yet. Add a license file before distributing or accepting external contributions.
