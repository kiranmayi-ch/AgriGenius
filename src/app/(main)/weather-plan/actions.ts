'use server';

import {
  getWeatherProofPlan,
  type WeatherProofPlanInput,
  type WeatherProofPlanOutput,
} from '@/ai/flows/weather-proof-plan';
import {z} from 'zod';

export type WeatherPlanState = {
  form: WeatherProofPlanInput;
  result?: WeatherProofPlanOutput;
  error?: string;
};

const WeatherPlanSchema = z.object({
  crop: z.string().min(2, 'Crop name is required.'),
  location: z.string().min(2, 'Location is required.'),
});

export async function generateWeatherPlan(
  prevState: WeatherPlanState,
  formData: FormData
): Promise<WeatherPlanState> {
  const validatedFields = WeatherPlanSchema.safeParse({
    crop: formData.get('crop'),
    location: formData.get('location'),
  });

  if (!validatedFields.success) {
    return {
      form: {
        crop: (formData.get('crop') as string) || '',
        location: (formData.get('location') as string) || '',
      },
      error: 'Invalid form data. Please check the fields and try again.',
    };
  }

  try {
    const result = await getWeatherProofPlan(validatedFields.data);
    return {
      form: validatedFields.data,
      result,
    };
  } catch (e: any) {
    return {
      form: validatedFields.data,
      error:
        e.message ||
        'An unexpected error occurred while generating the plan.',
    };
  }
}
