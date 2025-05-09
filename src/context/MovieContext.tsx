
import { createContext, useContext, useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  backdrop_path: string | null;
}

interface MovieContextType {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  lastSearchQuery: string;
  setLastSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  toggleViewMode: () => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      const storedLastSearch = localStorage.getItem("lastSearch");
      const storedViewMode = localStorage.getItem("viewMode");

      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      
      if (storedLastSearch) {
        setLastSearchQuery(storedLastSearch);
      }

      if (storedViewMode === 'list' || storedViewMode === 'grid') {
        setViewMode(storedViewMode);
      }
    } catch (error) {
      console.error("Error loading data from localStorage", error);
    }
  }, []);

  const addToFavorites = (movie: Movie) => {
    setFavorites((prev) => {
      const newFavorites = [...prev, movie];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((movie) => movie.id !== id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (id: number) => {
    return favorites.some((movie) => movie.id === id);
  };

  const updateLastSearchQuery = (query: string) => {
    setLastSearchQuery(query);
    localStorage.setItem("lastSearch", query);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const newMode = prev === 'grid' ? 'list' : 'grid';
      localStorage.setItem("viewMode", newMode);
      return newMode;
    });
  };

  return (
    <MovieContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        lastSearchQuery,
        setLastSearchQuery: updateLastSearchQuery,
        viewMode,
        toggleViewMode,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};
