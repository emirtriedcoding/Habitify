"use client";

import axios from "axios";

import { useState } from "react";
import { toast } from "sonner";

import { XCircle } from "lucide-react";


const Feedback = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ratings = ["🤩", "😊", "😶", "😕", "😭"];

  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(ratings[0]);

  const sendFeedback = () => {
    if (!message) {
      toast.error("لطفا ابتدا پیام خود را وارد نمایید");
      return;
    }

    axios
      .post("/api/feedback", {
        message,
        rating,
      })
      .then(() => {
        toast.success("نظر شما با موفقیت ثبت شد");
        setIsOpen(false);
      });
  };

  return (
    <div className="fixed bottom-0 left-0 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-tr-lg bg-base-200 border border-dashed border-base-300 p-3 text-sm font-bold"
        >
          انتقاد و پیشنهاد
        </button>
      )}
      {isOpen && (
        <div className="flex lg:w-96 flex-col gap-3 rounded-tr-lg border border-base-200 bg-base-100 p-5">
          <XCircle
            strokeWidth={1.5}
            onClick={() => setIsOpen(false)}
            className="cursor-pointer"
          />
          <h6 className="font-bold">انتقادات و پیشنهادات</h6>
          <p className="text-xs font-semibold leading-loose">
            هرگونه درخواستی جهت بهبود پلتفرم دارید خوشحالم میشیم که با ما در
            جریان بزارید ...
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea textarea-bordered"
            s
            placeholder="خیلی بهتر میشد که ..."
          />
          <p className="text-sm font-bold">نظر صادقانتون ؟ </p>
          <div className="flex items-center justify-center gap-4">
            {ratings.map((r , i) => (
              <span
               key={i}
                onClick={() => setRating(r)}
                className={`${r === rating ? "scale-150 saturate-100" : "saturate-0"} cursor-pointer text-xl transition hover:scale-125`}
              >
                {r}
              </span>
            ))}
          </div>
          <button onClick={sendFeedback} className="btn btn-primary">
            ارسال
          </button>
        </div>
      )}
    </div>
  );
};

export default Feedback;
