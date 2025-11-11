import { join } from 'node:path';
import fs from 'fs-extra';

const { ensureDir, pathExists, readJson, writeJson } = fs;

const DATA_DIR = join(process.cwd(), 'data');
const CONFIG_PATH = join(DATA_DIR, 'openrouter.json');

const DEFAULT_CONFIG = {
  model: 'openrouter/llama-3.1-70b-instruct',
  apiKey: ''
};

function normaliseString(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }
  return value.trim();
}

async function ensureConfigFile() {
  await ensureDir(DATA_DIR);
  const exists = await pathExists(CONFIG_PATH);
  if (!exists) {
    await writeJson(CONFIG_PATH, DEFAULT_CONFIG, { spaces: 2 });
  }
}

async function read() {
  await ensureConfigFile();
  const stored = await readJson(CONFIG_PATH);
  return {
    ...DEFAULT_CONFIG,
    ...stored,
    model: normaliseString(stored?.model, DEFAULT_CONFIG.model),
    apiKey: normaliseString(stored?.apiKey, '')
  };
}

async function update(partial = {}) {
  const current = await read();
  const next = {
    ...current,
    ...partial
  };

  if (partial.model !== undefined) {
    next.model = normaliseString(partial.model, DEFAULT_CONFIG.model);
  }
  if (partial.apiKey !== undefined) {
    next.apiKey = normaliseString(partial.apiKey, '');
  }

  await ensureConfigFile();
  await writeJson(CONFIG_PATH, next, { spaces: 2 });

  return next;
}

function toClientPayload(config) {
  return {
    model: config.model,
    hasApiKey: Boolean(config.apiKey)
  };
}

export const openRouterConfigStore = {
  read,
  update,
  toClientPayload
};
