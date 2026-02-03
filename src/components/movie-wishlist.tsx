"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import type { Movie } from "@/lib/types";
import { Clapperboard, Search, Download, Upload } from "lucide-react";
import { AddMovieForm } from "@/components/add-movie-form";
import { MovieList } from "@/components/movie-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEY = "reel-dreams-movies";

export default function MovieWishlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const { toast } = useToast();

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

  const handleDownloadExcel = () => {
    const moviesToExport = movies.map((movie) => ({
      Title: movie.title,
      Watched: movie.watched,
      Rating: movie.rating,
      Notes: movie.notes,
      "Watched At": movie.watchedAt
        ? new Date(movie.watchedAt).toLocaleDateString()
        : "",
      "Created At": new Date(movie.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(moviesToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movies");
    XLSX.writeFile(workbook, "reel-dreams.xlsx");
  };

  const handleImportMovies = () => {
    const lines = importText.trim().split("\n");
    const newMovies: Movie[] = [];

    // Skip header row if it exists
    const startIndex = lines[0]?.toLowerCase().includes("title") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const cells = line.split("\t");
      const title = cells[0]?.trim();

      if (
        !title ||
        movies.some((m) => m.title.toLowerCase() === title.toLowerCase())
      ) {
        continue;
      }

      const now = Date.now();
      const watched = cells[1]?.trim().toLowerCase() === "true";
      const watchedAtDate = cells[4]?.trim();
      const watchedAt = watched ? (watchedAtDate && !isNaN(new Date(watchedAtDate).getTime()) ? new Date(watchedAtDate).getTime() : now) : null;
      const rating = cells[2] ? parseInt(cells[2].trim(), 10) : null;

      const newMovie: Movie = {
        id: now + i,
        title: title,
        watched: watched,
        createdAt: now,
        watchedAt: watchedAt,
        rating:
          rating && !isNaN(rating) ? Math.max(1, Math.min(5, rating)) : null,
        notes: cells[3]?.trim() || null,
      };
      newMovies.push(newMovie);
    }

    if (newMovies.length > 0) {
      setMovies((prev) => [...newMovies, ...prev]);
      toast({
        title: "Import Successful",
        description: `${newMovies.length} movies have been added to your list.`,
      });
    }

    setImportText("");
    setIsImportDialogOpen(false);
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

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your movies..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={handleDownloadExcel} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Movies from Excel</DialogTitle>
                <DialogDescription>
                  Paste your movie list from an Excel or Google Sheets file.
                  Ensure columns are in order: Title, Watched (TRUE/FALSE),
                  Rating (1-5), Notes, Watched At (Date). The header row is
                  optional.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Paste data here..."
                className="min-h-[200px] my-4"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <DialogFooter>
                <Button onClick={handleImportMovies}>Import Movies</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
