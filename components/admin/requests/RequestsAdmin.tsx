"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

type BookingRequest = {
  id: string;
  name: string;
  contact: string;
  service: string;
  services?: string[];
  totalPrice?: number;
  hairLength: string;
  date: string;
  time: string;
  comment: string;
  createdAt: string;
  status: "new" | "accepted" | "rejected" | string;
};

type FilterType = "new" | "accepted" | "completed" | "rejected" | "all";

function formatDate(value?: string) {
  if (!value) return "—";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(value?: string) {
  if (!value) return "—";

  if (/^\d{2}:\d{2}$/.test(value)) return value;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("uk-UA", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCreatedAt(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateOnly(value?: string) {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateTimeValue(dateValue?: string, timeValue?: string) {
  if (!dateValue || !timeValue) return null;

  const cleanDate = /^\d{4}-\d{2}-\d{2}$/.test(dateValue) ? dateValue : "";
  const cleanTime = /^\d{2}:\d{2}$/.test(timeValue) ? timeValue : "";

  if (!cleanDate || !cleanTime) return null;

  const date = new Date(`${cleanDate}T${cleanTime}:00`);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function isCompletedRequest(request: BookingRequest) {
  if (request.status !== "accepted") return false;

  const requestDateTime = getDateTimeValue(request.date, request.time);

  if (!requestDateTime) return false;

  return requestDateTime.getTime() < Date.now();
}

function isExpiredNotAcceptedRequest(request: BookingRequest) {
  if (request.status === "accepted") return false;

  const requestDate = getDateOnly(request.date);
  const today = getDateOnly(new Date().toISOString());

  if (!requestDate || !today) return false;

  return requestDate < today;
}

function getTotalFromText(service?: string) {
  if (!service) return "";

  const match = service.match(/Разом:\s*([^.;]+)/i);
  return match?.[1]?.trim() || "";
}

function getServicesList(service?: string) {
  if (!service) return [];

  return service
    .replace(/\.\s*Разом:.*/i, "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getStatusLabel(request: BookingRequest) {
  if (isCompletedRequest(request)) return "Виконана";
  if (request.status === "accepted") return "Прийнята";
  if (request.status === "rejected") return "Відхилена";
  return "Нова";
}

function getStatusBadgeClass(request: BookingRequest) {
  if (isCompletedRequest(request)) {
    return "bg-[#f1ebe3] text-[#2b2826]";
  }

  if (request.status === "accepted") {
    return "bg-green-50 text-green-600";
  }

  if (request.status === "rejected") {
    return "bg-red-50 text-red-500";
  }

  return "bg-[#f1ebe3] text-accent";
}

export default function RequestsAdmin() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [filter, setFilter] = useState<FilterType>("new");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const uniqueRequests = useMemo(() => {
    const seen = new Set<string>();

    return requests.filter((request) => {
      const key = request.id || `${request.name}-${request.createdAt}`;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [requests]);

  const visibleRequests = useMemo(() => {
    return uniqueRequests.filter(
      (request) => request.status === "accepted" || !isExpiredNotAcceptedRequest(request)
    );
  }, [uniqueRequests]);

  const counts = useMemo(() => {
    return {
      all: visibleRequests.length,
      new: visibleRequests.filter((request) => request.status === "new").length,
      accepted: visibleRequests.filter(
        (request) =>
          request.status === "accepted" && !isCompletedRequest(request)
      ).length,
      completed: visibleRequests.filter((request) =>
        isCompletedRequest(request)
      ).length,
      rejected: visibleRequests.filter(
        (request) => request.status === "rejected"
      ).length,
    };
  }, [visibleRequests]);

  const filteredRequests = useMemo(() => {
    const sorted = [...visibleRequests].sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();

      if (Number.isNaN(aDate) || Number.isNaN(bDate)) return 0;

      return bDate - aDate;
    });

    if (filter === "all") return sorted;

    if (filter === "completed") {
      return sorted.filter((request) => isCompletedRequest(request));
    }

    if (filter === "accepted") {
      return sorted.filter(
        (request) =>
          request.status === "accepted" && !isCompletedRequest(request)
      );
    }

    return sorted.filter((request) => request.status === filter);
  }, [filter, visibleRequests]);

  const loadRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/booking", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.success) {
        setError("Не вдалося завантажити заявки з Google Sheets.");
        setLoading(false);
        return;
      }

      setRequests(result.requests || []);
      setLoading(false);
    } catch {
      setError("Помилка завантаження заявок.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRequests();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const updateStatus = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    const previous = requests;

    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateStatus",
          id,
          status,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setRequests(previous);
        setError("Не вдалося змінити статус заявки.");
      }
    } catch {
      setRequests(previous);
      setError("Помилка зміни статусу заявки.");
    }
  };

  const deleteRequest = async (id: string) => {
    const previous = requests;

    setRequests((current) => current.filter((request) => request.id !== id));

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          id,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setRequests(previous);
        setError("Не вдалося видалити заявку.");
      }
    } catch {
      setRequests(previous);
      setError("Помилка видалення заявки.");
    }
  };

  const clearAll = async () => {
    const previous = requests;

    setRequests([]);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "clear",
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setRequests(previous);
        setError("Не вдалося очистити заявки.");
      }
    } catch {
      setRequests(previous);
      setError("Помилка очищення заявок.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 py-6 sm:px-5 sm:py-10">
      <div className="mx-auto max-w-[980px]">
        <div className="rounded-[34px] bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.07)] sm:p-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-semibold text-accent"
          >
            <ArrowLeft className="mr-2" size={18} />
            Назад в адмінку
          </Link>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              daryna_makhraieva admin
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.08em] text-[#2b2826] sm:text-7xl">
              Заявки
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-secondary sm:text-lg">
              Нові, прийняті, виконані та відхилені записи. Прийнята заявка
              блокує вибраний день і час для клієнтів.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={loadRequests}
              className="inline-flex items-center justify-center rounded-full bg-[#f1ebe3] px-6 py-4 text-sm font-black text-[#2b2826] transition hover:bg-[#e9e0d5]"
            >
              <RefreshCw className="mr-2" size={17} />
              Оновити
            </button>

            {requests.length > 0 && (
              <button
                onClick={clearAll}
                className="inline-flex items-center justify-center rounded-full bg-[#f1ebe3] px-6 py-4 text-sm font-black text-[#2b2826] transition hover:bg-[#e9e0d5]"
              >
                Очистити всі
              </button>
            )}
          </div>

          <div className="mt-8 grid gap-3">
            <TabButton
              label="Нові"
              count={counts.new}
              active={filter === "new"}
              onClick={() => setFilter("new")}
            />

            <TabButton
              label="Прийняті"
              count={counts.accepted}
              active={filter === "accepted"}
              onClick={() => setFilter("accepted")}
            />

            <TabButton
              label="Виконані"
              count={counts.completed}
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
            />

            <TabButton
              label="Відхилені"
              count={counts.rejected}
              active={filter === "rejected"}
              onClick={() => setFilter("rejected")}
            />

            <TabButton
              label="Усі"
              count={counts.all}
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
          </div>

          {error && (
            <div className="mt-6 rounded-[24px] bg-red-50 px-5 py-4">
              <p className="text-sm font-semibold text-red-500">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          {loading ? (
            <StateCard
              label="Завантаження"
              title="Отримуємо заявки..."
              text="Трохи зачекай, дані підтягуються з Google Sheets."
            />
          ) : filteredRequests.length === 0 ? (
            <StateCard
              label="Поки пусто"
              title={
                filter === "new"
                  ? "Нових заявок немає"
                  : filter === "accepted"
                  ? "Прийнятих заявок немає"
                  : filter === "completed"
                  ? "Виконаних заявок немає"
                  : filter === "rejected"
                  ? "Відхилених заявок немає"
                  : "Заявок ще немає"
              }
              text="Коли клієнт залишить заявку, вона зʼявиться тут."
            />
          ) : (
            <div className="grid gap-6">
              {filteredRequests.map((request) => {
                const services = getServicesList(request.service);
                const totalFromText = getTotalFromText(request.service);
                const total =
                  request.totalPrice && request.totalPrice > 0
                    ? `${request.totalPrice.toLocaleString("uk-UA")} грн`
                    : totalFromText || "—";

                const completed = isCompletedRequest(request);

                return (
                  <article
                    key={request.id}
                    className="rounded-[34px] bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.07)] sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div
                          className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${getStatusBadgeClass(
                            request
                          )}`}
                        >
                          {getStatusLabel(request)}
                        </div>

                        <h2 className="mt-4 break-words text-4xl font-semibold tracking-[-0.07em] text-[#2b2826] sm:text-5xl">
                          {request.name || "Без імені"}
                        </h2>

                        <p className="mt-3 text-sm font-semibold text-secondary sm:text-base">
                          Створено: {formatCreatedAt(request.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteRequest(request.id)}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8f6f2] text-red-500 transition hover:bg-red-50"
                        aria-label="Видалити заявку"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <InfoCard title="Контакт" value={request.contact} />
                      <InfoCard title="Довжина" value={request.hairLength} />
                      <InfoCard
                        title="Дата"
                        value={formatDate(request.date)}
                        icon={<CalendarDays size={17} />}
                      />
                      <InfoCard
                        title="Час"
                        value={formatTime(request.time)}
                        icon={<Clock3 size={17} />}
                      />
                    </div>

                    <div className="mt-7 rounded-[30px] bg-[#f8f6f2] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                        Послуги
                      </p>

                      <div className="mt-4 grid gap-2">
                        {services.length > 0 ? (
                          services.map((service) => (
                            <div
                              key={service}
                              className="rounded-[22px] bg-white px-4 py-4 text-sm font-bold leading-6 text-[#2b2826] shadow-[0_10px_25px_rgba(0,0,0,0.03)] sm:text-base"
                            >
                              {service}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[22px] bg-white px-4 py-4 text-sm font-bold leading-6 text-[#2b2826] shadow-[0_10px_25px_rgba(0,0,0,0.03)] sm:text-base">
                            {request.service || "—"}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 rounded-[24px] bg-white px-5 py-4 shadow-[0_10px_25px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-secondary sm:text-base">
                            Загальна сума
                          </p>

                          <p className="text-2xl font-black tracking-[-0.04em] text-[#2b2826] sm:text-3xl">
                            {total}
                          </p>
                        </div>
                      </div>
                    </div>

                    {completed ? (
                      <div className="mt-7 rounded-[28px] bg-[#f1ebe3] p-5 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                          Запис виконано
                        </p>

                        <p className="mt-2 text-sm font-semibold leading-6 text-secondary">
                          Час цієї прийнятої заявки вже пройшов, тому вона
                          автоматично знаходиться у вкладці “Виконані”.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <button
                          onClick={() => updateStatus(request.id, "accepted")}
                          disabled={request.status === "accepted"}
                          className="inline-flex items-center justify-center rounded-full bg-[#c9a96e] px-6 py-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <Check className="mr-2" size={17} />
                          Прийняти
                        </button>

                        <button
                          onClick={() => updateStatus(request.id, "rejected")}
                          disabled={request.status === "rejected"}
                          className="inline-flex items-center justify-center rounded-full bg-[#f1ebe3] px-6 py-4 text-sm font-black text-[#2b2826] transition hover:bg-[#e9e0d5] disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <X className="mr-2" size={17} />
                          Відхилити
                        </button>
                      </div>
                    )}

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <InfoCard
                        title="Статус"
                        value={getStatusLabel(request)}
                        accent
                      />

                      <InfoCard title="ID заявки" value={request.id || "—"} />
                    </div>

                    <div className="mt-7 rounded-[30px] bg-[#f8f6f2] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                        Коментар
                      </p>

                      <p className="mt-3 break-words text-sm leading-7 text-secondary sm:text-base">
                        {request.comment || "Без коментаря"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[58px] w-full items-center justify-between rounded-full py-3 pl-7 pr-4 text-left transition ${
        active
          ? "bg-[#2b2826] text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
          : "bg-white text-[#2b2826] shadow-[0_14px_35px_rgba(0,0,0,0.05)] hover:bg-[#f8f6f2]"
      }`}
    >
      <span
        style={{ marginLeft: "24px" }}
        className="block text-lg font-semibold tracking-[-0.04em]"
      >
        {label}
      </span>

      <span
        className={`ml-4 flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full px-3 text-sm font-black ${
          active ? "bg-white/15 text-white" : "bg-[#f8f6f2] text-accent"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function StateCard({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[34px] bg-white p-8 text-center shadow-[0_22px_60px_rgba(0,0,0,0.07)]">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
        {label}
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.07em] text-[#2b2826] sm:text-5xl">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-secondary">
        {text}
      </p>
    </div>
  );
}

function InfoCard({
  title,
  value,
  icon,
  accent = false,
}: {
  title: string;
  value: string;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[28px] bg-[#f8f6f2] p-5">
      <div className="flex items-center gap-2 text-accent">
        {icon}

        <p className="text-xs font-bold uppercase tracking-[0.22em]">
          {title}
        </p>
      </div>

      <p
        className={`mt-3 break-words text-2xl font-semibold tracking-[-0.05em] ${
          accent ? "text-accent" : "text-[#2b2826]"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}