"use client";

import axios from "axios";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import { joinGroupSchema } from "@/lib/schemas";

import { toast } from "sonner";

const JoinGroupModal = () => {
  const [err, setErr] = useState("");

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      inviteLink: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ inviteLink }) => {
      return axios.post("/api/group-habits/join-group", { inviteLink });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["group-habits"]).then(() => {
        document.getElementById("join_group_modal").close();
        reset();
      });
    },
    onError: (err) => {
      setErr(err.response.data.message);
    },
  });

  return (
    <div>
      <button
        onClick={() => document.getElementById("join_group_modal").showModal()}
        className="btn btn-xs"
      >
        محلق شدن به گروه جدید
      </button>
      <dialog id="join_group_modal" className="modal">
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="modal-box space-y-2"
        >
          <h3 className="text-lg font-bold">عضویت در گروه جدید</h3>
          <div className="space-y-1">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">لینک دعوت : </span>
              </div>
              <input
                {...register("inviteLink")}
                type="text"
                placeholder="لینک دعوتی که از دوست یا آشنا گرفتی ..."
                className={`${
                  errors.inviteLink ? "border-error" : ""
                } input input-bordered w-full placeholder:text-sm`}
              />
            </label>
            {errors.inviteLink && (
              <p className="text-xs font-semibold text-error">
                {errors.inviteLink.message}
              </p>
            )}
          </div>
          {err && <p className="text-xs font-semibold text-error">{err}</p>}
          <button
            disabled={mutation.isPending}
            className="btn btn-secondary w-full"
          >
            تایید
          </button>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>بستن</button>
        </form>
      </dialog>
    </div>
  );
};

export default JoinGroupModal;
