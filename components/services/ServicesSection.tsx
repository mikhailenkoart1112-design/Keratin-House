"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, RefreshCw, X } from "lucide-react";

import BookingModal from "@/components/common/BookingModal";

type ServiceItem = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  priceFrom: string;
  order: number;
  active: boolean;
};

function isConsultation(title: string) {
  return title.toLowerCase().includes("консультац");
}

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingServiceTitle, setBookingServiceTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
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

        setServices(result.services || []);
        setLoading(false);
      } catch {
        setError("Помилка завантаження послуг.");
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const visibleServices = useMemo(() => {
    return services
      .filter((service) => service.active !== false)
      .sort((a, b) => Number(a.order) - Number(b.order));
  }, [services]);

  const openBookingForService = (service?: ServiceItem) => {
    if (service && !isConsultation(service.title)) {
      setBookingServiceTitle(service.title);
    } else {
      setBookingServiceTitle("");
    }

    setBookingOpen(true);
  };

  return (
    <>
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "#f8f6f2",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url('/images/services-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background:
              "linear-gradient(180deg, rgba(248,246,242,0.08), rgba(248,246,242,0.34) 46%, #f8f6f2 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <section
            style={{
              width: "100%",
              padding: "128px 10px 54px 10px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "980px",
                margin: "0 auto",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45 }}
                style={{
                  width: "100%",
                  maxWidth: "640px",
                  marginTop: "54px",
                  background: "rgba(255,255,255,0.88)",
                  borderRadius: "34px",
                  padding: "30px 32px 34px 32px",
                  boxShadow: "0 22px 60px rgba(0,0,0,0.10)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "#c9a96e",
                  }}
                >
                  DARYNA_MAKHRAIEVA
                </p>

                <h1
                  style={{
                    marginTop: "16px",
                    marginBottom: 0,
                    fontSize: "46px",
                    lineHeight: "1.05",
                    fontWeight: 800,
                    letterSpacing: "-0.065em",
                    color: "#2b2826",
                    overflowWrap: "break-word",
                  }}
                >
                  Послуги
                </h1>

                <p
                  style={{
                    marginTop: "16px",
                    marginBottom: 0,
                    maxWidth: "560px",
                    fontSize: "17px",
                    lineHeight: "1.75",
                    fontWeight: 600,
                    color: "#77716b",
                    overflowWrap: "break-word",
                  }}
                >
                  Кератин, ботокс, тотальна реконструкція, холодне відновлення,
полірування та домашній догляд.
                </p>

                <button
                  onClick={() => openBookingForService()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    border: "none",
                    borderRadius: "999px",
                    background: "#c9a96e",
                    padding: "16px 24px",
                    marginTop: "24px",
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "#ffffff",
                    cursor: "pointer",
                    boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
                  }}
                >
                  <CalendarDays size={18} />
                  Записатися
                </button>
              </motion.div>
            </div>
          </section>

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
                  <RefreshCw
                    className="mx-auto animate-spin text-accent"
                    size={30}
                  />

                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
                    Завантажуємо послуги...
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
              ) : visibleServices.length === 0 ? (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "34px",
                    padding: "32px",
                    textAlign: "center",
                    boxShadow: "0 24px 65px rgba(0,0,0,0.07)",
                  }}
                >
                  <p className="text-secondary">Послуги скоро зʼявляться.</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "24px",
                    width: "100%",
                  }}
                >
                  {visibleServices.map((service, index) => {
                    const consultation = isConsultation(service.title);

                    return (
                      <motion.article
                        key={service.id}
                        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.035 }}
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
                          {!consultation && (
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
                              {service.priceFrom || "DARYNA_MAKHRAIEVA"}
                            </p>
                          )}

                          {consultation && (
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
                              Безкоштовно
                            </p>
                          )}

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
                            {service.title}
                          </h2>

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
                            {service.shortDescription}
                          </p>

                          <div
                            style={{
                              display: "grid",
                              gap: "12px",
                              marginTop: "24px",
                              width: "100%",
                            }}
                          >
                            <button
                              onClick={() => setSelectedService(service)}
                              style={{
                                width: "100%",
                                border: "none",
                                borderRadius: "999px",
                                background: "#f1ebe3",
                                padding: "15px 22px",
                                fontSize: "15px",
                                fontWeight: 800,
                                color: "#2b2826",
                                cursor: "pointer",
                              }}
                            >
                              Детальніше
                            </button>

                            {!consultation && (
                              <button
                                onClick={() => openBookingForService(service)}
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
                                  boxShadow:
                                    "0 18px 40px rgba(201,165,122,0.35)",
                                }}
                              >
                                Записатися
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end bg-black/35 p-3 backdrop-blur-md sm:items-center sm:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[34px] bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:p-8"
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.96 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {!isConsultation(selectedService.title) && (
                    <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-[#c9a96e]">
                      {selectedService.priceFrom}
                    </p>
                  )}

                  {isConsultation(selectedService.title) && (
                    <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-[#c9a96e]">
                      Безкоштовно
                    </p>
                  )}

                  <h2 className="mt-4 break-words text-[34px] font-black leading-tight tracking-[-0.06em] text-[#2b2826] sm:text-5xl">
                    {selectedService.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedService(null)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1ebe3]"
                >
                  <X size={22} />
                </button>
              </div>

              <p className="mt-6 break-words text-base font-semibold leading-8 text-[#77716b] sm:text-lg">
                {selectedService.fullDescription}
              </p>

              {selectedService.benefits?.length > 0 && (
                <div className="mt-6 grid gap-2">
                  {selectedService.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="rounded-[22px] bg-[#f8f6f2] px-4 py-3 text-sm font-bold leading-6 text-[#2b2826]"
                    >
                      {benefit}
                    </div>
                  ))}
                </div>
              )}

              {!isConsultation(selectedService.title) && (
                <button
                  onClick={() => {
                    openBookingForService(selectedService);
                    setSelectedService(null);
                  }}
                  className="mt-8 w-full rounded-full bg-[#c9a96e] px-6 py-4 font-black text-white shadow-[0_18px_40px_rgba(201,169,110,0.35)]"
                >
                  Записатися на послугу
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialServiceTitle={bookingServiceTitle}
      />
    </>
  );
}