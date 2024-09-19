import connectToDb from "@/config/db";
import User from "@/models/User";

import { passwordRegex } from "@/lib/helpers";

import { hash } from "bcryptjs";
import { verify } from "jsonwebtoken";

export const PUT = async (req) => {
  const { token, password } = await req.json();

  if (!passwordRegex.test(password)) {
    return Response.json(
      {
        message: "گذرواژه ضعیف میباشد !",
      },
      {
        status: 403,
      },
    );
  }

  try {
    const { _id } = verify(token, process.env.JWT_SECRET);

    connectToDb();

    await User.findByIdAndUpdate(
      {
        _id,
      },
      {
        password: await hash(password, 10),
      },
    );

    return Response.json({
      message: "گذرواژه با موفقیت تغییر یافت !",
    });
  } catch (error) {
    console.log("Error while verifying the token => ", error);
    return Response.json(
      {
        message: "خطای سرور !",
      },
      {
        status: 500,
      },
    );
  }
};
