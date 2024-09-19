import mongoose from "mongoose";

import User from "./User";

const activitySchema = new mongoose.Schema(
  {
    body: { type: String, required: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

const Activity =
  mongoose.models?.Activity || mongoose.model("Activity", activitySchema);

export default Activity;
