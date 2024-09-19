"use client";

import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 min-h-screen items-center justify-center">
      <p className="text-lg font-bold">404 - چیزی پیدا نکردیم </p>
      <button onClick={() => router.push("/")} className="btn btn-primary">
        بازگشت
      </button>
    </div>
  );
};

export default NotFound;
