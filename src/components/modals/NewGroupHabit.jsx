"use client";

import axios from "axios";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import { groupHabitSchema } from "@/lib/schemas";

import { toast } from "sonner";

import { Plus } from "lucide-react";

const NewGroupHabitModal = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(groupHabitSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ name, description }) => {
      return axios.post("/api/group-habits/new", {
        name,
        description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["group-habits"]).then(() => {
        document.getElementById("new_group_habit_modal").close();
        reset();
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  return (
    <div>
      <div className="lg:tooltip" data-tip="ایجاد عادت گروهی جدید">
        <Plus
          onClick={() =>
            document.getElementById("new_group_habit_modal").showModal()
          }
          className="-z-50 cursor-pointer"
          size={20}
          strokeWidth={1.8}
        />
      </div>
      <dialog id="new_group_habit_modal" className="modal">
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
                placeholder="برای مثال نخوردن نوشابه"
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
              <span className="label-text">توضیحات عادت : </span>
            </div>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="از امروز تصمیم گرفتیم که نوشابه نخوریم  ... "
              className="textarea textarea-bordered w-full placeholder:text-sm"
            />
          </label>

          <button disabled={isSubmitting || mutation.isPending } className="btn btn-primary w-full">
            ثبت و ایجاد
          </button>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>بستن</button>
        </form>
      </dialog>
    </div>
  );
};

export default NewGroupHabitModal;
