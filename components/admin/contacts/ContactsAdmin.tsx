"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Sparkles,
} from "lucide-react";

type ContactsSettings = {
  phone: string;
  instagram: string;
  address: string;
  mapUrl: string;
  workingHours: string;
  bookingText: string;
};

const defaultContacts: ContactsSettings = {
  phone: "",
  instagram: "",
  address: "",
  mapUrl: "",
  workingHours: "",
  bookingText: "",
};

const fields = [
  {
    key: "phone",
    label: "Телефон",
    placeholder: "+380 99 123 45 67",
    icon: Phone,
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/daryna_hair",
    icon: ArrowUpRight,
  },
  {
    key: "address",
    label: "Адреса",
    placeholder: "м. Хмельницький",
    icon: MapPin,
  },
  {
    key: "mapUrl",
    label: "Google Maps посилання",
    placeholder: "https://maps.app.goo.gl/...",
    icon: MapPin,
  },
  {
    key: "workingHours",
    label: "Графік роботи",
    placeholder: "Пн–Сб 10:00–16:00",
    icon: Clock3,
  },
  {
    key: "bookingText",
    label: "Текст запису",
    placeholder: "Запис через Instagram або форму на сайті",
    icon: Sparkles,
  },
] as const;

export default function ContactsAdmin() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [contacts, setContacts] = useState<ContactsSettings>(defaultContacts);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/settings", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.success) {
        setMessage("Не вдалося завантажити контакти.");
        setLoading(false);
        return;
      }

      setContacts({
        ...defaultContacts,
        ...(result.settings || {}),
      });

      setLoading(false);
    } catch {
      setMessage("Помилка завантаження контактів.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed) return;

    const timer = setTimeout(() => {
      loadContacts();
    }, 0);

    return () => clearTimeout(timer);
  }, [allowed, loadContacts]);

  function updateField(key: keyof ContactsSettings, value: string) {
    setContacts((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
  }

  async function saveContacts() {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: contacts,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage("Не вдалося зберегти контакти.");
        setSaving(false);
        return;
      }

      setMessage("Контакти збережено.");
      setSaving(false);
    } catch {
      setMessage("Помилка збереження.");
      setSaving(false);
    }
  }

  if (!allowed) return null;

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-3 py-8 pb-24">
      <div className="mx-auto w-full max-w-[980px]">
        <Link
          href="/admin"
          className="mb-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-[15px] font-black text-[#2b2826] shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
        >
          <ArrowLeft size={18} />
          Назад в адмінку
        </Link>

        <section className="mb-7 rounded-[36px] border border-[#eadcc9] bg-white p-8 shadow-[0_26px_80px_rgba(52,39,25,0.10)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c9a96e]">
            daryna_makhraieva Admin
          </p>

          <h1 className="mt-4 text-[46px] font-bold leading-none tracking-[-0.07em] text-[#2b2826]">
            Контакти
          </h1>

          <p className="mt-5 max-w-[720px] text-[17px] leading-7 text-[#77716b]">
            Тут редагуються телефон, Instagram, адреса, Google Maps, графік і
            текст запису для сторінки контактів.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={saveContacts}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-6 py-4 text-[15px] font-black text-white shadow-[0_18px_42px_rgba(201,169,110,0.34)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Зберігаємо..." : "Зберегти"}
            </button>

            <button
              onClick={loadContacts}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-full bg-[#f1ebe3] px-6 py-4 text-[15px] font-black text-[#2b2826] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={18} />
              Оновити
            </button>
          </div>

          {message && (
            <p className="mt-5 rounded-[20px] bg-[#f8f6f2] px-4 py-3.5 text-sm font-black text-[#2b2826]">
              {message}
            </p>
          )}
        </section>

        {loading ? (
          <section className="rounded-[36px] bg-white p-10 text-center shadow-[0_26px_80px_rgba(52,39,25,0.10)]">
            <Loader2 className="mx-auto animate-spin text-[#c9a96e]" size={32} />

            <h2 className="mt-4 text-3xl font-bold tracking-[-0.06em]">
              Завантажуємо...
            </h2>
          </section>
        ) : (
          <section className="grid gap-6">
            {fields.map(({ key, label, placeholder, icon: Icon }) => (
              <article
                key={key}
                className="rounded-[36px] border border-[#eadcc9] bg-white p-8 shadow-[0_26px_80px_rgba(52,39,25,0.10)]"
              >
                <Icon className="text-[#c9a96e]" size={26} />

                <label className="mt-6 block text-xs font-black uppercase tracking-[0.18em] text-[#c9a96e]">
                  {label}
                </label>

                {key === "bookingText" ? (
                  <textarea
                    value={contacts[key]}
                    onChange={(event) => updateField(key, event.target.value)}
                    placeholder={placeholder}
                    className="mt-4 min-h-[130px] w-full resize-y rounded-[24px] border border-[#eadcc9] bg-[#f8f6f2] px-5 py-[18px] text-[17px] font-semibold leading-7 text-[#2b2826] outline-none focus:border-[#c9a96e]"
                  />
                ) : (
                  <input
                    value={contacts[key]}
                    onChange={(event) => updateField(key, event.target.value)}
                    placeholder={placeholder}
                    className="mt-4 w-full rounded-[24px] border border-[#eadcc9] bg-[#f8f6f2] px-5 py-[18px] text-[17px] font-semibold leading-7 text-[#2b2826] outline-none focus:border-[#c9a96e]"
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

