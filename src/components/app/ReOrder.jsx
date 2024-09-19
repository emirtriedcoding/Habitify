"use client";

import axios from "axios";
import Back from "../global/Back";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { DndContext } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { toast } from "sonner";

const SortableItem = ({ habit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: habit._id,
    });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
      }}
      className="rounded-lg border border-base-300 bg-base-200 p-3 text-sm font-bold lg:text-lg"
    >
      {habit.name}
    </div>
  );
};

const ReOrder = () => {
  const queryClient = useQueryClient();

  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);

  const {
    data: habits,
    isLoading,
    status,
  } = useQuery({
    queryKey: ["reorder"],
    queryFn: () => axios.get("/api/habits").then((res) => res.data),
  });

  useEffect(() => {
    if (status === "success") {
      setDaily(habits.filter((habit) => habit.type === "daily"));
      setWeekly(habits.filter((habit) => habit.type === "weekly"));
    }
  }, [status, habits]);

  const mutation = useMutation({
    mutationFn: (data) => axios.put("/api/habits/reorder", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["reorder", "habits"]);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-1/2 space-y-3">
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-10 w-full" />
      </div>
    );
  }

  const moveItems = async (e, type) => {
    const { active, over } = e;

    if (!over) return;

    if (active.id !== over.id) {
      const data = type === "daily" ? daily : weekly;

      const oldIndex = data.findIndex((link) => link._id === active.id);
      const newIndex = data.findIndex((link) => link._id === over.id);

      const array = arrayMove(data, oldIndex, newIndex);

      type === "daily" ? setDaily(array) : setWeekly(array);

      mutation.mutate({
        daily: type === "daily" ? array : daily,
        weekly: type === "weekly" ? array : weekly,
      });
    }
  };

  return (
    <div className="mx-auto space-y-3 lg:w-1/2">
      <Back />
      <DndContext onDragEnd={(e) => moveItems(e, "daily")}>
        <SortableContext items={daily?.map(({ _id }) => _id)}>
          <ul className="flex flex-col gap-3">
            {daily.map((item) => (
              <SortableItem key={item._id} habit={item} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {weekly.length !== 0 && <span className="divider">هفتگی</span>}
      <DndContext onDragEnd={(e) => moveItems(e, "weekly")}>
        <SortableContext items={weekly?.map(({ _id }) => _id)}>
          <ul className="flex flex-col gap-3">
            {weekly.map((item) => (
              <SortableItem key={item._id} habit={item} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ReOrder;
