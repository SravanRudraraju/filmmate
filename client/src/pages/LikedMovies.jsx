
import React from "react";
import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";

const LikedMovies = () => {
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    const fetchLikedMovies = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/liked/movies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setLikedMovies(data.liked_movies);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching liked movies:", error);
        alert("Something went wrong. Please try again.");
      }
    };

    fetchLikedMovies();
  }, []);

  return (
    <div className="min-h-screen px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4 sm:pb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            FILMS
          </h1>

          <p className="shrink-0 text-sm font-medium text-white/45 sm:text-base">
            {likedMovies.length}{" "}
            {likedMovies.length === 1 ? "FILM" : "FILMS"}
          </p>
        </div>

        {/* Movies */}
        {likedMovies.length > 0 ? (
          <div className="mt-6 grid grid-cols-3 justify-items-center gap-x-3 gap-y-6 sm:mt-8 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-7 md:grid-cols-5 md:gap-x-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10">
            {likedMovies.map((movie) => (
              <MovieCard
                key={movie.tmdb_movie_id}
                movie={movie}
                className="w-full max-w-[110px]"
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center sm:min-h-[400px]">
            <div className="text-center">
              <p className="text-base font-medium text-white/60 sm:text-lg">
                No liked movies yet
              </p>

              <p className="mt-2 text-sm text-white/30">
                Movies you liked will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedMovies;
