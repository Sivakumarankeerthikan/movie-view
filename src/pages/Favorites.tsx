
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { useMovieContext } from "@/context/MovieContext";
import { Grid2X2, List } from "lucide-react";

const Favorites = () => {
  const { favorites, viewMode, toggleViewMode } = useMovieContext();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-2">Your Favorite Movies</h1>
        
        <p className="text-muted-foreground mb-8">
          {favorites.length
            ? `You have ${favorites.length} favorite movie${favorites.length > 1 ? "s" : ""}`
            : "You haven't added any favorite movies yet"}
        </p>
        
        {favorites.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {`Showing ${favorites.length} favorite${favorites.length > 1 ? "s" : ""}`}
            </p>
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
        )}
        
        {favorites.length === 0 ? (
          <div className="rounded-lg border p-8 text-center">
            <h3 className="mb-2 text-xl font-semibold">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Add movies to your favorites to see them here.
            </p>
            <Link to="/">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "movie-grid" : "movie-list gap-4"}>
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} view={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
