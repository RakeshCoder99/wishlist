"use client";

import { useState, useEffect } from "react";
import type { Movie } from "@/lib/types";
import { Clapperboard } from "lucide-react";
import { AddMovieForm } from "@/components/add-movie-form";
import { MovieList } from "@/components/movie-list";
import { Recommendations } from "@/components/recommendations";
import { Skeleton } from "@/components/ui/skeleton";

const LOCAL_STORAGE_KEY = "reel-dreams-movies";

export default function MovieWishlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedMovies = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedMovies) {
        setMovies(JSON.parse(storedMovies));
      }
    } catch (error) {
      console.error("Failed to parse movies from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
    }
  }, [movies, isLoaded]);

  const handleAddMovie = (title: string) => {
    // Prevent adding duplicates
    if (movies.some(movie => movie.title.toLowerCase() === title.toLowerCase())) {
        return;
    }
    const now = Date.now();
    const newMovie: Movie = {
      id: now,
      title,
      watched: false,
      createdAt: now,
      watchedAt: null,
      rating: null,
    };
    setMovies((prevMovies) => [newMovie, ...prevMovies]);
  };

  const handleToggleWatched = (id: number) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { 
          ...movie, 
          watched: !movie.watched,
          watchedAt: !movie.watched ? Date.now() : null,
          rating: !movie.watched ? movie.rating : null, // Reset rating if moved to "To Watch"
        } : movie
      )
    );
  };

  const handleDeleteMovie = (id: number) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };
  
  const handleSetRating = (id: number, rating: number) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, rating } : movie
      )
    );
  };

  const toWatchMovies = movies.filter((movie) => !movie.watched);
  const watchedMovies = movies.filter((movie) => movie.watched);

  if (!isLoaded) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <Skeleton className="mx-auto h-12 w-12 rounded-full" />
                <Skeleton className="h-10 w-64 mx-auto" />
                <Skeleton className="h-6 w-80 mx-auto" />
            </div>
            <Skeleton className="h-36 w-full" />
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Clapperboard className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
          Reel Dreams
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your personal movie watchlist, powered by AI.
        </p>
      </header>

      <AddMovieForm onAddMovie={handleAddMovie} />

      <div className="grid md:grid-cols-2 gap-8">
        <MovieList
          title="To Watch"
          movies={toWatchMovies}
          onToggleWatched={handleToggleWatched}
          onDeleteMovie={handleDeleteMovie}
          emptyMessage="Your watchlist is empty. Add some movies!"
        />
        <MovieList
          title="Watched"
          movies={watchedMovies}
          onToggleWatched={handleToggleWatched}
          onDeleteMovie={handleDeleteMovie}
          onSetRating={handleSetRating}
          emptyMessage="You haven't watched any movies from your list yet."
        />
      </div>

      <Recommendations watchedMovies={watchedMovies} onAddMovie={handleAddMovie} />
    </div>
  );
}
