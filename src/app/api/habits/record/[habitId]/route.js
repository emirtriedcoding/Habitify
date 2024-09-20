import connectToDb from "@/config/db";
import Habit from "@/models/Habit";

import { authUser, checkTrialStatus, formattedDate } from "@/lib/helpers";
import { isValidObjectId } from "mongoose";

export const PUT = async (req, { params }) => {
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

  if (!isValidObjectId(habitId)) {
    return Response.json(
      {
        message: "درخواست نامعتبر !",
      },
      {
        status: 400,
      },
    );
  }

  const trialStatus = checkTrialStatus(user.createdAt, user.isPaid);

  if (!trialStatus.valid) {
    return Response.json({
      message: trialStatus.message,
    }, {
      status: 403,
    });
  }

  connectToDb();

  const habit = await Habit.findById(habitId);

  if (!habit) {
    return Response.json(
      {
        message: "عادت موردنظر یافت نشد !",
      },
      {
        status: 404,
      },
    );
  }

  if (habit.user.toString() !== user._id.toString()) {
    return Response.json(
      {
        message: "غیر مجاز !",
      },
      {
        status: 403,
      },
    );
  }

  const date = formattedDate();

  if (habit.records.some((record) => record.date === date)) {
    habit.records = habit.records.filter((record) => record.date !== date);
    await habit.save();
    return Response.json({
      message: "عادت از حالت تکمیلی درومد !",
    });
  } else {
    habit.records.push({ date, count: 10 });
    await habit.save();

    user.activities.push({
      body : `عادت ${habit.name} توسط ${user.name} تکمیل شد !`
    });
    
    await user.save();

    return Response.json(
      {
        message: "عادت تکمیل شد !",
      },
      {
        status: 201,
      },
    );
  }
};
