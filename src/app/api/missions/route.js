import { authUser, checkTrialStatus, formattedDate } from "@/lib/helpers";

export const GET = async () => {
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

  return Response.json({
    coins: user.coins,
    habits: user.habits,
    groupHabits: user.groups,
    achievements: user.achievements,
    garden: user.garden,
    followings: user.followings,
    subscription: false,
    tasks: user.tasks,
  });
};

export const POST = async (req) => {
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

  const trialStatus = checkTrialStatus(user.createdAt, user.isPaid);

  if (!trialStatus.valid) {
    return Response.json({
      message: trialStatus.message,
    });
  }

  const { type } = await req.json();

  const d = formattedDate(new Date());

  if (user.tasks.some((task) => task.at === d && task.type === type)) {
    return Response.json(
      {
        message: "این کار امروز انجام شده است !",
      },
      {
        status: 400,
      },
    );
  }

  user.tasks.push({
    type,
    at: d,
  });

  let coinsAdded = 0;
  let scoreAdded = 0;

  switch (type) {
    case "complete":
      coinsAdded = 5;
      scoreAdded = 5;
      break;
    case "atleasttwo":
      coinsAdded = 6;
      scoreAdded = 6;
      break;
    case "atleastthree":
      coinsAdded = 7;
      scoreAdded = 7;
      break;
  }

  user.coins += coinsAdded;
  user.score += scoreAdded;

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
