import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

const works = [
  "Кератин",
  "Ботокс",
  "Відновлення",
  "Полірування",
  "тотальна реконструкція",
  "Догляд",
];

export default function GalleryPreview() {
  return (
    <AnimatedSection id="gallery" className="bg-[#f8f6f2] py-24">
      <Container>
        <SectionTitle
          eyebrow="Галерея"
          title="Роботи та результати"
          description="Короткий перегляд робіт. Повна галерея доступна на окремій сторінці."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <div
              key={work}
              className="overflow-hidden rounded-[32px] bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
            >
              <div className="flex aspect-[4/5] items-center justify-center rounded-[26px] bg-[#efe9df] text-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
                    {work}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em]">
                    Фото роботи
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
          >
            Уся галерея
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </Container>
    </AnimatedSection>
  );
}

