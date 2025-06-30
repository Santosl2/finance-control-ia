import { Router } from 'express';
import { AssistantController } from '../controllers/AssitantController';

const aiRoutes = Router();

aiRoutes.post(
	'/ai-assistant',
	new AssistantController().handleAssistantRequest,
);

export { aiRoutes };
