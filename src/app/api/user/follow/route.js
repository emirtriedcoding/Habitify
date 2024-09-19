import User from "@/models/User";
import connectToDb from "@/config/db";

import { authUser } from "@/lib/helpers";

export const POST = async (req) => {
  const user = await authUser();

  if (!user) {
    return Response.json(
      { message: "لطفا ابتدا وارد شوید !" },
      { status: 401 },
    );
  }

  const { userId } = await req.json();

  connectToDb();


  if (user.followings.some((following) => following._id.toString() === userId)) {
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: user._id },
    });

    user.followings = user.followings.filter((following) => following._id.toString() !== userId);
  } else {
    await User.findByIdAndUpdate(userId, {
      $push: { followers: user._id },
    });

    user.followings.push(userId);
  }

  await user.save();

  return Response.json({ message: "تمام !" });
};
