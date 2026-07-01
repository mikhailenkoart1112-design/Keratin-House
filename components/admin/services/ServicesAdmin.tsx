"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

type Service = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string;
  priceFrom: string;
  order: number;
  active: boolean;
};

type ServiceKey =
  | "id"
  | "title"
  | "shortDescription"
  | "fullDescription"
  | "benefits"
  | "priceFrom"
  | "order"
  | "active";

const emptyService = (): Service => ({
  id: `service-${Date.now()}`,
  title: "",
  shortDescription: "",
  fullDescription: "",
  benefits: "",
  priceFrom: "",
  order: 1,
  active: true,
});

export default function ServicesAdmin() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
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

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/services", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося завантажити послуги.");
        setLoading(false);
        return;
      }

      const loadedServices: Service[] = (result.services || []).map(
        (item: {
          id?: string;
          title?: string;
          shortDescription?: string;
          fullDescription?: string;
          benefits?: string[] | string;
          priceFrom?: string;
          order?: number;
          active?: boolean;
        }) => ({
          id: item.id || `service-${Date.now()}`,
          title: item.title || "",
          shortDescription: item.shortDescription || "",
          fullDescription: item.fullDescription || "",
          benefits: Array.isArray(item.benefits)
            ? item.benefits.join("; ")
            : item.benefits || "",
          priceFrom: item.priceFrom || "",
          order: Number(item.order) || 1,
          active: item.active !== false,
        })
      );

      setServices(loadedServices);
      setLoading(false);
    } catch {
      setError("Помилка завантаження послуг.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed) return;

    const timer = setTimeout(() => {
      loadServices();
    }, 0);

    return () => clearTimeout(timer);
  }, [allowed, loadServices]);

  const updateService = (
    index: number,
    key: ServiceKey,
    value: string | number | boolean
  ) => {
    setServices((current) =>
      current.map((service, serviceIndex) =>
        serviceIndex === index
          ? {
              ...service,
              [key]: value,
            }
          : service
      )
    );

    setSuccess("");
    setError("");
  };

  const addService = () => {
    setServices((current) => [
      ...current,
      {
        ...emptyService(),
        order: current.length + 1,
      },
    ]);

    setSuccess("");
    setError("");
  };

  const removeService = (index: number) => {
    setServices((current) =>
      current.filter((_, serviceIndex) => serviceIndex !== index)
    );

    setSuccess("");
    setError("");
  };

  const saveServices = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          services,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося зберегти послуги в Google Sheets.");
        setSaving(false);
        return;
      }

      setSuccess("Послуги збережено в Google Sheets.");
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
            Послуги
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
            Тут можна редагувати послуги, опис, переваги, ціну, порядок і
            активність. Після збереження все оновиться в Google Sheets.
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
              onClick={saveServices}
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
              onClick={loadServices}
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

            <button
              onClick={addService}
              disabled={saving || loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                borderRadius: "999px",
                background: "#ffffff",
                padding: "15px 22px",
                fontSize: "15px",
                fontWeight: 800,
                color: "#2b2826",
                cursor: saving || loading ? "not-allowed" : "pointer",
                opacity: saving || loading ? 0.6 : 1,
                boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
              }}
            >
              <Plus size={18} />
              Додати послугу
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
            {services.map((service, index) => (
              <article
                key={service.id}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  borderRadius: "34px",
                  boxShadow: "0 22px 60px rgba(0,0,0,0.07)",
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <Sparkles size={26} style={{ color: "#c9a96e" }} />

                    <button
                      onClick={() => removeService(index)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "none",
                        borderRadius: "999px",
                        background: "#fff1f1",
                        padding: "10px 14px",
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={16} />
                      Видалити
                    </button>
                  </div>

                  <p
                    style={{
                      marginTop: "24px",
                      marginBottom: 0,
                      fontSize: "12px",
                      lineHeight: "20px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#c9a96e",
                    }}
                  >
                    Послуга #{index + 1}
                  </p>

                  <Field
                    label="ID"
                    value={service.id}
                    onChange={(value) => updateService(index, "id", value)}
                    placeholder="keratin"
                  />

                  <Field
                    label="Назва"
                    value={service.title}
                    onChange={(value) => updateService(index, "title", value)}
                    placeholder="Кератин / Ботокс"
                  />

                  <Field
                    label="Короткий опис"
                    value={service.shortDescription}
                    onChange={(value) =>
                      updateService(index, "shortDescription", value)
                    }
                    placeholder="Короткий текст для картки"
                    textarea
                  />

                  <Field
                    label="Повний опис"
                    value={service.fullDescription}
                    onChange={(value) =>
                      updateService(index, "fullDescription", value)
                    }
                    placeholder="Детальний опис послуги"
                    textarea
                  />

                  <Field
                    label="Переваги"
                    value={service.benefits}
                    onChange={(value) =>
                      updateService(index, "benefits", value)
                    }
                    placeholder="Гладкість; Блиск; Менше пухнастості"
                    textarea
                  />

                  <Field
                    label="Ціна від"
                    value={service.priceFrom}
                    onChange={(value) =>
                      updateService(index, "priceFrom", value)
                    }
                    placeholder="від 1800 грн"
                  />

                  <Field
                    label="Порядок"
                    value={String(service.order)}
                    onChange={(value) =>
                      updateService(index, "order", Number(value) || 0)
                    }
                    placeholder="1"
                    type="number"
                  />

                  <button
                    onClick={() =>
                      updateService(index, "active", !service.active)
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "20px",
                      border: "none",
                      borderRadius: "999px",
                      background: service.active ? "#ecfdf3" : "#fff1f1",
                      padding: "13px 18px",
                      fontSize: "14px",
                      fontWeight: 800,
                      color: service.active ? "#15803d" : "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    {service.active ? <Eye size={17} /> : <EyeOff size={17} />}
                    {service.active ? "Активна" : "Вимкнена"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "10px",
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
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            minHeight: "120px",
            boxSizing: "border-box",
            resize: "vertical",
            border: "none",
            borderRadius: "24px",
            background: "#f8f6f2",
            padding: "18px 20px",
            fontSize: "17px",
            lineHeight: "1.55",
            fontWeight: 650,
            color: "#2b2826",
            outline: "none",
            overflowWrap: "anywhere",
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "none",
            borderRadius: "24px",
            background: "#f8f6f2",
            padding: "18px 20px",
            fontSize: "17px",
            lineHeight: "1.55",
            fontWeight: 650,
            color: "#2b2826",
            outline: "none",
            overflowWrap: "anywhere",
          }}
        />
      )}
    </div>
  );
}

