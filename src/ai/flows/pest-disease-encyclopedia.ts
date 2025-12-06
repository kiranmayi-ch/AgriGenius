'use server';
/**
 * @fileOverview Fetches and generates encyclopedia information for a given pest or disease.
 *
 * - getPestDiseaseInfo - A function that handles fetching details.
 * - PestDiseaseEncyclopediaInput - The input type for the getPestDiseaseInfo function.
 * - PestDiseaseEncyclopediaOutput - The return type for the getPestDiseaseInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PestDiseaseEncyclopediaInputSchema = z.object({
  query: z.string().describe('The name of the pest or disease to look up.'),
});
export type PestDiseaseEncyclopediaInput = z.infer<
  typeof PestDiseaseEncyclopediaInputSchema
>;

const PestDiseaseEncyclopediaOutputSchema = z.object({
  name: z.string().describe('The common name of the pest or disease.'),
  description: z
    .string()
    .describe('A short description of the pest or disease.'),
  symptoms: z
    .string()
    .describe(
      'A short, bulleted list of common symptoms caused by the pest or disease.'
    ),
  treatment: z
    .string()
    .describe(
      'A short, bulleted list of recommended treatment and prevention methods.'
    ),
});
export type PestDiseaseEncyclopediaOutput = z.infer<
  typeof PestDiseaseEncyclopediaOutputSchema
>;

export async function getPestDiseaseInfo(
  input: PestDiseaseEncyclopediaInput
): Promise<PestDiseaseEncyclopediaOutput> {
  const getPestDiseaseInfoFlow = ai.defineFlow(
    {
      name: 'getPestDiseaseInfoFlow',
      inputSchema: PestDiseaseEncyclopediaInputSchema,
      outputSchema: PestDiseaseEncyclopediaOutputSchema,
    },
    async input => {
      // Define the prompt for fetching textual information
      const infoPrompt = ai.definePrompt({
        name: 'pestDiseaseInfoPrompt',
        input: {schema: PestDiseaseEncyclopediaInputSchema},
        output: {
          schema: PestDiseaseEncyclopediaOutputSchema,
        },
        prompt: `You are an expert agricultural entomologist and plant pathologist.
Provide a short, concise encyclopedia entry for the following pest or disease: {{{query}}}.

Your response should include:
- A short description.
- A short, bulleted list of common symptoms.
- A short, bulleted list of recommended treatment and prevention methods.

Format the response as a JSON object.`,
      });

      // Generate the text information
      const infoResponse = await infoPrompt(input);

      const output = infoResponse.output;
      if (!output) {
        throw new Error('Failed to generate encyclopedia information.');
      }

      return output;
    }
  );

  return getPestDiseaseInfoFlow(input);
}
