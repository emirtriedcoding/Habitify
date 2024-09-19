"use client";

import axios from "axios";
import Link from "next/link";

import HeatMap from "@uiw/react-heat-map";

import confetti from "canvas-confetti";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { formattedDate } from "@/lib/helpers";
import { hexToRgba } from "@/lib/helpers";

import { toast } from "sonner";

import { Bell, Check, Edit, MoreVertical, Trash2 } from "lucide-react";

const HabitCard = ({ habit, isExapnded }) => {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  const completeAudio = new Audio("/sounds/habit-completion.mp3");
  const removeAudio = new Audio("/sounds/habit-removal.mp3");

  useEffect(() => {
    const setter = () => {
      isOpen && setIsOpen(false);
    };

    document.addEventListener("click", setter);

    return () => {
      document.removeEventListener("click", setter);
    };
  }, [isOpen]);

  useEffect(() => {
    const date = formattedDate();

    const completedToday = habit.records.some((record) => record.date === date);

    setIsCompletedToday(completedToday);
  }, [habit.records]);

  const recordMutation = useMutation({
    mutationFn: () => axios.put(`/api/habits/record/${habit._id}`),
    onSuccess: async (res) => {
      if (res.status === 201) {
        completeAudio.play();
        await confetti({
          angle: 90, // Explosion happens upwards
          spread: 160, // Maximum spread for particles
          startVelocity: 60, // Particles shoot fast
          particleCount: 200, // Number of particles for the explosion
          origin: { y: 0.6 }, // Starting point
          colors: ["#ff0000", "#00ff00", "#0000ff", "#ff7700", "#f0e130"], // Explosion colors
          gravity: 1, // Gravity for how fast they fall
          scalar: 1.2, // Size of the confetti particles
          zIndex: 10000, // Ensures confetti appears on top
        });
      } else {
        removeAudio.play();
      }
      queryClient.invalidateQueries(["habits"]).then(() => {
        queryClient.refetchQueries(["habits"]);
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/api/habits/${habit._id}`),
    onSuccess: () => {
      toast.success("عادت با موفقیت حذف شد !");
      queryClient.invalidateQueries(["habits"]);
    },
  });

  const getMissedDays = () => {
    if (habit.type === "weekly") return []; // Only for daily habits

    const missedDays = [];
    const selectedDays = habit.days; // E.g., [0, 2] for Sunday, Tuesday
    const createdAt = new Date(habit.createdAt);
    const currentDate = new Date();

    // Loop through each day from the habit creation date to today
    for (
      let d = new Date(createdAt);
      d <= currentDate;
      d.setDate(d.getDate() + 1)
    ) {
      // Only consider the days that are in the selectedDays array
      if (selectedDays.includes(d.getDay())) {
        const dateStr = formattedDate(d); // Format the specific date for comparison
        const completedOnDay = habit.records.some(
          (record) => record.date === dateStr,
        );

        // If the habit is not completed on this day, add it to missedDays
        if (!completedOnDay) {
          missedDays.push({ date: dateStr, count: 0 }); // Use count: 0 to indicate a missed day
        }
      }
    }

    return missedDays;
  };

  const calculateWeeklyConsistency = () => {
    const currentDate = new Date();
    const createdAt = new Date(habit.createdAt);

    // Calculate the number of weeks since the habit was created
    const weeksElapsed = Math.ceil(
      (currentDate - createdAt) / (1000 * 60 * 60 * 24 * 7),
    );

    // Calculate the total number of check-ins
    const totalCheckIns = habit.records.length;

    // Calculate the average check-ins per week
    const averageCheckInsPerWeek =
      weeksElapsed === 0 ? 0 : totalCheckIns / weeksElapsed;

    // Calculate the consistency
    const consistency = Math.round(
      habit.frequency === 0
        ? 0
        : (averageCheckInsPerWeek / habit.frequency) * 100,
    );

    return Math.min(consistency.toFixed(2), 100);
  };

  const calculateDailyConsistency = () => {
    const currentDate = new Date();
    const createdAt = new Date(habit.createdAt);
    const selectedDays = habit.days;

    let eligibleDaysElapsed = 0;

    for (
      let d = new Date(createdAt);
      d <= currentDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (selectedDays.includes(d.getDay())) {
        eligibleDaysElapsed++;
      }
    }

    const totalCheckIns = habit.records.length;

    const consistency =
      eligibleDaysElapsed === 0
        ? 0
        : (totalCheckIns / eligibleDaysElapsed) * 100;

    return Math.min(consistency.toFixed(2), 100);
  };

  return (
    <div
      className={`${isCompletedToday ? "opacity-50 hover:opacity-100" : "opacity-100"} card relative border border-base-200 bg-base-100 shadow-sm transition`}
    >
      <div
        className={`${isOpen ? "visible scale-100 opacity-100" : "scale-80 invisible opacity-0"} absolute right-10 top-16 z-50 flex cursor-pointer flex-col gap-2 rounded-lg border border-base-300 bg-base-100 p-3 shadow-sm transition`}
      >
        <Link
          href={`/app/my-habits/edit/${habit._id}`}
          className="btn btn-sm text-xs font-bold text-warning"
        >
          <Edit size={15} strokeWidth={1.5} />
          ویرایش
        </Link>
        <button
          onClick={() =>
            document.getElementById("delete_habit_modal").showModal()
          }
          className="btn btn-sm text-xs font-bold text-error"
        >
          <Trash2 size={15} strokeWidth={1.5} />
          حذف
        </button>
      </div>
      <div className="card-body items-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <MoreVertical
              onClick={() => setIsOpen(true)}
              className="cursor-pointer transition hover:opacity-50"
            />
            <h5
              className={`font-bold lg:text-lg ${isCompletedToday ? "line-through" : ""}`}
            >
              {habit.name}
            </h5>
            {habit.notifications && <Bell size={14} />}
          </div>
          <button
            disabled={recordMutation.isPending}
            onClick={() => recordMutation.mutate()}
            className={`${isCompletedToday ? "border-2 border-success hover:border-success" : ""} btn btn-square btn-outline btn-sm flex items-center justify-center !bg-transparent`}
          >
            {recordMutation.isPending && (
              <span className="loading loading-spinner loading-sm mt-[5px]"></span>
            )}

            <Check
              className={`transition ${!recordMutation.isPending && isCompletedToday ? "visible text-success opacity-100" : "invisible opacity-0"}`}
            />
          </button>
        </div>
        {isExapnded && (
          <div className="space-y-3">
            <p className="px-5 text-xs font-semibold text-gray-500">
              {habit.description}
            </p>
            <div className="grid grid-cols-2">
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">
                  {habit.type === "weekly"
                    ? calculateWeeklyConsistency()
                    : calculateDailyConsistency()}
                  %
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  نظم و دیسیپلین
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">
                  {habit.records.length}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  تکمیل شده ها
                </span>
              </div>
            </div>
            <HeatMap
              value={[...habit.records, ...getMissedDays()]}
              startDate={
                new Date(habit.createdAt.split("T")[0].replace(/-/g, "/"))
              }
              style={{ color: habit.color }}
              weekLabels={[
                "یکشنبه",
                "دوشنبه",
                "سه شنبه",
                "چهارشنبه",
                "پنجشنبه",
                "جمعه",
                "شنبه",
              ]}
              legendRender={(props) => (
                <rect {...props} y={props.y + 10} rx={4} />
              )}
              rectProps={{
                rx: 4,
              }}
              panelColors={{
                0: "#e0e0e0",
                5: hexToRgba(habit.color, 0.4),
                10: habit.color,
              }}
              className="mt-3"
            />
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold">
              <div className="flex items-center gap-2">
                استراحت :
                <div className="h-3 w-3 rounded bg-[#e0e0e0]" />
              </div>
              {habit.type === "daily" && (
                <div className="flex items-center gap-2">
                  از دست رفته :
                  <div
                    className="h-3 w-3 rounded"
                    style={{
                      backgroundColor: hexToRgba(habit.color, 0.4),
                    }}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                تکمیل شده :
                <div
                  className="h-3 w-3 rounded"
                  style={{
                    backgroundColor: habit.color,
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <dialog id="delete_habit_modal" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">مطمئنی ؟ </h3>
            <p className="py-4 text-center text-sm font-bold leading-loose text-error">
              با حذف این عادت تمامی داده های مربوط به اون برای همیشه حذف خواهند
              شد و این عمل هرگز قابل بازگشت نخواهد بود !
            </p>
            <button
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
              className="btn btn-error w-full"
            >
              تایید و حذف
            </button>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default HabitCard;
