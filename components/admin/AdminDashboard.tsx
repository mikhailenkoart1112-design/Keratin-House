"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
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
    title: "Прайс",
    text: "Редагування цін",
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
    text: "Фото робіт",
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
    <main className="min-h-screen bg-[#f8f6f2] px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[36px] bg-white p-8 shadow-[0_24px_70px_rgba(0,0,0,0.07)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            daryna_makhraieva Admin
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-5xl font-semibold tracking-[-0.07em]">
              Адмінка
            </h1>

            <button
              onClick={logout}
              className="rounded-full bg-[#f8f6f2] px-5 py-3 text-sm font-semibold transition hover:bg-[#ece6dc]"
            >
              Вийти
            </button>
          </div>

          <p className="mt-4 text-secondary">
  Панель керування сайтом. Тут можна редагувати заявки, ціни, послуги, галерею,
  блог, контакти та інформацію про майстриню.
</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, text, icon: Icon, href }) => {
            const content = (
              <>
                <Icon className="text-accent" />

                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.06em]">
                  {title}
                </h2>

                <p className="mt-3 text-secondary">{text}</p>
              </>
            );

            if (href) {
              return (
                <Link
                  key={title}
                  href={href}
                  className="rounded-[32px] bg-white p-6 text-left shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition hover:-translate-y-1"
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={title}
                className="rounded-[32px] bg-white p-6 text-left shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition hover:-translate-y-1"
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

