'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing suspicious communication.
 * It uses Gemini to identify scam markers and provide a risk assessment.
 *
 * - analyzeCommunicationThreat - Function to analyze a piece of communication.
 * - AnalyzeThreatInput - Input type for the analysis.
 * - AnalyzeThreatOutput - Output type for the analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeThreatInputSchema = z.object({
  content: z.string().describe('The text transcript or description of the suspicious communication.'),
  mediaType: z.enum(['voice', 'video', 'social']).describe('The medium of the communication.'),
});
export type AnalyzeThreatInput = z.infer<typeof AnalyzeThreatInputSchema>;

const AnalyzeThreatOutputSchema = z.object({
  riskScore: z.number().min(0).max(100).describe('A risk score from 0 (safe) to 100 (scam).'),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).describe('The categorized threat level.'),
  detectedMarkers: z.array(z.string()).describe('Specific red flags or scam techniques identified.'),
  analysis: z.string().describe('A professional breakdown of why this content is suspicious.'),
  immediateAction: z.string().describe('The single most important step the user should take right now.'),
});
export type AnalyzeThreatOutput = z.infer<typeof AnalyzeThreatOutputSchema>;

export async function analyzeCommunicationThreat(input: AnalyzeThreatInput): Promise<AnalyzeThreatOutput> {
  return analyzeCommunicationThreatFlow(input);
}

const threatPrompt = ai.definePrompt({
  name: 'analyzeCommunicationThreatPrompt',
  input: {schema: AnalyzeThreatInputSchema},
  output: {schema: AnalyzeThreatOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are the Vishwaas Guard Security Intelligence Engine. Your goal is to analyze communication content to detect scams, deepfakes, and social engineering attempts.

Analyze the following:
Medium: {{{mediaType}}}
Content: {{{content}}}

Look for:
- Urgency or manufactured crisis.
- Requests for sensitive data (OTP, password, wire transfer).
- Biometric inconsistencies (if described).
- Unusual speech patterns or robotic cadence.

Provide a highly accurate risk assessment in the Apple premium voice: clear, direct, and authoritative.`,
});

const analyzeCommunicationThreatFlow = ai.defineFlow(
  {
    name: 'analyzeCommunicationThreatFlow',
    inputSchema: AnalyzeThreatInputSchema,
    outputSchema: AnalyzeThreatOutputSchema,
  },
  async input => {
    try {
      const {output} = await threatPrompt(input);
      if (!output) {
        throw new Error('Safety filter block or empty response.');
      }
      return output;
    } catch (error: any) {
      console.error('Threat Analysis Error:', error);
      // Return a safe fallback if the model fails
      return {
        riskScore: 50,
        riskLevel: 'medium',
        detectedMarkers: ['System timeout or filter hit'],
        analysis: 'The security engine encountered an issue analyzing this specific content. Please use caution.',
        immediateAction: 'Do not share sensitive information until a manual review is performed.',
      };
    }
  }
);
