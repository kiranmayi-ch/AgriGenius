"use server";

import { detectDiseaseFromImage, type DetectDiseaseFromImageOutput } from "@/ai/flows/disease-detection-from-image";
import { z } from "zod";

export type DiseaseDetectionState = {
  photoDataUri?: string;
  result?: DetectDiseaseFromImageOutput;
  error?: string;
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
