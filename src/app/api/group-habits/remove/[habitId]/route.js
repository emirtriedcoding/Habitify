import connectToDb from "@/config/db";
import GroupHabit from "@/models/GroupHabit";

import { authUser } from "@/lib/helpers";

export const DELETE = async (req, { params }) => {
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

  const { habitId } = params;

  connectToDb();

  const habit = await GroupHabit.findById(habitId);

  if (!habit) {
    return Response.json(
      {
        message: "ورزش مورد نظر یافت نشد",
      },
      {
        status: 404,
      },
    );
  }

  if (habit.user.toString() !== user._id.toString()) {
    return Response.json(
      {
        message: "شما مجاز به حذف این عادت نیستید",
      },
      {
        status: 403,
      },
    );
  }

  user.groups.pull(habit._id);

  await user.save();

  await GroupHabit.findByIdAndDelete(habitId);

  return Response.json({
    message: "ورزش مورد نظر با موفقیت حذف شد",
  });
};
