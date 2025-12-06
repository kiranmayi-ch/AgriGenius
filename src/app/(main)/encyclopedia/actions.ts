'use server';

import {
  getPestDiseaseInfo,
  type PestDiseaseEncyclopediaInput,
  type PestDiseaseEncyclopediaOutput,
} from '@/ai/flows/pest-disease-encyclopedia';
import {z} from 'zod';

export type EncyclopediaState = {
  form: {query: string};
  result?: PestDiseaseEncyclopediaOutput;
  error?: string;
};

const EncyclopediaSchema = z.object({
  query: z
    .string()
    .min(2, 'Search query is required and must be at least 2 characters.'),
});

export async function generateEncyclopediaEntry(
  prevState: EncyclopediaState,
  formData: FormData
): Promise<EncyclopediaState> {
  const validatedFields = EncyclopediaSchema.safeParse({
    query: formData.get('query'),
  });

  if (!validatedFields.success) {
    return {
      form: {query: (formData.get('query') as string) || ''},
      error: 'Invalid query. Please enter a valid pest or disease name.',
    };
  }

  try {
    const result = await getPestDiseaseInfo(validatedFields.data);
    return {
      form: validatedFields.data,
      result,
    };
  } catch (e: any) {
    return {
      form: validatedFields.data,
      error:
        e.message ||
        'An unexpected error occurred while fetching the encyclopedia entry.',
    };
  }
}
