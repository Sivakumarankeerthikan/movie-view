
import { useTrendingMovies } from "@/hooks/useMovieData";
import MovieCard from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieContext } from "@/context/MovieContext";
import { Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Movie } from "@/hooks/useMovieData";

interface TrendingMoviesProps {
  title?: string;
  selectedGenre?: number | null;
}

export const TrendingMovies = ({ 
  title = "Trending Movies",
  selectedGenre = null
}: TrendingMoviesProps) => {
  const { data, isLoading, error } = useTrendingMovies();
  const { viewMode, toggleViewMode } = useMovieContext();
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (data?.results) {
      if (selectedGenre === null) {
        setFilteredMovies(data.results);
      } else {
        const filtered = data.results.filter(movie => 
          movie.genre_ids?.includes(selectedGenre)
        );
        setFilteredMovies(filtered);
      }
    }
  }, [data?.results, selectedGenre]);

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          <div className={viewMode === "grid" ? "movie-grid" : "movie-list"}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className={viewMode === "grid" ? "" : "flex gap-4"}>
                {viewMode === "grid" ? (
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                ) : (
                  <>
                    <Skeleton className="h-36 w-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-10 w-24 mt-4" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
            <h3 className="mb-2 text-xl font-semibold text-destructive">Error loading trending movies</h3>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!filteredMovies.length) {
    return (
      <div className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
            <div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleViewMode}
                title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
              >
                {viewMode === "grid" ? (
                  <List className="h-5 w-5" />
                ) : (
                  <Grid2X2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          <div className="rounded-lg border p-8 text-center">
            <h3 className="mb-2 text-xl font-semibold">No movies found for this genre</h3>
            <p className="text-muted-foreground">Try selecting a different genre.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleViewMode}
              title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
            >
              {viewMode === "grid" ? (
                <List className="h-5 w-5" />
              ) : (
                <Grid2X2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        <div className={viewMode === "grid" ? "movie-grid" : "movie-list gap-4"}>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} view={viewMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingMovies;
