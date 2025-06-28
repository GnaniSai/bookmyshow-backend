import express from "express";
import movieModel from "../models/movieSchema.js";
import showModel from "../models/showSchema.js";
import theatreModel from "../models/theatreSchema.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.use(authenticateToken, requireAdmin);

adminRouter.get("/admin", (req, res) => {
  res.send("Welcome to BookMyShow Admin Panel");
});

adminRouter.post("/addMovie", async (req, res) => {
  try {
    const newMovie = new movieModel(req.body);
    const savedMovie = await newMovie.save();
    res
      .status(201)
      .json({ message: "Movie added successfully", data: savedMovie });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding movie", error: error.message });
  }
});

adminRouter.get("/movies", async (req, res) => {
  try {
    const allMovies = await movieModel.find().populate("shows");
    res.status(200).json(allMovies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching movies", error: error.message });
  }
});

adminRouter.put("/movie/:id", async (req, res) => {
  try {
    const updatedMovie = await movieModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie updated", data: updatedMovie });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating movie", error: error.message });
  }
});

adminRouter.delete("/movie/:id", async (req, res) => {
  try {
    const deletedMovie = await movieModel.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting movie", error: error.message });
  }
});

adminRouter.post("/addTheatre", async (req, res) => {
  try {
    const newTheatre = new theatreModel(req.body);
    const savedTheatre = await newTheatre.save();
    res.status(201).json({ message: "Theatre added", data: savedTheatre });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding theatre", error: error.message });
  }
});

adminRouter.get("/theatres", async (req, res) => {
  try {
    const theatres = await theatreModel.find();
    res.status(200).json(theatres);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching theatres", error: error.message });
  }
});

adminRouter.put("/theatre/:id", async (req, res) => {
  try {
    const updated = await theatreModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated) return res.status(404).json({ message: "Theatre not found" });
    res.status(200).json({ message: "Theatre updated", data: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating theatre", error: error.message });
  }
});

adminRouter.delete("/theatre/:id", async (req, res) => {
  try {
    const deleted = await theatreModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Theatre not found" });
    res.status(200).json({ message: "Theatre deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting theatre", error: error.message });
  }
});

adminRouter.post("/addShow", async (req, res) => {
  try {
    const { movie, theatre, showDate, showTime, availableSeats, seatPrice } = req.body;

    const newShow = new showModel({
      movie,
      theatre,
      showDate,
      showTime,
      availableSeats,
      seatPrice: seatPrice || 200,
    });

    const savedShow = await newShow.save();

    await movieModel.findByIdAndUpdate(movie, {
      $push: { shows: savedShow._id },
    });

    res.status(201).json({ message: "Show added", data: savedShow });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding show", error: error.message });
  }
});

adminRouter.get("/shows", async (req, res) => {
  try {
    const shows = await showModel.find().populate("movie theatre");
    res.status(200).json(shows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shows", error: error.message });
  }
});

adminRouter.put("/show/:id", async (req, res) => {
  try {
    const updatedShow = await showModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedShow)
      return res.status(404).json({ message: "Show not found" });
    res.status(200).json({ message: "Show updated", data: updatedShow });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating show", error: error.message });
  }
});

adminRouter.delete("/show/:id", async (req, res) => {
  try {
    const deletedShow = await showModel.findByIdAndDelete(req.params.id);
    if (!deletedShow)
      return res.status(404).json({ message: "Show not found" });
    await movieModel.findByIdAndUpdate(deletedShow.movie, {
      $pull: { shows: deletedShow._id },
    });

    res.status(200).json({ message: "Show deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting show", error: error.message });
  }
});

export default adminRouter;
