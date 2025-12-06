"use server";

import { answerFarmerQuestions, type AnswerFarmerQuestionsInput } from "@/ai/flows/answer-farmer-questions";
import { z } from "zod";

const AssistantActionSchema = z.object({
  query: z.string().min(1, "Query is required."),
  language: z.enum(['en', 'te', 'hi']).default('en'),
});

export async function getAssistantResponse(
  input: AnswerFarmerQuestionsInput
): Promise<{answer: string} | {error: string}> {
  const validatedFields = AssistantActionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
    };
  }

  try {
    const result = await answerFarmerQuestions(validatedFields.data);
    return { answer: result.answer };
  } catch (e: any) {
    return {
      error: e.message || "An unexpected error occurred.",
    };
  }
}
