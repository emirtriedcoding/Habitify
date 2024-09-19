"use client";

import RegisterForm from "../auth/RegisterForm";
import LoginForm from "../auth/LoginForm";
import ForgotForm from "../auth/ForgotForm";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

const AuthModal = () => {
  const searchParams = useSearchParams();

  const [currentView, setCurrentView] = useState("register");

  useEffect(() => {
    searchParams.get("auth") === "true" &&
      document.getElementById("auth_modal").showModal();
  }, [searchParams]);

  return (
    <dialog id="auth_modal" className="modal">
      <div className="modal-box overflow-y-hidden">
        <AnimatePresence mode="wait">
          {currentView === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterForm setCurrentView={setCurrentView} />
            </motion.div>
          )}
          {currentView === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm setCurrentView={setCurrentView} />
            </motion.div>
          )}
          {currentView === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <ForgotForm setCurrentView={setCurrentView} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AuthModal;
