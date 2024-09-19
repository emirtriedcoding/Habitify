import connectToDb from "@/config/db";
import User from "@/models/User";

import { authUser } from "@/lib/helpers";
import { userSchema } from "@/lib/schemas";

import { z } from "zod";

export const PUT = async (req) => {
  const user = await authUser();

  if (!user) {
    return Response.json(
      { message: "لطفا ابتدا وارد شوید !" },
      { status: 401 },
    );
  }

  try {
    const { name, username } = userSchema.parse(await req.json());

    connectToDb();

    const isUsernameTaken = await User.findOne({
      username: username.toLowerCase().trim(),
    });

    if (
      isUsernameTaken &&
      isUsernameTaken._id.toString() !== user._id.toString()
    ) {
      return Response.json(
        { message: "نام کاربری توسط شخص دیگری به کار گرفته شده است !" },
        { status: 400 },
      );
    }

    await User.findByIdAndUpdate(user._id, {
      name,
      username,
    });

    return Response.json({ message: "اطلاعات با موفقیت بروز شد !" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { message: error.errors[0].message },
        { status: 400 },
      );
    } else {
      console.log("error while updating user info =>", error);
      return Response.json({ message: "خطای سرور !" }, { status: 500 });
    }
  }
};
