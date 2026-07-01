"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  description: string;
  nextStep: string;
};

export default function AdminPlaceholderPage({
  title,
  description,
  nextStep,
}: Props) {
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

  if (!allowed) return null;

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 py-6 sm:px-5 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[30px] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:rounded-[36px] sm:p-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-semibold text-accent"
          >
            <ArrowLeft className="mr-2" size={18} />
            Назад в адмінку
          </Link>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-accent sm:tracking-[0.28em]">
            daryna_makhraieva Admin
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-secondary sm:text-base sm:leading-7">
            {description}
          </p>

          <div className="mt-8 rounded-[28px] bg-[#f8f6f2] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Наступний крок
            </p>

            <p className="mt-3 text-lg font-semibold tracking-[-0.03em]">
              {nextStep}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

