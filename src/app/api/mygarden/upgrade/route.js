import { authUser, checkTrialStatus } from "@/lib/helpers";

export const PUT = async (req) => {
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

  const { flowerIndex, flowerCost } = await req.json();

  const flower = user.garden.flowers.find(
    (flower) => +flower.i === flowerIndex,
  );

  if (!flower) {
    return Response.json({ error: "گیاه پیدا نشد !" }, { status: 404 });
  }

  if (flower.level === 3) {
    return Response.json(
      { error: "گیاه به حداکثر سطح رشد رسیده است !" },
      { status: 403 },
    );
  }

  if (!flowerCost) {
    return Response.json({ error: "نامعتبر !" }, { status: 403 });
  }

  if (user.coins < flowerCost) {
    return Response.json({ error: "موجودی کافی نیست !" }, { status: 403 });
  }

  flower.level += 1;

  await user.save();

  return Response.json({ message: "ارتقا یافت !" });
};
