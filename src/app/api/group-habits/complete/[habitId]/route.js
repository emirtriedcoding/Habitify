import connectToDb from "@/config/db";
import GroupHabit from "@/models/GroupHabit";

import { authUser, checkTrialStatus } from "@/lib/helpers";

export const PUT = async (req, { params }) => {
  const user = await authUser();

  if (!user) {
    return Response.json(
      {
        message: "لطفا ابتدا وارد شوید !",
      },
      {
        status: 400,
      },
    );
  }

  const trialStatus = checkTrialStatus(user.createdAt, user.isPaid);

  if (!trialStatus.valid) {
    return Response.json(
      {
        message: trialStatus.message,
      },
      {
        status: 403,
      },
    );
  }

  const { habitId } = params;

  connectToDb();

  const habit = await GroupHabit.findById(habitId);

  if (!habit) {
    return Response.json(
      {
        message: "هیبتی با این آی دی وجود ندارد !",
      },
      {
        status: 404,
      },
    );
  }

  const d = new Date().toISOString().split("T")[0];

  if (
    !habit.completions.some(
      (completion) =>
        new Date(completion.at).toISOString().split("T")[0] === d &&
        completion.user.toString() === user._id.toString(),
    )
  ) {
    habit.completions.push({ user: user._id });
    await habit.save();
    return Response.json({
      message: "عادت تکمیل شد",
    });
  }

  return Response.json(
    {
      message: "این عادت قبلا تکمیل شده !",
    },
    {
      status: 400,
    },
  );
};
