import React from 'react'
import { useSearchParams } from "react-router-dom";
import { useEffect,useState } from 'react';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [searchResults , setSearchResults] = useState([])
  const [searchParams] = useSearchParams(); 
  const query = searchParams.get("query");

  useEffect(()=>{
    const fetchMovies = async () =>{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/search?query=${query}`)

      const data = await response.json()
      
      setSearchResults(data.results);
    }
    if(query){
      fetchMovies()
    }
  },[query])
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {searchResults.map((movie)=>(
        <MovieCard  key ={movie.id} movie = {movie} />
      ))}
      </div>
      
    </div>
  )
}

export default Search
