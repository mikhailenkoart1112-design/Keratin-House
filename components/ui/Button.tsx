import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export default function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  const styles = clsx(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300",
    variant === "primary" &&
      "bg-accent text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)] hover:bg-accent-dark",
    variant === "secondary" &&
      "bg-white text-foreground shadow-[0_18px_40px_rgba(0,0,0,0.06)] hover:bg-[#f1ebe3]",
    variant === "ghost" &&
      "border border-black/10 bg-white/50 text-foreground hover:bg-white",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return <button className={styles}>{children}</button>;
}

