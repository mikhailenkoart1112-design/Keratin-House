/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  function openBooking() {
    window.dispatchEvent(new Event("open-booking"));
  }

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-16 pt-32">
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/home-bg.jpg"
          alt="Keratin House"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#f8f6f2]/62" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-[#f8f6f2]/20 to-[#f8f6f2]/95" />
      </div>

      <div className="mx-auto flex min-h-[72vh] w-full max-w-5xl flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-accent shadow-[0_18px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl"
        >
          <Sparkles size={16} />
          Daryna Makhraieva
        </motion.div>

        <motion.h1
  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={{ duration: 0.65, delay: 0.08 }}
  className="mt-5 max-w-4xl text-[clamp(42px,10.5vw,86px)] font-extrabold lowercase leading-[0.9] tracking-[-0.075em] text-[#2b2826]/90"
>
  daryna
  <br />
  makhraieva
</motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-5 max-w-xl text-[19px] font-semibold leading-[1.45] tracking-[-0.035em] text-[#6f6760] sm:text-2xl"
        >
          Відновлення, кератин, ботокс та догляд за волоссям.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-8 grid w-full max-w-2xl gap-4"
        >
          <button
            type="button"
            onClick={openBooking}
            className="flex h-16 items-center justify-center rounded-full bg-accent px-7 text-xl font-bold text-white shadow-[0_22px_55px_rgba(201,165,122,0.38)] transition active:scale-[0.98]"
          >
            Записатися
            <ArrowRight className="ml-2" size={22} />
          </button>

          <Link
            href="/gallery"
            className="flex h-16 items-center justify-center rounded-full bg-white/88 px-7 text-xl font-black text-[#2b2826] shadow-[0_22px_55px_rgba(0,0,0,0.08)] backdrop-blur-xl transition active:scale-[0.98]"
          >
            Мої роботи
          </Link>
        </motion.div>
      </div>
    </section>
  );
}