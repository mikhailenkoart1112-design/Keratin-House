"use client";

import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import MobileMenu from "./MobileMenu";
import BookingModal from "@/components/common/BookingModal";

const nav = [
  { label: "Головна", href: "/" },
  { label: "Послуги", href: "/services" },
  { label: "Галерея", href: "/gallery" },
  { label: "Блог", href: "/blog" },
  { label: "Прайс", href: "/prices" },
  { label: "Про мене", href: "/about" },
  { label: "Контакти", href: "/contacts" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const open = () => setBookingOpen(true);
    window.addEventListener("open-booking", open);
    return () => window.removeEventListener("open-booking", open);
  }, []);

  return (
    <>
      <motion.header
        className="fixed left-0 top-0 z-40 w-full px-4 py-3 sm:px-6 lg:px-10"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between rounded-full border border-black/5 bg-white/88 py-3 pl-8 pr-3 shadow-[0_18px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:pl-10 sm:pr-4 lg:pl-12">
          <motion.div
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.96 }}
  className="min-w-0 pl-10 sm:pl-12 lg:pl-14"
>
            <Link
  href="/"
  style={{ marginLeft: "28px" }}
  className="block truncate text-xs font-black uppercase tracking-[0.34em] text-[#2b2826] sm:text-sm"
>
  KERATIN HOUSE
</Link>
          </motion.div>

          <div className="flex shrink-0 items-center gap-3">
            <motion.button
              onClick={() => setBookingOpen(true)}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="hidden min-h-[54px] items-center justify-center rounded-full border border-white/40 bg-gradient-to-r from-[#d5b77d] via-[#c9a96e] to-[#b99255] px-7 text-base font-black text-white shadow-[0_18px_45px_rgba(201,165,122,0.45)] transition hover:shadow-[0_22px_55px_rgba(201,165,122,0.55)] md:inline-flex"
            >
              Записатися

              <span className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/22">
                <ArrowRight size={16} />
              </span>
            </motion.button>

            <motion.button
              onClick={() => setMenuOpen(true)}
              whileHover={{
                scale: 1.06,
                backgroundColor: "#ffffff",
              }}
              whileTap={{ scale: 0.92 }}
              aria-label="Відкрити меню"
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#f1ebe3] text-[#2b2826] shadow-[0_14px_35px_rgba(0,0,0,0.08)]"
            >
              <Menu size={25} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        nav={nav}
        onBooking={() => {
          setMenuOpen(false);
          setBookingOpen(true);
        }}
      />

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}