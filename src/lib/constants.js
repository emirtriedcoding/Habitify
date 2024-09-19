import {
  Calculator,
  Leaf,
  Tractor,
  Trees,
  Users,
  UserSearch,
} from "lucide-react";

export const routes = [
  {
    label: "عادت های من ",
    path: "/app/my-habits",
    icon: Leaf,
  },
  {
    label: "عادت های گروهی",
    path: "/app/group-habits",
    icon: Users,
  },
  {
    label: "محاسبه گر عادت",
    path: "/app/visualize-habit",
    icon: Calculator,
  },
  {
    label: "مراحل",
    path: "/app/missions",
    icon: Trees,
  },
  {
    label: "مزرعه من ",
    path: "/app/my-garden",
    icon: Tractor,
  },
  {
    label: "لیدربرد و سایر کاربران",
    path: "/app/social",
    icon: UserSearch,
  },
];

export const days = [
  {
    label: "شنبه",
    value: 6,
  },
  {
    label: "یکشنبه",
    value: 0,
  },
  {
    label: "دوشنبه",
    value: 1,
  },
  {
    label: "سه شنبه",
    value: 2,
  },
  {
    label: "چهارشنبه",
    value: 3,
  },
  { label: "پنجشنبه", value: 4 },
  {
    label: "جمعه",
    value: 5,
  },
];

export const themes = [
  { name: "روشن", value: "light" },
  { name: "تاریک", value: "dark" },
  { name: "کاپ‌کیک", value: "cupcake" },
  { name: "زنبور عسل", value: "bumblebee" },
  { name: "زمرد", value: "emerald" },
  { name: "شرکتی", value: "corporate" },
  { name: "سینث‌ویو", value: "synthwave" },
  { name: "رترو", value: "retro" },
  { name: "سایبرپانک", value: "cyberpunk" },
  { name: "ولنتاین", value: "valentine" },
  { name: "هالووین", value: "halloween" },
  { name: "باغ", value: "garden" },
  { name: "جنگل", value: "forest" },
  { name: "آب", value: "aqua" },
  { name: "لوفی", value: "lofi" },
  { name: "پاستل", value: "pastel" },
  { name: "فانتزی", value: "fantasy" },
  { name: "وایرفریم", value: "wireframe" },
  { name: "سیاه", value: "black" },
  { name: "لوکس", value: "luxury" },
  { name: "دراکولا", value: "dracula" },
  { name: "سی‌ام‌وای‌کی", value: "cmyk" },
  { name: "پاییز", value: "autumn" },
  { name: "تجاری", value: "business" },
  { name: "اسید", value: "acid" },
  { name: "لیموناد", value: "lemonade" },
  { name: "شب", value: "night" },
  { name: "قهوه", value: "coffee" },
  { name: "زمستان", value: "winter" },
  { name: "تاریک‌ملایم", value: "dim" },
  { name: "نورد", value: "nord" },
  { name: "غروب", value: "sunset" },
];
