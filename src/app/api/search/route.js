import connectToDb from "@/config/db";

import User from "@/models/User";

export const GET = async (req) => {
  const q = req.nextUrl.searchParams.get("q");

  try {
    connectToDb();

    const results = await User.find({
      username: { $regex: new RegExp(q, "i") }, // Case-insensitive search
    })
      .select("name , username , image")
      .limit(10);

    return Response.json(results);
  } catch (error) {
    console.log("Error while searching products : ", error);

    return Response.json({ msg: "خطای سرور !" }, { status: 500 });
  }
};
