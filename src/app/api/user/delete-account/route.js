import connectToDb from "@/config/db";
import User from "@/models/User";

import GroupHabit from "@/models/GroupHabit";
import Habit from "@/models/Habit";

import { authUser } from "@/lib/helpers";

export const DELETE = async () => {
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

  await Habit.deleteMany({ user: user._id });
  await GroupHabit.deleteMany({ user: user._id });

  await User.findByIdAndDelete(user._id);

  return Response.json({
    message: "حساب کاربری با موفقیت حذف شد !",
  });
};
