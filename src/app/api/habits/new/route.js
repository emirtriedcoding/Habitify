import connectToDb from "@/config/db";
import Habit from "@/models/Habit";

import { authUser, checkTrialStatus } from "@/lib/helpers";
import { habitSchema } from "@/lib/schemas";

import { z } from "zod";

export const POST = async (req) => {
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

  try {
    const { name, description, type, days, frequency, color } =
      habitSchema.parse(await req.json());

    connectToDb();

    const newHabit = await Habit.create({
      name,
      description,
      type,
      days,
      frequency,
      color,
      user: user._id,
    });

    user.habits.push(newHabit._id);
    await user.save();

    return Response.json(
      {
        message: "عادت با موفقیت اضافه شد !",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          message: error.errors[0].message,
        },
        {
          status: 400,
        },
      );
    } else {
      console.log("Error while registering user => ", error);
      return Response.json(
        {
          message: "خطای سرور !",
        },
        {
          status: 500,
        },
      );
    }
  }
};
