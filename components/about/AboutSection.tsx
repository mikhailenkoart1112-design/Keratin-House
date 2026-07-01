"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type AboutData = {
  name?: string;
  title?: string;
  description?: string;
  experience?: string;
  specialization?: string;
  imageUrl?: string;
  badge1?: string;
  badge2?: string;
  badge3?: string;
  quote?: string;
};

type SettingsData = {
  instagram?: string;
};

type InfoCard = {
  title: string;
  text: string;
};

type CardProps = {
  children: React.ReactNode;
};

const cardStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  background: "#ffffff",
  borderRadius: "34px",
  boxShadow: "0 22px 60px rgba(0,0,0,0.07)",
  textDecoration: "none",
  color: "inherit",
};

const cardInnerStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "26px 30px 30px 30px",
};

const labelStyle = {
  fontSize: "12px",
  lineHeight: "20px",
  fontWeight: 800,
  textTransform: "uppercase" as const,
  letterSpacing: "0.18em",
  color: "#c9a96e",
  margin: 0,
};

const titleStyle = {
  marginTop: "16px",
  marginBottom: 0,
  fontSize: "27px",
  lineHeight: "1.22",
  fontWeight: 700,
  letterSpacing: "-0.055em",
  color: "#2b2826",
  overflowWrap: "break-word" as const,
  wordBreak: "normal" as const,
};

const textStyle = {
  marginTop: "16px",
  marginBottom: 0,
  fontSize: "16px",
  lineHeight: "1.75",
  color: "#77716b",
  overflowWrap: "break-word" as const,
  wordBreak: "normal" as const,
};

function AnimatedCard({ children }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={cardStyle}
    >
      {children}
    </motion.div>
  );
}

export default function AboutSection() {
  const [about, setAbout] = useState<AboutData>({});
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const [aboutResponse, settingsResponse] = await Promise.all([
          fetch("/api/about", {
            method: "GET",
            cache: "no-store",
          }),
          fetch("/api/settings", {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        const aboutResult = await aboutResponse.json();
        const settingsResult = await settingsResponse.json();

        if (!aboutResult.success) {
          setError("Не вдалося завантажити інформацію.");
          setLoading(false);
          return;
        }

        setAbout(aboutResult.about || {});
        setSettings(settingsResult.settings || {});
        setLoading(false);
      } catch {
        setError("Помилка завантаження інформації.");
        setLoading(false);
      }
    };

    loadAbout();
  }, []);

  const name = about.name || "Дарина";

  const title =
    about.title || "Спеціалістка з відновлення та догляду за волоссям";

  const description =
    about.description ||
    "Допомагаю волоссю виглядати гладким, блискучим і доглянутим. Підбираю процедуру під стан волосся, довжину та бажаний результат.";

  const experience =
    about.experience || "Досвід у догляді та відновленні волосся";

  const specialization =
    about.specialization ||
    "Кератин, ботокс, тотальна реконструкція, холодне відновлення та полірування волосся";

  const imageUrl = about.imageUrl || "/images/about-daryna.png";

  const quote =
    about.quote || "Красиве волосся починається з правильного догляду.";

  const instagram =
    settings.instagram || "https://www.instagram.com/daryna_makhraieva";

  const cards = useMemo<InfoCard[]>(
    () => [
      {
        title: about.badge1 || "Індивідуальний підхід",
        text: "Процедура підбирається під стан, довжину та структуру волосся.",
      },
      {
        title: about.badge2 || "Професійний догляд",
        text: "Акуратна робота, якісні засоби та уважність до деталей.",
      },
      {
        title: about.badge3 || "Акуратна робота",
        text: "Результат має виглядати чисто, доглянуто і природно.",
      },
    ],
    [about.badge1, about.badge2, about.badge3]
  );

  return (
    <section
      style={{
        width: "100%",
        background: "transparent",
        paddingBottom: "96px",
        paddingTop: "128px",
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
              background: "rgba(255,255,255,0.55)",
              borderRadius: "34px",
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 18px 45px rgba(0,0,0,0.04)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <Loader2 className="mx-auto animate-spin text-accent" size={30} />

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
              Завантажуємо інформацію...
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
            <AnimatedCard>
              <div style={cardInnerStyle}>
                <p style={labelStyle}>DARYNA_MAKHRAIEVA</p>

                <h2 style={titleStyle}>Про мене</h2>

                <p style={textStyle}>{title}</p>
              </div>
            </AnimatedCard>

            <AnimatedCard>
              <div
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4 / 5",
                    borderRadius: "28px",
                    overflow: "hidden",
                    background: "#f1ebe2",
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt="Дарина — спеціалістка з догляду та відновлення волосся"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 980px"
                    style={{
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "22px 18px 18px 18px",
                  }}
                >
                  <p style={labelStyle}>{experience}</p>

                  <h2 style={titleStyle}>{name}</h2>

                  <p style={textStyle}>{specialization}</p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard>
              <div style={cardInnerStyle}>
                <h2 style={{ ...titleStyle, marginTop: 0 }}>
                  Догляд, підібраний саме під ваше волосся
                </h2>

                <p style={textStyle}>{description}</p>
              </div>
            </AnimatedCard>

            {cards.map((card) => (
              <AnimatedCard key={card.title}>
                <div style={cardInnerStyle}>
                  <h2 style={{ ...titleStyle, marginTop: 0 }}>
                    {card.title}
                  </h2>

                  <p style={textStyle}>{card.text}</p>
                </div>
              </AnimatedCard>
            ))}

            <AnimatedCard>
              <div style={cardInnerStyle}>
                <p style={labelStyle}>ФІЛОСОФІЯ РОБОТИ</p>

                <h2 style={titleStyle}>“{quote}”</h2>

                <p style={textStyle}>
                  Головне — не просто зробити волосся рівним, а підібрати
                  догляд так, щоб результат виглядав дорого, чисто і природно.
                </p>
              </div>
            </AnimatedCard>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Link
                href={instagram}
                target="_blank"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  border: "none",
                  borderRadius: "999px",
                  background: "#c9a96e",
                  padding: "16px 26px",
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "#ffffff",
                  cursor: "pointer",
                  boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
                  textDecoration: "none",
                }}
              >
                Перейти в Instagram
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}