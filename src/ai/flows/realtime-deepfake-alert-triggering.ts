'use server';
/**
 * @fileOverview This file defines a Genkit flow for real-time deepfake alert triggering.
 * It takes audio and video metadata and returns a deepfake probability analysis.
 *
 * - realtimeDeepfakeAlertTriggering - A function that initiates the deepfake probability calculation.
 * - RealtimeDeepfakeAlertTriggeringInput - The input type for the flow.
 * - RealtimeDeepfakeAlertTriggeringOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealtimeDeepfakeAlertTriggeringInputSchema = z.object({
  audioSegmentDataUri: z
    .string()
    .describe(
      "A short audio segment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  videoFrameDataUri: z
    .string()
    .describe(
      "A video frame (image), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  contextualInfo: z
    .string()
    .optional()
    .describe(
      'Additional contextual information from on-device analysis, such as suspicious patterns or anomalies.'
    ),
});
export type RealtimeDeepfakeAlertTriggeringInput = z.infer<
  typeof RealtimeDeepfakeAlertTriggeringInputSchema
>;

const RealtimeDeepfakeAlertTriggeringOutputSchema = z.object({
  deepfakeProbability: z
    .number()
    .min(0)
    .max(1)
    .describe('The probability that the input audio/video is a deepfake (0-1).'),
  explanation: z
    .string()
    .describe('A brief explanation for the calculated deepfake probability.'),
});
export type RealtimeDeepfakeAlertTriggeringOutput = z.infer<
  typeof RealtimeDeepfakeAlertTriggeringOutputSchema
>;

export async function realtimeDeepfakeAlertTriggering(
  input: RealtimeDeepfakeAlertTriggeringInput
): Promise<RealtimeDeepfakeAlertTriggeringOutput> {
  return realtimeDeepfakeAlertTriggeringFlow(input);
}

const realtimePrompt = ai.definePrompt({
  name: 'realtimeDeepfakeAlertTriggeringPrompt',
  input: {schema: RealtimeDeepfakeAlertTriggeringInputSchema},
  output: {schema: RealtimeDeepfakeAlertTriggeringOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert deepfake detection system. Your task is to analyze provided audio and video metadata to determine the probability of it being a deepfake.

Analyze the following: 
- Audio: {{media url=audioSegmentDataUri}}
- Video Frame: {{media url=videoFrameDataUri}}

Context: {{{contextualInfo}}}

Based on the analysis, provide a deepfake probability between 0 and 1, where 1 indicates a very high likelihood of a deepfake, and 0 indicates no likelihood. Also, provide a concise explanation for your determination.

Consider anomalies, inconsistencies, and any other indicators commonly associated with deepfake technology in both audio and video.`,
});

const realtimeDeepfakeAlertTriggeringFlow = ai.defineFlow(
  {
    name: 'realtimeDeepfakeAlertTriggeringFlow',
    inputSchema: RealtimeDeepfakeAlertTriggeringInputSchema,
    outputSchema: RealtimeDeepfakeAlertTriggeringOutputSchema,
  },
  async input => {
    const {output} = await realtimePrompt(input);
    if (!output) {
      throw new Error('Analysis failed.');
    }
    return output;
  }
);
