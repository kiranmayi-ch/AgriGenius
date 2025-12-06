"use server";

import { cropProfitPrediction, type CropProfitPredictionInput, type CropProfitPredictionOutput } from "@/ai/flows/crop-profit-prediction";
import { z } from "zod";

export type ProfitPredictorState = {
  form: CropProfitPredictionInput;
  result?: CropProfitPredictionOutput;
  error?: string;
};

const ProfitPredictorSchema = z.object({
  cropType: z.string().min(1, "Crop type is required."),
  landSizeAcres: z.coerce.number().min(0.1, "Land size must be positive."),
  expectedYieldPerAcre: z.coerce.number().min(0, "Expected yield cannot be negative."),
  sellingPricePerUnit: z.coerce.number().min(0, "Selling price cannot be negative."),
  inputCostsPerAcre: z.coerce.number().min(0, "Input costs cannot be negative."),
  location: z.string().min(1, "Location is required."),
});

export async function getProfitPrediction(
  prevState: ProfitPredictorState,
  formData: FormData
): Promise<ProfitPredictorState> {
  const validatedFields = ProfitPredictorSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      form: Object.fromEntries(formData.entries()) as any,
      error: "Invalid form data. Please check the fields and try again.",
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
      error: e.message || "An unexpected error occurred.",
    };
  }
}
