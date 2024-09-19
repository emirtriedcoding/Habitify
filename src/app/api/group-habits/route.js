import connectToDb from "@/config/db";
import GroupHabit from "@/models/GroupHabit";

import { authUser } from "@/lib/helpers";

export const GET = async () => {
  const user = await authUser();

  if (!user) {
    return Response.json(
      {
        message: "لطفا ابتدا وارد شوید !",
      },
      {
        status: 401,
      },
    );
  }

  connectToDb();

  const habits = await GroupHabit.find({ members: user._id })
    .populate("user")
    .populate("members")
    .populate({
      path: "completions.user",
    });

  return Response.json(habits);
};
