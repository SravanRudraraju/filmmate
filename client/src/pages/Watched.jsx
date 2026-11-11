import React from 'react'
import MovieCard from '../components/MovieCard'
import { useState } from 'react'
import { useEffect } from 'react'

const Watched = () => {
    const [movies, setMovies] = useState([])
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/watched`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    setMovies(data.watched_movies)
                } else {
                    alert(data.message)
                }
            } catch (error) {
                console.error("Error fetching watched movies:", error)
                alert("Something went wrong. Please try again.")
            }
        }
        fetchMovies()
    }, [])

    return (
        <div className="min-h-screen w-full overflow-x-hidden px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8 lg:pt-10">
            {/* Header */}
            <div className="mx-auto w-full max-w-7xl min-w-0">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4 sm:pb-5">
                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        FILMS
                    </h1>

                    <p className="shrink-0 text-sm font-medium text-white/45 sm:text-base">
                        {movies.length} {movies.length === 1 ? "FILM" : "FILMS"}
                    </p>
                </div>

                {/* Movies */}
                {movies.length > 0 ? (
                    <div className="mt-6 grid grid-cols-3 justify-items-center gap-x-3 gap-y-6 min-[420px]:grid-cols-4 sm:grid-cols-5 sm:gap-x-4 sm:gap-y-7 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 xl:justify-items-start xl:gap-x-6 xl:gap-y-8">
                        {[...movies]
                            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                            .map((movie) => (
                                <MovieCard
                                    key={movie.tmdb_movie_id}
                                    movie={movie}
                                    className="w-full max-w-[110px] sm:max-w-[140px] xl:max-w-[160px]"
                                />
                            ))}
                    </div>
                ) : (
                    <div className="flex min-h-[300px] items-center justify-center px-4 text-center sm:min-h-[400px]">
                        <div className="text-center">
                            <p className="text-lg font-medium text-white/60">
                                No watched movies yet
                            </p>

                            <p className="mt-2 text-sm text-white/30">
                                Movies you mark as watched will appear here.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Watched
