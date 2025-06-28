import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Show",
            required: true,
        },
        seats: [{
            type: String,
            required: true,
        }],
        totalAmount: {
            type: Number,
            required: true,
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["confirmed", "cancelled", "pending"],
            default: "confirmed",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema); 