import { join } from 'node:path';
import fs from 'fs-extra';
import { nanoid } from 'nanoid';

const { readJson, writeJson, ensureDir, readdir } = fs;
const DATA_DIR = join(process.cwd(), 'data', 'conversations');

async function list() {
  await ensureDir(DATA_DIR);
  const files = await readdir(DATA_DIR);
  const conversations = await Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .map(async (file) => readJson(join(DATA_DIR, file)))
  );
  return conversations.sort((a, b) => {
    const timeA = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
    const timeB = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
    return timeB - timeA;
  });
}

async function save(conversation) {
  const id = conversation.id ?? nanoid();
  const now = new Date().toISOString();
  const enriched = {
    ...conversation,
    id,
    updatedAt: now,
    createdAt: conversation.createdAt ?? now
  };
  await ensureDir(DATA_DIR);
  await writeJson(join(DATA_DIR, `${id}.json`), enriched, { spaces: 2 });
  return enriched;
}

export const conversationStore = {
  list,
  save
};
