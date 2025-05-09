
import { Link, useNavigate } from "react-router-dom";
import { Film, Search, Moon, Sun, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { useMovieContext } from "@/context/MovieContext";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { lastSearchQuery, setLastSearchQuery } = useMovieContext();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchInput, setSearchInput] = useState(lastSearchQuery);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLastSearchQuery(searchInput.trim());
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-xl"
        >
          <Film className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Movie Explorer</span>
        </Link>

        <form onSubmit={handleSearch} className="relative w-full max-w-sm mx-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-full bg-muted px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search movies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Link to="/favorites">
            <Button variant="outline">Favorites</Button>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:block text-sm font-medium">
                {user?.name}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>
                <User className="h-4 w-4 mr-2" /> Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
