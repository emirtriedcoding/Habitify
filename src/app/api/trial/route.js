import { authUser } from "@/lib/helpers";

export const GET = async () => {
  const user = await authUser();

  if (!user) {
    return Response.json(
      { message: "لطفا ابتدا وارد شوید !" },
      { status: 401 },
    );
  }

  const today = new Date();

  const trialEndDate = new Date(user.createdAt);

  trialEndDate.setDate(trialEndDate.getDate() + 7);


  const remainingDays = Math.max(
    Math.ceil((trialEndDate - today) / (1000 * 60 * 60 * 24)),
    0,
  );

  return Response.json({
    remainingDays,
    isPaid: user.isPaid,
  });
};
