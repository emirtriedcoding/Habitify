import mongoose from "mongoose";

import User from "./User";

const habitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["daily", "weekly"], default: "daily" },
    days: [
      {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6],
        default: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    frequency: { type: Number, max: 6, default: 1 },
    color: { type: String, default: "#000" },

    records: [{ date: String, count: { type: Number, default: 5 } }],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

const Habit = mongoose.models?.Habit || mongoose.model("Habit", habitSchema);

export default Habit;
