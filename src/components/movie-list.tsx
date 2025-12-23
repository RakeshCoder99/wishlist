import type { Movie } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MovieItem } from "@/components/movie-item";

interface MovieListProps {
  title: string;
  movies: Movie[];
  onToggleWatched: (id: number) => void;
  onDeleteMovie: (id: number) => void;
  onSetRating?: (id: number, rating: number) => void;
  onSetNotes?: (id: number, notes: string) => void;
  emptyMessage: string;
}

export function MovieList({ title, movies, onToggleWatched, onDeleteMovie, onSetRating, onSetNotes, emptyMessage }: MovieListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {movies.length > 0 ? (
          <div className="space-y-2">
            {movies.map((movie) => (
              <MovieItem
                key={movie.id}
                movie={movie}
                onToggleWatched={onToggleWatched}
                onDeleteMovie={onDeleteMovie}
                onSetRating={onSetRating}
                onSetNotes={onSetNotes}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}
