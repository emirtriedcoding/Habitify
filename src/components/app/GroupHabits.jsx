"use client";

import axios from "axios";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { formatDistanceToNow } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { confetti } from "@tsparticles/confetti";

import { toast } from "sonner";

import { ChartNoAxesColumnDecreasing, Info, Radio, Users } from "lucide-react";

const GroupHabits = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const [activeTabs, setActiveTabs] = useState({});

  const { data: habits, isLoading } = useQuery({
    queryKey: ["group-habits"],
    queryFn: () => axios.get("/api/group-habits").then((res) => res.data),
  });

  useEffect(() => {
    if (habits) {
      const initialTabs = {};
      habits.forEach((habit) => {
        initialTabs[habit._id] = 1;
      });
      setActiveTabs(initialTabs);
    }
  }, [habits]);

  const handleTabChange = (habitId, index) => {
    setActiveTabs((prev) => ({ ...prev, [habitId]: index }));
  };

  const mutation = useMutation({
    mutationFn: (id) => axios.put(`/api/group-habits/complete/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["group-habits"]);
      await confetti({
        spread: 70,
      });
    },
    onError : (err) => {
      toast.error(err.response.data.message);
    }
  });

  const generateLeaderboard = (habit) => {
    if (!habit) return [];

    const userCompletions = {};

    // Aggregate completions by user for this specific habit
    habit.completions.forEach((completion) => {
      const userId = completion.user._id;
      if (!userCompletions[userId]) {
        userCompletions[userId] = {
          user: completion.user,
          totalCompletions: 0,
        };
      }
      userCompletions[userId].totalCompletions += 1;
    });

    // Convert the object to an array and sort by totalCompletions
    return Object.values(userCompletions)
      .sort((a, b) => b.totalCompletions - a.totalCompletions)
      .slice(0, 8); // Limit to top 8 users
  };

  const leaveMutation = useMutation({
    mutationFn: async (habitId) => {
      return axios.put(`/api/group-habits/leave/${habitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["group-habits"]);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (habitId) => {
      return axios.delete(`/api/group-habits/remove/${habitId}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["group-habits"]);
    },
  });

  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-5">
              <div className="skeleton h-6 w-1/2" />
              <div className="skeleton h-52 w-full" />
            </div>
          </div>
        ))}
      </div>
    );


  const tabs = [
    {
      label: "اخیر",
      icon: Radio,
    },
    {
      label: "لیدربرد",
      icon: ChartNoAxesColumnDecreasing,
    },
    {
      label: "درباره",
      icon: Info,
    },
  ];

  const isCompletedToday = (habit) => {
    const today = new Date().toISOString().split("T")[0];

    const isCompleted = habit.completions.some((completion) => {
      return (
        completion.user.email === session.data.user.email &&
        completion.at.split("T")[0] === today
      );
    });

    return isCompleted;
  };

  const handleLeaveOrRemove = (habit) => {
    if (habit.user.email === session.data.user.email) {
      removeMutation.mutate(habit._id);
    } else {
      leaveMutation.mutate(habit._id);
    }
  };


  return habits.length !== 0 ? (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      {habits.map((habit) => (
        <div
          key={habit._id}
          className="card border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="card-body gap-5 max-h-[500px]">
            <div className="flex items-center gap-5">
              <h4 className="text-lg font-bold">{habit.name}</h4>
              <div className="flex items-center gap-1 rounded-lg bg-base-200 px-2 py-1 text-xs">
                <Users size={15} strokeWidth={1.5} className="mb-0.5" />
                <span>{habit.members.length}</span>
              </div>
            </div>
            <div className="tabs-boxed tabs tabs-sm">
              {tabs.map((tab, index) => (
                <div
                  key={tab.label}
                  onClick={() => handleTabChange(habit._id, index + 1)}
                  className={`${activeTabs[habit._id] === index + 1 ? "tab-active" : ""} tab-sm tab gap-1`}
                >
                  <tab.icon className="hidden xl:block" size={15} strokeWidth={1.5} />
                  {tab.label}
                </div>
              ))}
            </div>
            {activeTabs[habit._id] === 1 && (
              <div className="space-y-3 rounded-lg bg-base-200 p-3">
                {habit.completions.length !== 0 ? (
                  habit.completions.slice(0, 5).map((completion) => (
                    <div
                      key={completion._id}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={completion.user.image || "/assets/noavatar.png"}
                        alt="User Image"
                        className="h-8 w-8 rounded-full border border-base-300"
                      />
                      <div className="flex flex-col gap-1 text-xs">
                        <span>{completion.user.name}</span>
                        {formatDistanceToNow(new Date(completion.at), {
                          addSuffix: true,
                          locale: faIR,
                          includeSeconds: true,
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center font-bold text-sm">هنوز کسی تکمیل نکرده !</div>
                )}
              </div>
            )}
            {activeTabs[habit._id] === 2 && (
              <div className="space-y-3 rounded-lg bg-base-200 p-3">
                {generateLeaderboard(habit).length !== 0 ? generateLeaderboard(habit).map((entry, index) => (
                  <div
                    key={entry.user._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{index + 1}.</span>
                      <img
                        src={entry.user.image || "/assets/noavatar.png"}
                        alt="User Image"
                        className="h-8 w-8 rounded-full border border-base-300"
                      />
                      <div className="flex flex-col gap-1 text-[10px] lg:text-xs">
                        <span>{entry.user.name}</span>
                        <span>تکمیل شده ها : {entry.totalCompletions}</span>
                      </div>
                    </div>
                    {index === 0 && <span>🥇</span>}
                    {index === 1 && <span>🥈</span>}
                    {index === 2 && <span>🥉</span>}
                  </div>
                )) : (
                  <div className="text-center font-bold text-sm" >
                    فعلا هیشکی !
                  </div>
                )}
              </div>
            )}

            {activeTabs[habit._id] === 3 && (
              <div className="space-y-4 rounded-lg bg-base-200 p-3 text-xs font-semibold">
                <p className="leading-loose">{habit.description}</p>
                <p>
                  تاریخ ساخت :{" "}
                  {new Date(habit.createdAt).toLocaleDateString("fa-IR")}
                </p>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(habit.inviteLink);
                    toast.success("لینک کپی شد");
                  }}
                  className="btn btn-primary btn-xs"
                >
                  کپی لینک دعوت
                </button>
                <div className="flex items-center gap-1">
                  <Users size={15} strokeWidth={1.5} className="mb-0.5" />
                  <span>{habit.members.length}</span>
                </div>
                <div className="flex max-h-[100px] flex-col gap-2 overflow-y-auto">
                  {habit.members.map((member) => (
                    <div key={member._id} className="flex items-center gap-2">
                      <img
                        src={member.image || "/assets/noavatar.png"}
                        className="h-7 w-7 rounded-full"
                        alt="User"
                      />
                      {member.name}
                    </div>
                  ))}
                </div>
                <button
                  disabled={removeMutation.isPending}
                  onClick={() => handleLeaveOrRemove(habit)}
                  className="btn btn-error btn-sm w-full"
                >
                  {habit.user.email === session.data.user.email
                    ? "حذف گروه"
                    : "خروج از گروه"}
                </button>
              </div>
            )}

            {!isCompletedToday(habit) && (
              <button
                disabled={mutation.isPending}
                className="btn btn-secondary"
                onClick={() => mutation.mutate(habit._id)}
              >
                تکمیل عادت
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="!mt-60 flex flex-col items-center justify-center gap-5">
      <h3 className="text-xl font-bold"> فعلا عادت گروهی وجود نداره !</h3>
      <button
        onClick={() =>
          document.getElementById("new_group_habit_modal").showModal()
        }
        className="btn btn-primary"
      >
        اولیشو بساز
      </button>
    </div>
  );
};

export default GroupHabits;
