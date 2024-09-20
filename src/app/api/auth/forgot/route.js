import connectToDb from "@/config/db";
import User from "@/models/User";

import nodemailer from "nodemailer";

import { forgotSchema } from "@/lib/schemas";
import { sign } from "jsonwebtoken";
import { z } from "zod";

export const POST = async (req) => {
  try {
    const { email } = forgotSchema.parse(await req.json());

    connectToDb();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return Response.json(
        { message: "کاربری با این آدرس ایمیل یافت نشد !" },
        { status: 404 },
      );
    }

    const currentDate = Date.now();

    if (user.lastEmailedAt > currentDate) {
      return Response.json(
        {
          message: "لطفا بعد از گذشت سه دقیقه دوباره تلاش نمایید !",
        },
        {
          status: 403,
        },
      );
    }

    const token = sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3m",
    });

    const t = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await t.sendMail({
      from: "info@todohub.ir",
      to: email,
      subject: "هبیتیفای - بازیابی گذرواژه",
      html: `
        <div style="direction: rtl; font-family: Tahoma, Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #66CC8A; padding: 20px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 24px;">بازیابی گذرواژه</h2>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px; color: #333333;">کاربر عزیز،</p>
              <p style="font-size: 16px; color: #333333;">لطفاً برای بازیابی گذرواژه خود، روی دکمه زیر کلیک کنید. این لینک تنها برای ۳ دقیقه معتبر است.</p>
              <a href="https://habitify.ir/reset-password?token=${token}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #66CC8A; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                بازیابی گذرواژه
              </a>
              <p style="margin-top: 20px; font-size: 14px; color: #666666;">اگر این درخواست از طرف شما نبوده است، این ایمیل را نادیده بگیرید.</p>
            </div>
            <div style="background-color: #f4f4f4; padding: 10px; font-size: 12px; color: #999999;">
              <p style="margin: 0;">تیم هبیتیفای</p>
            </div>
          </div>
        </div>
      `,
    });

    user.lastEmailedAt = currentDate + 180000; /// 3 minutes ;
    await user.save();

    return Response.json({ message: "ایمیل بازنشانی با موفقیت ارسال گردید !" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { message: error.errors[0].message },
        { status: 400 },
      );
    } else {
      console.log("Error while sending the email =>", error);
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
