"use client";

import axios from "axios";
import Link from "next/link";

import HabitCard from "./HabitCard";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Maximize2, Minimize2 } from "lucide-react";

const MyHabits = () => {
  const [isExapnded, setIsExpanded] = useState(null);

  useEffect(() => {
    const value = localStorage.getItem("expand");

    setIsExpanded(value === "true" ? true : false);
  }, []);

  const { data: habits, isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: () => axios.get("/api/habits").then((res) => res.data),
  });

  const changeExpand = () => {
    setIsExpanded((prev) => !prev);
    localStorage.setItem("expand", !isExapnded);
  };

  if (isLoading)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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

  const daily = habits.filter((habit) => habit.type === "daily");
  const weekly = habits.filter((habit) => habit.type === "weekly");

  return (
    <>
      {habits.length ? (
        <div className="space-y-5">
          {daily.length !== 0 && (
            <>
              <span className="divider">روزانه</span>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {daily.map((habit) => (
                  <HabitCard
                    key={habit._id}
                    habit={habit}
                    isExapnded={isExapnded}
                  />
                ))}
              </div>
            </>
          )}
          {weekly.length !== 0 && (
            <>
              <span className="divider">هفتگی</span>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {weekly.map((habit) => (
                  <HabitCard
                    key={habit._id}
                    habit={habit}
                    isExapnded={isExapnded}
                  />
                ))}
              </div>
            </>
          )}
          <div className="mr-5 flex items-center gap-5">
            <button onClick={changeExpand} className="btn btn-sm">
              {isExapnded ? (
                <Minimize2 size={20} strokeWidth={1.5} />
              ) : (
                <Maximize2 size={20} strokeWidth={1.5} />
              )}
            </button>
            <Link href={"/app/my-habits/reorder"} className="btn btn-sm">
              مرتب سازی
            </Link>
          </div>
        </div>
      ) : (
        <div className="!mt-48 flex flex-col items-center justify-center gap-5">
          <h3 className="text-xl font-bold">فعلا هیچ عادتی نداری ! </h3>
          <button
            onClick={() =>
              document.getElementById("new_habit_modal").showModal()
            }
            className="btn btn-primary"
          >
            ایجاد عادت جدید
          </button>
        </div>
      )}
    </>
  );
};

export default MyHabits;
