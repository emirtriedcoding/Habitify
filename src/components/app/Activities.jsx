"use client";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Activities = ({ followings }) => {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => axios.get("/api/activities").then((res) => res.data),
  });

  if (isLoading) return null;

  return (
    <>
      <div role="tablist" className="tabs tabs-bordered">
        <span
          role="tab"
          className={`tab text-[9px] lg:text-base ${activeTab === 1 && "tab-active"}`}
          onClick={() => setActiveTab(1)}
        >
          همه
        </span>
        <span
          role="tab"
          className={`tab text-[9px] lg:text-base ${activeTab === 2 && "tab-active"}`}
          onClick={() => setActiveTab(2)}
        >
          دنبال شونده ها
        </span>
      </div>
      {activeTab === 1 && (
        <div className="space-y-3">
          {data.map((a) => (
            <div
              key={a._id}
              className="flex items-center justify-between gap-3"
            >
              <img
                src={a.user.image || "/assets/noavatar.png"}
                alt="User"
                className="h-10 w-10 rounded-full"
              />
              <p className="text-xs font-bold">{a.body}</p>
              <button
                onClick={() => {
                  a.user.username && router.push(`/app/${a.user.username}`);
                }}
                className="btn"
              >
                مشاهده پروفایل
              </button>
            </div>
          ))}
        </div>
      )}
      {activeTab === 2 && (
        <div className="space-y-3">
          {followings.map(
            (following) =>
              following.activities.length !== 0 && following.activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between gap-3"
                >
                  <img
                    src={following.image || "/assets/noavatar.png"}
                    alt="User"
                    className="h-10 w-10 rounded-full"
                  />
                  <p className="text-xs font-bold">{activity.body}</p>
                  <button
                    onClick={() => {
                      following.username && router.push(`/app/${a.user.username}`);
                    }}
                    className="btn"
                  >
                    مشاهده پروفایل
                  </button>
                </div>
              ))
          )}
        </div>
      )}
    </>
  );
};

export default Activities;
