
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface GenreFilterProps {
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
  className?: string;
}

interface Genre {
  id: number;
  name: string;
}

const fetchGenres = async () => {
  const API_KEY = "1eadc099fcd876edfae48eece46ac901";
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }
  
  const data = await response.json();
  return data.genres as Genre[];
};

export const GenreFilter = ({ 
  selectedGenre, 
  onGenreSelect,
  className = ""
}: GenreFilterProps) => {
  const { data: genres, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });
  
  if (isLoading) {
    return (
      <div className={`flex gap-2 justify-center ${className}`}>
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
    );
  }
  
  return (
    <ScrollArea className={`max-w-full pb-4 ${className}`}>
      <div className="flex gap-2 flex-nowrap overflow-x-auto pb-2">
        <Button
          variant={selectedGenre === null ? "default" : "outline"}
          className="rounded-full whitespace-nowrap"
          onClick={() => onGenreSelect(null)}
        >
          All Genres
        </Button>
        
        {genres?.map((genre) => (
          <Button
            key={genre.id}
            variant={selectedGenre === genre.id ? "default" : "outline"}
            className="rounded-full whitespace-nowrap"
            onClick={() => onGenreSelect(genre.id)}
          >
            {genre.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default GenreFilter;
