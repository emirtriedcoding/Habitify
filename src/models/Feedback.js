import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: String, rqeuired: true },
  },
  {
    timestamps: true,
  },
);

const Feedback =
  mongoose.models?.Feedback || mongoose.model("Feedback", feedbackSchema);

export default Feedback;
