
import { Link } from "react-router-dom";
import { getPosterUrl, formatDate } from "@/hooks/useMovieData";
import { useMovieContext } from "@/context/MovieContext";
import { Button } from "@/components/ui/button";
import { Eye, Heart, HeartOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    overview: string;
  };
  view?: "grid" | "list";
}

export const MovieCard = ({ movie, view = "grid" }: MovieCardProps) => {
  const { id, title, poster_path, release_date, vote_average } = movie;
  const releaseYear = release_date ? new Date(release_date).getFullYear() : "N/A";
  const rating = vote_average ? (vote_average / 2).toFixed(1) : "N/A";
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your favorites.`,
      });
    } else {
      addToFavorites(movie);
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites.`,
      });
    }
  };
  
  if (view === "list") {
    return (
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border animate-fade-in">
        <img 
          src={getPosterUrl(poster_path)}
          alt={title}
          className="w-24 h-36 object-cover rounded-md"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1 gap-2">
            <span>{releaseYear}</span>
            <span>•</span>
            <div className="flex items-center">
              <svg 
                className="w-4 h-4 text-yellow-500 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {movie.overview || "No description available."}
          </p>
          <div className="mt-4 flex gap-2">
            <Link to={`/movie/${id}`}>
              <Button variant="secondary" size="sm" className="gap-1">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </Link>
            
            <Button 
              variant={isFavorite(id) ? "destructive" : "outline"} 
              size="sm"
              onClick={handleToggleFavorite}
              className="gap-1"
            >
              {isFavorite(id) ? (
                <>
                  <HeartOff className="h-4 w-4" />
                  Remove
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4" />
                  Favorite
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group movie-card animate-fade-in relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${id}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <img
            src={getPosterUrl(poster_path)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="movie-card-overlay">
            <div className="absolute bottom-0 w-full p-4">
              <h3 className="text-white font-medium line-clamp-1">{title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-300">{releaseYear}</span>
                <div className="flex items-center">
                  <svg 
                    className="w-4 h-4 text-yellow-500 mr-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-300">{rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {isHovered && (
        <Button
          variant={isFavorite(id) ? "destructive" : "default"}
          size="sm"
          className="absolute top-2 right-2 opacity-90 p-2 h-auto"
          onClick={handleToggleFavorite}
        >
          {isFavorite(id) ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

export default MovieCard;
