import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#f8f6f2] py-10">
      <Container className="flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-black tracking-[0.28em]">daryna_makhraieva</p>
          <p className="mt-2 text-sm text-secondary">
            Кератин • Ботокс • Відновлення волосся
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-secondary sm:items-end">
          <Link
            href="https://instagram.com/daryna_makhraieva"
            target="_blank"
            className="font-semibold text-accent"
          >
            Instagram ↗
          </Link>

          <p>© 2026 daryna_makhraieva</p>
        </div>
      </Container>
    </footer>
  );
}

