'use server';
/**
 * @fileOverview Recommends the best crops for a farmer based on their profile and various data sources.
 *
 * - recommendCrops - A function that suggests the best crops.
 * - CropRecommendationInput - The input type for the recommendCrops function.
 * - CropRecommendationOutput - The return type for the recommendCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  location: z.string().describe('The geographic location of the farm.'),
  landSize: z.number().describe('The size of the farm in acres.'),
  farmDetails: z.string().describe('Additional details about the farm.'),
  soilData: z.string().describe('Data about the soil composition and health.'),
  weatherForecast: z.string().describe('Weather forecast for the upcoming season.'),
  cropRotationHistory: z.string().describe('History of crops planted on the farm.'),
  marketTrends: z.string().describe('Current market trends for various crops.'),
});
export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      cropName: z.string().describe('The name of the recommended crop.'),
      expectedYield: z.string().describe('The expected yield for the crop.'),
      profitMargin: z.string().describe('The expected profit margin for the crop.'),
      sustainabilityScore: z.number().describe('A score indicating the sustainability of the crop (0-100).'),
      rationale: z.string().describe('Rationale for recommending the crop.')
    })
  ).describe('A list of crop recommendations.'),
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return recommendCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the following information, recommend the best crops for the farmer to plant this season.

Farm Location: {{{location}}}
Land Size: {{{landSize}}} acres
Farm Details: {{{farmDetails}}}
Soil Data: {{{soilData}}}
Weather Forecast: {{{weatherForecast}}}
Crop Rotation History: {{{cropRotationHistory}}}
Market Trends: {{{marketTrends}}}

Consider expected yield, profit margin, and sustainability when making your recommendations.

Format your response as a JSON object with a 'recommendations' field, which is an array of crop recommendations. Each recommendation should include the crop name, expected yield, profit margin, a sustainability score from 0 to 100, and a brief rationale.`, 
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
