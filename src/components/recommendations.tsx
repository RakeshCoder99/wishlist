"use client";

import { useState } from "react";
import type { Movie } from "@/lib/types";
import { suggestMoviesBasedOnPreferences } from "@/ai/flows/suggest-movies-based-on-user-preferences";
import { Sparkles, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecommendationsProps {
  watchedMovies: Movie[];
  onAddMovie: (title: string) => void;
}

export function Recommendations({ watchedMovies, onAddMovie }: RecommendationsProps) {
  const [genres, setGenres] = useState("Sci-Fi, Drama, Comedy");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);

    const watchHistory = watchedMovies.map((m) => m.title).join(", ");
    
    if (!watchHistory) {
      setError("You need to watch some movies first to get recommendations!");
      setLoading(false);
      return;
    }

    try {
      const result = await suggestMoviesBasedOnPreferences({
        watchHistory,
        preferredGenres: genres,
        numberOfSuggestions: 5,
      });
      setSuggestions(result.suggestions);
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't get any recommendations right now.");
      toast({
        variant: "destructive",
        title: "Recommendation Error",
        description: "There was a problem fetching movie recommendations.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Sparkles className="text-primary" />
          Intelligent Recommendations
        </CardTitle>
        <CardDescription>
          Get movie suggestions from our AI based on your watched list and preferred genres.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="genres">Preferred Genres (comma-separated)</Label>
          <Input
            id="genres"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            placeholder="e.g., Action, Thriller"
          />
        </div>
        <Button onClick={handleGetRecommendations} disabled={loading}>
          {loading ? "Thinking..." : "Get Recommendations"}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {loading && (
          <div className="w-full space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        )}
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {suggestions.length > 0 && (
          <div className="w-full space-y-2">
            <h4 className="font-semibold">Here are some movies you might like:</h4>
            <ul className="list-disc list-inside space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center justify-between gap-2">
                  <span>{suggestion}</span>
                  <Button variant="outline" size="sm" onClick={() => onAddMovie(suggestion)}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
