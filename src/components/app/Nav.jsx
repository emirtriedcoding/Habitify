"use client";

import { usePathname } from "next/navigation";

import { routes } from "@/lib/constants";

import { Menu } from "lucide-react";

const Nav = ({ image }) => {
  const pathname = usePathname();

  const label = routes.find((route) => route.path === pathname)?.label;

  return (
    <div className="z-50 flex h-[50px] items-center justify-between border-b border-base-200 px-5">
      <Menu
        onClick={() => {
          document.getElementById("drawer").click();
        }}
        size={20}
        strokeWidth={1.5}
        className="lg:hidden"
      />
      <h2 className="text-sm font-bold text-secondary">{label}</h2>
      <img onClick={() => document.getElementById("profile_modal").showModal()} src={image || "/assets/noavatar.png"} alt="User Image" className="h-8 w-8 rounded-full cursor-pointer transition hover:scale-105" />
    </div>
  );
};

export default Nav;
