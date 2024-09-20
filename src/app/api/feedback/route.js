import connectToDb from "@/config/db";
import Feedback from "@/models/Feedback";

import { authUser } from "@/lib/helpers";

export const POST = async (req) => {
  const user = await authUser();

  if (!user) {
    return Response.json(
      {
        message: "کاربری یافت نشد !",
      },
      {
        status: 401,
      },
    );
  }

  const { message, rating } = await req.json();

  if (message.length < 3 || !rating) {
    return Response.json(
      {
        message: "نظر و امتیاز را به درستی وارد کنید !",
      },
      {
        status: 403,
      },
    );
  }

  connectToDb();

  await Feedback.create({
    message,
    rating,
    username: user.username || user.email,
  });

  return Response.json({
    message: "نظر شما با موفقیت ثبت گردید !",
  });
};
