"use client";

import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { passwordRegex } from "@/lib/helpers";

import { toast } from "sonner";

const ResetPasswordForm = ({ token }) => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      toast.error("گذرواژه ضعیف میباشد !");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("گذرواژه ها با هم تطابق ندارند !");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put("/api/auth/reset", {
        token,
        password,
      });

      toast.success(res.data.message);
      router.push("/?auth=true");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="card w-[400px] border border-base-300 shadow-sm"
      >
        <div className="card-body gap-5">
          <h2 className="card-title self-center">هبیتیفای - بازیابی گذرواژه</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="گذرواژه جدید"
            className="input input-bordered placeholder:text-sm"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="تکرار گذرواژه"
            className="input input-bordered placeholder:text-sm"
          />
          <button disabled={loading} className="btn btn-primary">
            تایید و ثبت
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
