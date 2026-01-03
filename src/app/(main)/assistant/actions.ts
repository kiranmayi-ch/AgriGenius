"use server";

import { answerFarmerQuestions, type AnswerFarmerQuestionsInput, type AnswerFarmerQuestionsOutput } from "@/ai/flows/answer-farmer-questions";
import { textToSpeech, type TextToSpeechInput } from "@/ai/flows/text-to-speech";
import { z } from "zod";

const AssistantActionSchema = z.object({
  query: z.string().min(1, "Query is required."),
  language: z.enum(['en', 'te', 'hi']).default('en'),
});

export async function getAssistantResponse(
  input: AnswerFarmerQuestionsInput
): Promise<AnswerFarmerQuestionsOutput | {error: string}> {
  const validatedFields = AssistantActionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
    };
  }

  try {
    const result = await answerFarmerQuestions(validatedFields.data);
    return result;
  } catch (e: any) {
    return {
      error: e.message || "An unexpected error occurred.",
    };
  }
}

const TextToSpeechActionSchema = z.object({
  text: z.string().min(1, "Text is required."),
  language: z.enum(['en', 'te', 'hi']).default('en'),
});


export async function getSpeechFromText(
  input: TextToSpeechInput
): Promise<{audioDataUri: string} | {error: string}> {
    const validatedFields = TextToSpeechActionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
    };
  }

  try {
    const result = await textToSpeech(validatedFields.data);
    return { audioDataUri: result.audioDataUri };
  } catch (e: any) {
    return {
      error: e.message || "An unexpected error occurred while generating audio.",
    };
  }
}
