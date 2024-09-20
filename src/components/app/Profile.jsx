"use client";

import axios from "axios";
import MyGarden from "./MyGarden";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { achievements } from "@/lib/helpers";
import { toast } from "sonner";

const Profile = ({ user, isPreview, currentUser }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const userAchievements = achievements.filter((achievement) => {
    return user.achievements.some(
      (userAchievement) => achievement.key === userAchievement.key,
    );
  });

  const handleFollow = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/user/follow", {
        userId: user._id,
      });

      router.refresh();
    } catch (error) {
      toast.error("مشکلی پیش آمده !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-base-300 p-5 lg:border-none">
      <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
        <div className="flex items-center gap-3">
          <img
            className="h-14 w-14 rounded-full lg:h-20 lg:w-20"
            src={user.image || "/assets/noavatar.png"}
            alt="User"
          />
          <div className="space-y-1 lg:space-y-3">
            <h5 className="text-base font-bold lg:text-lg">{user.name}</h5>
            <p>{user.username}@</p>
          </div>
        </div>
        {user._id === currentUser._id ? (
          <button
            onClick={() =>
              navigator.clipboard
                .writeText(`https://habitify.ir/app/${user.username}`)
                .then(() => toast.success("لینک کپی شد !"))
            }
            className="btn btn-primary w-full lg:w-fit"
          >
            اشتراک
          </button>
        ) : (
          <button
            disabled={loading}
            onClick={handleFollow}
            className="btn btn-primary"
          >
            {user.followers.includes(currentUser._id)
              ? "دنبال نکردن"
              : "دنبال کردن"}
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {user.habits.slice(0, 5).map((habit) => (
          <div
            key={habit._id}
            className="rounded-lg bg-primary/5 p-3 text-xs font-bold"
          >
            {habit.name}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
        <div className="flex flex-col items-center gap-2 font-bold">
          <span className="text-xs lg:text-sm">دنبال کننده ها : </span>
          <span>{user.followers.length}</span>
        </div>
        <div className="flex flex-col items-center gap-2 font-bold">
          <span className="text-xs lg:text-sm">دنبال شونده ها : </span>
          <span>{user.followings.length}</span>
        </div>
        <div className="flex flex-col items-center gap-2 font-bold">
          <span className="text-xs lg:text-sm">عادت ها : </span>
          <span>{user.habits.length}</span>
        </div>
      </div>
      <p className="text-xs font-bold text-gray-500">
        {" "}
        ثبت نام شده در : {new Date(user.createdAt).toLocaleDateString("fa-IR")}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {userAchievements.map((ach) => (
          <div
            key={ach.icon}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-base-200 bg-primary/10 text-sm"
          >
            {ach.icon}
          </div>
        ))}
      </div>
      <MyGarden userId={user._id} isProfile={true} />
      {isPreview && (
        <div className="card border border-base-200 bg-base-100">
          <div className="card-body gap-3">
            <h2 className="card-title">فعالیت ها</h2>
            {user.activities.length !== 0 ? (
              user.activities.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center justify-between gap-3"
                >
                  <img
                    src={user.image || "/assets/noavatar.png"}
                    alt="User"
                    className="h-10 w-10 rounded-full"
                  />
                  <p className="text-xs font-bold">{a.body}</p>
                </div>
              ))
            ) : (
              <p className="text-center font-bold">فعلا هیچی !</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
