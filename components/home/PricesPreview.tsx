"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronDown, Loader2 } from "lucide-react";

import BookingModal from "@/components/common/BookingModal";

type PriceItem = {
  id: string;
  category: string;
  title: string;
  label: string;
  price: string;
  order: number;
  active: boolean;
};

function getPriceFrom(items: PriceItem[]) {
  const firstPrice = items.find((item) => item.price)?.price || "";
  const match = firstPrice.match(/\d+/);

  if (match) {
    return `від ${match[0]} грн`;
  }

  return firstPrice || "ціна після консультації";
}

export default function PricesPreview() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [openedTitle, setOpenedTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const response = await fetch("/api/prices", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!result.success) {
          setError("Не вдалося завантажити прайс.");
          setLoading(false);
          return;
        }

        setPrices(result.prices || []);
        setLoading(false);
      } catch {
        setError("Помилка завантаження прайсу.");
        setLoading(false);
      }
    };

    loadPrices();
  }, []);

  const groupedPrices = useMemo(() => {
    const groups: Record<string, PriceItem[]> = {};

    prices
      .filter((item) => item.active !== false)
      .sort((a, b) => Number(a.order) - Number(b.order))
      .forEach((item) => {
        if (!groups[item.title]) {
          groups[item.title] = [];
        }

        groups[item.title].push(item);
      });

    return Object.entries(groups);
  }, [prices]);

  return (
    <>
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
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#ffffff",
              borderRadius: "34px",
              padding: "26px 30px 30px 30px",
              boxShadow: "0 22px 60px rgba(0,0,0,0.07)",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                lineHeight: "20px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#c9a96e",
                margin: 0,
                overflowWrap: "break-word",
              }}
            >
              daryna_makhraieva
            </p>

            <h1
              style={{
                marginTop: "16px",
                marginBottom: 0,
                fontSize: "36px",
                lineHeight: "1.15",
                fontWeight: 800,
                letterSpacing: "-0.055em",
                color: "#2b2826",
                overflowWrap: "break-word",
              }}
            >
              Прайс
            </h1>

            <p
              style={{
                marginTop: "16px",
                marginBottom: 0,
                fontSize: "16px",
                lineHeight: "1.75",
                fontWeight: 600,
                color: "#77716b",
                overflowWrap: "break-word",
              }}
            >
              Актуальні ціни на відновлення, реконструкцію, полірування та
              догляд за волоссям.
            </p>

            <button
              onClick={() => setBookingOpen(true)}
              style={{
                width: "100%",
                marginTop: "22px",
                border: "none",
                borderRadius: "999px",
                background: "#c9a96e",
                padding: "14px 20px",
                fontSize: "16px",
                fontWeight: 800,
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <CalendarDays size={18} />
              Записатися
            </button>
          </div>

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
                Завантажуємо прайс...
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
              {groupedPrices.map(([title, items]) => {
                const isOpen = openedTitle === title;

                return (
                  <div
                    key={title}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: "#ffffff",
                      borderRadius: "34px",
                      boxShadow: "0 22px 60px rgba(0,0,0,0.07)",
                      padding: "26px 30px 30px 30px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        lineHeight: "20px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        color: "#c9a96e",
                        margin: 0,
                        overflowWrap: "break-word",
                      }}
                    >
                      daryna_makhraieva
                    </p>

                    <h2
                      style={{
                        marginTop: "16px",
                        marginBottom: 0,
                        fontSize: "29px",
                        lineHeight: "1.2",
                        fontWeight: 800,
                        letterSpacing: "-0.045em",
                        color: "#2b2826",
                        overflowWrap: "break-word",
                      }}
                    >
                      {title}
                    </h2>

                    <p
                      style={{
                        marginTop: "14px",
                        marginBottom: 0,
                        fontSize: "20px",
                        lineHeight: "1.4",
                        fontWeight: 800,
                        color: "#c9a96e",
                      }}
                    >
                      {getPriceFrom(items)}
                    </p>

                    <button
                      onClick={() =>
                        setOpenedTitle(isOpen ? null : title)
                      }
                      style={{
                        width: "100%",
                        marginTop: "20px",
                        border: "none",
                        borderRadius: "999px",
                        background: "#f8f6f2",
                        padding: "14px 20px",
                        fontSize: "15px",
                        fontWeight: 800,
                        color: "#2b2826",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      {isOpen ? "Сховати ціни" : "Більше про ціни"}
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "0.25s",
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          marginTop: "16px",
                          borderRadius: "26px",
                          background: "#f8f6f2",
                          padding: "14px",
                          display: "grid",
                          gap: "10px",
                        }}
                      >
                        {items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              borderRadius: "20px",
                              background: "#ffffff",
                              padding: "14px 16px",
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                fontSize: "15px",
                                lineHeight: "1.45",
                                fontWeight: 800,
                                color: "#2b2826",
                                overflowWrap: "break-word",
                              }}
                            >
                              {item.label}
                            </p>

                            <p
                              style={{
                                marginTop: "6px",
                                marginBottom: 0,
                                fontSize: "16px",
                                lineHeight: "1.45",
                                fontWeight: 800,
                                color: "#c9a96e",
                                overflowWrap: "break-word",
                              }}
                            >
                              {item.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
