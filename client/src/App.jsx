import React, { useState } from 'react'
import Home from './pages/Home'
import { Routes, Route, useNavigate } from "react-router-dom"
import Profile from './pages/Profile'
import MovieDeatils from './pages/MovieDeatils'
import Watchlist from './pages/Watchlist'
import Diary from './pages/Diary'
import Search from './pages/Search'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Watched from './pages/Watched'
import LikedMovies from './pages/LikedMovies'
import DiaryEntry from './components/DiaryEntry'
import MoviePicker from './components/MoviePicker'


const App = () => {
  const [showMoviePicker, setShowMoviePicker] = useState(false)
  const [showDiary, setShowDiary] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState()
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate()

  const [diaryRefresh, setDiaryRefresh] = useState(0);


  const handleDiarySave = async (watchedDate, rating, liked, review) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!selectedMovie) {
      alert("Please select a movie.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/movies/${selectedMovie.id}/diary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            watched_on: watchedDate,
            rating: rating > 0 ? rating : null,
            liked: liked,
            review: review,
          }),
        }
      );

      if (response.ok) {
        setDiaryRefresh((prev) => prev + 1);
        setShowDiary(false);
        setSelectedMovie(null);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to save diary entry.");
      }
    } catch (error) {
      console.error("Failed to save diary entry:", error);
      alert("Something went wrong. Please try again.");
    }
  };



  const handleLogFilm = () => {
    setShowMoviePicker(true)
  }
  return (
    <div className="relative min-h-screen bg-[#08090D]">
      <Navbar onLogFilm={handleLogFilm} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/moviedetails/:id" element={<MovieDeatils />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/diary" element={<Diary refreshTrigger ={diaryRefresh}/>} />
        <Route path="/watched" element={<Watched />} />
        <Route path="/liked/movies" element={<LikedMovies />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      {showMoviePicker && (
        <MoviePicker
          onSelect={(movie) => {
            setSelectedMovie(movie)
            setShowMoviePicker(false)
            setShowDiary(true)
          }}
          onClose={()=>setShowMoviePicker(false)} />
      )}
      {showDiary && (
        <DiaryEntry Movie={selectedMovie} onClose={() => setShowDiary(false)} onSave={handleDiarySave} />
      )
      }
    </div>
  )
}

export default App
