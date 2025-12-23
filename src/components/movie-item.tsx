import { Star } from "lucide-react";
import type { Movie } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieItemProps {
  movie: Movie;
  onToggleWatched: (id: number) => void;
  onDeleteMovie: (id: number) => void;
  onSetRating?: (id: number, rating: number) => void;
}

const StarRating = ({ rating, onSetRating }: { rating: number | null, onSetRating: (rating: number) => void }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onSetRating(star)} aria-label={`Rate ${star} stars`}>
          <Star
            className={cn(
              "h-5 w-5",
              rating && rating >= star
                ? "text-primary fill-primary"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
};


export function MovieItem({ movie, onToggleWatched, onDeleteMovie, onSetRating }: MovieItemProps) {
  return (
    <div className="flex items-center gap-4 p-2 rounded-md transition-colors hover:bg-white/5">
      <Switch
        id={`watched-${movie.id}`}
        checked={movie.watched}
        onCheckedChange={() => onToggleWatched(movie.id)}
        aria-label={`Mark ${movie.title} as watched`}
      />
      <div className="flex-grow">
        <label
          htmlFor={`watched-${movie.id}`}
          className={cn(
            "cursor-pointer transition-colors",
            movie.watched && "line-through text-muted-foreground"
          )}
        >
          {movie.title}
        </label>
        {movie.watched && movie.watchedAt && (
          <p className="text-xs text-muted-foreground">
            Watched on {new Date(movie.watchedAt).toLocaleDateString()}
          </p>
        )}
        {movie.watched && onSetRating && (
          <div className="mt-1">
            <StarRating rating={movie.rating ?? 0} onSetRating={(rating) => onSetRating(movie.id, rating)} />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteMovie(movie.id)}
        aria-label={`Delete ${movie.title}`}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
