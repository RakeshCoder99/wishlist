'use server';
/**
 * @fileOverview AI agent to suggest movies based on user preferences.
 *
 * - suggestMoviesBasedOnPreferences - A function that suggests movies based on user preferences.
 * - SuggestMoviesBasedOnPreferencesInput - The input type for the suggestMoviesBasedOnPreferences function.
 * - SuggestMoviesBasedOnPreferencesOutput - The return type for the suggestMoviesBasedOnPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMoviesBasedOnPreferencesInputSchema = z.object({
  watchHistory: z
    .string()
    .describe('A list of movies the user has watched, comma separated.'),
  preferredGenres: z
    .string()
    .describe('A list of preferred movie genres, comma separated.'),
  numberOfSuggestions: z
    .number()
    .default(3)
    .describe('The number of movie suggestions to return.'),
});
export type SuggestMoviesBasedOnPreferencesInput = z.infer<
  typeof SuggestMoviesBasedOnPreferencesInputSchema
>;

const SuggestMoviesBasedOnPreferencesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested movie titles.'),
});
export type SuggestMoviesBasedOnPreferencesOutput = z.infer<
  typeof SuggestMoviesBasedOnPreferencesOutputSchema
>;

export async function suggestMoviesBasedOnPreferences(
  input: SuggestMoviesBasedOnPreferencesInput
): Promise<SuggestMoviesBasedOnPreferencesOutput> {
  return suggestMoviesBasedOnPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMoviesBasedOnPreferencesPrompt',
  input: {schema: SuggestMoviesBasedOnPreferencesInputSchema},
  output: {schema: SuggestMoviesBasedOnPreferencesOutputSchema},
  prompt: `You are a movie expert. Given the user's watch history and preferred genres, suggest {{{numberOfSuggestions}}} movies they might like. Return only movie titles in a JSON array.

Watch History: {{{watchHistory}}}
Preferred Genres: {{{preferredGenres}}}`,
});

const suggestMoviesBasedOnPreferencesFlow = ai.defineFlow(
  {
    name: 'suggestMoviesBasedOnPreferencesFlow',
    inputSchema: SuggestMoviesBasedOnPreferencesInputSchema,
    outputSchema: SuggestMoviesBasedOnPreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
