'use server';

/**
 * @fileOverview Generates anonymous community insights for a given location.
 *
 * - getCommunityInsights - A function that handles the community insights generation.
 * - CommunityInsightsInput - The input type for the getCommunityInsights function.
 * - CommunityInsightsOutput - The return type for the getCommunityInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunityInsightsInputSchema = z.object({
  location: z
    .string()
    .describe(
      "The user's location to find nearby community data (e.g., district, state)."
    ),
});

const CommunityInsightsOutputSchema = z.object({
  commonCrops: z
    .array(
      z.object({
        name: z.string().describe('The name of the commonly grown crop.'),
        notes: z
          .string()
          .describe(
            'Brief notes about this crop in the region (e.g., "High yield, good market price").'
          ),
      })
    )
    .describe('A list of common crops grown in the area.'),
  commonDiseases: z
    .array(
      z.object({
        name: z.string().describe('The name of the common disease.'),
        crop: z.string().describe('The primary crop this disease affects.'),
        prevalence: z
          .string()
          .describe('How common the disease is (e.g., "High", "Moderate").'),
      })
    )
    .describe('A list of common diseases reported in the area.'),
  marketTrends: z
    .array(
      z.object({
        crop: z.string().describe('The crop name.'),
        trend: z
          .string()
          .describe(
            'The market trend (e.g., "Price increasing", "Stable demand").'
          ),
        reason: z.string().describe('A brief reason for the trend.'),
      })
    )
    .describe('A list of current market trends.'),
  effectiveTreatments: z
    .array(
      z.object({
        disease: z.string().describe('The disease name.'),
        treatment: z.string().describe('The effective treatment method.'),
        effectiveness: z
          .string()
          .describe(
            'How effective the treatment is reported to be (e.g., "Very effective", "Moderately effective").'
          ),
      })
    )
    .describe(
      'A list of effective treatments reported by the community.'
    ),
});

export type CommunityInsightsInput = z.infer<typeof CommunityInsightsInputSchema>;
export type CommunityInsightsOutput = z.infer<
  typeof CommunityInsightsOutputSchema
>;

const getCommunityInsightsFlow = ai.defineFlow(
  {
    name: 'getCommunityInsightsFlow',
    inputSchema: CommunityInsightsInputSchema,
    outputSchema: CommunityInsightsOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'communityInsightsPrompt',
      input: {schema: CommunityInsightsInputSchema},
      output: {schema: CommunityInsightsOutputSchema},
      prompt: `You are an agricultural data analyst. Based on the location provided, generate a plausible, anonymous summary of community-sourced agricultural data.
The data must be realistic and specific to the given region. Do not use real names or specific farm data.

**Location:** {{{location}}}

**Task:**
Generate a JSON object containing insights for the four categories:
1.  **Common Crops:** List 3-4 crops genuinely common in the area with brief, realistic notes.
2.  **Common Diseases:** List 2-3 prevalent diseases for those crops in that region, their affected crops, and their typical prevalence.
3.  **Market Trends:** List 2-3 current, plausible market trends for local crops.
4.  **Effective Treatments:** List 2-3 treatments that are reported as effective for the common local diseases.

Your response must be a JSON object matching the output schema. Do not include any conversational text or introductions.
`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);

export async function getCommunityInsights(
  input: CommunityInsightsInput
): Promise<CommunityInsightsOutput> {
  return getCommunityInsightsFlow(input);
}
