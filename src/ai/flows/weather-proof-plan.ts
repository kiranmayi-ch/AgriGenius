'use server';

/**
 * @fileOverview Generates a weather-resilient farming plan for a specific crop and location.
 *
 * - getWeatherProofPlan - A function that handles the plan generation.
 * - WeatherProofPlanInput - The input type for the getWeatherProofPlan function.
 * - WeatherProofPlanOutput - The return type for the getWeatherProofPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const WeatherProofPlanInputSchema = z.object({
  crop: z.string().describe('The crop for which to create the plan.'),
  location: z.string().describe('The location of the farm.'),
});
export type WeatherProofPlanInput = z.infer<
  typeof WeatherProofPlanInputSchema
>;

const WeatherProofPlanOutputSchema = z.object({
  irrigation: z.object({
    title: z.string(),
    plan: z.string().describe('Detailed irrigation schedule and advice.'),
  }),
  fertilizer: z.object({
    title: z.string(),
    plan: z.string().describe('Detailed fertilizer schedule and advice.'),
  }),
  pestControl: z.object({
    title: z.string(),
    plan: z.string().describe('Detailed pest control schedule and advice.'),
  }),
  harvesting: z.object({
    title: z.string(),
    plan: z.string().describe('Detailed harvesting advice based on humidity.'),
  }),
});
export type WeatherProofPlanOutput = z.infer<
  typeof WeatherProofPlanOutputSchema
>;

export async function getWeatherProofPlan(
  input: WeatherProofPlanInput
): Promise<WeatherProofPlanOutput> {
  const getWeatherProofPlanFlow = ai.defineFlow(
    {
      name: 'getWeatherProofPlanFlow',
      inputSchema: WeatherProofPlanInputSchema,
      outputSchema: WeatherProofPlanOutputSchema,
    },
    async input => {
      const prompt = ai.definePrompt({
        name: 'weatherProofPlanPrompt',
        input: {schema: WeatherProofPlanInputSchema},
        output: {schema: WeatherProofPlanOutputSchema},
        prompt: `You are an expert agronomist. Create a weather-resilient farming plan for a farmer growing {{{crop}}} in {{{location}}}.
The plan should be broken down into four key areas. For each area, provide a title and a detailed, actionable plan as a string.

1.  **Heatwave-safe Irrigation:** Create a plan that ensures crop survival during extreme heat. Include advice on timing (e.g., early morning/late evening), water quantity, and methods like drip irrigation.
2.  **Rain-avoidance Fertilizer Plan:** Create a fertilizer schedule that minimizes nutrient runoff during rainy seasons. Advise on when to apply fertilizer relative to rain forecasts.
3.  **Pest-risk Based Schedule:** Based on common pests for the crop and weather patterns in the location, create a proactive pest and disease management schedule.
4.  **Harvest Timing based on Humidity:** Provide guidance on the optimal humidity levels for harvesting the crop to ensure quality and reduce spoilage.

Generate a concise JSON object with the four sections. Do not include any conversational text.
`,
      });

      const {output} = await prompt(input);
      return output!;
    }
  );
  return getWeatherProofPlanFlow(input);
}
