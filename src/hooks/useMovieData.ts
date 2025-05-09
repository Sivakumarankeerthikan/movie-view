
import { useQuery } from "@tanstack/react-query";

// API config
const API_KEY = "1eadc099fcd876edfae48eece46ac901";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids?: number[];
  genres?: { id: number, name: string }[];
};

export type TrendingMoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type SearchMoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type MovieDetailsResponse = Movie;

// Helper functions to get image URLs
export const getPosterUrl = (path: string | null, size = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size = "w1280") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Format date helper
export const formatDate = (dateStr: string) => {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// API fetch functions
const fetchTrendingMovies = async () => {
  const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error("Failed to fetch trending movies");
  }
  return response.json() as Promise<TrendingMoviesResponse>;
};

const fetchSearchMovies = async (query: string, page = 1) => {
  if (!query) return { page: 0, results: [], total_pages: 0, total_results: 0 };
  
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  
  if (!response.ok) {
    throw new Error("Failed to search movies");
  }
  
  return response.json() as Promise<SearchMoviesResponse>;
};

const fetchMovieDetails = async (movieId: string) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  
  return response.json() as Promise<any>;
};

// React Query hooks
export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovies,
  });
};

export const useSearchMovies = (query: string, page = 1) => {
  return useQuery({
    queryKey: ["searchMovies", query, page],
    queryFn: () => fetchSearchMovies(query, page),
    enabled: !!query,
  });
};

export const useMovieDetails = (movieId: string | undefined) => {
  return useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => fetchMovieDetails(movieId as string),
    enabled: !!movieId,
  });
};
