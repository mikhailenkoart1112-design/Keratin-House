"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Globe,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Save,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Settings = {
  phone: string;
  instagram: string;
  address: string;
  workingHours: string;
  bookingText: string;
  heroLabel: string;
  siteName: string;
};

type SettingKey = keyof Settings;

const defaultSettings: Settings = {
  phone: "",
  instagram: "",
  address: "",
  workingHours: "",
  bookingText: "",
  heroLabel: "",
  siteName: "",
};

const items: {
  key: SettingKey;
  label: string;
  icon: LucideIcon;
  placeholder: string;
}[] = [
  {
    key: "phone",
    label: "Телефон",
    icon: Phone,
    placeholder: "+380 99 123 45 67",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: ArrowUpRight,
    placeholder: "https://instagram.com/daryna_hair",
  },
  {
    key: "address",
    label: "Адреса",
    icon: MapPin,
    placeholder: "м. Хмельницький",
  },
  {
    key: "workingHours",
    label: "Графік",
    icon: Clock3,
    placeholder: "Пн–Сб 10:00–16:00",
  },
  {
    key: "bookingText",
    label: "Текст запису",
    icon: Globe,
    placeholder: "Запис через Instagram або форму на сайті",
  },
  {
    key: "heroLabel",
    label: "Hero Label",
    icon: Globe,
    placeholder: "Keratin | Botox | Recovery",
  },
  {
    key: "siteName",
    label: "Назва сайту",
    icon: Globe,
    placeholder: "daryna_makhraieva",
  },
];

export default function SettingsAdmin() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/settings", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося завантажити налаштування.");
        setLoading(false);
        return;
      }

      setSettings({
        ...defaultSettings,
        ...(result.settings || {}),
      });

      setLoading(false);
    } catch {
      setError("Помилка завантаження налаштувань.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed) return;

    const timer = setTimeout(() => {
      loadSettings();
    }, 0);

    return () => clearTimeout(timer);
  }, [allowed, loadSettings]);

  const updateField = (key: SettingKey, value: string) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSuccess("");
    setError("");
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося зберегти в Google Sheets.");
        setSaving(false);
        return;
      }

      setSuccess("Налаштування збережено в Google Sheets.");
      setSaving(false);
    } catch {
      setError("Помилка збереження.");
      setSaving(false);
    }
  };

  if (!allowed) return null;

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 py-6 sm:px-5 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold shadow-[0_18px_45px_rgba(0,0,0,0.08)] transition hover:bg-[#f1ebe3]"
        >
          <ArrowLeft className="mr-2" size={18} />
          Назад в адмінку
        </Link>

        <section className="mt-6 rounded-[34px] bg-white p-6 shadow-[0_24px_65px_rgba(0,0,0,0.07)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
            daryna_makhraieva Admin
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">
            Налаштування
          </h1>

          <p className="mt-4 text-sm leading-7 text-secondary sm:text-base">
            Тут можна змінити телефон, Instagram, адресу, графік і текст запису.
            Після збереження дані оновляться в Google Sheets.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={saveSettings}
              disabled={saving || loading}
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)] disabled:opacity-60"
            >
              <Save className="mr-2" size={18} />
              {saving ? "Зберігаємо..." : "Зберегти в Google Sheets"}
            </button>

            <button
              onClick={loadSettings}
              disabled={saving || loading}
              className="inline-flex items-center justify-center rounded-full bg-[#f1ebe3] px-6 py-4 text-sm font-bold transition hover:bg-[#e8ded0] disabled:opacity-60"
            >
              <RefreshCw className="mr-2" size={18} />
              Оновити
            </button>
          </div>

          {success && (
            <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {success}
            </p>
          )}

          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
              {error}
            </p>
          )}
        </section>

        {loading ? (
          <section className="mt-6 rounded-[34px] bg-white p-8 text-center shadow-[0_24px_65px_rgba(0,0,0,0.07)]">
            <Loader2 className="mx-auto animate-spin text-accent" size={30} />

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
              Завантажуємо...
            </h2>
          </section>
        ) : (
          <section className="mt-6 grid gap-5">
            {items.map(({ key, label, icon: Icon, placeholder }) => (
              <article
                key={key}
                className="rounded-[34px] bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.07)] sm:p-8"
              >
                <Icon className="text-accent" size={26} />

                <label className="mt-6 block text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  {label}
                </label>

                {key === "bookingText" ? (
                  <textarea
                    value={settings[key]}
                    onChange={(event) => updateField(key, event.target.value)}
                    placeholder={placeholder}
                    className="mt-4 min-h-28 w-full resize-none rounded-[24px] bg-[#f8f6f2] px-5 py-4 text-lg font-semibold leading-7 outline-none ring-1 ring-transparent transition focus:ring-accent"
                  />
                ) : (
                  <input
                    value={settings[key]}
                    onChange={(event) => updateField(key, event.target.value)}
                    placeholder={placeholder}
                    className="mt-4 w-full rounded-[24px] bg-[#f8f6f2] px-5 py-4 text-lg font-semibold leading-7 outline-none ring-1 ring-transparent transition focus:ring-accent"
                  />
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

