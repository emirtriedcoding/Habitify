"use client";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const CheckTrial = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["trial"],
    queryFn: () => axios.get("/api/trial").then((res) => res.data),
  });

  if (isLoading) return null;

  const { remainingDays, isPaid } = data;

  return (
    <div>
      {!isPaid && (
        <div className="flex flex-col items-center justify-center gap-3 bg-base-200 p-3 md:flex-row md:gap-5">
          <p
            className={`text-sm font-bold ${remainingDays <= 3 ? "text-warning" : remainingDays === 0 ? "text-error" : ""}`}
          >
            {remainingDays === 0
              ? "جهت ادامه باید تعرفه خود را ارتقا دهید !"
              : `${remainingDays} روز باقی مونده`}
          </p>
          <progress
            className={`progress h-3 w-32 md:w-40 ${remainingDays <= 3 ? "progress-warning" : remainingDays === 0 ? "progress-error" : "progress-primary"}`}
            value={remainingDays}
            max="7"
          />
          <button
            onClick={() => router.push("/#pricing")}
            className="btn btn-primary btn-sm"
          >
            همین الان ارتقا بده
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckTrial;
