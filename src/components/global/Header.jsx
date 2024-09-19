"use client";

import Image from "next/image";
import Link from "next/link";

import Auth from "../modals/Auth";

const Header = () => {
  return (
    <header className="flex h-[75px] w-full items-center justify-between rounded-xl border border-base-200 px-2 lg:px-5 py-3 shadow-sm">
      <Link href="/" className="btn btn-ghost">
        <Image src="/assets/logo.png" width={35} height={35} />
      </Link>
      <Link
        href="/"
        className="font-bold text-primary transition hover:scale-105 lg:text-xl"
      >
        <h1>هبیتیفای</h1>
      </Link>
      <button
        onClick={() => document.getElementById("auth_modal").showModal()}
        className="btn btn-primary btn-sm text-xs lg:btn-md"
      >
        شروع کنید
      </button>
      <Auth />
    </header>
  );
};

export default Header;
