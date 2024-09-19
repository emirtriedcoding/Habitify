import connectToDb from "@/config/db";
import User from "@/models/User";

import { registerSchema } from "@/lib/schemas";
import { hash } from "bcryptjs";
import { z } from "zod";

export const POST = async (req) => {
  try {
    const { name, email, password } = registerSchema.parse(await req.json());

    connectToDb();

    const isAlreadyExist = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (isAlreadyExist) {
      return Response.json(
        {
          message: "این کاربر قبلا ثبت نام شده است !",
        },
        {
          status: 403,
        },
      );
    }

    await User.create({
      name,
      email,
      password: await hash(password, 10),
    });

    return Response.json(
      {
        message: "ثبت نام با موفقیت انجام گردید !",
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
