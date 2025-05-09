
import { useParams, Link } from "react-router-dom";
import { useMovieDetails, getBackdropUrl, getPosterUrl, formatDate } from "@/hooks/useMovieData";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useMovieContext } from "@/context/MovieContext";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading, error } = useMovieDetails(id);
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  const handleToggleFavorite = () => {
    if (!movie) return;
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="relative h-[50vh] w-full">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="container -mt-32 relative z-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <Link to="/" className="inline-flex items-center mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-destructive">
              Error Loading Movie
            </h1>
            <p className="mb-4 text-muted-foreground">
              The movie you're looking for couldn't be found or there was an error loading it.
            </p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : "N/A";
  
  // Get trailer if available
  const trailer = movie.videos?.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div 
        className="relative h-[50vh] w-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      
      <div className="container -mt-32 relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center mb-8 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
            
            <Button
              className="mt-6 w-full"
              variant={isFavorite(movie.id) ? "destructive" : "default"}
              onClick={handleToggleFavorite}
            >
              {isFavorite(movie.id) ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>
          
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>{releaseYear}</span>
              
              {movie.runtime && (
                <>
                  <span>•</span>
                  <span>{movie.runtime} minutes</span>
                </>
              )}
              
              <span>•</span>
              <div className="flex items-center">
                <svg 
                  className="w-5 h-5 text-yellow-500 mr-1" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating} / 5.0
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres?.map((genre: any) => (
                <span
                  key={genre.id}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground">
                {movie.overview || "No overview available."}
              </p>
            </div>
            
            {trailer && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Trailer</h2>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${movie.title} Trailer`}
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
            )}
            
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {movie.credits.cast.slice(0, 10).map((person: any) => (
                    <div key={person.id} className="flex-shrink-0 w-24">
                      <img
                        src={getPosterUrl(person.profile_path, "w185")}
                        alt={person.name}
                        className="w-full aspect-[2/3] object-cover rounded-md mb-2"
                      />
                      <p className="text-sm font-medium truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {person.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
