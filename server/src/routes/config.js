import { Router } from 'express';
import { openRouterConfigStore } from '../storage/openRouterConfigStore.js';

const router = Router();

router.get('/openrouter', async (_req, res, next) => {
  try {
    const config = await openRouterConfigStore.read();
    res.json({ config: openRouterConfigStore.toClientPayload(config) });
  } catch (error) {
    next(error);
  }
});

router.put('/openrouter', async (req, res, next) => {
  try {
    const { model, apiKey, clearApiKey } = req.body ?? {};

    const payload = {};
    if (model !== undefined) payload.model = model;

    if (clearApiKey === true) {
      payload.apiKey = '';
    } else if (apiKey !== undefined) {
      payload.apiKey = apiKey;
    }

    const updated = await openRouterConfigStore.update(payload);
    res.json({ config: openRouterConfigStore.toClientPayload(updated) });
  } catch (error) {
    next(error);
  }
});

export default router;
