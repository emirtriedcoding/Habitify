"use client";

import ImportHabit from "@/components/modals/ImportHabit";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const VisualizeHabit = () => {
  const [habit, setHabit] = useState(null);

  const schema = z.object({
    name: z.string().min(1, {
      message: "اسم عادت ضروریه !",
    }),
    timeSpent: z.number().min(1, {
      message: "مقدار زمان عادت ضروریه !",
    }),
    frequency: z.number(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      timeSpent: null,
      frequency: 3,
    },
  });

  useEffect(() => {
    if (habit) {
      document.getElementById("import_habit_modal").showModal();
    }
  }, [habit]);

  const habits = [
    {
      label: "مدیتیشن 🧘‍♂️",
      advantage: "استرس کمتر و زندگی بهتر",
    },
    {
      label: "ورزش 🏋️‍♀️",
      advantage: "بدنی سالم و انرژی بیشتر",
    },
    {
      label: "مطالعه 📚",
      advantage: "دانش بیشتر و ذهن فعال‌تر",
    },
    {
      label: "نوشتن ✍️",
      advantage: "افکار منظم و خلاقیت بیشتر",
    },
    {
      label: "یادگیری 🌐",
      advantage: "فرصت‌های جدید و ارتباطات بهتر",
    },
    {
      label: "تغذیه سالم 🥗",
      advantage: "بدنی قوی‌تر و سلامتی بیشتر",
    },
    {
      label: "خواب منظم 💤",
      advantage: "ذهن آرام و تمرکز بیشتر",
    },
    {
      label: "مهربونی 🤗",
      advantage: "تجربیات جدید و دیدگاه‌های گسترده‌تر",
    },
    {
      label: "کدنویسی 👨‍💻",
      advantage: "حمایت اجتماعی و ارتباطات قوی‌تر",
    },
    {
      label: "مسواک 🦷",
      advantage: "پوست شاداب و اعتماد به نفس بیشتر",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit((data) => setHabit(data))}
      className="space-y-6"
    >
      <h3 className="font-bold">محاسبه گر عادت</h3>
      <p className="text-xs font-semibold leading-loose text-gray-500 lg:text-sm">
        بهم بگو چه عادتی رو میخوای چقد انجام بدی تا بهت بگم که چی از آب در میاد
        ... برای مثال :
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {habits.map((habit) => (
          <div
            onClick={() => setValue("name", habit.label)}
            key={habit.label}
            className="cursor-pointer rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 p-5 text-center text-xs font-semibold shadow-sm transition hover:scale-105 lg:text-sm"
          >
            {habit.label}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">اسم عادت : </span>
          </div>
          <input
            {...register("name")}
            type="text"
            placeholder="برای مثال پیاده روی"
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
      <div className="space-y-1">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">مدت زمان : ( دقیقه در روز ) </span>
          </div>
          <input
            {...register("timeSpent", { valueAsNumber: true })}
            type="number"
            placeholder="روزانه چند دقیقه ؟"
            className={`${
              errors.timeSpent ? "border-error" : ""
            } input input-bordered w-full placeholder:text-sm`}
          />
        </label>
        {errors.timeSpent && (
          <p className="text-xs font-semibold text-error">این فیلد ضروریست !</p>
        )}
      </div>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">چند روز در هفته ؟ </span>
        </div>
        <select
          {...register("frequency", {
            valueAsNumber: true,
          })}
          className="select select-bordered"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} روز
            </option>
          ))}
        </select>
      </label>
      <button className="btn btn-primary w-full">ایجاد عادت سفارشی</button>
      {habit && <ImportHabit habit={habit} />}
    </form>
  );
};

export default VisualizeHabit;
