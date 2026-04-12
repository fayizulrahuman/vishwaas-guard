'use server';
/**
 * @fileOverview This file defines a Genkit flow for performing a comprehensive AI security audit.
 * It analyzes security metrics and recent activity to provide a rating and recommendations.
 *
 * - securityAudit - A function that initiates the security audit analysis.
 * - SecurityAuditInput - The input type for the flow.
 * - SecurityAuditOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SecurityAuditInputSchema = z.object({
  recentAlerts: z.array(z.string()).describe('A list of recent security alert descriptions or events.'),
  systemUptime: z.string().describe('The current system uptime percentage.'),
  protectionStatus: z.string().describe('The user\'s current protection level (e.g., "Full", "Partial", "None").'),
});
export type SecurityAuditInput = z.infer<typeof SecurityAuditInputSchema>;

const SecurityAuditOutputSchema = z.object({
  securityScore: z.number().min(0).max(100).describe('A calculated security score from 0 to 100.'),
  auditSummary: z.string().describe('A professional summary of the user\'s security posture.'),
  recommendations: z.array(z.string()).describe('A list of 3 actionable steps to improve security.'),
  threatAnalysis: z.string().describe('An assessment of current global deepfake threats relevant to the user.'),
});
export type SecurityAuditOutput = z.infer<typeof SecurityAuditOutputSchema>;

export async function securityAudit(input: SecurityAuditInput): Promise<SecurityAuditOutput> {
  return securityAuditFlow(input);
}

const auditPrompt = ai.definePrompt({
  name: 'securityAuditPrompt',
  input: {schema: SecurityAuditInputSchema},
  output: {schema: SecurityAuditOutputSchema},
  prompt: `You are a high-level security consultant for Vishwaas Guard, an Apple-inspired deepfake protection platform.

Analyze the following security data for the user:
- Recent Alerts: {{#each recentAlerts}} - {{{this}}}{{/each}}
- System Uptime: {{{systemUptime}}}
- Protection Level: {{{protectionStatus}}}

Provide a comprehensive security audit. 
1. Assign a security score (0-100).
2. Write a professional, encouraging summary in the Apple "Liquid Glass" voice (premium, clear, and direct).
3. Provide 3 highly actionable recommendations.
4. Include a brief analysis of the current deepfake threat landscape.

Tone: Professional, calm, authoritative, yet approachable.`,
});

const securityAuditFlow = ai.defineFlow(
  {
    name: 'securityAuditFlow',
    inputSchema: SecurityAuditInputSchema,
    outputSchema: SecurityAuditOutputSchema,
  },
  async input => {
    const {output} = await auditPrompt(input);
    if (!output) {
      throw new Error('Failed to generate security audit from Gemini.');
    }
    return output;
  }
);
