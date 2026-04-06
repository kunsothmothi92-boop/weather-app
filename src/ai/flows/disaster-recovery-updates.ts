
'use server';
/**
 * @fileOverview An AI agent that provides disaster recovery information for a location.
 *
 * - getDisasterRecoveryUpdates - A function that fetches recent disaster-related updates.
 * - DisasterUpdatesInput - The input type for the getDisasterRecoveryUpdates function.
 * - DisasterUpdatesOutput - The return type for the getDisasterRecoveryUpdates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisasterUpdatesInputSchema = z.object({
  location: z
    .string()
    .describe('The location for which to fetch disaster recovery updates.'),
});
export type DisasterUpdatesInput = z.infer<typeof DisasterUpdatesInputSchema>;

const DisasterUpdatesOutputSchema = z.object({
  updates: z.string().describe('A concise summary of recent disaster-related news or preparedness tips for the location (e.g., 2-4 bullet points). If no specific recent events, provide general preparedness advice relevant to common risks in the region. Always include a disclaimer to check official local emergency services for the latest information.'),
  locationName: z.string().describe('The name of the location for which the updates were generated.')
});
export type DisasterUpdatesOutput = z.infer<typeof DisasterUpdatesOutputSchema>;

export async function getDisasterRecoveryUpdates(input: DisasterUpdatesInput): Promise<DisasterUpdatesOutput> {
  return disasterRecoveryUpdatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'disasterRecoveryUpdatesPrompt',
  input: {schema: DisasterUpdatesInputSchema},
  output: {schema: DisasterUpdatesOutputSchema},
  prompt: `You are an AI assistant providing helpful, general information related to disaster preparedness for the specified location.

Location: {{{location}}}

Provide:
- 'locationName': Confirm the location for which this information is relevant.
- 'updates': A concise summary (e.g., 2-4 bullet points) of:
    - Any very recent, publicly known significant disaster-related news or alerts for this location (e.g., major floods, earthquakes, ongoing large-scale evacuations). Prioritize official-sounding but general information if available.
    - If no specific major recent events are apparent, provide general preparedness advice relevant to common natural hazard risks known for that region (e.g., "For coastal areas: be aware of hurricane season preparedness.").
    - Conclude the 'updates' section with the following disclaimer: "Important: This is general information. Always refer to official local emergency services and government channels for the most accurate and up-to-date alerts and instructions."

Focus on general awareness and preparedness tips. Do not generate fake news or specific, unverified incident details. If the location is very broad, you may pick a major city within it.
If you cannot find any relevant information, state that and provide only the disclaimer.
Output should be brief and easy to read.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH', 
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const disasterRecoveryUpdatesFlow = ai.defineFlow(
  {
    name: 'disasterRecoveryUpdatesFlow',
    inputSchema: DisasterUpdatesInputSchema,
    outputSchema: DisasterUpdatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

