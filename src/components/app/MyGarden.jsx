"use client";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

import axios from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

const MyGarden = ({ userId, isProfile }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-garden"],
    queryFn: async () => {
      const response = await axios.get(`/api/mygarden?userId=${userId}`);
      return response.data;
    },
  });

  const flowersAndTrees = [
    {
      name: "رز",
      icon: "🌹",
      rarity: "کم یاب",
      cost: 20,
    },
    {
      name: "لاله",
      icon: "🌷",
      rarity: "عادی",
      cost: 10,
    },
    {
      name: "بنفشه",
      icon: "🌸",
      rarity: "نادر",
      cost: 30,
    },
    {
      name: "تاج خروس",
      icon: "🌻",
      rarity: "عادی",
      cost: 15,
    },
    {
      name: "گیاه بامبو",
      icon: "🎋",
      rarity: "کم یاب",
      cost: 25,
    },
    {
      name: "نخل خرما",
      icon: "🌴",
      rarity: "نادر",
      cost: 40,
    },
    {
      name: "بلوط",
      icon: "🌳",
      rarity: "افسانه ای",
      cost: 50,
    },
    {
      name: "کاج",
      icon: "🌲",
      rarity: "کم یاب",
      cost: 35,
    },
    {
      name: "ارکیده",
      icon: "💐",
      rarity: "عادی",
      cost: 12,
    },
    {
      name: "گیاه پیچک",
      icon: "🌿",
      rarity: "نادر",
      cost: 28,
    },
  ];

  const audio = new Audio("/sounds/plant.mp3");

  const plantMutation = useMutation({
    mutationFn: ({ flower, i }) => {
      return axios.post(`/api/mygarden/plant`, {
        flowerIndex: i,
        flowerName: flower.name,
        cost: flower.cost,
      });
    },

    onSuccess: async () => {
      queryClient.invalidateQueries(["my-garden"]).then(() => {
        queryClient.refetchQueries(["my-garden"]);
        audio.play();
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: ({ index, cost }) => {
      return axios.put(`/api/mygarden/upgrade`, {
        flowerIndex: index,
        flowerCost: cost,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["my-garden"]).then(() => {
        queryClient.refetchQueries(["my-garden"]);
      });
    },
    onError: (err) => {
      toast.error(err.response.data.error);
    },
  });

  const getCornerClass = (index) => {
    if (index === 0) return "rounded-tr-lg"; // Top-left corner
    if (index === 4) return "rounded-tl-lg"; // Top-right corner
    if (index === 15) return "rounded-br-lg"; // Bottom-left corner
    if (index === 19) return "rounded-bl-lg"; // Bottom-right corner
    return ""; // No rounding for non-corner boxes
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center gap-5">
        {!isProfile && <div className="skeleton h-5 w-10" />}
        <div className="skeleton h-[250px] w-[250px] lg:h-[400px] lg:w-[400px]" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="skeleton h-10 w-10" />
          <div className="skeleton h-10 w-10" />
          <div className="skeleton h-10 w-10" />
          <div className="skeleton h-10 w-10" />
        </div>
      </div>
    );

  // Map flowers to their positions
  const plantedFlowers = Array(20).fill(null);

  data.flowers.forEach((flower) => {
    plantedFlowers[flower.i] = {
      name: flower.name,
      level: flower.level,
      icon: flowersAndTrees.find((f) => f.name === flower.name)?.icon || "🌱",
    };
  });

  return (
    <div className="flex flex-col items-center gap-10 self-center">
      {!isProfile && <div> {data.coins} 💎</div>}
      <div className="grid grid-cols-5 rounded-lg bg-primary/5">
        {Array.from({ length: 20 }).map((_, i) => {
          const flowerContent = plantedFlowers[i] ? (
            <div className="flex w-56 flex-col gap-3">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="rounded-lg bg-primary/10 p-2 text-lg">
                  {plantedFlowers[i].icon}
                </span>
                <span>سطح : {plantedFlowers[i].level}</span>
                {plantedFlowers[i].level < 3 ? (
                  <button
                    onClick={() =>
                      upgradeMutation.mutate({
                        index: i,
                        cost: flowersAndTrees.find(
                          (flower) => flower.name === plantedFlowers[i].name,
                        ).cost,
                      })
                    }
                    className="btn btn-secondary btn-sm"
                  >
                    ارتقاء
                  </button>
                ) : (
                  <span className="text-xs">حداکثر سطح رسیده است</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex max-h-[300px] w-56 flex-col gap-3 overflow-y-auto">
              {flowersAndTrees.map((flower, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm font-bold"
                >
                  <span className="rounded-lg bg-primary/10 p-2 text-lg">
                    {flower.icon}
                  </span>
                  <span>{flower.cost} 💎</span>
                  <button
                    onClick={() => plantMutation.mutate({ flower, i })}
                    className="btn btn-primary btn-sm"
                  >
                    بکار
                  </button>
                </div>
              ))}
            </div>
          );

          const boxContent = (
            <div
              className={`relative flex ${isProfile ? "h-10 w-10 md:h-14 md:w-14 lg:h-20 lg:w-20" : "h-12 w-12 md:h-16 md:w-16 lg:h-24 lg:w-24"} cursor-pointer items-center justify-center border border-dashed border-base-300 p-4 transition hover:bg-primary/20 ${getCornerClass(
                i,
              )}`}
            >
              {plantedFlowers[i] ? (
                <span
                  className={`${
                    plantedFlowers[i].level === 1
                      ? "text-base"
                      : plantedFlowers[i].level === 2
                        ? "text-2xl"
                        : "text-3xl"
                  }`}
                >
                  {plantedFlowers[i].icon}
                </span>
              ) : (
                ""
              )}
              <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                {plantedFlowers[i]?.level}
              </span>
            </div>
          );

          return isProfile ? (
            <div key={i}>{boxContent}</div>
          ) : (
            <Tippy
              key={i}
              content={flowerContent}
              interactive
              placement={i > 9 ? "top" : "bottom"}
            >
              {boxContent}
            </Tippy>
          );
        })}
      </div>
      {!isProfile && (
        <div className="space-y-3">
          <p className="text-sm font-bold">گل های در دسترس جهت کاشتن : </p>
          <div className="flex flex-wrap items-center gap-3">
            {flowersAndTrees.map((flower, idx) => (
              <Tippy
                key={idx}
                content={
                  <div className="flex flex-col gap-3 p-3 text-sm">
                    <span className="font-bold">{flower.name}</span>
                    <span className="font-semibold">
                      میزان سختی : {flower.rarity}
                    </span>
                    <span>قیمت : {flower.cost} 💎</span>
                  </div>
                }
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/50 text-lg">
                  {flower.icon}
                </div>
              </Tippy>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGarden;
