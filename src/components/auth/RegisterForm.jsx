"use client";

import Image from "next/image";
import axios from "axios";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { signIn } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/lib/schemas";

import { Key, Mail, User } from "lucide-react";

const RegisterForm = ({ setCurrentView }) => {
  const [err, setErr] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ name, email, password }) => {
    setErr("");

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      signIn("credentials", {
        email,
        password,
        callbackUrl: "/app/my-habits",
      });
    } catch (error) {
      setErr(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <h2 className="!mb-5 text-center text-lg font-bold text-primary">
        هبیتیفای - ثبت نام
      </h2>
      <div className="space-y-2">
        <label
          className={`${errors.name ? "border-error" : ""} input input-bordered flex items-center gap-2`}
        >
          <User strokeWidth={1.5} size={20} className="text-base-300" />
          <input
            autoComplete="off"
            type="text"
            className="grow placeholder:text-sm"
            placeholder="نام و نام خانوادگی"
            {...register("name")}
          />
        </label>
        {errors.name && (
          <p className="text-xs font-semibold text-error">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          className={`${errors.email ? "border-error" : ""} input input-bordered flex items-center gap-2`}
        >
          <Mail strokeWidth={1.5} size={20} className="text-base-300" />
          <input
            autoComplete="off"
            type="email"
            className="grow placeholder:text-sm"
            placeholder="ایمیل"
            {...register("email")}
          />
        </label>
        {errors.email && (
          <p className="text-xs font-semibold text-error">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          className={`${errors.password ? "border-error" : ""} input input-bordered flex items-center gap-2`}
        >
          <Key strokeWidth={1.5} size={20} className="text-base-300" />
          <input
            autoComplete="off"
            type="password"
            className="grow placeholder:text-sm"
            placeholder="گذرواژه"
            {...register("password")}
          />
        </label>
        {errors.password && (
          <p className="text-xs font-semibold text-error">
            {errors.password.message}
          </p>
        )}
      </div>
      {err && <p className={"text-xs font-semibold text-error"}>{err}</p>}
      <button disabled={isSubmitting} className="btn btn-primary w-full">
        ثبت نام
      </button>
      <span className="divider my-4">یا</span>
      <span
        onClick={async () =>
          await signIn("google", {
            callbackUrl: "/app/my-habits",
          })
        }
        className="btn w-full !bg-white"
      >
        ثبت نام با گوگل
        <Image
          src={"/assets/google.svg"}
          alt="Google icon"
          width={25}
          height={50}
        />
      </span>
      <span
        onClick={async () =>
          await signIn("github", {
            callbackUrl: "/app/my-habits",
          })
        }
        className="btn w-full !bg-white"
      >
        ثبت نام با گیت هاب
        <Image
          src={"/assets/github.svg"}
          alt="Github icon"
          width={25}
          height={50}
        />
      </span>
      <span
        onClick={async () => await signIn("discord", {
          callbackUrl: "/app/my-habits",
        })}
        className="btn w-full !bg-white"
      >
        ثبت نام با دیسکورد
        <Image
          src={"/assets/discord.svg"}
          alt="Discord icon"
          width={25}
          height={50}
        />
      </span>
      <p className="!mt-5 text-center text-xs font-semibold">
        حساب کاربری دارید ؟{" "}
        <span
          onClick={() => setCurrentView("login")}
          className="cursor-pointer text-info"
        >
          ورود
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;
