import express from "express";
import bookingModel from "../models/bookingSchema.js";
import showModel from "../models/showSchema.js";
import userModel from "../models/userSchema.js";
import { authenticateToken } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.get("/show/:showId/seats", async (req, res) => {
    try {
        const { showId } = req.params;

        const show = await showModel.findById(showId).populate("theatre");
        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        const totalSeats = show.theatre.totalSeats;
        const bookedSeats = show.bookedSeats || [];

        const allSeats = [];
        const rows = Math.ceil(totalSeats / 10);

        for (let i = 0; i < rows; i++) {
            const rowLetter = String.fromCharCode(65 + i);
            for (let j = 1; j <= 10; j++) {
                const seatNumber = `${rowLetter}${j}`;
                if (allSeats.length < totalSeats) {
                    allSeats.push(seatNumber);
                }
            }
        }

        const availableSeats = allSeats.filter(seat => !bookedSeats.includes(seat));

        res.status(200).json({
            showId,
            totalSeats,
            bookedSeats,
            availableSeats,
            seatPrice: show.seatPrice,
            availableSeatsCount: show.availableSeats
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching seats", error: error.message });
    }
});

bookingRouter.post("/book", authenticateToken, async (req, res) => {
    try {
        const { showId, seats } = req.body;
        const userId = req.user._id;

        if (!seats || seats.length === 0) {
            return res.status(400).json({ message: "Please select at least one seat" });
        }

        const show = await showModel.findOneAndUpdate(
            {
                _id: showId,
                bookedSeats: { $nin: seats },
                availableSeats: { $gte: seats.length }
            },
            {
                $push: { bookedSeats: { $each: seats } },
                $inc: { availableSeats: -seats.length }
            },
            { new: true }
        );

        if (!show) {
            return res.status(400).json({
                message: "Some seats are already booked, show not found, or insufficient seats available",
                error: "Seats unavailable"
            });
        }

        const totalAmount = seats.length * show.seatPrice;

        const newBooking = new bookingModel({
            user: userId,
            show: showId,
            seats: seats,
            totalAmount,
        });

        const savedBooking = await newBooking.save();

        await userModel.findByIdAndUpdate(
            userId,
            { $push: { bookings: { show: showId, seats: seats } } }
        );

        const populatedBooking = await bookingModel
            .findById(savedBooking._id)
            .populate("show")
            .populate("user", "name email");

        res.status(201).json({
            message: "Booking successful",
            booking: populatedBooking,
        });
    } catch (error) {
        res.status(500).json({ message: "Error booking tickets", error: error.message });
    }
});

bookingRouter.get("/my-bookings", authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const bookings = await bookingModel
            .find({ user: userId })
            .populate({
                path: "show",
                populate: [
                    { path: "movie", select: "moviename duration rating" },
                    { path: "theatre", select: "name address city" }
                ]
            })
            .sort({ bookingDate: -1 });

        res.status(200).json({
            bookings,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
});

export default bookingRouter; 