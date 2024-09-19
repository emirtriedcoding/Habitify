import connectToDb from "@/config/db";
import Habit from "@/models/Habit";

import { authUser } from "@/lib/helpers";
import { isValidObjectId } from "mongoose";

export const GET = async (req, { params }) => {
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

  connectToDb();

  const habit = await Habit.findById(habitId);

  if (!habit) {
    return Response.json(
      {
        message: "عادت مورد نظر یافت نشد !",
      },
      {
        status: 404,
      },
    );
  }

  if (habit.user.toString() !== user._id.toString()) {
    return Response.json(
      {
        message: "این عادت متعلق به شما نیست !",
      },
      {
        status: 403,
      },
    );
  }

  return Response.json(habit);
};

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

  connectToDb();

  const habit = await Habit.findById(habitId);

  if (!habit) {
    return Response.json(
      {
        message: "عادت مورد نظر یافت نشد !",
      },
      {
        status: 404,
      },
    );
  }

  if (habit.user.toString() !== user._id.toString()) {
    return Response.json(
      {
        message: "این عادت متعلق به شما نیست !",
      },
      {
        status: 403,
      },
    );
  }

  await Habit.findByIdAndDelete(habitId);

  return Response.json({
    message: "عادت با موفقیت حذف شد !",
  });
};
