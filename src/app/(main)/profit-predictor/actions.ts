
'use server';

import {
  cropProfitPrediction,
  type CropProfitPredictionInput,
  type CropProfitPredictionOutput,
} from '@/ai/flows/crop-profit-prediction';
import {
  getRegionalAverages,
  type RegionalAveragesInput,
  type RegionalAveragesOutput,
} from '@/ai/flows/get-regional-averages';
import {z} from 'zod';

export type ProfitPredictorState = {
  form: Partial<CropProfitPredictionInput>;
  result?: CropProfitPredictionOutput;
  error?: string;
};

const ProfitPredictorSchema = z.object({
  cropType: z.string().min(1, 'Crop type is required.'),
  landSizeAcres: z.coerce.number().min(0.1, 'Land size must be positive.'),
  expectedYieldPerAcre: z.coerce
    .number()
    .min(0, 'Expected yield cannot be negative.'),
  sellingPricePerUnit: z.coerce
    .number()
    .min(0, 'Selling price cannot be negative.'),
  inputCostsPerAcre: z.coerce
    .number()
    .min(0, 'Input costs cannot be negative.'),
  location: z.string().min(1, 'Location is required.'),
});

export async function getProfitPrediction(
  prevState: ProfitPredictorState,
  formData: FormData
): Promise<ProfitPredictorState> {
  const rawData = Object.fromEntries(formData.entries());

  // We need to remove the toggle fields before validating with the main schema
  const cleanData = { ...rawData };
  delete (cleanData as any).useAverageYield;
  delete (cleanData as any).useAveragePrice;
  delete (cleanData as any).useAverageCost;


  const validatedFields = ProfitPredictorSchema.safeParse(cleanData);

  if (!validatedFields.success) {
    return {
      form: rawData as any,
      error: 'Invalid form data. Please check the fields and try again.',
    };
  }

  try {
    const result = await cropProfitPrediction(validatedFields.data);
    return {
      form: validatedFields.data,
      result,
    };
  } catch (e: any) {
    return {
      form: validatedFields.data,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}

export async function fetchRegionalAverages(
  input: RegionalAveragesInput
): Promise<{data: RegionalAveragesOutput} | {error: string}> {
  if (!input.location || !input.cropType) {
    return {error: 'Location and Crop Type are required.'};
  }

  try {
    const result = await getRegionalAverages(input);
    return {data: result};
  } catch (e: any) {
    return {
      error:
        e.message || 'An unexpected error occurred while fetching averages.',
    };
  }
}
