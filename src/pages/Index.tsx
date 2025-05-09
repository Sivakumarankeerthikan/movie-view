
import { useTrendingMovies } from "@/hooks/useMovieData";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingMovies from "@/components/TrendingMovies";
import SearchBar from "@/components/SearchBar";
import { useMovieContext } from "@/context/MovieContext";

const Index = () => {
  const { data } = useTrendingMovies();
  const { lastSearchQuery } = useMovieContext();
  
  // Use the first trending movie for the hero section
  const heroMovie = data?.results?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {heroMovie && <HeroSection movie={heroMovie} />}
      
      <section className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Your Favorite Films</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Search for movies, browse trending titles, and create your collection of favorites.
          </p>
          <SearchBar className="mx-auto" />
        </div>
      </section>
      
      <TrendingMovies />
    </div>
  );
};

export default Index;
