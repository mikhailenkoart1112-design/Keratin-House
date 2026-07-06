"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

type AuthState = "loading" | "allowed" | "denied";

type BusySlot = {
  id: string;
  date: string;
  time: string;
  reason: string;
  active: boolean;
};

const times = ["10:00", "12:00", "14:00"];

function subscribeAuthStore(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

function getAuthSnapshot(): AuthState {
  if (typeof window === "undefined") return "loading";

  return localStorage.getItem("daryna-admin-auth") === "true"
    ? "allowed"
    : "denied";
}

function getAuthServerSnapshot(): AuthState {
  return "loading";
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

function formatDate(date: string) {
  if (!date) return "Оберіть дату";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time: string) {
  if (time === "ALL_DAY") return "Весь день";

  return time;
}

function getMonths() {
  const result = [];
  const now = new Date();

  for (let i = 0; i < 120; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);

    result.push({
      label: date.toLocaleDateString("uk-UA", { month: "long" }),
      year: date.getFullYear(),
      month: date.getMonth(),
    });
  }

  return result;
}

function getMonthDays(year: number, month: number) {
  const days: Date[] = [];
  const total = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= total; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function getMonthOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();

  return day === 0 ? 6 : day - 1;
}

function isPastDate(value: string) {
  return value < toDateValue(new Date());
}

export default function BusySlotsAdmin() {
  const router = useRouter();

  const authState = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(times[0]);
  const [allDay, setAllDay] = useState(false);
  const [reason, setReason] = useState("Зайнято");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authState === "denied") {
      router.replace("/admin/login");
    }
  }, [authState, router]);

  useEffect(() => {
    if (authState !== "allowed") return;

    let cancelled = false;

    async function loadInitialBusySlots() {
      try {
        const response = await fetch("/api/busy-slots", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();
        const list = result.busySlots || [];

        if (!cancelled) {
          setBusySlots(Array.isArray(list) ? list : []);
        }
      } catch {
        if (!cancelled) {
          setError("Не вдалося завантажити зайняті дати.");
          setBusySlots([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialBusySlots();

    return () => {
      cancelled = true;
    };
  }, [authState]);

  const months = useMemo(() => getMonths(), []);
  const activeMonth = months[activeMonthIndex];

  const monthDays = useMemo(
    () => getMonthDays(activeMonth.year, activeMonth.month),
    [activeMonth]
  );

  const monthOffset = useMemo(
    () => getMonthOffset(activeMonth.year, activeMonth.month),
    [activeMonth]
  );

  const sortedBusySlots = useMemo(() => {
    return [...busySlots].sort((a, b) => {
      const first = `${a.date}-${a.time}`;
      const second = `${b.date}-${b.time}`;

      return first.localeCompare(second);
    });
  }, [busySlots]);

  const loadBusySlots = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/busy-slots", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();
      const list = result.busySlots || [];

      setBusySlots(Array.isArray(list) ? list : []);
    } catch {
      setError("Не вдалося завантажити зайняті дати.");
      setBusySlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const chooseDate = (value: string, disabled: boolean) => {
    if (disabled) return;

    setDate(value);
    setCalendarOpen(false);
    setError("");
  };

  const saveBusySlot = async () => {
    if (!date) {
      setError("Оберіть дату.");
      return;
    }

    if (!allDay && !time) {
      setError("Оберіть час.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/busy-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          time: allDay ? "ALL_DAY" : time,
          reason: reason.trim() || (allDay ? "Вихідний" : "Зайнято"),
          active: true,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося зберегти.");
        return;
      }

      setDate("");
      setTime(times[0]);
      setAllDay(false);
      setReason("Зайнято");

      await loadBusySlots();
    } catch {
      setError("Помилка збереження.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBusySlot = async (id: string) => {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/busy-slots?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося видалити.");
        return;
      }

      setBusySlots((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("Помилка видалення.");
    } finally {
      setDeletingId("");
    }
  };

  if (authState !== "allowed") return null;

  return (
    <>
      <main className="min-h-screen bg-[#f8f6f2] px-4 py-7 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-3 text-sm font-bold text-[#2b2826] shadow-[0_14px_35px_rgba(0,0,0,0.06)] transition hover:bg-[#f1ebe3]"
            >
              <ArrowLeft size={18} />
              Назад в адмінку
            </Link>
          </div>

          <section className="rounded-[42px] border border-white/80 bg-white/85 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.07)] backdrop-blur sm:p-9">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-accent">
              Booking control
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-[#2b2826] sm:text-6xl">
              Зайняті дати
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-secondary sm:text-base">
              Закрий конкретний час або весь день. Клієнт не зможе вибрати
              зайнятий слот у формі запису.
            </p>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[42px] border border-white/80 bg-white/85 p-7 shadow-[0_22px_60px_rgba(0,0,0,0.065)] backdrop-blur sm:p-8">
              <div className="mb-7">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-accent">
                  Новий слот
                </p>

                <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.065em] text-[#2b2826]">
                  Додати зайнятий час
                </h2>
              </div>

              <div className="grid gap-4">
                <div>
                  <p className="mb-2 text-sm font-bold text-[#2b2826]">Дата</p>

                  <button
                    type="button"
                    onClick={() => setCalendarOpen(true)}
                    className="flex w-full items-center justify-between rounded-[26px] bg-[#f8f6f2] px-5 py-5 text-left text-base font-bold text-[#2b2826] outline-none transition hover:bg-[#f1ebe3]"
                  >
                    <span>{formatDate(date)}</span>
                    <CalendarDays size={21} className="text-accent" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setAllDay((current) => !current)}
                  className={`flex items-center gap-3 rounded-[26px] px-5 py-5 text-left transition ${
                    allDay
                      ? "bg-accent text-white"
                      : "bg-[#f8f6f2] text-[#2b2826]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      allDay
                        ? "border-white bg-white"
                        : "border-black/20 bg-white"
                    }`}
                  >
                    {allDay && (
                      <span className="h-3 w-3 rounded-full bg-accent" />
                    )}
                  </span>

                  <span className="text-sm font-black">
                    Позначити весь день зайнятим
                  </span>
                </button>

                {!allDay && (
                  <div>
                    <p className="mb-2 text-sm font-bold text-[#2b2826]">
                      Час
                    </p>

                    <div className="grid grid-cols-3 gap-2 rounded-[26px] bg-[#f8f6f2] p-2">
                      {times.map((item) => {
                        const active = time === item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setTime(item)}
                            className={`rounded-full px-4 py-3 text-sm font-black transition ${
                              active
                                ? "bg-accent text-white shadow-[0_14px_30px_rgba(201,165,122,0.35)]"
                                : "bg-white text-[#2b2826]"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <p className="mb-2 text-sm font-bold text-[#2b2826]">
                    Причина
                  </p>

                  <input
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className="w-full rounded-[26px] bg-[#f8f6f2] px-5 py-5 text-base font-semibold text-[#2b2826] outline-none placeholder:text-secondary"
                    placeholder="Зайнято"
                  />
                </div>

                {error && (
                  <p className="rounded-[24px] bg-red-50 px-5 py-4 text-sm font-bold text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={saveBusySlot}
                  disabled={isSaving}
                  className="mt-2 rounded-full bg-accent px-6 py-5 text-base font-bold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Зберігається..." : "Зберегти"}
                </button>
              </div>
            </div>

            <div className="rounded-[42px] border border-white/80 bg-white/85 p-7 shadow-[0_22px_60px_rgba(0,0,0,0.065)] backdrop-blur sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f8f6f2] text-accent">
                  <CalendarDays size={24} />
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-accent">
                    Список
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.065em] text-[#2b2826]">
                    Активні зайняті слоти
                  </h2>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center gap-3 rounded-[30px] bg-[#f8f6f2] p-5 text-sm font-bold text-secondary">
                  <Loader2 className="animate-spin text-accent" size={20} />
                  Завантаження...
                </div>
              ) : sortedBusySlots.length === 0 ? (
                <div className="rounded-[30px] bg-[#f8f6f2] p-6">
                  <p className="text-sm font-semibold text-secondary">
                    Поки немає зайнятих дат.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {sortedBusySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="rounded-[30px] border border-[#eadcc9] bg-[#f8f6f2] p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#2b2826]">
                              <CalendarDays
                                size={16}
                                className="text-accent"
                              />
                              {formatDate(slot.date)}
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#2b2826]">
                              <Clock3 size={16} className="text-accent" />
                              {formatTime(slot.time)}
                            </span>
                          </div>

                          <p className="mt-4 text-sm font-semibold text-secondary">
                            {slot.reason || "Зайнято"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteBusySlot(slot.id)}
                          disabled={deletingId === slot.id}
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          title="Видалити"
                        >
                          {deletingId === slot.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {calendarOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end bg-black/35 p-3 backdrop-blur-sm sm:items-center sm:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-[42px] bg-white p-5 shadow-[0_30px_90px_rgba(0,0,0,0.2)] sm:p-6"
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.96 }}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-accent">
                    Календар
                  </p>

                  <h3 className="mt-2 text-3xl font-semibold tracking-[-0.065em] text-[#2b2826]">
                    Оберіть дату
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8f6f2] text-[#2b2826]"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mb-5 flex items-center justify-between rounded-[28px] bg-[#f8f6f2] p-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveMonthIndex((current) => Math.max(0, current - 1))
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2b2826] shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
                >
                  <ChevronLeft size={22} />
                </button>

                <div className="text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-accent">
                    {activeMonth.year}
                  </p>

                  <h4 className="mt-1 text-3xl font-semibold capitalize tracking-[-0.06em] text-[#2b2826]">
                    {activeMonth.label}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveMonthIndex((current) =>
                      Math.min(months.length - 1, current + 1)
                    )
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2b2826] shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 rounded-[22px] bg-[#f8f6f2] p-2 text-center text-xs font-black uppercase text-[#9b9288]">
                <span>ПН</span>
                <span>ВТ</span>
                <span>СР</span>
                <span>ЧТ</span>
                <span>ПТ</span>
                <span>СБ</span>
                <span>НД</span>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-2 rounded-[28px] bg-[#f8f6f2] p-2">
                {Array.from({ length: monthOffset }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-12" />
                ))}

                {monthDays.map((day) => {
                  const value = toDateValue(day);
                  const disabled = isPastDate(value);
                  const active = date === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={disabled}
                      onClick={() => chooseDate(value, disabled)}
                      className={`flex h-12 items-center justify-center rounded-full text-sm font-black transition ${
                        active
                          ? "bg-accent text-white shadow-[0_14px_30px_rgba(201,165,122,0.35)]"
                          : disabled
                          ? "cursor-not-allowed bg-white/45 text-[#c8c1b8]"
                          : "bg-white text-[#2b2826] hover:bg-[#efe7dd]"
                      }`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}