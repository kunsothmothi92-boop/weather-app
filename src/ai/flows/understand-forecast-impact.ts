
// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that helps users understand the health implications of a weather forecast.
 *
 * - understandForecastImpact - A function that processes weather forecasts and provides health advice.
 * - UnderstandForecastImpactInput - The input type for the understandForecastImpact function.
 * - UnderstandForecastImpactOutput - The return type for the understandForecastImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandForecastImpactInputSchema = z.object({
  location: z.string().describe('The location for which the weather forecast is provided.'),
  forecast: z.string().describe('The weather forecast details, including temperature, humidity, UV index, and air quality.'),
  userHealthConditions: z.string().optional().describe('Any known health conditions of the user, such as asthma or allergies.'),
});
export type UnderstandForecastImpactInput = z.infer<typeof UnderstandForecastImpactInputSchema>;

const UnderstandForecastImpactOutputSchema = z.object({
  summary: z.string().describe('A CONCISE summary (1-2 sentences) of key potential health impacts.'),
  recommendations: z.string().describe('Brief, actionable recommendations (e.g., 2-3 short bullet points or a short paragraph).'),
});
export type UnderstandForecastImpactOutput = z.infer<typeof UnderstandForecastImpactOutputSchema>;

export async function understandForecastImpact(input: UnderstandForecastImpactInput): Promise<UnderstandForecastImpactOutput> {
  return understandForecastImpactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandForecastImpactPrompt',
  input: {schema: UnderstandForecastImpactInputSchema},
  output: {schema: UnderstandForecastImpactOutputSchema},
  prompt: `You are a health consultant providing advice based on the weather forecast. Your goal is to provide quick, easily digestible insights.

  Location: {{location}}
  Forecast: {{forecast}}
  User Health Conditions: {{userHealthConditions}}

  Provide a CONCISE summary (target 1-2 sentences) of the most important potential health impacts.
  Then, provide brief, actionable recommendations (target 2-3 short bullet points or a very short paragraph).
  Consider factors like UV index, air quality, and temperature in your analysis.
  Tailor the recommendations to the forecast, location, and any provided user health conditions.
  If user health conditions are not provided, provide general, brief recommendations based on the forecast.
  Focus on clarity and brevity. Output should be suitable for quick reading.
  `,
});

const understandForecastImpactFlow = ai.defineFlow(
  {
    name: 'understandForecastImpactFlow',
    inputSchema: UnderstandForecastImpactInputSchema,
    outputSchema: UnderstandForecastImpactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

