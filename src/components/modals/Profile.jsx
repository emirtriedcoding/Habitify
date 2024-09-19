"use client";

import axios from "axios";

import Uploader from "@/components/app/Uploader";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema } from "@/lib/schemas";
import { themes } from "@/lib/constants";

import { ThemeContext } from "@/providers/theme-provider";
import { signOut } from "next-auth/react";

const ProfileModal = ({ name, username, email, image, isPaid }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shouldBeOpen = searchParams.get("settings");
    if (shouldBeOpen === "true") {
      document.getElementById("profile_modal").showModal();
    }
  }, [searchParams]);

  const [err, setErr] = useState("");

  const { changeTheme, theme } = useContext(ThemeContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name,
      username,
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: (url) => {
      return axios.put("/api/user/update-image", { url });
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const updateInfoMutation = useMutation({
    mutationFn: ({ name, username }) => {
      return axios.put("/api/user/update-info", {
        name,
        username,
      });
    },
    onSuccess: () => {
      router.refresh();
      document.getElementById("profile_modal").close();
      setErr("");
    },
    onError: (e) => {
      setErr(e.response.data.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete("/api/user/delete-account"),
    onSuccess: async () => {
      await signOut({
        callbackUrl: "/",
      });
    },
  });

  const usernamenow = watch("username");

  return (
    <dialog id="profile_modal" className="modal">
      <div className="modal-box space-y-4">
        <h3 className="text-lg font-bold">پروفایل من</h3>
        <form
          onSubmit={handleSubmit((data) => updateInfoMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="flex flex-col items-center gap-3 lg:flex-row">
            <img
              src={image || "/assets/noavatar.png"}
              className="mask mask-squircle w-24"
              alt="User Avatar"
            />
            <div className="w-full space-y-1">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">نام شما : </span>
                </div>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="برای مثال امیرحسین"
                  className={`${
                    errors.name ? "border-error" : ""
                  } input input-bordered w-full placeholder:text-sm`}
                />
              </label>
              {errors.name && (
                <p className="text-xs font-semibold text-error">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <Uploader onUpload={(url) => updateImageMutation.mutate(url)} />
          <label className="form-control">
            <div className="label">
              <span className="label-text">ایمیل شما : </span>
            </div>
            <input
              type="email"
              disabled
              defaultValue={email}
              className="input input-bordered w-full placeholder:text-sm"
            />
          </label>
          <div className="w-full space-y-1">
            <label className="form-control">
              <div className="label">
                <span className="label-text">نام کاربری </span>
              </div>
              <input
                {...register("username")}
                type="text"
                placeholder="emirtriedcoding"
                className={`${
                  errors.username ? "border-error" : ""
                } input input-bordered w-full placeholder:text-sm`}
              />
            </label>
            {searchParams.get("settings") === "true" && !usernamenow && (
              <p className="text-xs font-semibold text-error">
                جهت استفاده از قسمت کاربران لطفا ابتدا یک نام کاربری برای خود
                انتخاب نمایید !
              </p>
            )}
            {errors.username && (
              <p className="text-xs font-semibold text-error">
                {errors.username.message}
              </p>
            )}
          </div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">تم : </span>
            </div>
            <select
              defaultValue={theme}
              onChange={(e) => changeTheme(e.target.value)}
              className="select select-bordered"
            >
              {themes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.name}
                </option>
              ))}
            </select>
          </label>

          <p className="!mt-7 text-xs font-bold lg:text-sm">
            پلن و تعرفه شما :{" "}
            <span className={`${isPaid ? "text-success" : "text-warning"}`}>
              {isPaid ? "دائمی" : "در انتظار پرداخت"}
            </span>
          </p>
          {!isPaid && (
            <button
              onClick={() => router.push("/#pricing")}
              className="btn btn-primary w-full"
            >
              ارتقا تعرفه
            </button>
          )}
          {err && <p className="text-sm font-bold text-error">{err}</p>}
          <button
            disabled={updateInfoMutation.isPending}
            className="btn w-full"
          >
            ذخیره تغییرات
          </button>
        </form>
        <span className="divider" />
        <button
          onClick={async () =>
            await signOut({
              callbackUrl: "/",
            })
          }
          className="btn w-full"
        >
          خروج
        </button>
        <button
          onClick={() =>
            document.getElementById("delete_account_modal").showModal()
          }
          className="btn btn-error w-full"
        >
          حذف حساب کاربری
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>بستن</button>
      </form>
      <dialog id="delete_account_modal" className="modal">
        <div className="modal-box space-y-4">
          <h3 className="text-lg font-bold">آیا اطمینان دارید ؟ </h3>
          <p className="text-center text-sm font-semibold leading-loose text-error">
            با این عمل حساب کاربری و تمام اطلاعات از جمله عادت ها و عادت های
            گروهی همچنین تمامی پرداخت های شما از بین خواهند رفت و این عمل هرگز
            قابل بازگشت نخواهد بود !
          </p>
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="btn btn-error w-full"
          >
            حذف حساب کاربری
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>بستن</button>
        </form>
      </dialog>
    </dialog>
  );
};

export default ProfileModal;
