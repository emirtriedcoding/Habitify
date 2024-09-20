import connectToDb from "@/config/db";
import Activity from "@/models/Activity";

export const GET = async () => {
  connectToDb();

  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .populate("user", "name username image -_id");

    return Response.json(activities);
  } catch (error) {
    console.log("Error while getting activities =>", error);
    return Response.json({
      message: "خطای سرور !",
    });
  }
};
