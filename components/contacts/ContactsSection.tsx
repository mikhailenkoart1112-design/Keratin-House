"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";

type Settings = {
  phone?: string;
  instagram?: string;
  address?: string;
  mapUrl?: string;
  workingHours?: string;
  schedule?: string;
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
  const instagram =
    settings.instagram || "https://instagram.com/daryna_makhraieva";
  const phone = settings.phone || "+380 99 123 45 68";

  const instagramName = useMemo(() => getInstagramName(instagram), [instagram]);
  const instagramUrl = useMemo(() => getInstagramUrl(instagram), [instagram]);

  const mapUrl =
    settings.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

  return (
    <section
      style={{
        width: "100%",
        background: "transparent",
        paddingBottom: "96px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "980px",
          margin: "0 auto",
          paddingLeft: "10px",
          paddingRight: "10px",
          boxSizing: "border-box",
        }}
      >
        {loading ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "34px",
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 24px 65px rgba(0,0,0,0.07)",
            }}
          >
            <Loader2 className="mx-auto animate-spin text-accent" size={30} />

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
              Завантажуємо контакти...
            </h2>
          </div>
        ) : error ? (
          <div
            style={{
              background: "#fff1f1",
              borderRadius: "34px",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <p style={{ fontWeight: 700, color: "#ef4444" }}>{error}</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "24px",
              width: "100%",
            }}
          >
            <ContactCard
              icon={<MapPin size={20} />}
              label="Адреса"
              title={address}
              text="Натисни кнопку, щоб відкрити місце на Google Maps."
              buttonText="Google Maps"
              href={mapUrl}
              external
            />

            <ContactCard
              icon={<Clock3 size={20} />}
              label="Графік"
              title="Робочий час"
              text={workingHours}
            />

            <ContactCard
              icon={<ArrowUpRight size={20} />}
              label="Instagram"
              title={instagramName}
              text="Перейди в Instagram, щоб подивитися роботи та написати майстрині."
              buttonText="Перейти"
              href={instagramUrl}
              external
            />

            <ContactCard
              icon={<Phone size={20} />}
              label="Телефон"
              title={phone}
              text="Можеш подзвонити або залишити заявку через форму запису."
              phoneHref={getPhoneHref(phone)}
            />
          </div>
        )}
      </div>
    </section>
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
  icon: React.ReactNode;
  label: string;
  title: string;
  text?: string;
  buttonText?: string;
  href?: string;
  external?: boolean;
  phoneHref?: string;
}) {
  return (
    <article
      style={{
        display: "block",
        width: "100%",
        boxSizing: "border-box",
        background: "#ffffff",
        borderRadius: "34px",
        boxShadow: "0 22px 60px rgba(0,0,0,0.07)",
        color: "inherit",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "26px 30px 30px 30px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "999px",
            background: "#f1ebe3",
            color: "#c9a96e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "18px",
          }}
        >
          {icon}
        </div>

        <p
          style={{
            fontSize: "12px",
            lineHeight: "20px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#c9a96e",
            margin: 0,
          }}
        >
          {label}
        </p>

        <h2
          style={{
            marginTop: "16px",
            marginBottom: 0,
            fontSize: "27px",
            lineHeight: "1.22",
            fontWeight: 700,
            letterSpacing: "-0.055em",
            color: "#2b2826",
            overflowWrap: "break-word",
            wordBreak: "normal",
          }}
        >
          {title}
        </h2>

        {text && (
          <p
            style={{
              marginTop: "16px",
              marginBottom: 0,
              fontSize: "16px",
              lineHeight: "1.75",
              color: "#77716b",
              overflowWrap: "break-word",
              wordBreak: "normal",
            }}
          >
            {text}
          </p>
        )}

        {href && buttonText && (
          <Link
            href={href}
            target={external ? "_blank" : undefined}
            style={{
              marginTop: "24px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderRadius: "999px",
              background: "#c9a96e",
              padding: "13px 22px",
              fontSize: "15px",
              fontWeight: 800,
              color: "#ffffff",
              textDecoration: "none",
              boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
            }}
          >
            {buttonText}
            <ArrowUpRight size={18} />
          </Link>
        )}

        {phoneHref && (
          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "24px",
              width: "100%",
            }}
          >
            <Link
              href={phoneHref}
              style={{
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "999px",
                background: "#f1ebe3",
                padding: "15px 22px",
                fontSize: "15px",
                fontWeight: 800,
                color: "#2b2826",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Подзвонити
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-booking"))}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "999px",
                background: "#c9a96e",
                padding: "15px 22px",
                fontSize: "15px",
                fontWeight: 800,
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
              }}
            >
              Записатися
            </button>
          </div>
        )}
      </div>
    </article>
  );
}