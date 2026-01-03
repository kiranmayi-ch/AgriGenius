'use server';
/**
 * @fileOverview Fetches regional average data for farming metrics.
 *
 * - getRegionalAverages - A function that returns regional averages.
 * - RegionalAveragesInput - The input type for the function.
 * - RegionalAveragesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RegionalAveragesInputSchema = z.object({
  location: z.string().describe("The user's location (e.g., district, state)."),
  cropType: z.string().describe('The crop type for which to get data.'),
  fields: z.array(z.enum(['expectedYieldPerAcre', 'sellingPricePerUnit', 'inputCostsPerAcre'])).describe('The list of fields for which to get average data.'),
});
export type RegionalAveragesInput = z.infer<typeof RegionalAveragesInputSchema>;

const RegionalAveragesOutputSchema = z.object({
    expectedYieldPerAcre: z.number().optional(),
    sellingPricePerUnit: z.number().optional(),
    inputCostsPerAcre: z.number().optional(),
});
export type RegionalAveragesOutput = z.infer<typeof RegionalAveragesOutputSchema>;


export async function getRegionalAverages(
  input: RegionalAveragesInput
): Promise<RegionalAveragesOutput> {
  return getRegionalAveragesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRegionalAveragesPrompt',
  input: {
    schema: RegionalAveragesInputSchema,
  },
  output: {
    schema: RegionalAveragesOutputSchema,
  },
  prompt: `You are an agricultural data analyst. Based on the user's location and crop type, provide plausible average values for the requested fields.
Base your response on typical conditions for the region. Only return the fields requested.

**Location:** {{{location}}}
**Crop Type:** {{{cropType}}}
**Requested Fields:** {{{json fields}}}

Return a concise JSON object with the requested fields and their estimated average numeric values. Do not add any conversational text.
Example for 'expectedYieldPerAcre': { "expectedYieldPerAcre": 2200 }
`,
});

const getRegionalAveragesFlow = ai.defineFlow(
  {
    name: 'getRegionalAveragesFlow',
    inputSchema: RegionalAveragesInputSchema,
    outputSchema: RegionalAveragesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
