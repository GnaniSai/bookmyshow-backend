import express from "express";
import showModel from "../models/showSchema.js";

const movieRouter = express.Router();

movieRouter.get("/movies-by-city", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "City query parameter is required" });
  }

  try {
    const showsInCity = await showModel
      .find()
      .populate({
        path: "theatre",
        match: { city: new RegExp(`^${city}$`, "i") },
        select: "name address city"
      })
      .populate({
        path: "movie",
        select: "moviename duration rating"
      });


    const filteredShows = showsInCity.filter(show => show.theatre !== null);

    const movieMap = {};

    filteredShows.forEach(show => {
      const movie = show.movie;
      const theatre = show.theatre;

      if (!movieMap[movie._id]) {
        movieMap[movie._id] = {
          _id: movie._id,
          moviename: movie.moviename,
          duration: movie.duration,
          rating: movie.rating,
          theatres: []
        };
      }

      const alreadyExists = movieMap[movie._id].theatres.some(
        t => t._id.toString() === theatre._id.toString()
      );

      if (!alreadyExists) {
        movieMap[movie._id].theatres.push({
          _id: theatre._id,
          name: theatre.name,
          address: theatre.address,
          city: theatre.city
        });
      }
    });

    const moviesWithTheatres = Object.values(movieMap);

    res.status(200).json({
      city,
      movies: moviesWithTheatres
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching movies", error: error.message });
  }
});

movieRouter.get("/theatre/:theatreId/shows", async (req, res) => {
  const { theatreId } = req.params;

  try {
    const shows = await showModel
      .find({ theatre: theatreId })
      .populate({
        path: "movie",
        select: "moviename duration rating"
      })
      .populate({
        path: "theatre",
        select: "name address city totalSeats"
      })
      .sort({ showDate: 1, showTime: 1 });

    const movieShows = {};

    shows.forEach(show => {
      const movieId = show.movie._id.toString();

      if (!movieShows[movieId]) {
        movieShows[movieId] = {
          movie: {
            _id: show.movie._id,
            moviename: show.movie.moviename,
            duration: show.movie.duration,
            rating: show.movie.rating
          },
          theatre: {
            _id: show.theatre._id,
            name: show.theatre.name,
            address: show.theatre.address,
            city: show.theatre.city,
            totalSeats: show.theatre.totalSeats
          },
          shows: []
        };
      }

      movieShows[movieId].shows.push({
        _id: show._id,
        showDate: show.showDate,
        showTime: show.showTime,
        availableSeats: show.availableSeats,
        bookedSeats: show.bookedSeats || [],
        seatPrice: show.seatPrice,
        totalSeats: show.theatre.totalSeats,
        bookedSeatsCount: (show.bookedSeats || []).length
      });
    });

    const result = Object.values(movieShows);

    res.status(200).json({
      theatreId,
      movies: result
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shows", error: error.message });
  }
});

export default movieRouter;
