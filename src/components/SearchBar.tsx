
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMovieContext } from "@/context/MovieContext";

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className = "" }: SearchBarProps) => {
  const { lastSearchQuery, setLastSearchQuery } = useMovieContext();
  const [query, setQuery] = useState(lastSearchQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLastSearchQuery(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex w-full max-w-xl items-center ${className}`}
    >
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="w-full rounded-full bg-muted px-10 py-3 text-base outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button 
        type="submit" 
        className="ml-2 rounded-full"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
