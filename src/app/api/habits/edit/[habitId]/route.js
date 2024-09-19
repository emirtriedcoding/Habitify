import connectToDb from "@/config/db";
import Habit from "@/models/Habit";

import { authUser } from "@/lib/helpers";
import { habitSchema } from "@/lib/schemas";
import { z } from "zod";

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

  try {
    const { habitId } = params;

    const {
      name,
      description,
      type,
      days,
      frequency,
      color,
    } = habitSchema.parse(await req.json());

    connectToDb();

    const habit = await Habit.findById(habitId);

    if (!habit) {
      return Response.json(
        {
          message: "عادتی یافت نشد !",
        },
        {
          status: 404,
        },
      );
    }

    if (habit.user.toString() !== user._id.toString()) {
      return Response.json(
        {
          message: "شما مجاز به ویرایش این عادت نیستید !",
        },
        {
          status: 403,
        },
      );
    }

    await Habit.findByIdAndUpdate(habitId, {
      name,
      description,
      type,
      days,
      frequency,
      icon,
      color,
      notifications,
    });

    return Response.json({ message: "عادت با موفقیت آپدیت شد !" });
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
