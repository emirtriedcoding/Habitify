import connectToDb from "@/config/db";
import GroupHabit from "@/models/GroupHabit";

import { authUser } from "@/lib/helpers";

export const PUT = async (req, { params }) => {
  const { habitId } = params;

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

  const habit = await GroupHabit.findByIdAndUpdate(habitId, {
    $pull: { members: user._id },
  });

  habit.completions = habit.completions.filter((completion) => {
    return completion.user.toString() !== user._id.toString();
  });

  await habit.save();

  return Response.json({
    message: "با موفقیت از گروه خارج شدید !",
  });
};
