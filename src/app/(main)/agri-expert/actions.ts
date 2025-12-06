"use server";

import { answerExpertQuestions, type AnswerExpertQuestionsInput } from "@/ai/flows/answer-expert-questions";
import { z } from "zod";

const ExpertActionSchema = z.object({
  query: z.string().min(1, "Query is required."),
});

export async function getExpertResponse(
  input: AnswerExpertQuestionsInput
): Promise<{answer: string} | {error: string}> {
  const validatedFields = ExpertActionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
    };
  }

  try {
    const result = await answerExpertQuestions(validatedFields.data);
    return { answer: result.answer };
  } catch (e: any) {
    return {
      error: e.message || "An unexpected error occurred.",
    };
  }
}
