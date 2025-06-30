import { openaiProvider } from "@shared/provider/ai/openai";
import {
  getExpenses,
  getTotalOnWallet,
  saveExpense,
} from "@shared/provider/ai/tools";
import { getMoreInfo } from "@shared/provider/ai/tools/get-more-info";
import { generateText } from "ai";
import { BASE_PROMPT } from "../shared/constants/base-prompt";

interface AssistantProps {
  userPrompt: string;
  userId: string;
}

export async function Assistant({ userPrompt, userId }: AssistantProps) {
  const result = await generateText({
    system: BASE_PROMPT,
    prompt: userPrompt,
    // model: ollamaProvider("llama3.1:8b"),
    //maxSteps: 32,
    model: openaiProvider,
    maxSteps: 5,
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
