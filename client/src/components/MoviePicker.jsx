
import { useEffect, useState } from "react";

const MoviePicker = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/movies/picker-search?query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Failed to search movies. Please try again.");
        }

        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Failed to search movies:", error);
        setResults([]);
        setError(error.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-4">
      <div className="my-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#353b4a] bg-[#11141c] p-4 shadow-2xl sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Log a Film
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-2xl text-[#a2a7b4] transition hover:bg-[#292f3d] hover:text-white"
            aria-label="Close movie picker"
          >
            &times;
          </button>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a film..."
          autoFocus
          className="w-full min-w-0 rounded-lg border border-[#353b4a] bg-[#1d222d] px-3 py-3 text-base text-white outline-none placeholder:text-[#858b99] focus:border-[#e9b44c] sm:px-4 sm:text-sm"
        />

        {/* Search results */}
        {query.trim() && (
          <div className="mt-3 max-h-[45dvh] overflow-y-auto overscroll-contain rounded-lg border border-[#353b4a] bg-[#1d222d] sm:max-h-80">
            {loading && (
              <p className="px-4 py-3 text-sm text-[#a2a7b4]">
                Searching movies...
              </p>
            )}

            {!loading && error && (
              <p className="break-words px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {!loading && !error && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-[#a2a7b4]">
                No movies found.
              </p>
            )}

            {!loading &&
              results.map((movie) => (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => onSelect(movie)}
                  className="block w-full border-b border-[#353b4a] px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-[#292f3d] sm:px-4"
                >
                  <span className="block break-words text-sm font-medium text-white">
                    {movie.title}

                    {movie.release_date && (
                      <span className="ml-2 whitespace-nowrap font-normal text-[#a2a7b4]">
                        ({movie.release_date.slice(0, 4)})
                      </span>
                    )}
                  </span>

                  <span className="mt-1 block break-words text-xs text-[#a2a7b4]">
                    Director: {movie.director}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePicker;
