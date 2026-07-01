"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
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
  schedule?: string;
  bookingText?: string;
  heroLabel?: string;
  siteName?: string;
};

function getInstagramName(value?: string) {
  if (!value) return "@daryna_makhraieva";

  let clean = value.trim();

  clean = clean
    .replace("https://www.instagram.com/", "")
    .replace("https://instagram.com/", "")
    .replace("http://www.instagram.com/", "")
    .replace("http://instagram.com/", "")
    .replace("www.instagram.com/", "")
    .replace("instagram.com/", "");

  clean = clean.split("?")[0].split("/")[0].trim();

  if (!clean) return "@daryna_makhraieva";

  return clean.startsWith("@") ? clean : `@${clean}`;
}

function getInstagramUrl(value?: string) {
  if (!value) return "https://www.instagram.com/daryna_makhraieva";

  if (value.startsWith("http")) return value;

  const username = getInstagramName(value).replace("@", "");

  return `https://www.instagram.com/${username}`;
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

  const address = settings.address || "м. Хмельницький";
  const workingHours =
    settings.workingHours || settings.schedule || "Пн–Сб 10:00–16:00";
  const instagram = settings.instagram || "https://instagram.com/daryna_makhraieva";
  const phone = settings.phone || "+380 99 123 45 68";

  const instagramName = useMemo(() => getInstagramName(instagram), [instagram]);
  const instagramUrl = useMemo(() => getInstagramUrl(instagram), [instagram]);

  const mapUrl =
    settings.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

  return (
    <AnimatedSection className="bg-transparent py-20">
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
          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <ContactCard
              icon={<MapPin size={26} />}
              label="Адреса"
              title={address}
              text="Натисни кнопку, щоб відкрити місце на Google Maps."
              buttonText="Google Maps"
              href={mapUrl}
              external
            />

            <ContactCard
              icon={<Clock3 size={26} />}
              label="Графік"
              title="Робочий час"
              text={workingHours}
            />

            <ContactCard
              icon={<ArrowUpRight size={26} />}
              label="Instagram"
              title={instagramName}
              text="Перейди в Instagram, щоб подивитися роботи та написати майстрині."
              buttonText="Перейти"
              href={instagramUrl}
              external
            />

            <ContactCard
              icon={<Phone size={26} />}
              label="Телефон"
              title={phone}
              text="Можеш подзвонити або залишити заявку через форму запису."
              phoneHref={getPhoneHref(phone)}
            />
          </div>
        )}
      </Container>
    </AnimatedSection>
  );
}

function ContactCard({
  icon,
  label,
  title,
  text,
  buttonText,
  href,
  external = false,
  phoneHref,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  text?: string;
  buttonText?: string;
  href?: string;
  external?: boolean;
  phoneHref?: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[34px] bg-white/88 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1e6d8] text-accent">
        {icon}
      </div>

      <p className="mt-7 break-words text-[11px] font-black uppercase tracking-[0.34em] text-accent">
        {label}
      </p>

      <h2 className="mt-3 max-w-full break-words text-[clamp(30px,8vw,48px)] font-black leading-[1.02] tracking-[-0.075em] text-[#2b2826]">
        {title}
      </h2>

      {text && (
        <p className="mt-4 max-w-full break-words text-[16px] leading-[1.55] text-secondary sm:text-lg">
          {text}
        </p>
      )}

      {href && buttonText && (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          className="mt-6 inline-flex max-w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
        >
          <span className="truncate">{buttonText}</span>
          <ArrowUpRight className="ml-2 shrink-0" size={18} />
        </Link>
      )}

      {phoneHref && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={phoneHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#efe7dd] px-6 py-3 text-base font-semibold text-[#2b2826]"
          >
            Подзвонити
          </Link>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-booking"))}
            className="min-h-12 rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
          >
            Записатися
          </button>
        </div>
      )}
    </div>
  );
}