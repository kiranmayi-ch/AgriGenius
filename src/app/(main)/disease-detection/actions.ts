"use server";

import { detectDiseaseFromImage, type DetectDiseaseFromImageOutput } from "@/ai/flows/disease-detection-from-image";
import { calculateDamageCost, DamageCostCalculatorInputSchema, type DamageCostCalculatorOutput } from "@/ai/flows/damage-cost-calculator";
import { z } from "zod";

export type DiseaseDetectionState = {
  photoDataUri?: string;
  result?: DetectDiseaseFromImageOutput;
  error?: string;
  damageCostResult?: DamageCostCalculatorOutput;
  damageCostError?: string;
  damageCostForm?: z.infer<typeof DamageCostCalculatorInputSchema>;
};

const DiseaseDetectionSchema = z.object({
  photoDataUri: z.string().min(1, "Image is required."),
});

export async function getDiseaseDetection(
  prevState: DiseaseDetectionState,
  formData: FormData
): Promise<DiseaseDetectionState> {
  const validatedFields = DiseaseDetectionSchema.safeParse({
    photoDataUri: formData.get("photoDataUri"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data. Please upload an image.",
    };
  }

  try {
    const result = await detectDiseaseFromImage(validatedFields.data);
    return {
      photoDataUri: validatedFields.data.photoDataUri,
      result,
    };
  } catch (e: any) {
    return {
      photoDataUri: validatedFields.data.photoDataUri,
      error: e.message || "An unexpected error occurred while analyzing the image.",
    };
  }
}

export async function getDamageCost(
  prevState: DiseaseDetectionState,
  formData: FormData
): Promise<DiseaseDetectionState> {
  const formValues = Object.fromEntries(formData.entries());
  const validatedFields = DamageCostCalculatorInputSchema.safeParse(formValues);

  if (!validatedFields.success) {
    return {
      ...prevState,
      damageCostError: "Invalid form data. Please check all fields.",
      damageCostForm: formValues as any,
    };
  }

  try {
    const result = await calculateDamageCost(validatedFields.data);
    return {
      ...prevState,
      damageCostResult: result,
      damageCostError: undefined,
    };
  } catch (e: any) {
    return {
      ...prevState,
      damageCostError: e.message || "An unexpected error occurred while calculating the cost.",
      damageCostForm: validatedFields.data,
    };
  }
}