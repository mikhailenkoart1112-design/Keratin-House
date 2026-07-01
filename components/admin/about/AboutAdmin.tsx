"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Image,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type About = {
  name: string;
  title: string;
  description: string;
  experience: string;
  specialization: string;
  imageUrl: string;
  badge1: string;
  badge2: string;
  badge3: string;
  quote: string;
};

type AboutKey = keyof About;

const defaultAbout: About = {
  name: "",
  title: "",
  description: "",
  experience: "",
  specialization: "",
  imageUrl: "",
  badge1: "",
  badge2: "",
  badge3: "",
  quote: "",
};

const items: {
  key: AboutKey;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  textarea?: boolean;
}[] = [
  {
    key: "name",
    label: "Імʼя",
    icon: User,
    placeholder: "Дарина",
  },
  {
    key: "title",
    label: "Заголовок",
    icon: Sparkles,
    placeholder: "Про мене з відновлення та догляду за волоссям",
  },
  {
    key: "description",
    label: "Опис",
    icon: Globe,
    placeholder:
      "Я допомагаю волоссю виглядати гладким, блискучим і доглянутим...",
    textarea: true,
  },
  {
    key: "experience",
    label: "Досвід",
    icon: Sparkles,
    placeholder: "Досвід у догляді та відновленні волосся",
  },
  {
    key: "specialization",
    label: "Спеціалізація",
    icon: Globe,
    placeholder: "Кератин, ботокс, тотальна реконструкція, холодне відновлення",
    textarea: true,
  },
  {
    key: "imageUrl",
    label: "Фото URL",
    icon: Image,
    placeholder: "https://...",
  },
  {
    key: "badge1",
    label: "Перевага 1",
    icon: Sparkles,
    placeholder: "Індивідуальний підхід",
  },
  {
    key: "badge2",
    label: "Перевага 2",
    icon: Sparkles,
    placeholder: "Професійний догляд",
  },
  {
    key: "badge3",
    label: "Перевага 3",
    icon: Sparkles,
    placeholder: "Акуратна робота",
  },
  {
    key: "quote",
    label: "Цитата",
    icon: Sparkles,
    placeholder: "Красиве волосся починається з правильного догляду.",
    textarea: true,
  },
];

export default function AboutAdmin() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [about, setAbout] = useState<About>(defaultAbout);
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

  const loadAbout = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/about", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося завантажити дані про майстриню.");
        setLoading(false);
        return;
      }

      setAbout({
        ...defaultAbout,
        ...(result.about || {}),
      });

      setLoading(false);
    } catch {
      setError("Помилка завантаження.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed) return;

    const timer = setTimeout(() => {
      loadAbout();
    }, 0);

    return () => clearTimeout(timer);
  }, [allowed, loadAbout]);

  const updateField = (key: AboutKey, value: string) => {
    setAbout((current) => ({
      ...current,
      [key]: value,
    }));

    setSuccess("");
    setError("");
  };

  const saveAbout = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          about,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося зберегти в Google Sheets.");
        setSaving(false);
        return;
      }

      setSuccess("Дані про майстриню збережено в Google Sheets.");
      setSaving(false);
    } catch {
      setError("Помилка збереження.");
      setSaving(false);
    }
  };

  if (!allowed) return null;

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f8f6f2",
        paddingTop: "32px",
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
        <Link
          href="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "28px",
            borderRadius: "999px",
            background: "#ffffff",
            padding: "14px 20px",
            fontSize: "15px",
            fontWeight: 800,
            boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
            textDecoration: "none",
            color: "#2b2826",
          }}
        >
          <ArrowLeft size={18} />
          Назад в адмінку
        </Link>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "34px",
            padding: "30px",
            boxShadow: "0 24px 65px rgba(0,0,0,0.07)",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              lineHeight: "20px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#c9a96e",
              margin: 0,
            }}
          >
            daryna_makhraieva Admin
          </p>

          <h1
            style={{
              marginTop: "16px",
              marginBottom: 0,
              fontSize: "42px",
              lineHeight: "1.05",
              fontWeight: 700,
              letterSpacing: "-0.07em",
              color: "#2b2826",
            }}
          >
            Про мене
          </h1>

          <p
            style={{
              marginTop: "18px",
              marginBottom: 0,
              fontSize: "16px",
              lineHeight: "1.75",
              color: "#77716b",
            }}
          >
            Тут можна змінити імʼя, опис, спеціалізацію, переваги та цитату для
            сторінки “Про майстриню”.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              onClick={saveAbout}
              disabled={saving || loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                borderRadius: "999px",
                background: "#c9a96e",
                padding: "15px 22px",
                fontSize: "15px",
                fontWeight: 800,
                color: "#ffffff",
                cursor: saving || loading ? "not-allowed" : "pointer",
                opacity: saving || loading ? 0.6 : 1,
                boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
              }}
            >
              <Save size={18} />
              {saving ? "Зберігаємо..." : "Зберегти в Google Sheets"}
            </button>

            <button
              onClick={loadAbout}
              disabled={saving || loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                borderRadius: "999px",
                background: "#f1ebe3",
                padding: "15px 22px",
                fontSize: "15px",
                fontWeight: 800,
                color: "#2b2826",
                cursor: saving || loading ? "not-allowed" : "pointer",
                opacity: saving || loading ? 0.6 : 1,
              }}
            >
              <RefreshCw size={18} />
              Оновити
            </button>
          </div>

          {success && (
            <p
              style={{
                marginTop: "20px",
                marginBottom: 0,
                borderRadius: "18px",
                background: "#ecfdf3",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#15803d",
              }}
            >
              {success}
            </p>
          )}

          {error && (
            <p
              style={{
                marginTop: "20px",
                marginBottom: 0,
                borderRadius: "18px",
                background: "#fff1f1",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#ef4444",
              }}
            >
              {error}
            </p>
          )}
        </section>

        {loading ? (
          <section
            style={{
              background: "#ffffff",
              borderRadius: "34px",
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 24px 65px rgba(0,0,0,0.07)",
            }}
          >
            <Loader2 className="mx-auto animate-spin text-accent" size={30} />

            <h2
              style={{
                marginTop: "16px",
                fontSize: "30px",
                lineHeight: "1.15",
                fontWeight: 700,
                letterSpacing: "-0.06em",
              }}
            >
              Завантажуємо...
            </h2>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gap: "24px",
              width: "100%",
            }}
          >
            {items.map(({ key, label, icon: Icon, placeholder, textarea }) => (
              <article
                key={key}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  borderRadius: "34px",
                  boxShadow: "0 22px 60px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "26px 30px 30px 30px",
                  }}
                >
                  <Icon
                    size={26}
                    style={{
                      color: "#c9a96e",
                    }}
                  />

                  <label
                    style={{
                      display: "block",
                      marginTop: "24px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#c9a96e",
                    }}
                  >
                    {label}
                  </label>

                  {textarea ? (
                    <textarea
                      value={about[key]}
                      onChange={(event) => updateField(key, event.target.value)}
                      placeholder={placeholder}
                      style={{
                        marginTop: "14px",
                        width: "100%",
                        minHeight: "128px",
                        boxSizing: "border-box",
                        resize: "vertical",
                        border: "none",
                        borderRadius: "24px",
                        background: "#f8f6f2",
                        padding: "18px 20px",
                        fontSize: "18px",
                        lineHeight: "1.55",
                        fontWeight: 650,
                        color: "#2b2826",
                        outline: "none",
                        overflowWrap: "anywhere",
                      }}
                    />
                  ) : (
                    <input
                      value={about[key]}
                      onChange={(event) => updateField(key, event.target.value)}
                      placeholder={placeholder}
                      style={{
                        marginTop: "14px",
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        borderRadius: "24px",
                        background: "#f8f6f2",
                        padding: "18px 20px",
                        fontSize: "18px",
                        lineHeight: "1.55",
                        fontWeight: 650,
                        color: "#2b2826",
                        outline: "none",
                        overflowWrap: "anywhere",
                      }}
                    />
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

