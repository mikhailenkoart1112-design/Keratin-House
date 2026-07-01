import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Container from "@/components/ui/Container";

export default function AboutPreview() {
  return (
    <AnimatedSection className="bg-[#f8f6f2] py-24">
      <Container>
        <div className="grid items-center gap-8 rounded-[42px] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.07)] lg:grid-cols-[0.8fr_1fr] lg:p-8">
          <div className="flex aspect-[4/5] items-center justify-center rounded-[34px] bg-[#efe9df] p-8 text-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
                Про мене
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
                Фото Дарини
              </h3>
            </div>
          </div>

          <div className="p-3 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Про майстриню
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
              Дарина
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-secondary sm:text-lg">
              Про мене з догляду та відновлення волосся. Працює з кератином,
              ботоксом, реконструкцією та підбором домашнього догляду.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
              >
                Детальніше
                <ArrowRight className="ml-2" size={18} />
              </Link>

              <Link
                href="https://www.instagram.com/daryna_makhraieva"
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-[#f8f6f2] px-7 py-4 text-sm font-semibold text-foreground"
              >
                Instagram ↗
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </AnimatedSection>
  );
}

