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

type PriceItem = {
  id: string;
  category: string;
  title: string;
  label: string;
  price: string;
  order: number;
  active: boolean;
};

type PriceKey =
  | "id"
  | "category"
  | "title"
  | "label"
  | "price"
  | "order"
  | "active";

const emptyPrice = (): PriceItem => ({
  id: `price-${Date.now()}`,
  category: "",
  title: "",
  label: "",
  price: "",
  order: 1,
  active: true,
});

export default function PricesAdmin() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [prices, setPrices] = useState<PriceItem[]>([]);
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

  const loadPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/prices", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося завантажити прайси.");
        setLoading(false);
        return;
      }

      const loadedPrices: PriceItem[] = (result.prices || []).map(
        (item: Partial<PriceItem>) => ({
          id: item.id || `price-${Date.now()}`,
          category: item.category || "",
          title: item.title || "",
          label: item.label || "",
          price: item.price || "",
          order: Number(item.order) || 1,
          active: item.active !== false,
        })
      );

      setPrices(loadedPrices);
      setLoading(false);
    } catch {
      setError("Помилка завантаження прайсів.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed) return;

    const timer = setTimeout(() => {
      loadPrices();
    }, 0);

    return () => clearTimeout(timer);
  }, [allowed, loadPrices]);

  const updatePrice = (
    index: number,
    key: PriceKey,
    value: string | number | boolean
  ) => {
    setPrices((current) =>
      current.map((price, priceIndex) =>
        priceIndex === index
          ? {
              ...price,
              [key]: value,
            }
          : price
      )
    );

    setSuccess("");
    setError("");
  };

  const addPrice = () => {
    setPrices((current) => [
      ...current,
      {
        ...emptyPrice(),
        order: current.length + 1,
      },
    ]);

    setSuccess("");
    setError("");
  };

  const removePrice = (index: number) => {
    setPrices((current) =>
      current.filter((_, priceIndex) => priceIndex !== index)
    );

    setSuccess("");
    setError("");
  };

  const savePrices = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prices,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося зберегти прайси в Google Sheets.");
        setSaving(false);
        return;
      }

      setSuccess("Прайси збережено в Google Sheets.");
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
            Прайси
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
            Тут можна редагувати категорію, назву, позначку, ціну, порядок і
            активність.
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
              onClick={savePrices}
              disabled={saving || loading}
              style={goldButton}
            >
              <Save size={18} />
              {saving ? "Зберігаємо..." : "Зберегти в Google Sheets"}
            </button>

            <button
              onClick={loadPrices}
              disabled={saving || loading}
              style={lightButton}
            >
              <RefreshCw size={18} />
              Оновити
            </button>

            <button
              onClick={addPrice}
              disabled={saving || loading}
              style={whiteButton}
            >
              <Plus size={18} />
              Додати ціну
            </button>
          </div>

          {success && <Message type="success" text={success} />}
          {error && <Message type="error" text={error} />}
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
            {prices.map((price, index) => (
              <article
                key={`${price.id}-${index}`}
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
                      onClick={() => removePrice(index)}
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
                    Ціна #{index + 1}
                  </p>

                  <Field
                    label="ID"
                    value={price.id}
                    onChange={(value) => updatePrice(index, "id", value)}
                    placeholder="keratin-30"
                  />

                  <Field
                    label="Категорія"
                    value={price.category}
                    onChange={(value) => updatePrice(index, "category", value)}
                    placeholder="Кератин / Ботокс"
                  />

                  <Field
                    label="Назва"
                    value={price.title}
                    onChange={(value) => updatePrice(index, "title", value)}
                    placeholder="Кератин / Ботокс"
                  />

                  <Field
                    label="Позначка"
                    value={price.label}
                    onChange={(value) => updatePrice(index, "label", value)}
                    placeholder="до 30 см"
                  />

                  <Field
                    label="Ціна"
                    value={price.price}
                    onChange={(value) => updatePrice(index, "price", value)}
                    placeholder="1800–2100 грн"
                  />

                  <Field
                    label="Порядок"
                    value={String(price.order)}
                    onChange={(value) =>
                      updatePrice(index, "order", Number(value) || 0)
                    }
                    placeholder="1"
                    type="number"
                  />

                  <button
                    onClick={() => updatePrice(index, "active", !price.active)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "20px",
                      border: "none",
                      borderRadius: "999px",
                      background: price.active ? "#ecfdf3" : "#fff1f1",
                      padding: "13px 18px",
                      fontSize: "14px",
                      fontWeight: 800,
                      color: price.active ? "#15803d" : "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    {price.active ? <Eye size={17} /> : <EyeOff size={17} />}
                    {price.active ? "Активна" : "Вимкнена"}
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

const goldButton = {
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
  cursor: "pointer",
  boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
};

const lightButton = {
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
  cursor: "pointer",
};

const whiteButton = {
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
  cursor: "pointer",
  boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
};

function Message({ type, text }: { type: "success" | "error"; text: string }) {
  return (
    <p
      style={{
        marginTop: "20px",
        marginBottom: 0,
        borderRadius: "18px",
        background: type === "success" ? "#ecfdf3" : "#fff1f1",
        padding: "14px 16px",
        fontSize: "14px",
        fontWeight: 700,
        color: type === "success" ? "#15803d" : "#ef4444",
      }}
    >
      {text}
    </p>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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
    </div>
  );
}

