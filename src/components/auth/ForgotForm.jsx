"use client";

import axios from "axios";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { forgotSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Mail } from "lucide-react";

const ForgotForm = ({ setCurrentView }) => {
  const [isSent, setIsSent] = useState(false);
  const [err, setErr] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }) => {
    setIsSent(false);
    setErr("");

    try {
      await axios.post("/api/auth/forgot", {
        email,
      });

      setIsSent(true);
    } catch (error) {
      setErr(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <h2 className="text-center text-xl font-bold text-primary">
        هبیتیفای - بازیابی گذرواژه
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
      {err && <p className="text-xs font-semibold text-error">{err}</p>}
      {isSent && (
        <p className="text-xs font-semibold text-success">
          ایمیل بازیابی گذرواژه با موفقیت ارسال شد !
        </p>
      )}
      <button disabled={isSubmitting} className="btn btn-primary w-full">
        تایید
      </button>
      <span onClick={() => setCurrentView("login")} className="btn w-full">
        بازگشت
      </span>
    </form>
  );
};

export default ForgotForm;
