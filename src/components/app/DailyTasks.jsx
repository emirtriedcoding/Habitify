"use client";

import axios from "axios";
import Link from "next/link";

import RewardModal from "../modals/TaskReward";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { formattedDate } from "@/lib/helpers";

import { toast } from "sonner";

const DailyTasks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["missions"],
    queryFn: () => axios.get("/api/missions").then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const [rewards, setRewards] = useState([]);

  const audio = new Audio("/sounds/reward.mp3");

  const today = formattedDate(new Date());

  const mutation = useMutation({
    mutationFn: (type) =>
      axios.post("/api/missions", {
        type,
      }),
    onSuccess: async (res) => {
      setRewards(res.data.rewards);

      document.getElementById("daily_reward").showModal();

      await audio.play();
      
      await queryClient.invalidateQueries(["missions"]);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="card h-1/2">
          <div className="card-body">
            <div className="skeleton h-[200px] w-full" />
          </div>
        </div>
        <div className="card h-1/2">
          <div className="card-body">
            <div className="skeleton h-[200px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  const handleOneHabit = () => {
    if (
      data.tasks.some((task) => task.at === today && task.type === "complete") ||
      !data.habits[0].records.some((record) => record.date === today)
    ) {
      return;
    } else {
      mutation.mutate("complete");
    }
  };

  const handleAtleastTwo = () => {
    if (
      data.tasks.some(
        (task) => task.at === today && task.type === "atleasttwo",
      ) ||
      data.habits.filter((habit) =>
        habit.records.find((record) => record.date === today),
      ).length !== 2
    ) {
      return;
    } else {
      mutation.mutate("atleasttwo");
    }
  };

  const handleAtleastThree = () => {
    if (
      data.tasks.some(
        (task) => task.at === today && task.type === "atleastthree",
      ) ||
      data.habits.filter((habit) =>
        habit.records.find((record) => record.date === today),
      ).length !== 3
    ) {
      return;
    } else {
      mutation.mutate("atleastthree");
    }
  };

  const nextDay = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
    0,
    0,
    0,
  );

  const hoursLeft = Math.floor((nextDay - new Date()) / (1000 * 60 * 60));

  return (
    <div className="space-y-3">
      <span className="text-sm font-bold text-info">💎 {data.coins}</span>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-6">
          <span className="inline !w-fit rounded-lg bg-secondary/20 p-3 text-xs font-bold lg:text-sm">
            مدت زمان باقی مانده :{" "}
            {hoursLeft === 0 ? "فقط چند دقیقه" : `${hoursLeft} ساعت`}
          </span>
          <h3 className="text-sm font-bold lg:card-title">
            ماموریت های روزانه
          </h3>
          {data.habits.length !== 0 ? (
            <>
              <div
                className={`flex items-center gap-5 ${data.tasks.some((task) => task.at === today && task.type === "complete") ? "!cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <span
                  onClick={() => handleOneHabit("complete")}
                  className={`text-3xl lg:text-5xl ${
                    data.habits[0].records.some(
                      (record) => record.date === today,
                    ) &&
                    !data.tasks.some(
                      (task) => task.at === today && task.type === "complete",
                    )
                      ? "animate-bounce"
                      : ""
                  }`}
                >
                  📦
                </span>
                <div className="w-full space-y-2 lg:space-y-4">
                  <p
                    className={`text-[10px] font-bold leading-loose lg:text-base ${data.tasks.some((task) => task.at.split("T")[0] === new Date().toISOString().split("T")[0] && task.type === "complete") ? "line-through" : ""}`}
                  >
                    {data.habits[0].name} رو تکمیل کن !
                  </p>
                  <progress
                    value={
                      data.habits[0].records.some(
                        (record) => record.date === today,
                      ) ||
                      data.tasks.some(
                        (task) => task.at === today && task.type === "complete",
                      )
                        ? 100
                        : 0
                    }
                    max="100"
                    className="progress progress-primary h-5 w-full"
                  />
                  <span className="text-sm text-gray-500">
                    1 /{" "}
                    {data.habits[0].records.some(
                      (record) => record.date === today,
                    ) ||
                    data.tasks.some(
                      (task) => task.at === today && task.type === "complete",
                    )
                      ? 1
                      : 0}
                  </span>
                </div>
              </div>
              <div
                className={`flex items-center gap-5 ${data.tasks.some((task) => task.at === today && task.type === "atleasttwo") ? "!cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <span
                  onClick={handleAtleastTwo}
                  className={`text-3xl lg:text-5xl ${
                    data.habits.filter((habit) =>
                      habit.records.find((record) => record.date === today),
                    ).length === 2 &&
                    !data.tasks.some(
                      (task) => task.at === today && task.type === "atleasttwo",
                    )
                      ? "animate-bounce"
                      : ""
                  }`}
                >
                  🏺
                </span>
                <div className="w-full space-y-2 lg:space-y-4">
                  <p className="text-[10px] font-bold leading-loose lg:text-base">
                    دو تا از عادتاتو تکمیل کن !
                  </p>
                  <progress
                    value={
                      data.tasks.some(
                        (task) =>
                          task.at === today && task.type === "atleasttwo",
                      )
                        ? 100
                        : (data.habits.filter((habit) =>
                            habit.records.find(
                              (record) => record.date === today,
                            ),
                          ).length *
                            100) /
                          2
                    }
                    max="100"
                    className="progress progress-primary h-5 w-full"
                  />
                  <span className="text-sm text-gray-500">
                    2 /
                    {data.tasks.some(
                      (task) => task.at === today && task.type === "atleasttwo",
                    )
                      ? 2
                      : Math.min(
                          data.habits.filter((habit) =>
                            habit.records.find(
                              (record) => record.date === today,
                            ),
                          ).length,
                          2,
                        )}
                  </span>
                </div>
              </div>
              <div
                className={`flex items-center gap-5 ${data.tasks.some((task) => task.at === today && task.type === "atleastthree") ? "!cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <span
                  onClick={handleAtleastThree}
                  className={`text-3xl lg:text-5xl ${
                    data.habits.filter((habit) =>
                      habit.records.find((record) => record.date === today),
                    ).length === 3 &&
                    !data.tasks.some(
                      (task) =>
                        task.at === today && task.type === "atleastthree",
                    )
                      ? "animate-bounce"
                      : ""
                  }`}
                >
                  🎒
                </span>
                <div className="w-full space-y-2 lg:space-y-4">
                  <p className="text-[10px] font-bold leading-loose lg:text-base">
                    سه تا از عادتاتو تکمیل کن !
                  </p>
                  <progress
                    value={
                      data.tasks.some(
                        (task) =>
                          task.at === today && task.type === "atleastthree",
                      )
                        ? 100
                        : (data.habits.filter((habit) =>
                            habit.records.find(
                              (record) => record.date === today,
                            ),
                          ).length *
                            100) /
                          3
                    }
                    max="100"
                    className="progress progress-primary h-5 w-full"
                  />
                  <span className="text-sm text-gray-500">
                    3 /{" "}
                    {data.tasks.some(
                      (task) =>
                        task.at === today && task.type === "atleastthree",
                    )
                      ? 3
                      : Math.min(
                          data.habits.filter((habit) =>
                            habit.records.find(
                              (record) => record.date === today,
                            ),
                          ).length,
                          3,
                        )}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-center font-bold">
                اولین عادتو بساز تا ماموریت ها باز شن
              </p>
              <Link href="/my-habits" className="btn btn-primary">
                ایجاد اولین عادت
              </Link>
            </>
          )}
        </div>
      </div>
      <RewardModal rewards={rewards} />
    </div>
  );
};

export default DailyTasks;
