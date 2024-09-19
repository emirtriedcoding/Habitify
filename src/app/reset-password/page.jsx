import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";

export const metadata = {
  title: "هبیتیفای - بازیابی گذرواژه",
};

const ResetPasswordPage = ({ searchParams }) => {
  const { token } = searchParams;

  try {
    verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return redirect("/"); 
  }

  return <ResetPasswordForm token={token} />;
};

export default ResetPasswordPage;
