
import { getBackdropUrl } from "@/hooks/useMovieData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  movie: {
    id: number;
    title: string;
    backdrop_path: string | null;
    overview: string;
  };
}

export const HeroSection = ({ movie }: HeroSectionProps) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      
      <div className="container relative z-10 flex h-full flex-col justify-end pb-20 pt-24">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {movie.title}
          </h1>
          
          <p className="mb-8 line-clamp-3 text-lg text-gray-300">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={handleViewDetails}>
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
