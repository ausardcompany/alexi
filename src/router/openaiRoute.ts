import { Router } from 'express';
import { openAIHandler } from '../handlers/openai';

const router = Router();

router.post('/openai', openAIHandler);

export default router;