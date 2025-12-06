'use server';
/**
 * @fileOverview Detects crop diseases or nutrient deficiencies from an uploaded image.
 *
 * - detectDiseaseFromImage - A function that handles the disease detection process.
 * - DetectDiseaseFromImageInput - The input type for the detectDiseaseFromImage function.
 * - DetectDiseaseFromImageOutput - The return type for the detectDiseaseFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDiseaseFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type DetectDiseaseFromImageInput = z.infer<typeof DetectDiseaseFromImageInputSchema>;

const DetectDiseaseFromImageOutputSchema = z.object({
  disease: z.string().describe('The detected disease or deficiency.'),
  explanation: z.string().describe('Explanation of the disease or deficiency.'),
  recommendedActions: z.string().describe('Recommended actions to address the issue.'),
  severity: z.string().describe('Severity of the disease or deficiency (e.g., Low, Medium, High).'),
});
export type DetectDiseaseFromImageOutput = z.infer<typeof DetectDiseaseFromImageOutputSchema>;

export async function detectDiseaseFromImage(input: DetectDiseaseFromImageInput): Promise<DetectDiseaseFromImageOutput> {
  return detectDiseaseFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDiseaseFromImagePrompt',
  input: {schema: DetectDiseaseFromImageInputSchema},
  output: {schema: DetectDiseaseFromImageOutputSchema},
  prompt: `You are an expert in plant pathology. Analyze the image of the crop and determine if there are any diseases or nutrient deficiencies.

    Provide the following information:
    - disease: The name of the detected disease or deficiency. If no disease is detected, state that the plant is healthy.
    - explanation: A brief explanation of the disease or deficiency, including symptoms and potential causes.
    - recommendedActions: Specific actions the farmer can take to address the issue.
    - severity: A rating of the severity of the disease or deficiency (Low, Medium, High).

    Here is the image of the crop: {{media url=photoDataUri}}`,
});

const detectDiseaseFromImageFlow = ai.defineFlow(
  {
    name: 'detectDiseaseFromImageFlow',
    inputSchema: DetectDiseaseFromImageInputSchema,
    outputSchema: DetectDiseaseFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
