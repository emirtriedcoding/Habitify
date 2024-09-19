import connectToDb from "@/config/db";
import Activity from "@/models/Activity";

export const GET = async () => {
  connectToDb();

  const activities = await Activity.find({})
    .sort({ createdAt: -1 })
    .populate("user", "name username image -_id");

  return Response.json(activities);
};
