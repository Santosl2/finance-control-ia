import type { Request, Response } from 'express';
import { Assistant } from '../useCase/Assistant';

export class AssistantController {
	async handleAssistantRequest(req: Request, res: Response): Promise<Response> {
		try {
			const userId = req.body.userId || 'abc';
			const userPrompt = req.body.prompt;

			if (!userPrompt) {
				return res.status(400).json({ error: 'Prompt is required' });
			}

			const result = await Assistant({ userPrompt, userId });

			return res.json({ response: result.text });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: 'Failed to process request' });
		}
	}
}
