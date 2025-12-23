import type { Movie } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieItemProps {
  movie: Movie;
  onToggleWatched: (id: number) => void;
  onDeleteMovie: (id: number) => void;
}

export function MovieItem({ movie, onToggleWatched, onDeleteMovie }: MovieItemProps) {
  return (
    <div className="flex items-center gap-4 p-2 rounded-md transition-colors hover:bg-white/5">
      <Switch
        id={`watched-${movie.id}`}
        checked={movie.watched}
        onCheckedChange={() => onToggleWatched(movie.id)}
        aria-label={`Mark ${movie.title} as watched`}
      />
      <label
        htmlFor={`watched-${movie.id}`}
        className={cn(
          "flex-grow cursor-pointer transition-colors",
          movie.watched && "line-through text-muted-foreground"
        )}
      >
        {movie.title}
      </label>
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
