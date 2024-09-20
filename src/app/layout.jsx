import localFont from "next/font/local";
import "./globals.css";

import SessionProvider from "@/providers/session-provider";

import { Analytics } from "@vercel/analytics/react"

import { Toaster } from "sonner";

export const metadata = {
  title: "هبیتیفای - ایجاد و مدیریت عادت های مفید در زندگی شخصی",
  description:
    "هبیتیفای - اولین هبیت ترکر پیشرفته در ایران شامل تمامی ویژگی ها و امکانات جهت ایجاد و مدیریت عادت های مفید در زندگی شخصی !",
  icons: {
    icon: "/assets/logo.png",
  },
};

const font = localFont({
  src: [
    {
      path: "../../public/fonts/Pelak-R.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pelak-S.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pelak-B.woff",
      weight: "800",
      style: "normal",
    },
  ],
});

const RootLayout = ({ children }) => {
  return (
    <html lang="fa" dir="rtl">
      <body className={font.className} data-theme="emerald">
        <SessionProvider>
          <Toaster className={font.className} theme="light" closeButton richColors />
          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
