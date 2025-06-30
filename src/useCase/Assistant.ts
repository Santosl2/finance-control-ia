import { openaiProvider } from "@shared/provider/ai/openai";
import {
  getExpenses,
  getTotalOnWallet,
  saveExpense,
} from "@shared/provider/ai/tools";
import { getMoreInfo } from "@shared/provider/ai/tools/get-more-info";
import { generateText } from "ai";
import { BASE_PROMPT } from "../shared/constants/base-prompt";
import { env } from "@config/env";
import { logger } from "@shared/logs/logger";

interface AssistantProps {
  userPrompt: string;
  userId: string;
}

const PROVIDERS = {
  ollama: async () => {
    return {
      maxSteps: 32,
      model: await import("@shared/provider/ai/ollama").then((module) =>
        module.ollamaProvider("llama3.1:8b")
      ),
    };
  },
  openai: async () => {
    return {
      maxSteps: 5,
      model: await import("@shared/provider/ai/openai").then(
        (module) => module.openaiProvider
      ),
    };
  },
};

export async function Assistant({ userPrompt, userId }: AssistantProps) {
  const provider = env.USE_OLLAMA ? "ollama" : "openai";
  logger.info(`Using AI provider: ${provider}`);
  const { model, maxSteps } = await PROVIDERS[provider]();
  const result = await generateText({
    system: BASE_PROMPT,
    prompt: userPrompt,
    // model: ollamaProvider("llama3.1:8b"),
    //maxSteps: 32,
    model,
    maxSteps,
    tools: {
      saveExpense: saveExpense(userId),
      getExpensesAndIncome: getExpenses(),
      getTotalOnWallet: getTotalOnWallet(),
      getMoreInfo: getMoreInfo(),
    },
  });

  console.log({ usage: result.usage });
  return result;
}
