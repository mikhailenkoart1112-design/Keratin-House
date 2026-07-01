/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";

import AnimatedSection from "@/components/ui/AnimatedSection";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

type GalleryItem = {
  id?: string;
  ID?: string;

  title?: string;
  Title?: string;

  category?: string;
  Category?: string;

  imageUrl?: string;
  ImageUrl?: string;
  image?: string;
  Image?: string;
  url?: string;
  Url?: string;

  beforeImageUrl?: string;
  BeforeImageUrl?: string;
  beforeUrl?: string;
  BeforeUrl?: string;
  before?: string;
  Before?: string;

  afterImageUrl?: string;
  AfterImageUrl?: string;
  afterUrl?: string;
  AfterUrl?: string;
  after?: string;
  After?: string;

  order?: number;
  Order?: number;

  active?: boolean | string;
  Active?: boolean | string;
};

function getTitle(item: GalleryItem) {
  return item.title || item.Title || "";
}

function getCategory(item: GalleryItem) {
  return item.category || item.Category || "";
}

function getOrder(item: GalleryItem) {
  return Number(item.order ?? item.Order ?? 0);
}

function getId(item: GalleryItem) {
  return (
    item.id ||
    item.ID ||
    `${getCategory(item)}-${getTitle(item)}-${getOrder(item)}`
  );
}

function getActive(item: GalleryItem) {
  const value = item.active ?? item.Active;

  if (typeof value === "string") {
    return value.toLowerCase() !== "false";
  }

  return value !== false;
}

function getMainImage(item: GalleryItem) {
  return (
    item.imageUrl ||
    item.ImageUrl ||
    item.image ||
    item.Image ||
    item.url ||
    item.Url ||
    ""
  );
}

function getBeforeImage(item: GalleryItem) {
  return (
    item.beforeImageUrl ||
    item.BeforeImageUrl ||
    item.beforeUrl ||
    item.BeforeUrl ||
    item.before ||
    item.Before ||
    ""
  );
}

function getAfterImage(item: GalleryItem) {
  return (
    item.afterImageUrl ||
    item.AfterImageUrl ||
    item.afterUrl ||
    item.AfterUrl ||
    item.after ||
    item.After ||
    ""
  );
}

function getDisplayImage(item: GalleryItem) {
  return getMainImage(item) || getAfterImage(item) || getBeforeImage(item) || "";
}

function getDriveId(url: string) {
  const cleanUrl = url.trim();

  const fileMatch = cleanUrl.match(/\/file\/d\/([^/]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  const idMatch = cleanUrl.match(/[?&]id=([^&]+)/);
  if (idMatch?.[1]) return idMatch[1];

  return "";
}

function getImageSources(url?: string) {
  if (!url) return [];

  const cleanUrl = url.trim();
  if (!cleanUrl) return [];

  const driveId = getDriveId(cleanUrl);

  if (!driveId) {
    return [cleanUrl];
  }

  return Array.from(
    new Set([
      `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`,
      `https://lh3.googleusercontent.com/d/${driveId}=w1600`,
      `https://drive.google.com/uc?export=view&id=${driveId}`,
      `https://drive.usercontent.google.com/download?id=${driveId}&export=view`,
      cleanUrl,
    ])
  );
}

function SmartImage({
  src,
  alt,
  className,
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className: string;
  fallbackTitle: string;
}) {
  const sources = useMemo(() => getImageSources(src), [src]);
  const [index, setIndex] = useState(0);

  if (!sources.length || index >= sources.length) {
    return <EmptyImage title={fallbackTitle} text="Фото не завантажилось" />;
  }

  return (
    <img
      src={sources[index]}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setIndex((current) => current + 1)}
    />
  );
}

export default function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Усі");
  const [activeWork, setActiveWork] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch("/api/gallery", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!result.success) {
          setError("Не вдалося завантажити галерею.");
          setLoading(false);
          return;
        }

        setGallery(result.gallery || []);
        setLoading(false);
      } catch {
        setError("Помилка завантаження галереї.");
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const works = useMemo(
    () =>
      gallery
        .filter((item) => getActive(item))
        .filter((item) => {
          const category = getCategory(item);
          return category === "work" || category === "works";
        })
        .sort((a, b) => getOrder(a) - getOrder(b)),
    [gallery]
  );

  const beforeAfter = useMemo(
    () =>
      works
        .filter((item) => getBeforeImage(item) && getAfterImage(item))
        .sort((a, b) => getOrder(a) - getOrder(b)),
    [works]
  );

  const filteredBeforeAfter =
  activeCategory === "Усі"
    ? beforeAfter
    : beforeAfter.filter((item) => getTitle(item) === activeCategory);

  const categories = useMemo(() => {
    const uniqueTitles = Array.from(
      new Set(works.map((work) => getTitle(work)))
    );

    return ["Усі", ...uniqueTitles.filter(Boolean)];
  }, [works]);

  const filteredWorks =
    activeCategory === "Усі"
      ? works
      : works.filter((work) => getTitle(work) === activeCategory);

  return (
    <>
      <AnimatedSection className="relative bg-transparent py-24">
        <Container>
          <div className="rounded-[38px] bg-white/82 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-10">
            <SectionTitle
              eyebrow="Галерея"
              title="Роботи та результати"
              description="Повна галерея робіт, процедур та результатів до / після."
            />

            {loading ? (
              <div className="rounded-[36px] bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl">
                <Loader2
                  className="mx-auto animate-spin text-accent"
                  size={30}
                />

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
                  Завантажуємо галерею...
                </h2>
              </div>
            ) : error ? (
              <div className="rounded-[36px] bg-red-50 p-8 text-center">
                <p className="font-semibold text-red-500">{error}</p>
              </div>
            ) : (
              <>
                <div className="mb-10 flex flex-wrap justify-center gap-3">
                  {categories.map((category) => {
                    const active = activeCategory === category;

                    return (
                      <motion.button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ y: -2 }}
                        className={`inline-flex min-h-[44px] min-w-[74px] items-center justify-center whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-bold tracking-[-0.03em] shadow-[0_14px_34px_rgba(0,0,0,0.08)] backdrop-blur-xl transition ${
  active
    ? "border-[#c9a96e] bg-gradient-to-r from-[#c9a96e] to-[#d8bb8d] text-white shadow-[0_18px_42px_rgba(201,165,122,0.38)]"
    : "border-white/70 bg-white/72 text-[#3b332d] hover:border-[#c9a96e]/70 hover:bg-white hover:text-[#2b2826]"
}`}
                      >
                        {category}
                      </motion.button>
                    );
                  })}
                </div>

                {filteredWorks.length > 0 ? (
                  <div className="grid auto-rows-[220px] gap-5 md:grid-cols-3">
                    {filteredWorks.map((work, index) => {
                      const imageUrl = getDisplayImage(work);
                      const title = getTitle(work);

                      return (
                        <motion.button
                          key={getId(work)}
                          onClick={() => setActiveWork(work)}
                          className={`group overflow-hidden rounded-[34px] bg-white p-3 text-left shadow-[0_24px_60px_rgba(0,0,0,0.07)] ${
                            index === 0 || index === 4
                              ? "md:row-span-2"
                              : index === 3 || index === 5
                              ? "md:col-span-2"
                              : ""
                          }`}
                          layout
                          whileHover={{ y: -4 }}
                        >
                          {imageUrl ? (
                            <SmartImage
                              key={imageUrl}
                              src={imageUrl}
                              alt={title}
                              fallbackTitle={title}
                              className="h-full w-full rounded-[28px] bg-[#f8f6f2] object-contain object-center transition duration-500 group-hover:scale-[1.01]"
                            />
                          ) : (
                            <EmptyImage
                              title={title}
                              text="Додай фото в адмінці"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[36px] bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.07)]">
                    <p className="text-secondary">Роботи скоро зʼявляться.</p>
                  </div>
                )}

                <div className="mt-24">
                  <SectionTitle
                    eyebrow="До / Після"
                    title="Результат у двох кадрах"
                    description="Окремі порівняння результату до процедури та після неї."
                  />

                  {filteredBeforeAfter.length > 0 ? (
                    <div className="space-y-6">
                      {filteredBeforeAfter.map((item) => (
                        <div
                          key={getId(item)}
                          className="overflow-hidden rounded-[38px] bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.07)]"
                        >
                          <div className="grid gap-3 md:grid-cols-2">
                            <BeforeAfterCard
                              label={getTitle(item)}
                              title="До"
                              imageUrl={getBeforeImage(item)}
                              light
                            />

                            <BeforeAfterCard
                              label={getTitle(item)}
                              title="Після"
                              imageUrl={getAfterImage(item)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[36px] bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.07)]">
                      <p className="text-secondary">
                        Фото до / після скоро зʼявляться.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Container>
      </AnimatedSection>

      <AnimatePresence>
        {activeWork && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl rounded-[36px] bg-white p-4 shadow-[0_30px_90px_rgba(0,0,0,0.25)]"
              initial={{ scale: 0.96, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 30 }}
            >
              <button
                onClick={() => setActiveWork(null)}
                className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
              >
                <X size={22} />
              </button>

              {getDisplayImage(activeWork) ? (
                <SmartImage
                  key={getDisplayImage(activeWork)}
                  src={getDisplayImage(activeWork)}
                  alt={getTitle(activeWork)}
                  fallbackTitle={getTitle(activeWork)}
                  className="max-h-[82vh] w-full rounded-[30px] bg-[#f8f6f2] object-contain object-center"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center rounded-[30px] bg-[#efe9df] text-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
                      {getTitle(activeWork)}
                    </p>

                    <p className="mt-4 text-4xl font-semibold tracking-[-0.06em]">
                      Велике фото
                    </p>

                    <p className="mt-3 text-secondary">
                      Фото додамо через адмінку
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EmptyImage({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-[28px] bg-[#efe9df] text-center transition group-hover:scale-[1.01]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
          {title}
        </p>

        <p className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
          Фото роботи
        </p>

        <p className="mt-3 text-sm text-secondary">{text}</p>
      </div>
    </div>
  );
}

function BeforeAfterCard({
  label,
  title,
  imageUrl,
  light = false,
}: {
  label: string;
  title: string;
  imageUrl: string;
  light?: boolean;
}) {
  return (
    <div
      className={`flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[30px] text-center ${
        light ? "bg-[#efe9df]" : "bg-[#eadcc9]"
      }`}
    >
      {imageUrl ? (
        <div className="relative h-full w-full">
          <SmartImage
            key={imageUrl}
            src={imageUrl}
            alt={`${label} ${title}`}
            fallbackTitle={label}
            className="h-full w-full bg-[#f8f6f2] object-contain object-center"
          />

          <div className="absolute bottom-5 left-5 right-5 rounded-[24px] bg-white/85 p-4 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              {label}
            </p>

            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
              {title}
            </h3>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            {label}
          </p>

          <h3 className="mt-4 text-4xl font-semibold tracking-[-0.06em]">
            {title}
          </h3>

          <p className="mt-3 px-5 text-sm text-secondary">Фото не знайдено</p>
        </div>
      )}
    </div>
  );
}