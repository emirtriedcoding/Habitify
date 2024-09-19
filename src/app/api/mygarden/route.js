import connectToDb from "@/config/db";
import User from "@/models/User";

export const GET = async (req) => {
  const userId = req.nextUrl.searchParams.get("userId");

  connectToDb();

  const user = await User.findById(userId);

  return Response.json({
    coins: user.coins,
    flowers: user.garden.flowers,
  });
};
