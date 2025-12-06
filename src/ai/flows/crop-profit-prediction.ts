'use server';

/**
 * @fileOverview Calculates and displays the expected yield, income, expenses, and profit/loss estimate for a chosen crop.
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
  sellingPricePerUnit: z.number().describe('The selling price per unit of the crop.'),
  inputCostsPerAcre: z.number().describe('The input costs per acre for the chosen crop, including seeds, fertilizer, and labor.'),
});
export type CropProfitPredictionInput = z.infer<typeof CropProfitPredictionInputSchema>;

const CropProfitPredictionOutputSchema = z.object({
  expectedYield: z.number().describe('The total expected yield for the given land size.'),
  expectedIncome: z.number().describe('The total expected income from selling the crop.'),
  totalInputCosts: z.number().describe('The total input costs for the given land size.'),
  estimatedProfitLoss: z.number().describe('The estimated profit or loss for the chosen crop.'),
});
export type CropProfitPredictionOutput = z.infer<typeof CropProfitPredictionOutputSchema>;

export async function cropProfitPrediction(input: CropProfitPredictionInput): Promise<CropProfitPredictionOutput> {
  return cropProfitPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropProfitPredictionPrompt',
  input: {schema: CropProfitPredictionInputSchema},
  output: {schema: CropProfitPredictionOutputSchema},
  prompt: `You are an expert agricultural economist. Calculate the expected yield, income, expenses, and profit/loss estimate for the given crop, land size, selling price, and input costs.

Crop Type: {{{cropType}}}
Land Size (Acres): {{{landSizeAcres}}}
Expected Yield per Acre: {{{expectedYieldPerAcre}}}
Selling Price per Unit: {{{sellingPricePerUnit}}}
Input Costs per Acre: {{{inputCostsPerAcre}}}

Calculate:
1.  Expected Yield: landSizeAcres * expectedYieldPerAcre
2.  Expected Income: expectedYield * sellingPricePerUnit
3.  Total Input Costs: landSizeAcres * inputCostsPerAcre
4.  Estimated Profit/Loss: expectedIncome - totalInputCosts

Present the results clearly, showing each calculation and the final profit/loss estimate. Make sure to populate all of the fields defined in the schema.
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
