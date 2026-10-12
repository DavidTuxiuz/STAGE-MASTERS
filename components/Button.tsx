import Link from "next/link";
import { ReactNode } from "react";

export default function Button({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
}) {
  const base = "inline-block px-6 py-3.5 text-[15px] font-medium transition-opacity";
  const style =
    variant === "solid"
      ? "bg-ink text-paper hover:opacity-80"
      : "border border-ink hover:opacity-70";

  return (
    <Link href={href} className={`${base} ${style}`}>
      {children}
    </Link>
  );
}
