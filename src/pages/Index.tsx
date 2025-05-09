
import { useState } from "react";
import { useTrendingMovies } from "@/hooks/useMovieData";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingMovies from "@/components/TrendingMovies";
import SearchBar from "@/components/SearchBar";
import { useMovieContext } from "@/context/MovieContext";
import GenreFilter from "@/components/GenreFilter";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data, isLoading } = useTrendingMovies();
  const { lastSearchQuery } = useMovieContext();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  // Use the first trending movie for the hero section
  const heroMovie = data?.results?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {isLoading ? (
        <div className="relative h-[70vh] w-full overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        heroMovie && <HeroSection movie={heroMovie} />
      )}
      
      <section className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            Discover Your Favorite Films
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Search for movies, browse trending titles, and create your collection of favorites.
          </p>
          <SearchBar className="mx-auto" />
          
          <GenreFilter 
            selectedGenre={selectedGenre}
            onGenreSelect={setSelectedGenre}
            className="mt-8"
          />
        </div>
      </section>
      
      <TrendingMovies title="Trending Movies" selectedGenre={selectedGenre} />
    </div>
  );
};

export default Index;
