"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const openBooking = () => {
    window.dispatchEvent(new Event("open-booking"));
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#f8f6f2] bg-cover bg-center px-4 pb-16 pt-28 sm:px-6 lg:px-10"
      style={{
        backgroundImage: "url('/images/home-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-[#f8f6f2]/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-[#f8f6f2]/20 to-[#f8f6f2]/60" />

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative z-10 mx-auto flex min-h-[calc(100vh-150px)] w-full max-w-7xl items-center justify-center text-center"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a96e] shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:px-5 sm:py-2.5 sm:text-xs">
            <Sparkles size={15} />
            DARYNA_MAKHRAIEVA
          </div>

          <h1 className="mx-auto max-w-[1100px] text-center text-[42px] font-black leading-[0.95] tracking-[-0.075em] text-[#2b2826] sm:text-7xl lg:text-[96px] xl:text-[112px]">
            daryna makhraieva
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-[17px] font-semibold leading-8 text-[#6f6963] sm:text-xl lg:text-2xl">
            Відновлення, кератин, ботокс та догляд за волоссям.
          </p>

          <div className="mx-auto mt-9 grid w-full max-w-md gap-3 sm:flex sm:max-w-2xl sm:items-center sm:justify-center sm:gap-4">
            <motion.button
              onClick={openBooking}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-[#c9a96e] px-8 py-4 text-base font-black text-white shadow-[0_20px_45px_rgba(201,169,110,0.35)] sm:w-auto sm:min-w-[220px] lg:min-h-[58px] lg:px-10 lg:text-lg"
            >
              Записатися
              <ArrowRight className="ml-2" size={20} />
            </motion.button>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/gallery"
                className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-white/90 px-8 py-4 text-base font-black text-[#2b2826] shadow-[0_18px_40px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:w-auto sm:min-w-[220px] lg:min-h-[58px] lg:px-10 lg:text-lg"
              >
                Наші роботи
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}