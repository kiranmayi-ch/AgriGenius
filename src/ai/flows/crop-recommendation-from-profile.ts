
'use server';
/**
 * @fileOverview Recommends the best crops for a farmer based on their profile and various data sources, providing deep analysis.
 *
 * - recommendCrops - A function that suggests the best crops and provides detailed analysis.
 * - CropRecommendationInput - The input type for the recommendCrops function.
 * - CropRecommendationOutput - The return type for the recommendCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CropRecommendationInputSchema = z.object({
  location: z.string().describe('The geographic location of the farm.'),
  landSize: z.number().describe('The size of the farm in acres.'),
  soilPH: z.number().describe('The pH level of the soil.'),
  soilNitrogen: z.number().describe('The Nitrogen (N) content of the soil in ppm.'),
  soilPhosphorus: z.number().describe('The Phosphorus (P) content of the soil in ppm.'),
  soilPotassium: z.number().describe('The Potassium (K) content of the soil in ppm.'),
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
      rationale: z.string().describe('Rationale for recommending this specific crop.')
    })
  ).describe('A ranked list of the top 3 crop recommendations.'),
  soilAnalysis: z.string().describe('A detailed analysis of the provided soil parameters and their implications for the recommended crops.'),
  featureCorrelation: z.string().describe('An analysis of how different input features (e.g., soil nitrogen, weather) correlate and influence the recommendations.'),
  climateSoilCropModeling: z.string().describe('An explanation of the relationship modeling between climate, soil, and the recommended crops, highlighting key interactions.'),
  sustainableFarmingSupport: z.string().describe('Actionable advice and decision support for implementing sustainable farming practices related to the recommendations.')
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return recommendCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `You are an expert agricultural ML model. Your task is to provide crop recommendations and detailed analysis based on the provided dataset.

**Input Data:**
- Farm Location: {{{location}}}
- Land Size: {{{landSize}}} acres
- Soil pH: {{{soilPH}}}
- Soil Nitrogen (N): {{{soilNitrogen}}} ppm
- Soil Phosphorus (P): {{{soilPhosphorus}}} ppm
- Soil Potassium (K): {{{soilPotassium}}} ppm
- Weather Forecast: {{{weatherForecast}}}
- Crop Rotation History: {{{cropRotationHistory}}}
- Market Trends: {{{marketTrends}}}

**Your Tasks:**

1.  **Top 3 Crop Recommendations:**
    *   Provide a ranked list of the top 3 most suitable crops.
    *   For each crop, include: cropName, expectedYield, profitMargin, sustainabilityScore (0-100), and a detailed rationale.

2.  **Soil Parameter Analysis:**
    *   Analyze the provided soil parameters (pH, N, P, K).
    *   Explain how these values impact the suitability of the recommended crops. Mention if levels are optimal, deficient, or excessive for each recommendation.

3.  **Feature Correlation Studies:**
    *   Briefly explain how different input features correlate to influence the recommendations.
    *   Example: "The high nitrogen level in the soil, combined with the forecast for heavy rain, strongly favors Crop A, as it is nitrogen-hungry but susceptible to drought. Market trends for pulses make Crop B a strong secondary choice despite slightly sub-optimal soil conditions."

4.  **Climate-Soil-Crop Relationship Modeling:**
    *   Describe the interaction between the climate forecast and soil conditions for the top recommended crop.
    *   Explain why this specific combination makes the crop a prime candidate.

5.  **Sustainable Farming Decision Support:**
    *   Based on the sustainabilityScore, provide actionable advice.
    *   For high scores, explain what makes the crop sustainable.
    *   For lower scores, suggest practices (e.g., cover cropping, reduced tillage, water conservation methods) to improve sustainability for that crop in this environment.

Format your entire response as a single, valid JSON object matching the output schema.
`, 
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
