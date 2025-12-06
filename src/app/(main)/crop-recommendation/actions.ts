"use server";

import { recommendCrops, type CropRecommendationInput } from "@/ai/flows/crop-recommendation-from-profile";
import { z } from "zod";
import {ai} from '@/ai/genkit';


export type CropRecommendationState = {
  form: CropRecommendationInput;
  recommendations?: Awaited<ReturnType<typeof recommendCrops>>['recommendations'];
  error?: string;
};

const CropRecommendationSchema = z.object({
  location: z.string().min(1, "Location is required."),
  landSize: z.coerce.number().min(0.1, "Land size must be positive."),
  farmDetails: z.string().min(1, "Farm details are required."),
  soilData: z.string().min(1, "Soil data is required."),
  weatherForecast: z.string().min(1, "Weather forecast is required."),
  cropRotationHistory: z.string().min(1, "Crop rotation history is required."),
  marketTrends: z.string().min(1, "Market trends are required."),
});

export async function getCropRecommendations(
  prevState: CropRecommendationState,
  formData: FormData
): Promise<CropRecommendationState> {
  const validatedFields = CropRecommendationSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return {
      form: Object.fromEntries(formData.entries()) as any,
      error: "Invalid form data. Please check the fields and try again.",
    };
  }

  try {
    const result = await recommendCrops(validatedFields.data);
    return {
      form: validatedFields.data,
      recommendations: result.recommendations,
    };
  } catch (e: any) {
    console.error(e);
    return {
      form: validatedFields.data,
      error: e.message || "An unexpected error occurred.",
    };
  }
}
