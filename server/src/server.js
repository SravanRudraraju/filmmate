import express from "express"
import "dotenv/config";
import { getMovieById, getTrendingMovies, searchMovie } from "./services/tmdbService.js";
import cors from "cors";
import pool from "./db.js";
import authRoutes from "./routes/authRoutes.js"
import movieRoutes from "./routes/movieRoutes.js"
import diaryRoutes from "./routes/diaryRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors());

app.use("/api/profile", profileRoutes)
app.use("/api", collectionRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/movies", movieRoutes)
app.use("/api/diary", diaryRoutes)



app.get("/api/movies/trending", async (req, res) => {
  try {
    const data = await getTrendingMovies()
    res.json(data)
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch trending movies" })
  }
})
app.get("/api/movies/search", async (req, res) => {
  const { query } = req.query
  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({
      message: "Search query is required."
    });
  }

  try {
    const data = await searchMovie(query)
    res.json(data)
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to search movie" })
  }
})


app.get("/api/movies/picker-search", async (req, res) => {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.json({ results: [] });
  }

  try {
    const data = await searchMovie(query);
    const movies = data.results.slice(0, 5);

    const results = await Promise.all(
      movies.map(async (movie) => {
        const details = await getMovieById(movie.id);

        const director = details.credits?.crew?.find(
          (member) => member.job === "Director"
        );

        return {
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          director: director?.name || ""
        };
      })
    );

    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to search movies for picker"
    });
  }
});




app.get("/api/movies/:id", async (req, res) => {
  const { id } = req.params
  try {
    const data = await getMovieById(id)
    res.json(data)
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch movie" })
  }
})


app.listen(port, () => {
  console.log(`listening to port ${port}`)
})