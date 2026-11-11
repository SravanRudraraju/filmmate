import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import background from "../assets/backgroundimage.jpg"
import poster from "../assets/sampleposter.jpg"
import { Link, useNavigate } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  FaRegClock, FaClock, FaRegEye, FaEye, FaRegHeart, FaHeart, FaRegStar, FaStar, FaRegEdit
} from "react-icons/fa";
import { MdPlaylistAdd } from "react-icons/md";
import DiaryEntry from '../components/DiaryEntry';


const MovieDeatils = () => {

  const [Movie, setMovie] = useState(null);
  const [watched, setWatched] = useState(false)
  const [liked, setLiked] = useState(false)
  const [watchlisted, setWatchlisted] = useState(false)
  const { id } = useParams();

  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate()

  const castRef = useRef(null)
  const crewRef = useRef(null)

  const [ratingOpen, setRatingOpen] = useState(false)
  const [rating, setRating] = useState(0)

  const [diaryOpen, setDiaryOpen] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await fetch(`http://localhost:3000/api/movies/${id}`)
      const data = await response.json()
      setMovie(data)

    }
    fetchMovie()
  }, [id])

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!isLoggedIn || !Movie) return

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/watchlist`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const data = await response.json()

      if (response.ok) {
        setWatchlisted(data.inWatchlist)
      }
    }
    checkWatchlist()
  }, [Movie, isLoggedIn])

  useEffect(() => {
    const checkLiked = async () => {
      if (!isLoggedIn || !Movie) return

      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/like`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        setLiked(data.isLiked)
      }
    }
    checkLiked()
  }, [Movie, isLoggedIn])

  useEffect(() => {
    const CheckWatched = async () => {
      if (!isLoggedIn || !Movie) return
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/watch`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        setWatched(data.isWatched)
      }
    }
    CheckWatched()
  }, [Movie, isLoggedIn])

  useEffect(() => {
    const checkRating = async () => {
      if (!isLoggedIn || !Movie) return
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/rating`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        setRating(Number(data.rating))
      }
    }
    checkRating()
  }, [Movie, isLoggedIn])

  if (!Movie) {
    return <h1 className="px-4 py-8 text-white">Loading...</h1>;
  }

  const trailer = Movie.videos.results.find(
    (video) =>
      video.type === "Trailer" &&
      video.site === "YouTube" &&
      video.official === true
  );
  const trailerKey = trailer?.key;
  const importantJobs = [
    "Director",
    "Writer",
    "Screenplay",
    "Producer",
    "Executive Producer",
    "Director of Photography",
    "Editor",
    "Original Music Composer",
    "Production Design",
    "Costume Design"
  ];
  const importantCrew = Movie.credits.crew
    .filter((person) => importantJobs.includes(person.job))
    .reduce((people, person) => {
      const existingPerson = people.find(
        (p) => p.id === person.id
      );

      if (existingPerson) {
        existingPerson.jobs.push(person.job);
      } else {
        people.push({
          id: person.id,
          name: person.name,
          profile_path: person.profile_path,
          jobs: [person.job]
        });
      }

      return people;
    }, [])
    .slice(0, 40);

  const scrollCast = (direction) => {
    if (castRef.current) {
      castRef.current.scrollBy({
        left: direction === "left" ? -500 : 500,
        behavior: "smooth"
      })
    }
  }
  const scrollCrew = (direction) => {
    if (crewRef.current) {
      crewRef.current.scrollBy({
        left: direction === "left" ? -500 : 500,
        behavior: "smooth"
      })
    }
  }

  const handleWatchlist = async () => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/watchlist`,
      {
        method: watchlisted ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.json()

    if (response.ok) {
      setWatchlisted(prev => !prev)
    } else {
      alert(data.message)
    }
  }

  const handleLikedMovies = async () => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }
    const token = localStorage.getItem("token")

    const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/like`,
      {
        method: liked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.json()
    if (response.ok) {
      setLiked(prev => !prev)
    } else {
      alert(data.message)
    }
  }

  const handleWatchedMovies = async () => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/watch`,
      {
        method: watched ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.json()
    if (response.ok) {
      if (watched) {
        setWatched(false)
      } else {
        setWatched(true)
        setWatchlisted(false)
      }

    } else {
      alert(data.message)
    }
  }

  const handleRatings = async (selectedRating) => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/rating`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: selectedRating
        })
      }
    )
    if (response.ok) {
      setRatingOpen(false)
    } else {
      const data = await response.json()
      alert(data.message)
    }
  }

  const handleDeleteRating = async () => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    const token = localStorage.getItem("token")

    const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/rating`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.ok) {
      setRating(0)
      setRatingOpen(false)
    } else {
      const data = await response.json()
      alert(data.message)
    }
  }

  const handleDiaryEntry = async (watchedDate, rating, liked, review) => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3000/api/movies/${Movie.id}/diary`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          watched_on: watchedDate,
          rating: rating > 0 ? rating : null,
          liked: liked,
          review: review
        })
      }
    )
    if (response.ok) {
      setWatched(true)
      setWatchlisted(false)
      setLiked(liked)
      if (rating > 0) {
        setRating(rating)
      }
      setDiaryOpen(false)

    } else {
      const data = await response.json()
      alert(data.message)
    }
  }

  return (
    <div className='relative isolate min-h-screen'>
      <div className='fixed inset-0 bg-cover bg-center z-0' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${Movie.backdrop_path})` }} />
      <div className='fixed inset-0 z-0 bg-black-50' />
      <div className='fixed inset-0 z-0 bg-gradient-to-r from-black/50 via-black/70 to-black/60' />


      <main className="relative z-10 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-12">
        <div className="mx-auto mt-4 flex max-w-6xl flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-10 xl:gap-18">

          {/* Poster */}
          <img
            className="mx-auto h-auto max-h-[360px] w-[min(65vw,240px)] shrink-0 rounded-lg border border-white/20 object-cover shadow-2xl sm:w-[267px] lg:mx-0 lg:h-[400px]"
            src={`https://image.tmdb.org/t/p/w500${Movie.poster_path}`}
            alt={Movie.title}
          />

          {/* Movie Information */}
          <div className="min-w-0 w-full max-w-2xl">

            {/* Title */}
            <h1 className="break-words text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:text-5xl">
              {Movie.title}
            </h1>

            {/* Metadata */}
            <p className="mt-3 text-base text-white/70 sm:mt-4 sm:text-lg">
              {Movie.release_date.slice(0, 4)} <span className="mx-2">•</span> {Movie.runtime} mins
            </p>

            {/* Genres */}
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              {Movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Director */}
            <p className="mt-5 text-base text-white/70 sm:mt-7 sm:text-lg">
              Directed by{" "}
              <span className="text-white font-medium">
                {Movie.credits.crew.find((person) => person.job === "Director")?.name}
              </span>
            </p>

            {/* Description */}
            <p className="mt-4 max-w-xl break-words text-base leading-7 text-white/80 sm:mt-5 sm:text-lg">
              {Movie.overview}
            </p>

          </div>
          {/* imdb */}
          <div className='w-full min-w-0 shrink-0 lg:w-[300px] xl:w-[350px]'>
            <a href={`https://www.themoviedb.org/movie/${Movie.id}`} target="_blank" className='group flex items-center justify-between border-b border-white/20 pb-4'>
              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-white/50'>TMDB</p>
                <p className='mt-1 text-2xl font-semibold text-white group-hover:text-yellow-400 transition'>{Movie.vote_average.toFixed(1)}/10</p>
              </div>
              <span className='text-white/40 text-xl group-hover:text-white transition'>
                ↗
              </span>
            </a>

            {/* trailer */}
            <div className='mt-6'>
              <p className="mb-3 text-xs tracking-[0.2em] text-white/50">
                TRAILER
              </p>
              <div className="overflow-hidden rounded-xl border border-white/15 shadow-xl">
                <iframe className='w-full aspect-video rounded-lg' src={`https://www.youtube.com/embed/${trailerKey}`} title={`${Movie.title}  trailer`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>

            </div>

            <div className='mt-7 border-t border-white/20 pt-5'>
              <p className='text-xs tracking-[0.2em] text-white/50'>WHERE TO WATCH</p>
              <div className='mt-3'>
                <h2 className='text-lg text-white/70'>coming soon ...</h2>
              </div>

            </div>

          </div>
        </div>


        {/* action bar */}
        <div className="mx-auto mt-8 grid w-full grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-4 backdrop-blur-md sm:mt-10 sm:grid-cols-6 sm:gap-2 sm:px-5 sm:py-5 lg:w-[90%] xl:w-[70%] xl:px-8">

          {/* WATCH */}
          <button
            className="flex w-full min-w-0 flex-col items-center justify-center gap-2 text-center text-white/60 transition duration-200 hover:text-white"
            onClick={handleWatchedMovies}
          >
            <span className="text-4xl transition-transform duration-200 hover:scale-110">
              {watched ? (
                <FaEye className="text-green-700" />
              ) : (
                <FaRegEye />
              )}
            </span>
            <span className="text-sm sm:text-base">
              {watched ? "WATCHED" : "WATCH"}
            </span>
          </button>

          {/* LIKE */}
          <button
            className="flex w-full min-w-0 flex-col items-center justify-center gap-2 text-center text-white/60 transition duration-200 hover:text-white"
            onClick={handleLikedMovies}
          >
            <span className="text-4xl transition-transform duration-200 hover:scale-110">
              {liked ? (
                <FaHeart className="text-pink-800" />
              ) : (
                <FaRegHeart />
              )}
            </span>
            <span className="text-sm sm:text-base">
              {liked ? "LIKED" : "LIKE"}
            </span>
          </button>

          {/* RATE */}
          <div className="relative flex w-full min-w-0 justify-center">
            <button
              className="flex w-full min-w-0 flex-col items-center justify-center gap-2 text-center text-white/60 transition duration-200 hover:text-white"
              onClick={() => {
                if (!isLoggedIn) {
                  navigate("/login");
                  return;
                }
                setRatingOpen(prev => !prev);
              }}
            >
              {rating > 0 ? (
                <>
                  <span className="text-4xl text-amber-400 transition-transform duration-200 hover:scale-110">
                    <FaStar />
                  </span>
                  <span className="text-sm sm:text-base">RATED</span>
                </>
              ) : (
                <>
                  <span className="text-4xl transition-transform duration-200 hover:scale-110">
                    <FaRegStar />
                  </span>
                  <span className="text-sm sm:text-base">RATE</span>
                </>
              )}
            </button>

            {/* Rating popup */}
            <div
              className={`absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 transition-all duration-300 ease-out ${ratingOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-2 scale-95 opacity-0"
                }`}
            >
              <div className="relative flex items-center gap-1 rounded-2xl border border-white/15 bg-gradient-to-br from-purple-950 via-slate-900 to-black px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.55)]">

                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="relative h-7 w-7 sm:h-9 sm:w-9">

                    <FaRegStar className="absolute inset-0 h-7 w-7 text-white/40 sm:h-9 sm:w-9" />

                    {rating >= star && (
                      <FaStar className="absolute inset-0 h-7 w-7 text-amber-400 sm:h-9 sm:w-9" />
                    )}

                    {rating === star - 0.5 && (
                      <div className="absolute inset-0 w-1/2 overflow-hidden">
                        <FaStar className="h-7 w-7 max-w-none text-amber-400 sm:h-9 sm:w-9" />
                      </div>
                    )}

                    <button
                      className="absolute left-0 top-0 h-full w-1/2"
                      onClick={() => {
                        setRating(star - 0.5);
                        handleRatings(star - 0.5);
                      }}
                    />

                    <button
                      className="absolute right-0 top-0 h-full w-1/2"
                      onClick={() => {
                        setRating(star);
                        handleRatings(star);
                      }}
                    />
                  </div>
                ))}

                <button
                  onClick={handleDeleteRating}
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-2xl font-bold leading-none text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>

                <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-t-[9px] border-l-transparent border-r-transparent border-t-slate-900" />
              </div>
            </div>
          </div>

          {/* LOG / REVIEW */}
          <button
            className="flex w-full min-w-0 flex-col items-center justify-center gap-2 text-center text-white/60 transition duration-200 hover:text-white"
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/login");
                return;
              }
              setDiaryOpen(true);
            }}
          >
            <span className="text-4xl transition-transform duration-200 hover:scale-110">
              <FaRegEdit />
            </span>
            <span className="text-sm sm:text-base">LOG / REVIEW</span>
          </button>

          {/* WATCHLIST */}
          <button
            className="flex w-full min-w-0 flex-col items-center justify-center gap-2 text-center text-white/60 transition duration-200 hover:text-white"
            onClick={handleWatchlist}
          >
            <span className="text-4xl transition-transform duration-200 hover:scale-110">
              {watchlisted ? (
                <FaClock className="text-orange-400/80" />
              ) : (
                <FaRegClock />
              )}
            </span>
            <span className="text-sm sm:text-base">
              {watchlisted ? "IN WATCHLIST" : "WATCHLIST"}
            </span>
          </button>

          {/* ADD TO LISTS */}
          <button
            className="flex w-full min-w-0 flex-col items-center justify-center gap-2 text-center text-white/60 transition duration-200 hover:text-white"
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/login");
                return;
              }
              // Add list functionality here later
            }}
          >
            <span className="text-4xl transition-transform duration-200 hover:scale-110">
              <MdPlaylistAdd />
            </span>
            <span className="text-xs sm:text-sm">ADD TO LISTS...</span>
          </button>

        </div>


        {/* cast */}
        <section className="mx-auto mt-10 max-w-7xl sm:mt-16">
          <h2 className="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl">
            Cast
          </h2>
          <div className='relative'>
            <button onClick={() => scrollCast("left")}
              className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:h-10 sm:w-10">
              <FaChevronLeft size={14} />
            </button>
            <div ref={castRef} className="flex gap-8 overflow-x-auto no-scrollbar px-12">
              {Movie.credits.cast.map((person) => (
                <div key={person.id} className="w-32 shrink-0 text-center sm:w-36">
                  <img
                    className="mx-auto h-24 w-24 rounded-full border border-white/20 object-cover shadow-lg sm:h-32 sm:w-32"
                    src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                    alt={person.name}
                  />

                  <h3 className="mt-3 text-base font-medium sm:mt-4 sm:text-lg">
                    {person.name}
                  </h3>

                  <p className="mt-1 text-xs text-white/50 sm:text-sm">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
            <button onClick={() => scrollCast("right")}
              className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xl text-white backdrop-blur-md transition hover:bg-black/80 sm:h-10 sm:w-10">
              <FaChevronRight size={14} />
            </button>
          </div>

        </section>

        {/* Crew */}
        <section className="mx-auto mt-10 max-w-7xl sm:mt-16">
          <h2 className="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl">
            Crew
          </h2>
          <div className='relative'>
            <button onClick={() => scrollCrew("left")}
              className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:h-10 sm:w-10">
              <FaChevronLeft size={14} />
            </button>

            <div ref={crewRef} className="flex gap-8 overflow-x-auto no-scrollbar px-12">
              {importantCrew.map((person) => (
                <div key={person.id} className="w-32 shrink-0 text-center sm:w-36">
                  <img
                    className="mx-auto h-24 w-24 rounded-full border border-white/20 object-cover shadow-lg sm:h-32 sm:w-32"
                    src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                    alt={person.name}
                  />

                  <h3 className="mt-3 text-base font-medium sm:mt-4 sm:text-lg">
                    {person.name}
                  </h3>

                  {person.jobs.map((job) => (
                    <p key={job} className="mt-1  text-sm text-white/50">
                      {job}
                    </p>
                  ))}

                </div>
              ))}

            </div>
            <button onClick={() => scrollCrew("right")}
              className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:h-10 sm:w-10">
              <FaChevronRight size={14} />
            </button>
          </div>

        </section>
      </main>

      {diaryOpen && (
        <DiaryEntry
          Movie={Movie}
          liked={liked}
          onClose={() => setDiaryOpen(false)}
          onSave={handleDiaryEntry}
        />
      )}

    </div>

  )
}

export default MovieDeatils
