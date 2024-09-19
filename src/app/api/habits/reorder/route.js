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

  try {
    const { daily, weekly } = await req.json();

    user.habits = [...daily, ...weekly];

    await user.save();

    return Response.json({
      message: "عادت با موفقیت مرتب شد !",
    });
  } catch (error) {
    console.log("Error while reordering habits =>", error);
    return Response.json(
      {
        message: "خطای سرور !",
      },
      {
        status: 500,
      },
    );
  }
};
