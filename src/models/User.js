import mongoose from "mongoose";

import Habit from "./Habit";
import GroupHabit from "./GroupHabit";
import Activity from "./Activity";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, default: "", trim: true, lowercase: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: { type: String, default: "" },
    password: { type: String, default: "" },
    provider: { type: String, default: "credentials" },
    lastEmailedAt: { type: Date, default: null },

    isPaid: { type: Boolean, default: false },

    coins: { type: Number, default: 0 },

    score: { type: Number, default: 0 },

    habits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Habit" }],

    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "GroupHabit" }],

    tasks: [
      {
        type: { type: String, default: "" },
        at: { type: String, default: "" },
      },
    ],

    achievements: [
      {
        key: { type: String, default: "" },
        date: { type: Date, default: Date.now },
      },
    ],

    garden: {
      flowers: [
        {
          i: String,
          name: String,
          level: Number,
        },
      ],
    },

    activities: [
      {
        body: { type: String, default: "" },
      },
    ],

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
