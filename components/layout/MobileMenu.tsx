"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  onBooking: () => void;
};

export default function MobileMenu({ open, onClose, nav, onBooking }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-[#f8f6f2]/95 px-5 py-5 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="pointer-events-none absolute -left-28 top-20 h-[320px] w-[320px] rounded-full bg-[#c9a96e]/25 blur-[90px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />

          <motion.div
            className="pointer-events-none absolute -right-28 bottom-20 h-[360px] w-[360px] rounded-full bg-white blur-[90px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <Link
              href="/"
              onClick={onClose}
              className="block truncate pl-1 text-sm font-black uppercase tracking-[0.28em] text-[#2b2826]"
            >
              daryna_makhraieva
            </Link>

            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.06 }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#2b2826] shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
            >
              <X size={24} />
            </motion.button>
          </div>

          <div className="relative z-10 mt-14 flex flex-col gap-3">
            {nav.map((item, index) => {
              const active = isActive(item.href);

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  whileHover={{ x: 8 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`group relative flex min-h-[58px] items-center justify-between overflow-hidden rounded-[28px] py-3 pl-7 pr-5 text-[40px] font-semibold leading-none tracking-[-0.06em] transition duration-300 sm:text-5xl ${
                      active
                        ? "bg-white text-[#2b2826] shadow-[0_22px_60px_rgba(62,45,25,0.10)]"
                        : "text-[#2b2826]/80 hover:bg-white hover:text-[#2b2826] hover:shadow-[0_22px_60px_rgba(62,45,25,0.10)]"
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>

                    <span
                      className={`relative z-10 h-3 w-3 shrink-0 rounded-full transition ${
                        active
                          ? "bg-[#c9a96e]"
                          : "bg-[#c9a96e]/0 group-hover:bg-[#c9a96e]"
                      }`}
                    />

                    <span className="absolute inset-0 translate-x-[-100%] bg-[#c9a96e]/10 transition duration-500 group-hover:translate-x-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            onClick={onBooking}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -3 }}
            className="absolute bottom-8 left-5 right-5 z-10 rounded-full bg-accent px-6 py-4 font-black text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
          >
            Записатися
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}