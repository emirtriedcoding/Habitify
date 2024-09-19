import connectToDb from "@/config/db";
import Habit from "@/models/Habit";

import EditTask from "@/components/app/EditTask";
import Back from "@/components/global/Back";

import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  connectToDb();

  const habit = await Habit.findById(params.habitId);

  return {
    title: `ویرایش عادت ${habit?.name}`,
    description: habit?.description,
  };
};

const EditHabitPage = async ({ params }) => {
  const { habitId } = params;

  if (!isValidObjectId(habitId)) return redirect("/app/my-habits");

  return (
    <div className="flex flex-col items-center">
      <Back />
      <EditTask habitId={habitId} />
    </div>
  );
};

export default EditHabitPage;
