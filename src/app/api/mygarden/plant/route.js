import { authUser, checkTrialStatus } from "@/lib/helpers";

export const POST = async (req) => {
  const user = await authUser();

  if (!user) {
    return Response.json({ error: "لطفا ابتدا وارد شوید !" }, { status: 401 });
  }

  const trialStatus = checkTrialStatus(user.createdAt, user.isPaid);

  if (!trialStatus.valid) {
    return Response.json({
      message: trialStatus.message,
    });
  }

  const { flowerName, flowerIndex, cost } = await req.json();

  if (user.coins < cost) {
    return Response.json({ message: "موجودی کافی نیست !" }, { status: 403 });
  }

  user.garden.flowers.push({ name: flowerName, i: flowerIndex, level: 1 });

  user.coins -= cost;

  await user.save();

  return Response.json("کاشته شد !", { status: 201 });
};
