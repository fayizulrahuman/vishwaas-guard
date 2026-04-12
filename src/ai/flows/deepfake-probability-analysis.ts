'use server';
/**
 * @fileOverview This file implements a Genkit flow for analyzing audio and video metadata
 * to determine the probability of a deepfake during a call.
 *
 * - deepfakeProbabilityAnalysis - A function that calculates the deepfake probability.
 * - DeepfakeProbabilityAnalysisInput - The input type for the deepfakeProbabilityAnalysis function.
 * - DeepfakeProbabilityAnalysisOutput - The return type for the deepfakeProbabilityAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeepfakeProbabilityAnalysisInputSchema = z.object({
  audioData: z
    .string()
    .describe(
      "The buffered 2-second audio segment as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  videoData: z
    .string()
    .describe(
      "A snapshot or metadata from the video feed as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  callContext: z
    .string()
    .describe('Additional context about the call, e.g., "incoming video call from unknown number".'),
});
export type DeepfakeProbabilityAnalysisInput = z.infer<typeof DeepfakeProbabilityAnalysisInputSchema>;

const DeepfakeProbabilityAnalysisOutputSchema = z.object({
  deepfakeProbability: z.number().min(0.0).max(1.0).describe('The calculated probability (0.0 to 1.0) that the audio/video is a deepfake.'),
  analysisSummary: z.string().describe('A brief explanation of the deepfake probability and the factors considered.'),
  threatLevel: z.enum(['low', 'medium', 'high', 'critical']).describe('The categorized threat level based on the deepfake probability.'),
});
export type DeepfakeProbabilityAnalysisOutput = z.infer<typeof DeepfakeProbabilityAnalysisOutputSchema>;

export async function deepfakeProbabilityAnalysis(
  input: DeepfakeProbabilityAnalysisInput
): Promise<DeepfakeProbabilityAnalysisOutput> {
  return deepfakeProbabilityAnalysisFlow(input);
}

const deepfakeProbabilityAnalysisPrompt = ai.definePrompt({
  name: 'deepfakeProbabilityAnalysisPrompt',
  input: {schema: DeepfakeProbabilityAnalysisInputSchema},
  output: {schema: DeepfakeProbabilityAnalysisOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are an expert deepfake detection system. Your task is to analyze the provided audio and video metadata along with the call context to determine the probability of a deepfake.

Analyze the following inputs:

Audio Data: {{media url=audioData}}
Video Data: {{media url=videoData}}
Call Context: {{{callContext}}}

Based on this information, provide a deepfake probability score between 0.0 and 1.0, a concise analysis summary, and categorize the threat level as 'low', 'medium', 'high', or 'critical'.`,
});

const deepfakeProbabilityAnalysisFlow = ai.defineFlow(
  {
    name: 'deepfakeProbabilityAnalysisFlow',
    inputSchema: DeepfakeProbabilityAnalysisInputSchema,
    outputSchema: DeepfakeProbabilityAnalysisOutputSchema,
  },
  async input => {
    const {output} = await deepfakeProbabilityAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to get deepfake probability analysis from the model.');
    }
    return output;
  }
);
