import { authUser } from "@/lib/helpers";

export const PUT = async (req) => {
  const user = await authUser();

  if (!user) {
    return Response.json(
      {
        message: "لطفا ابتدا وارد شوید !",
      },
      {
        status: 401,
      },
    );
  }

  const { url } = await req.json();

  user.image = url;

  await user.save();

  return Response.json({
    message: "تصویر با موفقیت تغییر کرد !",
  });
};
