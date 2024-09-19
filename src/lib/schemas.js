import { z } from "zod";

import { passwordRegex } from "./helpers";

export const registerSchema = z.object({
  name: z.string().min(3, {
    message: "این فیلد ضروریست !",
  }),
  email: z.string().email({
    message: "آدرس ایمیل معتبر نمیباشد !",
  }),
  password: z.string().regex(passwordRegex, {
    message: "گذرواژه ضعیف میباشد !",
  }),
});

export const loginSchema = z.object({
  email: z.string().email({
    message: "آدرس ایمیل معتبر نمیباشد !",
  }),
  password: z.string().regex(passwordRegex, {
    message: "گذرواژه ضعیف میباشد !",
  }),
});

export const forgotSchema = z.object({
  email: z.string().email({
    message: "آدرس ایمیل معتبر نمیباشد !",
  }),
});


export const habitSchema = z.object({
  name: z.string().min(1, { message: "این فیلد ضروریست !" }),
  description: z.string().optional(),
  type: z.enum(["daily", "weekly"]),
  days: z
    .array(z.number())
    .min(1, { message: "حداقل یک روز را انتخاب کنید !" }),
  frequency: z.number(),
  color: z.string(),
});

export const groupHabitSchema = z.object({
  name: z.string().min(1, { message: "این فیلد ضروریست !" }),
  description: z.string().optional(),
});

export const joinGroupSchema = z.object({
  inviteLink: z.string().min(1, { message: "این فیلد ضروریست !" }),
});

export const userSchema = z.object({
  name: z.string().min(1, { message: "این فیلد ضروریست !" }),
  username: z
    .string()
    .regex(/^[a-z0-9_-]{3,15}$/, {
      message: "نام کاربری معتبر نمیباشد !",
    })
    .optional(),
});
