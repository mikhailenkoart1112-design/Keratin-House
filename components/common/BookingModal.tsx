"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  initialServiceTitle?: string;
};

type Tab = "services" | "datetime";

type HairLength =
  | "До 30 см"
  | "До 40 см"
  | "До 50 см"
  | "До 60 см"
  | "До 70 см"
  | "До 80 см";

type ServiceOption = {
  title: string;
  prices: Record<HairLength, number>;
};

type BookingRequest = {
  id: string;
  name: string;
  contact: string;
  service: string;
  services: string[];
  totalPrice: number;
  hairLength: string;
  date: string;
  time: string;
  comment: string;
  createdAt: string;
  status: "new";
};

type ExistingBooking = {
  date?: string;
  time?: string;
  status?: string;
};

type BusySlot = {
  id?: string;
  date?: string;
  time?: string;
  reason?: string;
  active?: boolean | string;
};

const hairLengths: HairLength[] = [
  "До 30 см",
  "До 40 см",
  "До 50 см",
  "До 60 см",
  "До 70 см",
  "До 80 см",
];

const services: ServiceOption[] = [
  {
    title: "Кератинове вирівнювання",
    prices: {
      "До 30 см": 1800,
      "До 40 см": 2200,
      "До 50 см": 2700,
      "До 60 см": 3200,
      "До 70 см": 3800,
      "До 80 см": 4500,
    },
  },
  {
    title: "Кератин / Ботокс",
    prices: {
      "До 30 см": 2000,
      "До 40 см": 2400,
      "До 50 см": 2800,
      "До 60 см": 3300,
      "До 70 см": 3800,
      "До 80 см": 4500,
    },
  },
  {
    title: "Ботокс для волосся",
    prices: {
      "До 30 см": 1800,
      "До 40 см": 2200,
      "До 50 см": 2700,
      "До 60 см": 3200,
      "До 70 см": 3800,
      "До 80 см": 4500,
    },
  },
  {
    title: "Холодне відновлення",
    prices: {
      "До 30 см": 1200,
      "До 40 см": 1500,
      "До 50 см": 1800,
      "До 60 см": 2200,
      "До 70 см": 2600,
      "До 80 см": 3000,
    },
  },
  {
    title: "Тотальна реконструкція",
    prices: {
      "До 30 см": 2200,
      "До 40 см": 2700,
      "До 50 см": 3200,
      "До 60 см": 3800,
      "До 70 см": 4500,
      "До 80 см": 5200,
    },
  },
  {
    title: "Полірування волосся",
    prices: {
      "До 30 см": 700,
      "До 40 см": 800,
      "До 50 см": 900,
      "До 60 см": 1000,
      "До 70 см": 1200,
      "До 80 см": 1400,
    },
  },
  {
    title: "SPA догляд",
    prices: {
      "До 30 см": 900,
      "До 40 см": 1100,
      "До 50 см": 1300,
      "До 60 см": 1500,
      "До 70 см": 1700,
      "До 80 см": 1900,
    },
  },
];

const allTimes = ["10:00", "12:00", "14:00"];

function formatPrice(price: number) {
  return `${price.toLocaleString("uk-UA")} грн`;
}

function getServicePrice(service: ServiceOption, hairLength: string) {
  if (hairLengths.includes(hairLength as HairLength)) {
    return service.prices[hairLength as HairLength];
  }

  return service.prices["До 30 см"];
}

function normalize(value: string) {
  return value.toLowerCase().replaceAll(" ", "").replaceAll("/", "").trim();
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

function parseDateValue(value?: string) {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const match = value.match(/(\d{2})\.(\d{2})\.(\d{4})/);

  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return toDateValue(date);
}

function parseTimeValue(value?: string) {
  if (!value) return "";

  if (value === "ALL_DAY") return "ALL_DAY";

  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("uk-UA", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function isActiveBusySlot(value: boolean | string | undefined) {
  if (value === undefined) return true;
  if (value === true) return true;
  if (value === false) return false;

  const text = String(value).trim().toUpperCase();

  return text === "TRUE" || text === "YES" || text === "1";
}

export default function BookingModal({
  open,
  onClose,
  initialServiceTitle = "",
}: Props) {
  const [tab, setTab] = useState<Tab>("services");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);
  const [hairLength, setHairLength] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [bookings, setBookings] = useState<ExistingBooking[]>([]);
  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (!initialServiceTitle) {
        setSelectedServices([]);
        return;
      }

      const normalizedInitial = normalize(initialServiceTitle);

      const foundService = services.find((service) => {
        const normalizedService = normalize(service.title);

        return (
          normalizedService === normalizedInitial ||
          normalizedInitial.includes(normalizedService) ||
          normalizedService.includes(normalizedInitial)
        );
      });

      if (!foundService) return;

      setSelectedServices([foundService]);
      setTab("services");
    }, 0);

    return () => clearTimeout(timer);
  }, [open, initialServiceTitle]);

  useEffect(() => {
    if (!open) return;

    const loadBookings = async () => {
      try {
        const response = await fetch("/api/booking", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        const list =
          result.requests ||
          result.bookings ||
          result.data ||
          result.items ||
          [];

        setBookings(Array.isArray(list) ? list : []);
      } catch {
        setBookings([]);
      }
    };

    const loadBusySlots = async () => {
      try {
        const response = await fetch("/api/busy-slots", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        const list =
          result.busySlots || result.slots || result.data || result.items || [];

        setBusySlots(Array.isArray(list) ? list : []);
      } catch {
        setBusySlots([]);
      }
    };

    loadBookings();
    loadBusySlots();
  }, [open]);

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

  const busyTimesByDate = useMemo(() => {
    const map: Record<string, string[]> = {};

    bookings.forEach((booking) => {
      if (booking.status !== "accepted") return;

      const bookingDate = parseDateValue(booking.date);
      const bookingTime = parseTimeValue(booking.time);

      if (!bookingDate || !bookingTime) return;

      if (!map[bookingDate]) {
        map[bookingDate] = [];
      }

      map[bookingDate].push(bookingTime);
    });

    busySlots.forEach((slot) => {
      if (!isActiveBusySlot(slot.active)) return;

      const slotDate = parseDateValue(slot.date);
      const slotTime = parseTimeValue(slot.time);

      if (!slotDate || !slotTime) return;

      if (!map[slotDate]) {
        map[slotDate] = [];
      }

      map[slotDate].push(slotTime);
    });

    Object.keys(map).forEach((key) => {
      map[key] = Array.from(new Set(map[key]));
    });

    return map;
  }, [bookings, busySlots]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, service) => {
      return sum + getServicePrice(service, hairLength);
    }, 0);
  }, [selectedServices, hairLength]);

  const selectedServiceNames = useMemo(() => {
    return selectedServices.map((service) => service.title);
  }, [selectedServices]);

  const resetForm = () => {
    setName("");
    setContact("");
    setSelectedServices([]);
    setHairLength("");
    setDate("");
    setTime("");
    setComment("");
    setError("");
    setTab("services");
  };

  const toggleService = (service: ServiceOption) => {
    setSelectedServices((current) => {
      const exists = current.some((item) => item.title === service.title);

      if (exists) {
        return current.filter((item) => item.title !== service.title);
      }

      return [...current, service];
    });
  };

  const removeService = (title: string) => {
    setSelectedServices((current) =>
      current.filter((service) => service.title !== title)
    );
  };

  const chooseDate = (value: string, disabled: boolean) => {
    if (disabled) return;

    setDate(value);
    setTime("");
    setError("");
  };

  const submitRequest = async () => {
    if (isSubmittingRef.current) return;

    if (
      !name.trim() ||
      !contact.trim() ||
      selectedServices.length === 0 ||
      !hairLength ||
      !date ||
      !time
    ) {
      setError("Заповніть імʼя, контакт, послуги, довжину, день та час.");
      return;
    }

    const busy = busyTimesByDate[date] || [];

    if (busy.includes("ALL_DAY") || busy.includes(time)) {
      setError("Цей час уже зайнятий. Оберіть інший день або час.");
      return;
    }

    const serviceSummary = selectedServices
      .map((service) => {
        const price = getServicePrice(service, hairLength);
        return `${service.title} — ${formatPrice(price)}`;
      })
      .join("; ");

    const fullServiceText = `${serviceSummary}. Разом: ${formatPrice(
      totalPrice
    )}`;

    const newRequest: BookingRequest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      contact: contact.trim(),
      service: fullServiceText,
      services: selectedServiceNames,
      totalPrice,
      hairLength,
      date,
      time,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      status: "new",
    };

    isSubmittingRef.current = true;
    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRequest),
      });

      const result = await response.json();

      if (!result.success) {
        isSubmittingRef.current = false;
        setIsSending(false);
        setError("Не вдалося відправити заявку в Google Sheets.");
        return;
      }

      setSuccess(true);
      resetForm();

      setTimeout(() => {
        isSubmittingRef.current = false;
        setIsSending(false);
        setSuccess(false);
        onClose();
      }, 1200);
    } catch {
      isSubmittingRef.current = false;
      setIsSending(false);
      setError("Не вдалося відправити заявку. Спробуйте ще раз.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end bg-black/35 p-3 backdrop-blur-sm sm:items-center sm:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-h-[94svh] w-full max-w-2xl overflow-y-auto rounded-[34px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
          >
            <div className="sticky top-0 z-20 bg-white p-5 pb-3">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                    Онлайн запис
                  </p>

                  <h2 className="mt-1 text-4xl font-semibold tracking-[-0.07em]">
                    Записатися
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1ebe3]"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-[22px] bg-[#f1ebe3] p-1">
                <button
                  type="button"
                  onClick={() => setTab("services")}
                  className={`flex items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-black transition ${
                    tab === "services"
                      ? "bg-white text-[#2b2826] shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                      : "text-[#77716b]"
                  }`}
                >
                  <ShoppingBag size={17} />
                  Послуги
                </button>

                <button
                  type="button"
                  onClick={() => setTab("datetime")}
                  className={`flex items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-black transition ${
                    tab === "datetime"
                      ? "bg-white text-[#2b2826] shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                      : "text-[#77716b]"
                  }`}
                >
                  <CalendarDays size={17} />
                  Дата і час
                </button>
              </div>
            </div>

            {success ? (
              <div className="p-5 pt-2">
                <div className="rounded-[28px] bg-[#f8f6f2] p-8 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                    Заявку відправлено
                  </p>

                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                    Дякуємо!
                  </h3>

                  <p className="mt-3 text-secondary">
                    Заявка збережена в адмінці та Google Sheets.
                  </p>
                </div>
              </div>
            ) : (
              <form className="grid gap-3 p-5 pt-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl bg-[#f8f6f2] px-4 py-4 outline-none"
                  placeholder="Імʼя"
                />

                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="rounded-2xl bg-[#f8f6f2] px-4 py-4 outline-none"
                  placeholder="Instagram або телефон"
                />

                {tab === "services" && (
                  <>
                    <select
                      value={hairLength}
                      onChange={(e) => setHairLength(e.target.value)}
                      className="rounded-2xl bg-[#f8f6f2] px-4 py-4 outline-none"
                    >
                      <option value="">Довжина волосся</option>
                      {hairLengths.map((length) => (
                        <option key={length}>{length}</option>
                      ))}
                    </select>

                    <div className="rounded-[26px] bg-[#f8f6f2] p-3">
                      <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.22em] text-accent">
                        Оберіть послуги
                      </p>

                      <div className="grid gap-2">
                        {services.map((service) => {
                          const selected = selectedServices.some(
  (item) => item.title === service.title
);

                          const price = getServicePrice(service, hairLength);

                          return (
                            <button
                              key={service.title}
                              type="button"
                              onClick={() => toggleService(service)}
                              className="flex items-center justify-between gap-3 rounded-[22px] bg-white p-4 text-left text-[#2b2826] transition hover:bg-[#fffaf2]"
                            >
                              <span>
                                <span className="block text-base font-bold leading-5">
                                  {service.title}
                                </span>

                                <span className="mt-1 block text-sm font-semibold text-secondary">
                                  {hairLength
                                    ? formatPrice(price)
                                    : `від ${formatPrice(price)}`}
                                </span>
                              </span>

                              <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                                  selected
                                    ? "border-accent bg-accent text-white"
                                    : "border-black/10 bg-white text-[#2b2826]"
                                }`}
                              >
                                {selected ? (
                                  <Check size={18} />
                                ) : (
                                  <Plus size={19} />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedServices.length > 0 && (
                      <div className="rounded-[26px] border border-[#eadcc9] bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                          Ваш вибір
                        </p>

                        <div className="mt-4 grid gap-2">
                          {selectedServices.map((service) => {
                            const price = getServicePrice(service, hairLength);

                            return (
                              <div
                                key={service.title}
                                className="flex items-center justify-between gap-3 rounded-[20px] bg-[#f8f6f2] p-3"
                              >
                                <div>
                                  <p className="text-sm font-bold text-[#2b2826]">
                                    {service.title}
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-accent">
                                    {hairLength
                                      ? formatPrice(price)
                                      : `від ${formatPrice(price)}`}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeService(service.title)}
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-[22px] bg-[#2b2826] p-4 text-white">
                          <p className="text-sm font-bold">Разом</p>
                          <p className="text-xl font-black">
                            {hairLength
                              ? formatPrice(totalPrice)
                              : `від ${formatPrice(totalPrice)}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {tab === "datetime" && (
                  <div className="rounded-[26px] bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
                    <div className="mb-4 flex items-center gap-2">
                      <Clock3 size={16} className="text-accent" />

                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                        Виберіть дату і час
                      </p>
                    </div>

                    <div className="mb-5 flex items-center justify-between rounded-[24px] bg-[#f8f6f2] p-3">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMonthIndex((current) =>
                            Math.max(0, current - 1)
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2b2826] shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
                      >
                        <ChevronLeft size={22} />
                      </button>

                      <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                          {activeMonth.year}
                        </p>

                        <h3 className="mt-1 text-3xl font-semibold capitalize tracking-[-0.06em] text-[#2b2826]">
                          {activeMonth.label}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveMonthIndex((current) =>
                            Math.min(months.length - 1, current + 1)
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2b2826] shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 rounded-[20px] bg-[#f8f6f2] p-2 text-center text-xs font-black uppercase text-[#9b9288]">
                      <span>ПН</span>
                      <span>ВТ</span>
                      <span>СР</span>
                      <span>ЧТ</span>
                      <span>ПТ</span>
                      <span>СБ</span>
                      <span>НД</span>
                    </div>

                    <div className="mt-3 grid grid-cols-7 gap-2 rounded-[24px] bg-[#f8f6f2] p-2">
                      {Array.from({ length: monthOffset }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-11" />
                      ))}

                      {monthDays.map((day) => {
                        const value = toDateValue(day);
                        const isSunday = day.getDay() === 0;
                        const isPast = isPastDate(value);
                        const busy = busyTimesByDate[value] || [];
                        const allDayBusy = busy.includes("ALL_DAY");
                        const fullyBusy =
                          allDayBusy ||
                          (busy.filter((item) => item !== "ALL_DAY").length >=
                            allTimes.length &&
                            !isSunday);
                        const disabled = isPast || isSunday || fullyBusy;
                        const active = date === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={disabled}
                            onClick={() => chooseDate(value, disabled)}
                            className={`flex h-11 items-center justify-center rounded-full text-sm font-black transition ${
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

                    <div className="mt-5 rounded-[24px] bg-[#f8f6f2] p-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                        Вільний час
                      </p>

                      {!date ? (
                        <p className="text-sm font-semibold text-secondary">
                          Оберіть день у календарі.
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {allTimes.map((availableTime) => {
                            const busy = busyTimesByDate[date] || [];
                            const allDayBusy = busy.includes("ALL_DAY");
                            const isBusy =
                              allDayBusy || busy.includes(availableTime);
                            const active = time === availableTime;

                            return (
                              <button
                                key={availableTime}
                                type="button"
                                disabled={isBusy}
                                onClick={() => setTime(availableTime)}
                                className={`rounded-full px-4 py-3 text-sm font-black transition ${
                                  active
                                    ? "bg-accent text-white shadow-[0_14px_30px_rgba(201,165,122,0.35)]"
                                    : isBusy
                                    ? "cursor-not-allowed bg-white/45 text-black/20"
                                    : "bg-white text-[#2b2826]"
                                }`}
                              >
                                {availableTime}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-28 rounded-2xl bg-[#f8f6f2] px-4 py-4 outline-none"
                  placeholder="Коментар"
                />

                {error && (
                  <p className="text-sm font-semibold text-red-500">{error}</p>
                )}

                <button
                  type="button"
                  onClick={submitRequest}
                  disabled={isSending}
                  className="rounded-full bg-accent px-6 py-4 font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending
                    ? "Відправляється..."
                    : selectedServices.length > 0 && hairLength
                    ? `Відправити заявку • ${formatPrice(totalPrice)}`
                    : "Відправити заявку"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}