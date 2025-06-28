import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    totalSeats: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Theatre", theatreSchema);
