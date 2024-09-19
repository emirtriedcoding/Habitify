import mongoose from "mongoose";

import User from "./User";

const groupHabitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },

    inviteLink: { type: String, default: "" },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    completions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const GroupHabit =
  mongoose.models?.GroupHabit || mongoose.model("GroupHabit", groupHabitSchema);

export default GroupHabit;
