"use client";

import { useState, useEffect } from "react";
import type { Movie } from "@/lib/types";
import { Clapperboard, Search } from "lucide-react";
import { AddMovieForm } from "@/components/add-movie-form";
import { MovieList } from "@/components/movie-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const LOCAL_STORAGE_KEY = "reel-dreams-movies";

export default function MovieWishlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      notes: null,
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
  
  const handleSetNotes = (id: number, notes: string) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, notes } : movie
      )
    );
  };

  const handleEditMovie = (id: number, title: string) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, title } : movie
      )
    );
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toWatchMovies = filteredMovies
    .filter((movie) => !movie.watched)
    .sort((a, b) => a.title.localeCompare(b.title));
  const watchedMovies = filteredMovies.filter((movie) => movie.watched);

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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search your movies..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <MovieList
          title="To Watch"
          movies={toWatchMovies}
          onToggleWatched={handleToggleWatched}
          onDeleteMovie={handleDeleteMovie}
          onEditMovie={handleEditMovie}
          emptyMessage={searchTerm ? "No movies found." : "Your watchlist is empty. Add some movies!"}
        />
        <MovieList
          title="Watched"
          movies={watchedMovies}
          onToggleWatched={handleToggleWatched}
          onDeleteMovie={handleDeleteMovie}
          onEditMovie={handleEditMovie}
          onSetRating={handleSetRating}
          onSetNotes={handleSetNotes}
          emptyMessage={searchTerm ? "No movies found." : "You haven't watched any movies from your list yet."}
        />
      </div>
    </div>
  );
}
