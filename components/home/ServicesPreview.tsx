import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

const services = [
  {
    title: "Кератин",
    text: "Гладкість, блиск і слухняність волосся.",
  },
  {
    title: "Ботокс",
    text: "Мʼякість, догляд та візуальне відновлення.",
  },
  {
    title: "Холодне відновлення",
    text: "Делікатний догляд без високих температур.",
  },
];

export default function ServicesPreview() {
  return (
    <AnimatedSection className="bg-white py-24">
      <Container>
        <SectionTitle
          eyebrow="Послуги"
          title="Основні процедури"
          description="Короткий огляд послуг. Детальніше — на окремій сторінці."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-[34px] bg-[#f8f6f2] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
                daryna_makhraieva
              </p>

              <h3 className="mt-5 text-3xl font-semibold tracking-[-0.06em]">
                {service.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-secondary">
                {service.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
          >
            Усі послуги
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </Container>
    </AnimatedSection>
  );
}

