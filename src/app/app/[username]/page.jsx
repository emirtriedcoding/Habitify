import connectToDb from "@/config/db";
import User from "@/models/User";

import Profile from "@/components/app/Profile";

import { authUser } from "@/lib/helpers";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  const { username } = params;

  connectToDb();

  const user = await User.findOne({ username: username.toLowerCase().trim() });

  if (!user) return notFound();

  return {
    title: `پروفایل کاربر - ${user.name}`,
    description: `هبیت های کاربر ${user?.username}`,
    openGraph: {
      title: `پروفایل کاربر - ${user.name}`,
      description: `هبیت های کاربر ${user?.username}`,
      url: `https://habitify.ir/app/${user.username}`,
      siteName: "Habitify",
      images: user?.image,
    },
  };
};

const UserPage = async ({ params }) => {
  const { username } = params;

  connectToDb();

  const user = await User.findOne({ username: username.toLowerCase().trim() })
    .populate("habits")
    .populate("activities");

  if (!user) return notFound();

  const currentUser = await authUser();

  return (
    <div className="mx-auto lg:w-1/2">
      <Profile
        user={JSON.parse(JSON.stringify(user))}
        currentUser={JSON.parse(JSON.stringify(currentUser))}
        isPreview={true}
      />
    </div>
  );
};

export default UserPage;
