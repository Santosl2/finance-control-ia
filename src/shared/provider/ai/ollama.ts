import { createOllama } from 'ollama-ai-provider';
import { env } from '../../config/env';

export const ollamaProvider = createOllama({
	baseURL: env.OLLAMA_API_URL,
});
