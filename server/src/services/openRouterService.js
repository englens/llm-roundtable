import { nanoid } from 'nanoid';
import { openRouterConfigStore } from '../storage/openRouterConfigStore.js';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_REFERRER = 'http://localhost';
const DEFAULT_TITLE = 'LLM Roundtable';

async function loadConfiguration() {
  const config = await openRouterConfigStore.read();
  if (!config.apiKey) {
    throw new Error('OpenRouter API key is not configured. Please add it via the settings panel.');
  }
  return config;
}

function extractJsonPayload(content) {
  if (typeof content !== 'string') {
    throw new Error('OpenRouter response did not include textual content.');
  }

  const fencedMatch = content.match(/```json\s*([\s\S]*?)```/i);
  const jsonString = fencedMatch ? fencedMatch[1] : content;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Unable to parse OpenRouter response as JSON.');
  }
}

function normaliseMessages(rawMessages = []) {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    throw new Error('OpenRouter response did not include any messages.');
  }

  const now = new Date();
  return rawMessages.map((message, index) => {
    const author = message?.author;
    const content = message?.content;
    if (!author || !content) {
      throw new Error('Each message must include author and content fields.');
    }

    const timestamp = message?.timestamp && typeof message.timestamp === 'string'
      ? message.timestamp
      : new Date(now.getTime() + index * 1000).toISOString();

    return {
      id: nanoid(),
      author,
      content,
      timestamp
    };
  });
}

async function createRoundtable({ topic, prompt }) {
  const config = await loadConfiguration();

  const systemPrompt = `You orchestrate expert multi-agent discussions for humans. Produce a JSON object with the keys "summary" (string) and "messages" (array). Each message must be an object with "author", "content", and optional "timestamp" fields. Respond with ONLY JSON. No markdown, no commentary.`;

  const userPrompt = `Topic: ${topic}\n\nPrompt: ${prompt}\n\nDesign a concise roundtable conversation between a Moderator, a Researcher, and a Strategist that addresses the prompt and highlights unique perspectives.`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': DEFAULT_REFERRER,
      'X-Title': DEFAULT_TITLE
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  const structured = extractJsonPayload(content);

  if (typeof structured?.summary !== 'string') {
    throw new Error('OpenRouter response missing required "summary" field.');
  }

  const messages = normaliseMessages(structured.messages);
  const now = new Date().toISOString();

  return {
    id: nanoid(),
    topic,
    summary: structured.summary,
    createdAt: now,
    updatedAt: now,
    messages
  };
}

export const openRouterService = {
  createRoundtable
};
