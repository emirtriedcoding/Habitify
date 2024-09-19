"use client";

import ColorPicker from "react-pick-color";

import axios from "axios";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { habitSchema } from "@/lib/schemas";
import { days } from "@/lib/constants";

const EditTaskModal = ({ habitId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { data: habit, isLoading } = useQuery({
    queryKey: ["habit", habitId],
    queryFn: () => axios.get(`/api/habits/${habitId}`).then((res) => res.data),
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(habitSchema),
  });

  useEffect(() => {
    if (habit) {
      setValue("name", habit.name);
      setValue("description", habit.description);
      setValue("type", habit.type);
      setValue("days", habit.days);
      setValue("frequency", habit.frequency);
      setValue("color", habit.color);
    }
  }, [habit, setValue]);

  const type = watch("type");
  const selectedDays = watch("days");

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setValue(
        "days",
        selectedDays.filter((d) => d !== day),
      );
    } else {
      setValue("days", [...selectedDays, day]);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.put(`/api/habits/edit/${habit._id}`, data);
    },
    onSuccess: () => {
      toast.success("عادت با موفقیت ویرایش گردید !", {
        description: "در حال انتقال ...",
      });
      queryClient.invalidateQueries(["habits"]);
      router.push("/app/my-habits");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="skeleton mt-5 h-[600px] w-1/3"></div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card mt-5 w-1/2 border border-base-300 shadow-sm"
    >
      <div className="card-body gap-3">
        <h3 className="text-lg font-bold">ویرایش عادت</h3>
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
            onChange={(e) => setValue("frequency", +e.target.value)}
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
          <button
            type="button"
            className="btn"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? "بستن" : "انتخاب رنگ"}
          </button>
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={mutation.isPending}
        >
          ویرایش
        </button>
      </div>
    </form>
  );
};

export default EditTaskModal;
