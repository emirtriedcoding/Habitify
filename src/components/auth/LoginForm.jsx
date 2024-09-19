"use client";

import Image from "next/image";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "next-auth/react";

import { loginSchema } from "@/lib/schemas";

import { Key, Mail } from "lucide-react";

const LoginForm = ({ setCurrentView }) => {
  const router = useRouter()

  const [err, setErr] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }) => {
    setErr("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if(res?.error){
      setErr(
        "مشکلی وجود دارد ! لطفا از صحیح بودن اطلاعات اطمینان حاصل فرمایید و اگر با همین ایمیل قبلا با گوگل یا دیسکورد و .. ثبت نام کرده اید از همان طریق وارد شوید !",
      );
      return
    }else {
      router.push("/app/my-habits")
    }
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <h2 className="!mb-5 text-center text-lg font-bold text-primary">
        هبیتیفای - ورود
      </h2>
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
      {err && <p className="text-xs leading-loose font-semibold text-error">{err}</p>}
      <button disabled={isSubmitting} className="btn btn-primary w-full">
        ورود
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
        ورود با گوگل
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
        ورود با گیت هاب
        <Image
          src={"/assets/github.svg"}
          alt="Github icon"
          width={25}
          height={50}
        />
      </span>
      <span
        onClick={async () =>
          await signIn("discord", {
            callbackUrl: "/app/my-habits",
          })
        }
        className="btn w-full !bg-white"
      >
        ورود با دیسکورد
        <Image
          src={"/assets/discord.svg"}
          alt="Discord icon"
          width={25}
          height={50}
        />
      </span>
      <p className="!mt-5 text-center text-xs font-semibold">
        حساب کاربری ندارید ؟{" "}
        <span
          onClick={() => setCurrentView("register")}
          className="cursor-pointer text-info"
        >
          ثبت نام
        </span>
      </p>
      <p
        onClick={() => setCurrentView("forgot")}
        className="!mt-5 cursor-pointer text-center text-xs font-semibold text-info"
      >
        فراموشی رمز عبور
      </p>
    </form>
  );
};

export default LoginForm;
