'use server';

/**
 * @fileOverview This flow answers farmer questions using the Gemini API.
 *
 * - answerFarmerQuestions - A function that answers questions related to farming.
 * - AnswerFarmerQuestionsInput - The input type for the answerFarmerQuestions function.
 * - AnswerFarmerQuestionsOutput - The return type for the answerFarmerQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFarmerQuestionsInputSchema = z.object({
  query: z.string().describe('The question from the farmer.'),
  language: z
    .enum(['en', 'te', 'hi'])
    .describe('The language of the query (en=English, te=Telugu, hi=Hindi).')
    .default('en'),
});

export type AnswerFarmerQuestionsInput = z.infer<
  typeof AnswerFarmerQuestionsInputSchema
>;

const AnswerFarmerQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the farmer question.'),
});

export type AnswerFarmerQuestionsOutput = z.infer<
  typeof AnswerFarmerQuestionsOutputSchema
>;

export async function answerFarmerQuestions(
  input: AnswerFarmerQuestionsInput
): Promise<AnswerFarmerQuestionsOutput> {
  return answerFarmerQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFarmerQuestionsPrompt',
  input: {
    schema: AnswerFarmerQuestionsInputSchema,
  },
  output: {
    schema: AnswerFarmerQuestionsOutputSchema,
  },
  prompt: `You are a helpful AI assistant for farmers. You will answer
questions about farming practices, crop care, and market information.
Provide clear, natural language responses with actionable steps.
Respond in the language specified by the user.

Question: {{{query}}}
Language: {{{language}}}`,
});

const answerFarmerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerFarmerQuestionsFlow',
    inputSchema: AnswerFarmerQuestionsInputSchema,
    outputSchema: AnswerFarmerQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
