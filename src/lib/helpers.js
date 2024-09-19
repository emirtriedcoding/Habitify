import connectToDb from "@/config/db";
import User from "@/models/User";

import { auth } from "@/app/auth";

export const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

export const authUser = async () => {
  const session = await auth();

  if (!session) return null;

  connectToDb();

  const user = await User.findOne({ email: session.user.email })
    .populate("habits")
    .populate({
      path: "followings",
      populate: {
        path: "activities",
      },
    })
    .populate({
      path: "groups",
      populate: [
        {
          path: "completions.user",
        },
        {
          path: "members",
        },
      ],
    });

  user.groups.forEach((groupHabit) => {
    groupHabit.completions.sort((a, b) => new Date(b.at) - new Date(a.at));
  });

  if (!user) return null;

  return user;
};

export const checkTrialStatus = (createdAt, isPaid) => {
  const today = new Date();
  const trialEndDate = new Date(createdAt);

  trialEndDate.setDate(trialEndDate.getDate() + 7);

  if (today > trialEndDate && !isPaid) {
    return {
      valid: false,
      message: "جهت استفاده بیشتر از سرویس بایستی تعرفه ارتقا داده شود !",
    };
  }

  return { valid: true };
};

export const formattedDate = (date) => {
  const d = date || new Date();
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

export const hexToRgba = (hex, opacity) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${r},${g},${b},${opacity})`;
};

export const achievements = [
  {
    label: "شروع کن!",
    desc: "اولین عادت خود را ایجاد کن!",
    value: 1,
    icon: "🌟",
    key: "action",
    condition: (data) => data.habits.length >= 1,
  },
  {
    label: "اولین قدم!",
    desc: "اولین عادت خود را کامل کن!",
    value: 1,
    icon: "🚀",
    key: "first_action",
    condition: (data) => data.habits?.some((habit) => habit.records.length > 1),
  },
  {
    label: "ماموریت انجام شد!",
    desc: "تمام وظایف امروز را کامل کن!",
    value: 1,
    icon: "🏅",
    key: "missions",
    condition: (data) =>
      data.tasks.filter((task) => task.at === formattedDate(new Date()))
        .length === 3,
  },
  {
    label: "بازیکن تیمی!",
    desc: "اولین عادت گروهی خود را ایجاد کن و یک دوست دعوت کن!",
    value: 1,
    icon: "🤝",
    key: "team",
    condition: (data) => data.groupHabits.length >= 1,
  },
  {
    label: "استاد عادت!",
    desc: "۱۰ عادت ایجاد کن!",
    value: 1,
    icon: "🏆",
    key: "10_habits",
    condition: (data) => data.habits.length >= 10,
  },
  {
    label: "پادشاه پایداری!",
    desc: "به مدت یک ماه فعالیت پایدار داشته باش!",
    value: 1,
    icon: "📅",
    key: "consistency",
    condition: (data) => {
      const now = new Date();
      const regDate = new Date(data.registrationDate);
      const diffTime = now - regDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 30;
    },
  },
  {
    label: "پروانه اجتماعی!",
    desc: "یک نام کاربری انتخاب کن و کسی را دنبال کن!",
    value: 1,
    icon: "🦋",
    key: "follow",
    condition: (data) => data.followings.length >= 1,
  },
  {
    label: "خدای عادت!",
    desc: "بیش از ۵۰ عادت داشته باش!",
    value: 1,
    icon: "👑",
    key: "godofhabit",
    condition: (data) => data.habits.length >= 50,
  },
  {
    label: "کهنه‌کار!",
    desc: "یک عادت را ۳۶۵ بار کامل کن!",
    value: 1,
    icon: "🎖️",
    key: "old",
    condition: (data) =>
      data.habits?.some((habit) => habit.records.length >= 365),
  },
  {
    label: "بازیکن نهایی!",
    desc: "یک عادت را ۱۲۵۰ بار کامل کن!",
    value: 1,
    icon: "🔥",
    key: "godmod",
    condition: (data) =>
      data.habits?.some((habit) => habit.records.length >= 1250),
  },
  {
    label: "قله!",
    desc: "یک عادت را ۱۰,۰۰۰ بار کامل کن!",
    value: 1,
    icon: "🏔️",
    key: "mountain",
    condition: (data) =>
      data.habits?.some((habit) => habit.records.length >= 10000),
  },
  {
    label: "باغبان!",
    desc: "اولین گل را در باغ خود بکار!",
    value: 1,
    icon: "🌻",
    key: "gardener",
    condition: (data) => data.garden.flowers.length > 0,
  },
  {
    label: "مشتری وفادار!",
    desc: "طرح ما را خریداری کن!",
    value: 1,
    icon: "🎉",
    key: "loyal",
    condition: (data) => data.subscription === "paid",
  },
];
