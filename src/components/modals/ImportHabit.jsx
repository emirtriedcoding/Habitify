"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

const ImportHabitModal = ({ habit }) => {
  const router = useRouter();

  const [year, setYear] = useState("1");

  const howMuch = () => {
    const total = Math.ceil(
      (habit.timeSpent * habit.frequency * year * 52) / 60,
    );

    return total;
  };

  const handleImport = () => {
    router.push(
      `/app/my-habits?name=${habit.name}&&frequency=${habit.frequency}`,
    );
  };

  return (
    <dialog id="import_habit_modal" className="modal">
      <div className="modal-box space-y-4 lg:space-y-6">
        <h3 className="text-lg font-bold">عادت {habit.name}</h3>
        <p className="text-xs leading-loose lg:text-sm">
          با زدن دکمه پایین میتونی همین عادتو ایجاد کنی و به اون چیزی که میخوای
          برسی !
        </p>
        <select
          onChange={(e) => setYear(e.target.value)}
          className="select select-bordered"
        >
          <option value="1">یک سال</option>
          <option value="5">پنج سال</option>
          <option value="10">ده سال</option>
        </select>
        <div className="text-center text-sm leading-loose">
          اگه این عادتو <span className="font-bold">{year}</span> سال منظم انجام
          بدی <span className="font-bold">{howMuch()}</span> دقیقه تونستی کامل
          انجامش بدی یا به عبارتی{" "}
          <span className="font-bold">{Math.ceil(howMuch() / 24)}</span> هفته در{" "}
          <span className="font-bold">{year}</span> سال !
        </div>
        <p className="text-center text-xs font-semibold leading-loose">
          نتایج بالا از داده‌های مربوط به متوسط افراد ساکن ایران استفاده می‌کند
          .
        </p>
        <button onClick={handleImport} className="btn btn-primary w-full">
          برو بریم
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>بستن</button>
      </form>
    </dialog>
  );
};

export default ImportHabitModal;
