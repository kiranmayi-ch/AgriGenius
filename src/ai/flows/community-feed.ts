
'use server';

/**
 * @fileOverview Generates a simulated community forum feed.
 *
 * - getCommunityFeed - A function that handles the feed generation.
 * - CommunityFeedInput - The input type for the getCommunityFeed function.
 * - CommunityFeedOutput - The return type for the getCommunityFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const CommunityFeedInputSchema = z.object({
  location: z
    .string()
    .describe(
      "The user's location to generate a relevant community feed (e.g., district, state)."
    ),
  postContent: z.string().optional().describe("A new post content from the user to add to the feed simulation."),
});

export const CommunityFeedOutputSchema = z.object({
  posts: z.array(z.object({
    id: z.number().describe("A unique ID for the post."),
    author: z.string().describe("A plausible, anonymous name for the author (e.g., 'Farmer from Guntur', 'Ravi S.')."),
    avatar: z.string().describe("A single emoji representing the user, like '👨‍🌾', '👩‍🌾', '🌱', ' tractor '."),
    content: z.string().describe("The text content of the post."),
    timestamp: z.string().describe("A relative timestamp (e.g., '2 hours ago', 'Just now')."),
    likes: z.number().describe("Number of likes."),
    replies: z.array(z.object({
      id: z.number().describe("A unique ID for the reply."),
      author: z.string().describe("A plausible, anonymous name for the author."),
      avatar: z.string().describe("A single emoji representing the user."),
      content: z.string().describe("The text content of the reply."),
      timestamp: z.string().describe("A relative timestamp."),
    })).describe("A list of replies to the post.")
  })).describe("A list of community forum posts.")
});

export type CommunityFeedInput = z.infer<typeof CommunityFeedInputSchema>;
export type CommunityFeedOutput = z.infer<typeof CommunityFeedOutputSchema>;

const getCommunityFeedFlow = ai.defineFlow(
  {
    name: 'getCommunityFeedFlow',
    inputSchema: CommunityFeedInputSchema,
    outputSchema: CommunityFeedOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'communityFeedPrompt',
      input: {schema: CommunityFeedInputSchema},
      output: {schema: CommunityFeedOutputSchema},
      prompt: `You are an AI simulating a community forum for farmers in India.
Generate a realistic and helpful feed based on the user's location.

**Rules:**
1.  Create 3-4 diverse posts. Include questions, shared experiences, and advice.
2.  If the user has provided a 'postContent', make that the first and most recent post in the feed. The author for this post should be "You".
3.  For other posts, create plausible, anonymous author names (e.g., "Farmer from [Location]", "Priya K.", "Amit V."). Use diverse emojis for avatars.
4.  Generate 1-2 realistic replies for some of the posts.
5.  Topics should be relevant to agriculture in the specified location: '{{{location}}}'.
6.  Timestamps should be relative and varied (e.g., "Just now", "15 minutes ago", "3 hours ago", "Yesterday").
7.  The tone should be helpful, authentic, and reflect a real community of farmers.

**User's Location:** {{{location}}}
{{#if postContent}}
**User's New Post:** {{{postContent}}}
{{/if}}

Your response must be a JSON object matching the output schema. Do not include any conversational text or introductions.
`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);

export async function getCommunityFeed(
  input: CommunityFeedInput
): Promise<CommunityFeedOutput> {
  return getCommunityFeedFlow(input);
}
