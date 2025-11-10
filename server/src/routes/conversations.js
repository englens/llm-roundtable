import { Router } from 'express';
import { conversationStore } from '../storage/conversationStore.js';
import { openRouterService } from '../services/openRouterService.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const conversations = await conversationStore.list();
    res.json({ conversations });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { topic, prompt } = req.body ?? {};
    if (!topic || !prompt) {
      return res.status(400).json({ message: 'Topic and prompt are required' });
    }

    const draftConversation = await openRouterService.createRoundtable({ topic, prompt });
    const persisted = await conversationStore.save(draftConversation);
    res.status(201).json(persisted);
  } catch (error) {
    next(error);
  }
});

export default router;
