import axios from "axios";

export const POST = async () => {
  try {
    const res = await axios.post(
      "https://payment.zarinpal.com/pg/v4/payment/request.json",
      {
        merchant_id: process.env.ZARIN,
        amount: 199000,
        currency: "IRT",
        description: "ارتقا کاربری هبیتیفای",
        callback_url: "https://habitify.ir/app/my-habits",
      },
    );

    if (res.data.data.code === 100) {
      return Response.json({
        url: `https://payment.zarinpal.com/pg/StartPay/${res.data.data.authority}`,
      });
    } else {
      console.error("Zarinpal response error:", res.data);
      return Response.json(
        { message: "درگاه شکست خورد !", details: res.data },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error(
      "Error while creating the payment =>",
      error.response?.data || error.message,
    );
    return Response.json({ message: "خطای سرور‌ !" }, { status: 500 });
  }
};
