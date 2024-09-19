import connectToDb from "@/config/db";
import Activity from "@/models/Activity";

import { achievements, authUser, checkTrialStatus } from "@/lib/helpers";

export const POST = async (req) => {
  const { key } = await req.json();

  const achievement = achievements.find((ach) => ach.key === key);

  if (!achievement) {
    return Response.json({ message: "دستاورد یافت نشد !" }, { status: 404 });
  }

  const user = await authUser();

  if (!user) {
    return Response.json(
      { message: "لطفا ابتدا وارد شوید !" },
      { status: 401 },
    );
  }

  const trialStatus = checkTrialStatus(user , user.isPaid);

  if (!trialStatus.valid) {
    return Response.json({ message: trialStatus.message }, { status: 403 });
  }

  let coinsAdded = 0;
  let scoreAdded = 0;

  switch (key) {
    case "action":
      coinsAdded = 5;
      scoreAdded = 15;
      break;

    case "first_action":
      coinsAdded = 10;
      scoreAdded = 30;
      break;

    case "missions":
      coinsAdded = 15;
      scoreAdded = 60;
      break;

    case "team":
      coinsAdded = 20;
      scoreAdded = 120;
      break;

    case "10_habits":
      coinsAdded = 25;
      scoreAdded = 240;
      break;

    case "consistency":
      coinsAdded = 30;
      scoreAdded = 480;
      break;

    case "follow":
      coinsAdded = 35;
      scoreAdded = 960;
      break;

    case "godofhabit":
      coinsAdded = 40;
      scoreAdded = 1300;
      break;

    case "old":
      coinsAdded = 45;
      scoreAdded = 1500;
      break;

    case "godmod":
      coinsAdded = 60;
      scoreAdded = 3000;
      break;

    case "mountain":
      coinsAdded = 70;
      scoreAdded = 4000;
      break;

    case "gardener":
      coinsAdded = 90;
      scoreAdded = 4900;
      break;

    case "loyal":
      coinsAdded = 180;
      scoreAdded = 6000;
      break;

    default:
      return Response.json({ message: "دستاورد نامعتبر !" }, { status: 400 });
  }

  connectToDb();

  const newActivity = await Activity.create({
    body: `کاربر ${user.name} به دستاورد جدیدی دست یافت !`,
    user: user._id,
  });

  user.coins += coinsAdded;
  user.score += scoreAdded;

  user.achievements.push({ key });
  user.activities.push(newActivity._id);

  await user.save();

  return Response.json({
    rewards: [
      {
        icon: "💎",
        count: coinsAdded,
      },
      {
        icon: "🏆",
        count: scoreAdded,
      },
    ],
  });
};
