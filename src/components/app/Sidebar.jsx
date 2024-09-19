"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { routes } from "@/lib/constants";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="drawer !w-0 lg:drawer-open ">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-50 lg:z-auto">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-[200px] gap-5 border-l border-base-200 bg-base-100 p-0 pr-2 text-base-content">
          <li>
            <Link href="/" className="mt-5 self-center text-lg font-bold">
              هبیتیفای
            </Link>
          </li>
          {routes.map((route) => (
            <li
              onClick={() => document.getElementById("drawer").click()}
              key={route.path}
            >
              <Link
                href={route.path}
                className={`${pathname === route.path ? "bg-primary/30" : ""} rounded-none rounded-r-xl`}
              >
                <route.icon strokeWidth={1.5} size={20} />
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
