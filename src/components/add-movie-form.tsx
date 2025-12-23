"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AddMovieFormProps {
  onAddMovie: (title: string) => void;
}

export function AddMovieForm({ onAddMovie }: AddMovieFormProps) {
  const [newMovieTitle, setNewMovieTitle] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMovieTitle.trim()) {
      onAddMovie(newMovieTitle.trim());
      setNewMovieTitle("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add a new movie</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., The Grand Budapest Hotel"
            value={newMovieTitle}
            onChange={(e) => setNewMovieTitle(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon" aria-label="Add movie">
            <Plus />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
