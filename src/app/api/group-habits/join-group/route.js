import connectToDb from "@/config/db";
import GroupHabit from "@/models/GroupHabit";

import { authUser, checkTrialStatus } from "@/lib/helpers";
import { joinGroupSchema } from "@/lib/schemas";

import { verify } from "jsonwebtoken";
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
    const { inviteLink } = joinGroupSchema.parse(await req.json());

    const decoded = verify(inviteLink, process.env.JWT_SECRET);

    const { _id } = decoded;

    connectToDb();

    const group = await GroupHabit.findById(_id);

    if (!group) {
      return Response.json(
        {
          message: "گروه وجود ندارد !",
        },
        {
          status: 404,
        },
      );
    }

    if (group.members.includes(user._id)) {
      return Response.json(
        {
          message: "شما قبلا به این گروه اضافه شده اید !",
        },
        {
          status: 400,
        },
      );
    } else {
      group.members.push(user._id);
      await group.save();
      return Response.json({
        message: "شما با موفقیت به گروه اضافه شدید !",
      });
    }
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
      console.log("Error while joining the group  =>", error);
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
