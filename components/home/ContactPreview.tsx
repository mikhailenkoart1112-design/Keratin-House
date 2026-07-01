"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ContactPreview() {
  return (
    <AnimatedSection className="bg-white py-24">
      <Container>
        <SectionTitle
          eyebrow="Контакти"
          title="Звʼязок та запис"
          description="Коротка інформація. Повні контакти — на окремій сторінці."
        />

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[34px] bg-[#f8f6f2] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Адреса
            </p>
            <h3 className="mt-4 text-2xl font-semibold">Хмельницький</h3>
          </div>

          <div className="rounded-[34px] bg-[#f8f6f2] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Графік
            </p>
            <h3 className="mt-4 text-2xl font-semibold">Пн–Сб</h3>
            <p className="mt-2 text-secondary">10:00 — 16:00</p>
          </div>

          <div className="rounded-[34px] bg-[#f8f6f2] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Instagram
            </p>
            <h3 className="mt-4 text-xl font-semibold">@daryna_makhraieva</h3>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.dispatchEvent(new Event("open-booking"))}
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
          >
            Записатися
          </button>

          <Link
            href="/contacts"
            className="inline-flex items-center justify-center rounded-full bg-[#f8f6f2] px-7 py-4 text-sm font-semibold text-foreground"
          >
            Усі контакти
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </Container>
    </AnimatedSection>
  );
}

