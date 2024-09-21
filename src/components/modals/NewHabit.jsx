"use client";

import axios from "axios";

import ColorPicker from "react-pick-color";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { habitSchema } from "@/lib/schemas";
import { days } from "@/lib/constants";

import { toast } from "sonner";

import { Plus } from "lucide-react";

const NewHabitModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const frequency = searchParams.get("frequency");

  useEffect(() => {
    if (name && frequency) {
      document.getElementById("new_habit_modal").showModal();
    }
  }, [searchParams, name , frequency]);

  const habits = [
    "پیاده روی 🚶‍♂️",
    "خواندن 📖",
    "یادگیری زبان انگلیسی 🇬🇧",
    "ورزش 🏋️‍♂️",
    "خوابیدن زودتر 🛌",
    "تغذیه سالم 🍀",
  ];

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: name || "",
      description: "",
      type: "weekly",
      days: [0],
      frequency: +frequency || 3,
      color: "#0065F6",
    },
  });

  const type = watch("type");

  const selectedDays = watch("days");

  const toggleDay = (index) => {
    const currentDays = selectedDays || [];
    if (currentDays.includes(index)) {
      setValue(
        "days",
        currentDays.filter((day) => day !== index),
      );
    } else {
      setValue("days", [...currentDays, index]);
    }
  };

  const mutation = useMutation({
    mutationFn: ({
      name,
      description,
      type,
      days,
      frequency,
      color,
    }) => {
      return axios.post("/api/habits/new", {
        name,
        description,
        type,
        days,
        frequency,
        color,
      });
    },
    onSuccess: () => {
      document.getElementById("new_habit_modal").close();
      queryClient.invalidateQueries(["habits"]).then(() => {
        reset();
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  return (
    <div>
      <div className="lg:tooltip" data-tip="ایجاد عادت جدید">
        <Plus
          onClick={() => document.getElementById("new_habit_modal").showModal()}
          className="-z-50 cursor-pointer"
          size={20}
          strokeWidth={1.8}
        />
      </div>
      <dialog id="new_habit_modal" className="modal">
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="modal-box space-y-2"
        >
          <h3 className="text-lg font-bold">ایجاد عادت جدید</h3>
          <div className="space-y-1">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">اسم عادت : </span>
              </div>
              <input
                {...register("name")}
                type="text"
                placeholder="پیاده روی 🚶‍♂️"
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
          <div className="!mt-4 flex flex-wrap items-center gap-2">
            {habits.map((habit) => (
              <span
              key={habit}
                onClick={() => setValue("name", habit)}
                className={`${watch("name") === habit ? "bg-primary/50" : ""} cursor-pointer rounded-lg border border-base-300 px-1 py-2 text-xs font-semibold transition hover:scale-105`}
              >
                {habit}
              </span>
            ))}
          </div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">توضیحات : </span>
            </div>
            <textarea
              {...register("description")}
              placeholder="میخوام اگه خدا بخواد از امروز به مدت نیم ساعت پیاده روی کنم ..."
              className="textarea textarea-bordered w-full placeholder:text-sm"
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">تکرار : </span>
            </div>
            <select {...register("type")} className="select select-bordered">
              <option value="daily">روزانه</option>
              <option value="weekly">هفتگی</option>
            </select>
          </label>
          {type === "daily" && (
            <div className="!mt-5 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
                {days.map((day) => (
                  <span
                    key={day.value}
                    className="flex flex-col items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day.value)}
                      onChange={() => toggleDay(day.value)}
                      className="checkbox"
                    />
                    {day.label}
                  </span>
                ))}
              </div>
              {errors.days && (
                <p className="text-xs font-semibold text-error">
                  {errors.days.message}
                </p>
              )}
            </div>
          )}
          {type === "weekly" && (
            <select
              {...register("frequency", {
                valueAsNumber: true,
              })}
              className="select select-bordered !mt-5 w-full"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1} روز
                </option>
              ))}
            </select>
          )}

          {isOpen && (
            <ColorPicker
              hideAlpha
              hideInputs
              className="!my-5"
              color={watch("color")}
              onChange={(color) => setValue("color", color.hex)}
            />
          )}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">رنگ عادت : </span>
              <span
                className="label-alt h-5 w-5 rounded-full"
                style={{
                  backgroundColor: watch("color"),
                }}
              ></span>
            </div>
            <span className="btn" onClick={() => setIsOpen((prev) => !prev)}>
              {isOpen ? "بستن" : "انتخاب رنگ"}
            </span>
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={mutation.isPending}
          >
            ایجاد
          </button>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>بستن</button>
        </form>
      </dialog>
    </div>
  );
};

export default NewHabitModal;
