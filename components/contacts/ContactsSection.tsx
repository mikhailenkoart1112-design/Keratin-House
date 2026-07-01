"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";

import AnimatedSection from "@/components/ui/AnimatedSection";
import Container from "@/components/ui/Container";

type Settings = {
  phone?: string;
  instagram?: string;
  address?: string;
  mapUrl?: string;
  workingHours?: string;
  bookingText?: string;
  heroLabel?: string;
  siteName?: string;
};

function getInstagramName(url?: string) {
  if (!url) return "@daryna_hair";

  return url
    .replace("https://instagram.com/", "@")
    .replace("https://www.instagram.com/", "@")
    .replace("/", "");
}

function getPhoneHref(phone?: string) {
  if (!phone) return "#";

  return `tel:${phone.replaceAll(" ", "")}`;
}

export default function ContactsSection() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!result.success) {
          setError("Не вдалося завантажити контакти.");
          setLoading(false);
          return;
        }

        setSettings(result.settings || {});
        setLoading(false);
      } catch {
        setError("Помилка завантаження контактів.");
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const address = settings.address || "м. Твоє місто";

  const mapUrl =
    settings.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

  const workingHours = settings.workingHours || "Пн-Сб 10:00–18:00";
  const instagram = settings.instagram || "https://instagram.com/daryna_hair";
  const phone = settings.phone || "+380 99 123 45 67";

  return (
    <AnimatedSection className="bg-transparent py-24">
      <Container>
        {loading ? (
          <div className="rounded-[36px] bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl">
            <Loader2 className="mx-auto animate-spin text-accent" size={28} />

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
              Завантажуємо контакти...
            </h2>
          </div>
        ) : error ? (
          <div className="rounded-[36px] bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[36px] bg-white/88 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <MapPin className="text-accent" />

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-accent">
                Адреса
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
                {address}
              </h2>

              <p className="mt-4 text-secondary">
                Натисни кнопку, щоб відкрити місце на Google Maps.
              </p>

              <Link
                href={mapUrl}
                target="_blank"
                className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
              >
                Google Maps
                <ArrowUpRight className="ml-2" size={18} />
              </Link>
            </div>

            <div className="rounded-[36px] bg-white/88 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <Clock3 className="text-accent" />

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-accent">
                Графік
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
                Робочий час
              </h2>

              <p className="mt-4 text-secondary">{workingHours}</p>
            </div>

            <div className="rounded-[36px] bg-white/88 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <ArrowUpRight className="text-accent" />

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-accent">
                Instagram
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {getInstagramName(instagram)}
              </h2>

              <Link
                href={instagram}
                target="_blank"
                className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
              >
                Перейти
                <ArrowUpRight className="ml-2" size={18} />
              </Link>
            </div>

            <div className="rounded-[36px] bg-white/88 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <Phone className="text-accent" />

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-accent">
                Телефон
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {phone}
              </h2>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={getPhoneHref(phone)}
                  className="inline-flex justify-center rounded-full bg-[#efe7dd] px-6 py-3 font-semibold"
                >
                  Подзвонити
                </Link>

                <button
                  onClick={() => window.dispatchEvent(new Event("open-booking"))}
                  className="rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
                >
                  Записатися
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </AnimatedSection>
  );
}