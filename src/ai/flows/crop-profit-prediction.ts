'use server';

/**
 * @fileOverview Calculates and displays the expected yield, income, expenses, and profit/loss estimate for a chosen crop, and suggests best markets.
 *
 * - cropProfitPrediction - A function that handles the crop profit prediction process.
 * - CropProfitPredictionInput - The input type for the cropProfitPrediction function.
 * - CropProfitPredictionOutput - The return type for the cropProfitPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropProfitPredictionInputSchema = z.object({
  cropType: z.string().describe('The type of crop to be planted.'),
  landSizeAcres: z.number().describe('The size of the land in acres.'),
  expectedYieldPerAcre: z.number().describe('The expected yield per acre for the chosen crop.'),
  sellingPricePerUnit: z.number().describe('The average expected selling price per unit of the crop.'),
  inputCostsPerAcre: z.number().describe('The input costs per acre for the chosen crop, including seeds, fertilizer, and labor.'),
  location: z.string().describe('The user\'s location to find nearby markets (e.g., district, state).'),
});
export type CropProfitPredictionInput = z.infer<typeof CropProfitPredictionInputSchema>;

const CropProfitPredictionOutputSchema = z.object({
  expectedYield: z.number().describe('The total expected yield for the given land size.'),
  expectedIncome: z.number().describe('The total expected income from selling the crop.'),
  totalInputCosts: z.number().describe('The total input costs for the given land size.'),
  estimatedProfitLoss: z.number().describe('The estimated profit or loss for the chosen crop.'),
  marketSuggestions: z.array(z.object({
    mandiName: z.string().describe('The name of the suggested Mandi (market).'),
    distance: z.string().describe('Approximate distance from the user\'s location.'),
    estimatedPrice: z.number().describe('The estimated selling price per unit at this mandi.'),
    potentialProfit: z.number().describe('The potential total profit if selling at this mandi.'),
    pros: z.string().describe('A brief reason or advantage of selling at this mandi.'),
  })).describe('A list of recommended nearby markets (mandis) to sell the crop.'),
});
export type CropProfitPredictionOutput = z.infer<typeof CropProfitPredictionOutputSchema>;

export async function cropProfitPrediction(input: CropProfitPredictionInput): Promise<CropProfitPredictionOutput> {
  return cropProfitPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropProfitPredictionPrompt',
  input: {schema: CropProfitPredictionInputSchema},
  output: {schema: CropProfitPredictionOutputSchema},
  prompt: `You are an expert agricultural economist. Based on the data below, do two things:
1.  Calculate the expected yield, income, total costs, and estimated profit/loss.
2.  Suggest the 3 best nearby Mandis (markets) for the user to sell their crop for maximum profit.

Input Data:
- Crop Type: {{{cropType}}}
- Land Size (Acres): {{{landSizeAcres}}}
- Expected Yield per Acre: {{{expectedYieldPerAcre}}}
- Average Selling Price per Unit: {{{sellingPricePerUnit}}}
- Input Costs per Acre: {{{inputCostsPerAcre}}}
- Location: {{{location}}}

Calculation Steps:
- Expected Yield: landSizeAcres * expectedYieldPerAcre
- Expected Income (based on average price): expectedYield * sellingPricePerUnit
- Total Input Costs: landSizeAcres * inputCostsPerAcre
- Estimated Profit/Loss: expectedIncome - totalInputCosts

Market Suggestions:
- Identify 3 real or plausible Mandis near the user's location.
- For each Mandi, provide a slightly varied 'estimatedPrice' (some higher, some lower than the average selling price).
- Calculate the 'potentialProfit' for each Mandi: (expectedYield * estimatedPrice) - totalInputCosts.
- Provide a short 'pros' for each suggestion (e.g., "Higher price", "Less crowded", "Better storage").

Return a concise JSON object. Do not add any conversational text.
`,
});

const cropProfitPredictionFlow = ai.defineFlow(
  {
    name: 'cropProfitPredictionFlow',
    inputSchema: CropProfitPredictionInputSchema,
    outputSchema: CropProfitPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
