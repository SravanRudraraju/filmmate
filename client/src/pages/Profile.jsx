import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import MovieCard from "../components/MovieCard"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MoviePicker from '../components/MoviePicker';


const Profile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState([])
  const [favourites, setFavourites] = useState([])
  const [recentMovies, setRecentMovies] = useState([])

  // for edit profile
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [showEditProfile, setShowEditProfile] = useState(false)

  const [selectedImage, setSelectedImage] = useState(null)

  const [favouriteMovies, setFavouriteMovies] = useState(
    Array(5).fill(null)
  );
  const [activeFavouriteSlot, setActiveFavouriteSlot] = useState(null);

  const handleEditProfile = () => {
    setName(profile.name || "")
    setBio(profile.bio || "")
    setLocation(profile.location || "")
    setProfileImage(profile.profile_image || "")

    const slots = Array(5).fill(null);

    favourites.forEach((movie) => {
      const position = movie.position - 1;

      if (position >= 0 && position < 5) {
        slots[position] = {
          id: movie.tmdb_movie_id,
          tmdb_movie_id: movie.tmdb_movie_id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
        };
      }
    });
    setFavouriteMovies(slots);
    setActiveFavouriteSlot(null);
    setShowEditProfile(true)
  }



  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token")


    try {
      const imageUrl = selectedImage ? await uploadImage() : profileImage
      if (selectedImage && !imageUrl) {
        alert("Image upload failed. Please try again.");
        return;
      }
      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name, bio, location, profile_image: imageUrl
        })
      })
      const profileData = await profileResponse.json()
      if (!profileResponse.ok) {
        alert(profileData.message || "Failed to update profile.")
        return
      }
      setProfile({
        ...profile,
        name, bio, location, profile_image: imageUrl
      })
      const moviesToSave = favouriteMovies.flatMap(
        (movie, index) =>
          movie
            ? [{
              tmdb_movie_id: movie.id ?? movie.tmdb_movie_id,
              position: index + 1,
            }] : []
      )
      const favouritesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/favourites`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            movies: moviesToSave,
          })
        }
      )
      const favouritesData = await favouritesResponse.json()
      if (!favouritesResponse.ok) {
        alert(
          favouritesData.message ||
          "Profile updated, but favourite films could not be saved."
        )
        return
      }
      setFavourites(
        favouriteMovies.flatMap((movie, index) =>
          movie
            ? [{
              tmdb_movie_id: movie.id ?? movie.tmdb_movie_id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              position: index + 1,
            }]
            : []
        )
      )
      setShowEditProfile(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Something went wrong. Please try again.");
    }
  }


  const handleFavouriteSelect = (movie) => {
    const movieId = movie.id ?? movie.tmdb_movie_id;

    const alreadySelected = favouriteMovies.some(
      (item, index) =>
        index !== activeFavouriteSlot &&
        (item?.id ?? item?.tmdb_movie_id) === movieId
    );

    if (alreadySelected) {
      alert("This movie is already selected in another slot.");
      return;
    }

    setFavouriteMovies((current) =>
      current.map((item, index) =>
        index === activeFavouriteSlot
          ? { ...movie, id: movieId, tmdb_movie_id: movieId }
          : item
      )
    );

    setActiveFavouriteSlot(null);
  };

  const uploadImage = async () => {
    if (!selectedImage) return null
    try {

      const formData = new FormData()
      formData.append("file", selectedImage)
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData
        }
      )
      const data = await response.json()

      if (!response.ok) {
        return null
      }
      return data.secure_url
    } catch (error) {
      console.error("Image upload error:", error)
      return null
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {


        const token = localStorage.getItem("token")
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          setProfile(data.profile_data)
          setFavourites(data.favourite_movies)
          setRecentMovies(data.recent_movies)
        }
        else {
          alert(data.message || "Failed to load profile")
        }
      }
      catch (error) {
        console.error("Failed to fetch profile:", error)
        alert("Unable to load your profile. Please try again.")
      }
    }
    fetchProfile()
  }, [])
  return (


    <div className="min-h-screen overflow-x-hidden bg-[#151922] px-4 pb-16 pt-6 text-[#ece8df] sm:px-6 sm:pb-20 sm:pt-8 lg:px-8">
      <div className="mx-auto w-full max-w-[1100px] min-w-0">

        <header className="flex flex-col gap-5 border-b border-[#2b3140] pb-7 sm:gap-7 sm:pb-9 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-4 sm:gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#1d222d] ring-1 ring-[#353b4a] ring-offset-4 ring-offset-[#151922] sm:h-28 sm:w-28">
              {profile.profile_image && (
                <img
                  src={profile.profile_image}
                  alt={`${profile.name}'s avatar`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 pt-1">
              <h1 className="break-words font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                {profile.name}
              </h1>

              <p className="mt-1.5 text-sm text-[#a2a7b4]">
                @{profile.username}
              </p>
              {profile.location && (
                <div className="mt-3 flex items-center gap-1.5 text-sm text-[#a2a7b4]">

                  <span>📍 {profile.location}</span>
                </div>
              )}

              {profile.bio && (
                <p className="mt-3 max-w-xl break-words text-sm leading-6 text-[#ece8df]/85 sm:mt-4 sm:text-[15px] sm:leading-7">
                  {profile.bio}
                </p>
              )}


            </div>
          </div>

          <button onClick={handleEditProfile}
            className="self-start rounded-full border border-[#363c4b] px-4 py-2 text-sm font-medium text-[#ece8df]/85 transition duration-200 hover:border-[#e9b44c] hover:bg-[#e9b44c]/5 hover:text-[#e9b44c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9b44c] sm:px-5"
          >
            Edit profile
          </button>
        </header>

        <section className="mt-8 sm:mt-11">
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <span className="h-5 w-1 rounded-full bg-[#e9b44c]" />

            <h2 className="font-display text-xl font-medium text-white sm:text-2xl">
              Favourite films
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-6">
            {favourites.map((movie) => (
              <MovieCard
                key={movie.tmdb_movie_id}
                movie={{
                  id: movie.tmdb_movie_id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  release_date: movie.release_date,
                }}
                className="w-[105px] xs:w-[120px] sm:w-[160px]"
                showMeta={false}
              />
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#2b3140] pb-3">
            <h2 className="font-display text-lg font-medium text-white sm:text-xl">
              Recently watched
            </h2>

            <button
              onClick={() => navigate("/diary")}
              className="shrink-0 text-xs font-medium text-[#a2a7b4] transition duration-200 hover:text-[#e9b44c] sm:text-sm"
            >
              Open diary →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-x-2 gap-y-5 min-[420px]:grid-cols-4 sm:gap-x-3 sm:gap-y-7 md:grid-cols-6 lg:grid-cols-8">
            {recentMovies.map((movie) => (
              <MovieCard
                key={movie.tmdb_movie_id}
                movie={movie}
                className="w-full"
              />
            ))}
          </div>
        </section>

      </div>


      {showEditProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#0b0e14]/85 p-2 backdrop-blur-md sm:p-4 md:p-6 lg:p-8">
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-start justify-center py-2 sm:items-center sm:py-0">
            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#3a4151] bg-[#151922] shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:rounded-2xl">

              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-[#343a49] px-4 py-4 sm:px-8 sm:py-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e9b44c]">
                    CineMate
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-white sm:text-3xl">
                    Edit profile
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  aria-label="Close edit profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#454c5d] text-2xl text-[#d1d5df] transition hover:border-[#e9b44c] hover:bg-[#252b38] hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Form content */}
              <div className="space-y-7 p-4 sm:space-y-9 sm:p-8">

                {/* Profile picture */}
                <section>
                  <label className="mb-4 block text-lg font-semibold text-white">
                    Profile picture
                  </label>

                  <div className="flex flex-col gap-4 rounded-xl border border-[#343a49] bg-[#1b202b] p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                    <label className="group relative flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#454c5d] bg-[#252b38] transition hover:border-[#e9b44c]">
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : profileImage ? (
                        <img
                          src={profileImage}
                          alt="Current profile picture"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-display text-4xl font-semibold text-[#e9b44c]">
                          {(name || profile.username || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}

                      <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition group-hover:opacity-100">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-7 w-7 text-white"
                          aria-hidden="true"
                        >
                          <path d="M14 4h-4L8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2-3Z" />
                          <circle cx="12" cy="13" r="3.5" />
                        </svg>
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) =>
                          setSelectedImage(e.target.files?.[0] || null)
                        }
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-white">
                        {selectedImage ? "Photo selected" : "Choose your profile photo"}
                      </p>

                      <p className="mt-1 text-sm text-[#b5bac7]">
                        {selectedImage
                          ? selectedImage.name
                          : ""}
                      </p>

                      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#555d6f] px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#e9b44c] hover:bg-[#252b38]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M12 16V4m-4 4 4-4 4 4" />
                          <path d="M5 14v5h14v-5" />
                        </svg>
                        {selectedImage ? "Choose another photo" : "Upload photo"}
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            setSelectedImage(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>
                  </div>
                </section>

                {/* Personal information */}
                <section>


                  <div className="grid min-w-0 gap-4 sm:gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-lg font-semibold text-[#ece8df]">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-lg border border-[#454c5d] bg-[#1b202b] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-[#9299a8] focus:border-[#e9b44c] focus:ring-1 focus:ring-[#e9b44c]/30"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-lg font-semibold text-[#ece8df]">
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, country"
                        className="w-full rounded-lg border border-[#454c5d] bg-[#1b202b] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-[#9299a8] focus:border-[#e9b44c] focus:ring-1 focus:ring-[#e9b44c]/30"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-lg font-semibold text-[#ece8df]">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder="A little about you..."
                        className="w-full resize-y rounded-lg border border-[#454c5d] bg-[#1b202b] px-4 py-3.5 text-base leading-6 text-white outline-none transition placeholder:text-[#9299a8] focus:border-[#e9b44c] focus:ring-1 focus:ring-[#e9b44c]/30"
                      />
                    </div>
                  </div>
                </section>

                {/* Favourite films */}
                <section>
                  <div className="mb-5 border-b border-[#343a49] pb-3">
                    <h3 className="text-lg font-semibold text-white">
                      Favourite films
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
                    {favouriteMovies.map((movie, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveFavouriteSlot(index)}
                        aria-label={
                          movie
                            ? `Replace ${movie.title}`
                            : "Choose a favourite film"
                        }
                        className={`group min-w-0 overflow-hidden rounded-xl border text-left transition ${activeFavouriteSlot === index
                          ? "border-[#e9b44c] ring-2 ring-[#e9b44c]/30"
                          : "border-[#343a49] hover:border-[#e9b44c]"
                          }`}
                      >
                        <div className="relative aspect-[2/3] overflow-hidden bg-[#202633]">
                          {movie?.poster_path ? (
                            <img
                              src={
                                movie.poster_path.startsWith("http")
                                  ? movie.poster_path
                                  : `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                              }
                              alt={movie.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#e9b44c]">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-8 w-8"
                                aria-hidden="true"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                              <span className="text-sm font-medium text-[#d1d5df]">
                                Add film
                              </span>
                            </div>
                          )}

                          {movie && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-12">
                              <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                                {movie.title}
                              </p>
                              <p className="mt-1 text-xs text-[#d1d5df]">
                                {movie.release_date?.slice(0, 4) || "Year unknown"}
                              </p>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {activeFavouriteSlot !== null && (
                    <div className="mt-5 min-w-0 rounded-xl border border-[#343a49] bg-[#1b202b] p-3 sm:p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white">
                          Select a film to change
                        </h4>

                        <button
                          type="button"
                          onClick={() => setActiveFavouriteSlot(null)}
                          className="text-sm font-medium text-[#d1d5df] transition hover:text-[#e9b44c]"
                        >
                          Close
                        </button>
                      </div>

                      <MoviePicker onSelect={handleFavouriteSelect} onClose={() => setActiveFavouriteSlot(null)} />
                    </div>
                  )}
                </section>
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#343a49] bg-[#1b202b] px-4 py-4 sm:flex-nowrap sm:gap-3 sm:px-8 sm:py-5">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="rounded-full px-4 py-3 text-sm font-semibold text-[#d1d5df] transition hover:bg-white/5 hover:text-white sm:px-5"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="rounded-full bg-[#e9b44c] px-5 py-3 text-sm font-bold text-[#151922] shadow-md shadow-[#e9b44c]/10 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#f5c96b] hover:shadow-lg hover:shadow-[#e9b44c]/20 active:translate-y-0 active:scale-[0.97] active:bg-[#d9a53c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9b44c] disabled:pointer-events-none disabled:opacity-50 sm:px-7"
                >
                  Save changes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div >
  )
}

export default Profile
