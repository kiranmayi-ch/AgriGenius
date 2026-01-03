
'use server';

import {
  getCommunityFeed,
  type CommunityFeedInput,
  type CommunityFeedOutput,
} from '@/ai/flows/community-feed';
import {z} from 'zod';

export type CommunityForumState = {
  form: {location: string, postContent?: string};
  feed?: CommunityFeedOutput;
  error?: string;
};

const CommunityFeedSchema = z.object({
  location: z
    .string()
    .min(3, 'Location is required and must be at least 3 characters.'),
  postContent: z.string().optional(),
});

export async function generateCommunityFeed(
  prevState: CommunityForumState,
  formData: FormData
): Promise<CommunityForumState> {
  const validatedFields = CommunityFeedSchema.safeParse({
    location: formData.get('location'),
    postContent: formData.get('postContent'),
  });

  if (!validatedFields.success) {
    return {
      form: {
          location: (formData.get('location') as string) || '',
          postContent: (formData.get('postContent') as string) || ''
        },
      error: 'Invalid form data. Please ensure location is set.',
    };
  }
  
  // Clear post content after submission, but keep location
  const nextFormState = { ...validatedFields.data, postContent: '' };


  try {
    const result = await getCommunityFeed(validatedFields.data);
    return {
      form: nextFormState,
      feed: result,
    };
  } catch (e: any) {
    return {
      form: validatedFields.data, // Keep original data on error
      error:
        e.message ||
        'An unexpected error occurred while fetching the community feed.',
    };
  }
}
