"use client";

import axios from "axios";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import RewardModal from "../modals/AchiveReward";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { achievements } from "@/lib/helpers";

import { toast } from "sonner";

const Achievements = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => axios.get("/api/missions").then((res) => res.data),
  });

  const [rewards, setRewards] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  const [completedAchievements, setCompletedAchievements] = useState({});
  const [claimedAchievements, setClaimedAchievements] = useState({});

  const audio = new Audio("/sounds/reward.mp3");

  useEffect(() => {
    if (data) {
      const completed = {};
      achievements.forEach((achievement) => {
        completed[achievement.key] = achievement.condition(data);
      });
      setCompletedAchievements(completed);
    }
  }, [data]);

  useEffect(() => {
    if (data?.achievements) {
      const claimed = {};
      data.achievements.forEach((ach) => {
        claimed[ach.key] = true;
      });
      setClaimedAchievements(claimed);
    }
  }, [data]);

  const handleClaimMutation = useMutation({
    mutationFn: (key) => axios.post("/api/achievement/new", { key }),
    onSuccess: async (res) => {
      setRewards(res.data.rewards);

      document.getElementById("achiv_reward").showModal();

      await audio.play();

      await queryClient.invalidateQueries(["achievements"]);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  const renderAchievementContent = (achievement, isClaimed) => (
    <div className={`w-64 space-y-3 p-2`}>
      <h6 className="font-bold">{achievement.label}</h6>
      <p className="text-xs">{achievement.desc}</p>
      <progress
        value={
          isClaimed
            ? achievement.value
            : completedAchievements[achievement.key]
              ? achievement.value
              : 0
        }
        max={achievement.value}
        className="progress progress-success h-5 w-full bg-gray-500"
      />
      <button
        className={`btn w-full ${isClaimed ? "btn-primary" : "btn-secondary"} ${isClaimed && "opacity-50"} disabled:bg-primary/50 disabled:text-white`}
        onClick={() =>
          !isClaimed && handleClaimMutation.mutate(achievement.key)
        }
        disabled={isClaimed || !completedAchievements[achievement.key]}
      >
        {isClaimed ? "جایزه گرفته شد" : "دریافت جایزه"}
      </button>
    </div>
  );

  if (isLoading) return null;

  return (
    <div className="card relative border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5">
        <h3 className="card-title">دستاورد ها</h3>
        <div role="tablist" className="tabs tabs-bordered">
          <span
            role="tab"
            className={`tab text-[9px] lg:text-base ${activeTab === 1 && "tab-active"}`}
            onClick={() => setActiveTab(1)}
          >
            قابل دریافت
          </span>
          <span
            role="tab"
            className={`tab text-[9px] lg:text-base ${activeTab === 2 && "tab-active"}`}
            onClick={() => setActiveTab(2)}
          >
            دریافت شده ها
          </span>
        </div>

        {/* Available Achievements */}
        {activeTab === 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3 lg:mt-5">
            {achievements
              .filter((achievement) => !claimedAchievements[achievement.key])
              .map((achievement) => (
                <Tippy
                  interactive
                  placement="top"
                  key={achievement.key}
                  content={renderAchievementContent(achievement, false)}
                >
                  <span
                    className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border-2 p-5 text-xl shadow-sm lg:h-20 lg:w-20 lg:p-2 lg:text-4xl ${
                      completedAchievements[achievement.key]
                        ? "animate-bounce bg-secondary/20"
                        : "border-base-300"
                    }`}
                  >
                    {achievement.icon}
                  </span>
                </Tippy>
              ))}
          </div>
        )}

        {/* Claimed Achievements */}
        {activeTab === 2 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {achievements
              .filter((achievement) => claimedAchievements[achievement.key])
              .map((achievement) => (
                <Tippy
                  interactive
                  placement="top"
                  key={achievement.key}
                  content={renderAchievementContent(achievement, true)}
                >
                  <span
                    className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border-2 p-5 text-xl shadow-sm lg:h-20 lg:w-20 lg:p-2 lg:text-4xl ${
                      claimedAchievements[achievement.key]
                        ? "border-primary bg-primary/20"
                        : "border-base-300"
                    }`}
                  >
                    {achievement.icon}
                  </span>
                </Tippy>
              ))}
          </div>
        )}
      </div>
      <RewardModal rewards={rewards} />
    </div>
  );
};

export default Achievements;
