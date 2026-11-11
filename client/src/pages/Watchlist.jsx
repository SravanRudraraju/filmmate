import React from 'react'
import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/watchlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (response.ok) {
          setWatchlist(data.watchlist)
        } else {
          alert(data.message)
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error)
        alert("Something went wrong. Please try again.")
      }
    }

    fetchWatchlist()
  }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
      <div className="mx-auto w-full max-w-[1300px]">

        {/* Heading */}
        <div className="mb-6 flex items-end gap-3 border-b border-white/[0.08] pb-4 sm:mb-9 sm:gap-6 sm:pb-5">
          <h1 className="min-w-0 text-lg font-medium tracking-tight text-white/80 sm:text-xl lg:text-2xl">
            <span className="font-semibold text-white">
              {watchlist.length}
            </span>{' '}
            {watchlist.length === 1 ? "FILM IS" : "FILMS ARE"} IN YOUR WATCHLIST
          </h1>
        </div>

        {/* Watchlist */}
        {watchlist.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 justify-items-center gap-x-3 gap-y-8 min-[480px]:grid-cols-3 sm:gap-x-5 sm:gap-y-10 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:justify-items-start xl:gap-x-8 xl:gap-y-14">
            {watchlist.map((movie) => (
              <div
                key={movie.tmdb_movie_id}
                className="flex w-full min-w-0 justify-center xl:justify-start"
              >
                <MovieCard
                  movie={movie}
                  className="w-full max-w-[135px] sm:max-w-[150px] md:max-w-[160px] xl:max-w-[175px]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[260px] items-center justify-center px-4 text-center sm:min-h-[300px]">
            <p className="text-base text-white/35 sm:text-lg">
              Your watchlist is waiting for its first film.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Watchlist
