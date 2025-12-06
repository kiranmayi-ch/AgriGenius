'use server';

/**
 * @fileOverview Calculates the potential financial loss from an untreated crop disease.
 *
 * - calculateDamageCost - A function that handles the damage cost calculation.
 * - DamageCostCalculatorInput - The input type for the calculateDamageCost function.
 * - DamageCostCalculatorOutput - The return type for the calculateDamageCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const DamageCostCalculatorInputSchema = z.object({
  cropType: z.string().describe('The type of crop affected by the disease.'),
  landSizeAcres: z.coerce.number().describe('The size of the land in acres.'),
  expectedYieldPerAcre: z.coerce.number().describe('The expected yield per acre (in kg) for the crop.'),
  sellingPricePerUnit: z.coerce.number().describe('The average expected selling price per unit (e.g., per kg) of the crop.'),
  diseaseName: z.string().describe('The name of the detected disease.'),
  diseaseSeverity: z.enum(['Low', 'Medium', 'High']).describe('The severity of the disease.'),
});
export type DamageCostCalculatorInput = z.infer<typeof DamageCostCalculatorInputSchema>;


export const DamageCostCalculatorOutputSchema = z.object({
    estimatedYieldLossPercentage: z.string().describe('The estimated percentage range of yield loss (e.g., "5-15%").'),
    estimatedYieldLossQuantity: z.number().describe('The estimated total quantity of yield loss in kg.'),
    estimatedFinancialLoss: z.number().describe('The estimated total financial loss in the local currency.'),
    recommendation: z.string().describe('A brief, urgent recommendation to mitigate the loss.')
});
export type DamageCostCalculatorOutput = z.infer<typeof DamageCostCalculatorOutputSchema>;

export async function calculateDamageCost(input: DamageCostCalculatorInput): Promise<DamageCostCalculatorOutput> {
  return calculateDamageCostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'damageCostCalculatorPrompt',
  input: {schema: DamageCostCalculatorInputSchema},
  output: {schema: DamageCostCalculatorOutputSchema},
  prompt: `You are an agricultural economist specializing in risk assessment for crop diseases.
A farmer has a detected disease and wants to understand the potential financial loss if it goes untreated.

Based on the data below, calculate the potential yield loss and financial cost.

**Input Data:**
- Crop: {{{cropType}}}
- Land Size: {{{landSizeAcres}}} acres
- Expected Yield per Acre: {{{expectedYieldPerAcre}}} kg
- Avg. Selling Price per Unit: {{{sellingPricePerUnit}}}
- Disease: {{{diseaseName}}}
- Severity: {{{diseaseSeverity}}}

**Calculation Logic:**
1.  **Total Expected Yield:** landSizeAcres * expectedYieldPerAcre
2.  **Estimate Yield Loss Percentage Range** based on severity:
    - Low: 5-15%
    - Medium: 20-40%
    - High: 50-80%
    *Present this as a string range in the output.*
3.  **Calculate Estimated Yield Loss (Quantity):** Use the *average* of the percentage range. For example, for "Low" (5-15%), use 10%.
    - (Total Expected Yield * Average Loss Percentage)
4.  **Calculate Estimated Financial Loss:**
    - Estimated Yield Loss (Quantity) * Avg. Selling Price per Unit
5.  **Provide a brief, urgent recommendation** to the farmer about addressing the issue.

**Output Format:**
- Your response must be a JSON object matching the output schema.
- Use bullet points for the recommendation.
- Do not include any conversational text or introductions.
`,
});

const calculateDamageCostFlow = ai.defineFlow(
  {
    name: 'calculateDamageCostFlow',
    inputSchema: DamageCostCalculatorInputSchema,
    outputSchema: DamageCostCalculatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
