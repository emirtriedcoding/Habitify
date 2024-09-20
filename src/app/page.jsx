"use client";

import Header from "@/components/global/Header";
import Image from "next/image";

import axios from "axios";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { motion } from "framer-motion";

import { Check, Instagram, Linkedin, Star } from "lucide-react";

const HomePage = () => {
  const router = useRouter();

  const { data } = useSession();

  const handlePayment = () => {
    if (!data) {
      handleAuth();
      return;
    }
    axios.post("/api/payment").then((res) => {
      router.push(res.data.url);
    });
  };

  const handleAuth = () => {
    document.getElementById("auth_modal").showModal();
  };

  const items = [
    "دسترسی کامل به تمامی امکانات",
    "ایجاد و تکمیل نامحدود عادت ها",
    "ایجاد نامحدود عادت های گروهی",
    "محاسبه گر عادت",
    "دسترسی کامل به بخش مراحل و جوایز",
    "دسترسی کامل به بخش مزرعه",
    "بیش از 25 تم مختلف و زیبا",
    "و کلی امکانات ویژه دیگر ...",
  ];

  return (
    <>
      <div className="relative z-50 mx-auto min-h-screen max-w-3xl p-5">
        <Header />
        <motion.div
          className="mt-8 flex min-h-screen flex-col items-center gap-7 lg:gap-10 lg:!mt-16"
          initial={{
            y: -100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <h4 className="text-center text-xl font-bold leading-loose text-primary lg:text-4xl">
            عادت هایی بساز که هرگز فراموششون نکنی
          </h4>
          <p className="text-center text-xs font-semibold leading-loose lg:text-sm">
            اینجا بهت کمک میکنم که به زندگیت بهبود و نظم ببخشی و بهش پایدار باشی
          </p>
          <div className="relative mt-20 lg:mt-40">
            <Image
              className="scale-105 rounded-lg shadow-2xl shadow-secondary/20 lg:scale-110"
              src="/assets/1.png"
              width="1000"
              height="1000"
            />
            <Image
              className="absolute -top-20 -z-50 rounded-lg lg:-top-40"
              src="/assets/2.png"
              width="1000"
              height="1000"
            />
          </div>
          <div className="my-5 flex flex-col items-center justify-center gap-3 lg:w-1/2 lg:flex-row">
            <button onClick={handleAuth} className="btn btn-primary">
              رایگان شروع کنید !
            </button>
            <button onClick={handleAuth} className="btn btn-outline">
              حساب کاربری دارم{" "}
            </button>
          </div>
          <h3 className="text-center text-xl font-bold leading-loose lg:text-4xl">
            ساختن عادت های خوب واقعا سخته اما ...
          </h3>
          <p className="text-sm font-bold text-secondary lg:text-lg">
            نه با ما ! با ما خیلیم آسونه ... 😉 فقط کافیه
          </p>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="borde-base-300 card border bg-base-100 shadow-sm">
              <div className="card-body gap-5">
                <h4 className="card-title">انتخاب عادت 🎯</h4>
                <p className="text-sm font-semibold">هدفتو مشخص کن !</p>
                <p className="text-xs font-bold text-primary">
                  من میخوام وزنمو کم کنم
                </p>
                <p className="text-xs font-bold text-primary">
                  میخوام کتابای بیشتری بخونم
                </p>
              </div>
            </div>
            <div className="borde-base-300 card border bg-base-100 shadow-sm">
              <div className="card-body gap-5">
                <h4 className="card-title">تلاش 🏃‍♂️</h4>
                <p className="text-sm font-semibold">به کمک هبیتیفای !</p>
                <p className="text-xs font-bold text-primary">
                  استارت باشگاه !
                </p>
                <p className="text-xs font-bold text-primary">
                  استارت کار با عادت های اتمی
                </p>
              </div>
            </div>
            <div className="borde-base-300 card border bg-base-100 shadow-sm">
              <div className="card-body gap-5">
                <h4 className="card-title"> بالاخره نتیجه داد 😎</h4>
                <p className="text-sm font-semibold">هبیتیفای باعث شد که ...</p>
                <p className="text-xs font-bold text-primary">
                  بتونم وزنمو کم کنم
                </p>
                <p className="text-xs font-bold text-primary">
                  تونستم کتابای بیشتری بخونم !
                </p>
              </div>
            </div>
          </div>
          <h3 className="text-center text-xl font-bold leading-loose lg:text-4xl">
            با رفیقات با هم عادت های خوب بسازید !
          </h3>
          <p className="text-center text-sm font-bold leading-loose text-secondary lg:text-lg">
            عادت گروهی بساز - لینکشو بده رفیقت عضو شه و با هم هر روز رقابت کنید‌
            !
          </p>
          <Image
            className="-z-50 rounded-lg"
            src="/assets/3.png"
            width="1000"
            height="1000"
            alt="3"
          />
          <h3 className="text-center text-xl font-bold leading-loose lg:text-4xl">
            فقط برای شما تا زندگی بهتری داشته باشید !
          </h3>
          <p className="text-center text-sm font-bold leading-loose text-secondary lg:text-lg">
            ویدیو معرفی پلتفرم و نحوه استفاده :
          </p>
          <div className="card border border-base-200 bg-base-100 shadow-sm">
            <div className="card-body gap-5">
              <Image src="/assets/noavatar.png" width="30" height="30" />
              <span className="text-lg font-bold">امیررضا صالحی</span>
              <p className="text-sm font-semibold leading-loose text-gray-500">
                بنظرم واقعا پلتفرم جالب و کاربردی هستش و من سعی میکنم همیشه ازش
                استفاده کنم و تا اینجای کار خیلی تونسته کمکم کنه ! واقعا دمتون
                گرم !
              </p>
              <div className="flex items-center gap-1">
                <Star
                  className="fill-yellow-500 text-yellow-500"
                  size="20"
                  strokeWidth={1.5}
                />
                <Star
                  className="fill-yellow-500 text-yellow-500"
                  size="20"
                  strokeWidth={1.5}
                />
                <Star
                  className="fill-yellow-500 text-yellow-500"
                  size="20"
                  strokeWidth={1.5}
                />
                <Star
                  className="fill-yellow-500 text-yellow-500"
                  size="20"
                  strokeWidth={1.5}
                />
                <Star
                  className="fill-yellow-500 text-yellow-500"
                  size="20"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
          <h5 className="text-xl font-bold lg:text-3xl">تعرفه ها :</h5>
          <p className="text-sm font-semibold text-secondary lg:text-lg">
            ما مثل بقیه نیستیم ! تنها یک بار برای همیشه
          </p>
          <div id="pricing" className="card">
            <div className="card-body gap-5 rounded-lg bg-gradient-to-bl from-base-100 to-transparent shadow-sm">
              <h6 className="card-title">همیشگی !</h6>
              <ul className="mt-2 space-y-3">
                {items.map((item) => (
                  <li
                    className="flex items-center gap-2 text-[10px] font-bold text-green-500 lg:text-xs"
                    key={item}
                  >
                    <Check size="20" strokeWidth="3" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="line-through">399,000</span>
                <span className="text-lg text-success">199,000 تومان</span>
              </div>
              <button onClick={handlePayment} className="btn btn-primary">
                خرید
              </button>
            </div>
          </div>
        </motion.div>
        <div className="fixed inset-0 -z-50 h-screen w-full bg-gradient-to-br from-transparent to-primary/40" />
      </div>

      <footer className="footer footer-center relative z-50 border-t border-base-300 p-10 text-base-content">
        <nav>
          <div className="grid grid-flow-col gap-4">
            <Link href="https://instagram.com/emirtriedcoding">
              <Instagram strokeWidth={1.5} size={20} />
            </Link>
            <Link href="https://www.linkedin.com/in/emirtreidcoding">
              <Linkedin strokeWidth={1.5} size={20} />
            </Link>
          </div>
        </nav>
        <aside>
          <p className="text-xs font-bold">طراحی و توسعه : امیرحسین عسگری </p>
        </aside>
      </footer>
    </>
  );
};

export default HomePage;
