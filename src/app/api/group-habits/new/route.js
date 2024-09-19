import connectToDb from "@/config/db";
import GroupHabit from "@/models/GroupHabit";

import { groupHabitSchema } from "@/lib/schemas";
import { z } from "zod";

import { sign } from "jsonwebtoken";
import { authUser, checkTrialStatus } from "@/lib/helpers";

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
    const { name, description } = groupHabitSchema.parse(await req.json());

    connectToDb();

    const newGroupHabit = await GroupHabit.create({
      name,
      description,
      user: user._id,
    });

    const inviteLink = sign({ _id: newGroupHabit._id }, process.env.JWT_SECRET);

    newGroupHabit.inviteLink = inviteLink;
    newGroupHabit.members.push(user._id);

    await newGroupHabit.save();

    user.groups.push(newGroupHabit._id);
    await user.save();

    return Response.json({
      message: "عادت گروهی با موفقیت ساخته شد !",
    });
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
