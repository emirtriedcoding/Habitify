import { authUser } from "@/lib/helpers";

export const GET = async () => {
  const user = await authUser();

  if (!user) {
    return Response.json(
      { message: "لطفا ابتدا وارد شوید !" },
      {
        status: 401,
      },
    );
  }

  return Response.json(user.habits);
};
