"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CalendarX,
  FileText,
  Image,
  Scissors,
  Settings,
  User,
  WalletCards,
} from "lucide-react";

const cards = [
  {
    title: "Заявки",
    text: "Нові записи клієнтів",
    icon: CalendarDays,
    href: "/admin/requests",
  },
  {
    title: "Зайняті дати",
    text: "Блокування дат і часу для запису",
    icon: CalendarX,
    href: "/admin/busy",
  },
  {
    title: "Прайс",
    text: "Редагування цін та категорій",
    icon: WalletCards,
    href: "/admin/prices",
  },
  {
    title: "Послуги",
    text: "Кератин, ботокс, відновлення",
    icon: Scissors,
    href: "/admin/services",
  },
  {
    title: "Галерея",
    text: "Фото робіт та до / після",
    icon: Image,
    href: "/admin/gallery",
  },
  {
    title: "Про мене",
    text: "Фото та опис Дарини",
    icon: User,
    href: "/admin/about",
  },
  {
    title: "Блог",
    text: "Статті та корисні матеріали",
    icon: FileText,
    href: "/admin/blog",
  },
  {
    title: "Контакти",
    text: "Телефон, Instagram, адреса, графік",
    icon: Settings,
    href: "/admin/contacts",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("daryna-admin-auth");

    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    const timer = setTimeout(() => {
      setAllowed(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("daryna-admin-auth");
    router.replace("/admin/login");
  };

  if (!allowed) return null;

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[42px] border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.07)] backdrop-blur sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-accent">
                daryna_makhraieva Admin
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-[#2b2826] sm:text-6xl">
                Адмінка
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-secondary sm:text-base">
                Панель керування сайтом. Тут можна редагувати заявки, зайняті
                дати, ціни, послуги, галерею, блог, контакти та інформацію про
                майстриню.
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full rounded-full bg-[#f1ebe3] px-6 py-4 text-sm font-bold text-[#2b2826] transition hover:bg-[#e8dece] sm:w-auto"
            >
              Вийти
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, text, icon: Icon, href }) => (
            <Link
              key={title}
              href={href}
              className="group min-h-[178px] rounded-[42px] border border-white/80 bg-white/85 p-7 shadow-[0_22px_60px_rgba(0,0,0,0.065)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(0,0,0,0.09)] sm:min-h-[205px] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f6f2] text-accent">
                  <Icon size={23} />
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f6f2] text-[#2b2826] transition group-hover:bg-accent group-hover:text-white">
                  <ArrowUpRight size={19} />
                </div>
              </div>

              <p className="mt-7 text-[11px] font-black uppercase tracking-[0.28em] text-accent">
                Розділ адмінки
              </p>

              <h2 className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.065em] text-[#2b2826] sm:text-4xl">
                {title}
              </h2>

              <p className="mt-4 text-base font-medium leading-6 text-secondary">
                {text}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}