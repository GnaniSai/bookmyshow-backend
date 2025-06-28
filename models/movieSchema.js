import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    moviename: { type: String, required: true },
    duration: { type: String, required: true },
    rating: { type: String },
    shows: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
