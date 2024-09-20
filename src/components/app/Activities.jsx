"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Activities = ({ followings }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <div role="tablist" className="tabs tabs-bordered">
        <span
          role="tab"
          className={`tab text-[9px] lg:text-base ${activeTab === 1 && "tab-active"}`}
          onClick={() => setActiveTab(1)}
        >
          دنبال شونده ها
        </span>
      </div>
      {activeTab === 1 && (
        <div className="space-y-3">
          {followings.map(
            (following) =>
              following.activities.length !== 0 &&
              following.activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex flex-col items-center justify-between gap-3 lg:flex-row"
                >
                  <img
                    src={following.image || "/assets/noavatar.png"}
                    alt="User"
                    className="h-10 w-10 rounded-full"
                  />
                  <p className="text-[10px] font-bold lg:text-xs">
                    {activity.body}
                  </p>
                  <button
                    onClick={() => {
                      following.username &&
                        router.push(`/app/${following.username}`);
                    }}
                    className="btn"
                  >
                    مشاهده پروفایل
                  </button>
                </div>
              )),
          )}
        </div>
      )}
    </>
  );
};

export default Activities;
