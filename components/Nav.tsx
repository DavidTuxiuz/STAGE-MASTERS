"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practise" },
  { href: "/projects", label: "Create" },
  { href: "/showcase", label: "Community" },
  { href: "/search", label: "Search" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-rule bg-paper">
      <nav className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-5 md:px-14">
        <Link href="/" className="font-serif text-[22px] font-semibold tracking-tight">
          Stage Master
        </Link>

        <ul className="hidden gap-8 text-[14.5px] md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="border-b border-transparent pb-0.5 transition-colors hover:border-brass"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="border border-rule px-3.5 py-2 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </nav>

      {open && (
        <ul
          id="mobile-nav"
          className="flex flex-col gap-4 border-b border-rule bg-paper px-5 pb-5 md:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
