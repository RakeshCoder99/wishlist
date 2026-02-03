"use client";

import { useState } from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import type { Movie } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface MovieItemProps {
  movie: Movie;
  onToggleWatched: (id: number) => void;
  onDeleteMovie: (id: number) => void;
  onEditMovie: (id: number, newTitle: string) => void;
  onSetRating?: (id: number, rating: number) => void;
  onSetNotes?: (id: number, notes: string) => void;
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


export function MovieItem({ movie, onToggleWatched, onDeleteMovie, onEditMovie, onSetRating, onSetNotes }: MovieItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(movie.title);

  const handleSave = () => {
    if (newTitle.trim()) {
      onEditMovie(movie.id, newTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(movie.title);
  };

  return (
    <div className="flex items-center gap-4 p-2 rounded-md transition-colors hover:bg-white/5">
      <Switch
        id={`watched-${movie.id}`}
        checked={movie.watched}
        onCheckedChange={() => onToggleWatched(movie.id)}
        aria-label={`Mark ${movie.title} as watched`}
      />
      <div className="flex-grow space-y-2">
        {isEditing ? (
          <Input 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
            className="h-9"
          />
        ) : (
          <div>
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
          </div>
        )}
        {movie.watched && !isEditing && (
          <div className="space-y-2">
            {onSetRating && (
              <StarRating rating={movie.rating ?? 0} onSetRating={(rating) => onSetRating(movie.id, rating)} />
            )}
            {onSetNotes && (
              <Textarea
                placeholder="Add a note..."
                defaultValue={movie.notes ?? ""}
                onBlur={(e) => onSetNotes(movie.id, e.target.value)}
                className="text-sm"
                rows={2}
              />
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-1">
          <Button onClick={handleSave} size="sm">Save</Button>
          <Button onClick={handleCancel} variant="ghost" size="sm">Cancel</Button>
        </div>
      ) : (
        <div className="flex items-center">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                aria-label={`Edit ${movie.title}`}
                className="text-muted-foreground hover:text-primary"
            >
                <Pencil className="h-4 w-4" />
            </Button>
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
      )}
    </div>
  );
}
