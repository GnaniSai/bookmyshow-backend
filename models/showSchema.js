import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },
    showDate: {
      type: Date,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    bookedSeats: [{
      type: String,
    }],
    seatPrice: {
      type: Number,
      required: true,
      default: 200,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Show", showSchema);
