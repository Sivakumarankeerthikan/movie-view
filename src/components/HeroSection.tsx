
import { getBackdropUrl } from "@/hooks/useMovieData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, Plus } from "lucide-react";
import { useMovieContext } from "@/context/MovieContext";

interface HeroSectionProps {
  movie: {
    id: number;
    title: string;
    backdrop_path: string | null;
    overview: string;
    release_date?: string;
    vote_average?: number;
  };
}

export const HeroSection = ({ movie }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites } = useMovieContext();
  
  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const handleAddToFavorites = () => {
    if (!isFavorite(movie.id)) {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: null, // This will be filled from the API response
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date || "",
        vote_average: movie.vote_average || 0,
        overview: movie.overview,
      });
    }
  };
  
  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : null;
  
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      
      <div className="container relative z-10 flex h-full flex-col justify-end pb-20 pt-24">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {movie.title}
            {releaseYear && <span className="text-3xl font-normal ml-4 opacity-75">({releaseYear})</span>}
          </h1>
          
          {movie.vote_average && (
            <div className="flex items-center mb-4">
              <div className="bg-primary px-2 py-1 rounded-md text-primary-foreground font-bold mr-3">
                {(movie.vote_average / 2).toFixed(1)}
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(movie.vote_average / 2) 
                        ? 'text-yellow-500' 
                        : 'text-gray-400'
                    }`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
          
          <p className="mb-8 line-clamp-3 text-lg text-gray-300">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={handleViewDetails} className="gap-2">
              <Play className="h-5 w-5" /> Watch Trailer
            </Button>
            
            {!isFavorite(movie.id) && (
              <Button size="lg" variant="outline" onClick={handleAddToFavorites} className="gap-2">
                <Plus className="h-5 w-5" /> Add to Favorites
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
