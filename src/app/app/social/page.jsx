import connectToDb from "@/config/db";
import User from "@/models/User";

import Social from "@/components/app/Social";

import { authUser } from "@/lib/helpers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "هبیتیفای - کاربران و لیدربرد",
};

const SocialPage = async () => {
  const user = await authUser();

  connectToDb();

  if (!user.username) return redirect("/app/my-habits?settings=true");

  const topUsers = await User.find({}).sort({ score: -1 });

  return (
    <Social
      user={JSON.parse(JSON.stringify(user))}
      topUsers={JSON.parse(JSON.stringify(topUsers))}
    />
  );
};

export default SocialPage;
