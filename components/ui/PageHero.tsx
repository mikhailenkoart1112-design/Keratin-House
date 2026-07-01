type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-[#f8f6f2] px-5 pb-16 pt-36">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
          {eyebrow}
        </p>

        <h1 className="mt-5 text-5xl font-semibold tracking-[-0.07em] sm:text-7xl">
          {title}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-secondary sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}

