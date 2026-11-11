
import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/movies/trending`
      );
      const data = await response.json();
      
      setTrendingMovies(data.results);
    };

    fetchTrendingMovies();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#FF6B1A]/[0.05] blur-[120px] sm:-top-60 sm:h-[600px] sm:w-[800px] sm:blur-[160px] lg:w-[1000px]" />

      <main className="relative mx-auto w-[92%] max-w-[1500px] pb-12 pt-28 sm:w-[90%] sm:pb-16 sm:pt-32 lg:w-[85%]">
        {/* TRENDING */}
        <section className="mb-16 sm:mb-20 lg:mb-28">
          <div className="mb-5 flex items-center gap-3 sm:mb-8 sm:gap-4">
            <div className="h-6 w-[3px] shrink-0 rounded-full bg-[#FF6B1A] sm:h-7" />

            <h2 className="text-xl font-semibold tracking-wide text-white sm:text-2xl lg:text-3xl">
              TRENDING NOW
            </h2>
          </div>

          {/* Movie grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-7 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6 xl:grid-cols-6">
            {trendingMovies.slice(0, 20).map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
