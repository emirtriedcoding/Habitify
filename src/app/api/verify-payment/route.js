import axios from "axios";

import { authUser } from "@/lib/helpers";

export const PUT = async (req) => {
  const user = await authUser();

  if (!user) {
    return Response.json({
      message: "لطفا ابتدا وارد شوید !",
    });
  }

  const { authority } = await req.json();

  try {
    const res = await axios.post(
      "https://payment.zarinpal.com/pg/v4/payment/verify.json",
      {
        merchant_id: process.env.ZARIN,
        amount: 1990000,
        authority,
      },
    );

    if (res.data.data.code === 100) {
      user.isPaid = true;
      await user.save();
      return Response.json({
        message: "پرداخت با موفقیت انجام شد !",
        ref_id: res.data.data.ref_id,
      });
    }
  } catch (error) {
    console.log("Error while verifying the payment =>", error);
    return Response.json({
      message: "خطایی در پرداخت رخ داده است !",
    });
  }
};
