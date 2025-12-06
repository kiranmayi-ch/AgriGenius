'use server';
/**
 * @fileOverview Fetches and generates encyclopedia information for a given pest or disease.
 *
 * - getPestDiseaseInfo - A function that handles fetching details and generating an image.
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
    .describe('A detailed description of the pest or disease.'),
  symptoms: z
    .string()
    .describe(
      'A list of common symptoms caused by the pest or disease, formatted as bullet points.'
    ),
  treatment: z
    .string()
    .describe(
      'Recommended treatment and prevention methods, formatted as bullet points.'
    ),
  imageUrl: z
    .string()
    .describe('A data URI of a generated image of the pest or disease.'),
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
          schema: PestDiseaseEncyclopediaOutputSchema.omit({imageUrl: true}),
        },
        prompt: `You are an expert agricultural entomologist and plant pathologist.
Provide a detailed encyclopedia entry for the following pest or disease: {{{query}}}.

Your response should include:
- A detailed description.
- A bulleted list of common symptoms.
- A bulleted list of recommended treatment and prevention methods.

Format the response as a JSON object.`,
      });

      // Generate the text information and the image in parallel
      const [infoResponse, imageResponse] = await Promise.all([
        infoPrompt(input),
        ai.generate({
          model: 'googleai/imagen-4.0-fast-generate-001',
          prompt: `A clear, detailed, photorealistic image of a "${input.query}"`,
        }),
      ]);

      const output = infoResponse.output;
      if (!output) {
        throw new Error('Failed to generate encyclopedia information.');
      }

      const imageUrl = imageResponse.media?.url;
      if (!imageUrl) {
        throw new Error('Failed to generate an image for the encyclopedia entry.');
      }

      return {
        ...output,
        imageUrl,
      };
    }
  );

  return getPestDiseaseInfoFlow(input);
}
