'use server';

import {
  getCommunityInsights,
  type CommunityInsightsInput,
  type CommunityInsightsOutput,
} from '@/ai/flows/community-insights';
import {z} from 'zod';

export type CommunityInsightsState = {
  form: {location: string};
  result?: CommunityInsightsOutput;
  error?: string;
};

const CommunityInsightsSchema = z.object({
  location: z
    .string()
    .min(3, 'Location is required and must be at least 3 characters.'),
});

export async function generateCommunityInsights(
  prevState: CommunityInsightsState,
  formData: FormData
): Promise<CommunityInsightsState> {
  const validatedFields = CommunityInsightsSchema.safeParse({
    location: formData.get('location'),
  });

  if (!validatedFields.success) {
    return {
      form: {location: (formData.get('location') as string) || ''},
      error: 'Invalid location. Please enter a valid location.',
    };
  }

  try {
    const result = await getCommunityInsights(validatedFields.data);
    return {
      form: validatedFields.data,
      result,
    };
  } catch (e: any) {
    return {
      form: validatedFields.data,
      error:
        e.message ||
        'An unexpected error occurred while fetching community insights.',
    };
  }
}
