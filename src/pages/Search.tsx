
import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSearchMovies } from "@/hooks/useMovieData";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { useMovieContext } from "@/context/MovieContext";
import { Grid2X2, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSearchMovies(query, page);
  const { viewMode, toggleViewMode } = useMovieContext();
  
  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  const handleLoadMore = () => {
    if (data && page < data.total_pages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search results for "${query}"` : "Search Movies"}
        </h1>
        
        <p className="text-muted-foreground mb-8">
          {data?.total_results
            ? `Found ${data.total_results} results`
            : isLoading
            ? "Searching..."
            : "Enter a search term to find movies"}
        </p>
        
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center mb-8">
            <h3 className="mb-2 text-xl font-semibold text-destructive">Error searching movies</h3>
            <p className="text-muted-foreground">Please try again with a different search term.</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {data?.results?.length ? `Showing ${data.results.length} of ${data.total_results} movies` : ""}
          </p>
          {data?.results?.length > 0 && (
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
          )}
        </div>
        
        {isLoading && (
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
        )}
        
        {!isLoading && data?.results?.length === 0 && query && (
          <div className="rounded-lg border p-8 text-center">
            <h3 className="mb-2 text-xl font-semibold">No movies found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any movies matching "{query}". Try a different search term.
            </p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        )}
        
        {!isLoading && data?.results?.length > 0 && (
          <>
            <div className={viewMode === "grid" ? "movie-grid" : "movie-list gap-4"}>
              {data.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} view={viewMode} />
              ))}
            </div>
            
            {data.page < data.total_pages && (
              <div className="mt-12 text-center">
                <Button 
                  onClick={handleLoadMore} 
                  size="lg"
                  disabled={isLoading}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
