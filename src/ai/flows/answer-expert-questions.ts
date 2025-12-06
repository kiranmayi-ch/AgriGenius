'use server';

/**
 * @fileOverview This flow answers farmer questions with expert-level detail.
 *
 * - answerExpertQuestions - A function that answers questions as an agriculture expert.
 * - AnswerExpertQuestionsInput - The input type for the answerExpertQuestions function.
 * - AnswerExpertQuestionsOutput - The return type for the answerExpertQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerExpertQuestionsInputSchema = z.object({
  query: z.string().describe('The detailed question from the farmer.'),
});

export type AnswerExpertQuestionsInput = z.infer<
  typeof AnswerExpertQuestionsInputSchema
>;

const AnswerExpertQuestionsOutputSchema = z.object({
  answer: z.string().describe('The expert-level answer to the farmer question.'),
});

export type AnswerExpertQuestionsOutput = z.infer<
  typeof AnswerExpertQuestionsOutputSchema
>;

export async function answerExpertQuestions(
  input: AnswerExpertQuestionsInput
): Promise<AnswerExpertQuestionsOutput> {
  return answerExpertQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerExpertQuestionsPrompt',
  input: {
    schema: AnswerExpertQuestionsInputSchema,
  },
  output: {
    schema: AnswerExpertQuestionsOutputSchema,
  },
  prompt: `You are a world-renowned agriculture expert with 30 years of experience in agronomy and soil science.
A user is asking for your advice. Provide a detailed, comprehensive, and authoritative answer.
Assume the user is looking for in-depth information, including scientific reasoning and actionable steps.
Break down complex topics into easy-to-understand sections.

Question: {{{query}}}
`,
});

const answerExpertQuestionsFlow = ai.defineFlow(
  {
    name: 'answerExpertQuestionsFlow',
    inputSchema: AnswerExpertQuestionsInputSchema,
    outputSchema: AnswerExpertQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
