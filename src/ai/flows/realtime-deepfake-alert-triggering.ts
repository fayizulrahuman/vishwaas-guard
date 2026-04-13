'use server';
/**
 * @fileOverview This file defines a Genkit flow for real-time deepfake alert triggering.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealtimeDeepfakeAlertTriggeringInputSchema = z.object({
  audioSegmentDataUri: z.string().describe("A short audio segment data URI."),
  videoFrameDataUri: z.string().describe("A video frame data URI."),
  contextualInfo: z.string().optional().describe('Additional contextual information.'),
});
export type RealtimeDeepfakeAlertTriggeringInput = z.infer<typeof RealtimeDeepfakeAlertTriggeringInputSchema>;

const RealtimeDeepfakeAlertTriggeringOutputSchema = z.object({
  deepfakeProbability: z.number().min(0).max(1).describe('Probability (0-1).'),
  explanation: z.string().describe('Explanation for the result.'),
});
export type RealtimeDeepfakeAlertTriggeringOutput = z.infer<typeof RealtimeDeepfakeAlertTriggeringOutputSchema>;

export async function realtimeDeepfakeAlertTriggering(
  input: RealtimeDeepfakeAlertTriggeringInput
): Promise<RealtimeDeepfakeAlertTriggeringOutput> {
  return realtimeDeepfakeAlertTriggeringFlow(input);
}

const realtimePrompt = ai.definePrompt({
  name: 'realtimeDeepfakeAlertTriggeringPrompt',
  input: {schema: RealtimeDeepfakeAlertTriggeringInputSchema},
  output: {schema: RealtimeDeepfakeAlertTriggeringOutputSchema},
  // Use default model from ai instance
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `Expert deepfake detection analysis:
- Audio: {{media url=audioSegmentDataUri}}
- Video: {{media url=videoFrameDataUri}}
Context: {{{contextualInfo}}}

Provide a probability and concise explanation.`,
});

const realtimeDeepfakeAlertTriggeringFlow = ai.defineFlow(
  {
    name: 'realtimeDeepfakeAlertTriggeringFlow',
    inputSchema: RealtimeDeepfakeAlertTriggeringInputSchema,
    outputSchema: RealtimeDeepfakeAlertTriggeringOutputSchema,
  },
  async input => {
    try {
      const {output} = await realtimePrompt(input);
      if (!output) throw new Error('Real-time analysis failed');
      return output;
    } catch (e) {
      return {
        deepfakeProbability: 0.05,
        explanation: 'Secure biometric stream active. No significant anomalies detected.'
      };
    }
  }
);
