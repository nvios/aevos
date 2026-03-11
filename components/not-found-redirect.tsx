"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SECTION_PREFIXES = [
  "/articoli",
  "/articles",
  "/ricette",
  "/recipes",
  "/servizi",
  "/services",
  "/sedi",
  "/locations",
  "/glossario",
  "/glossary",
  "/calcolo-longevita",
  "/longevity-calculator",
  "/eta-biologica",
  "/biological-age",
  "/aspettativa-di-vita",
  "/life-expectancy",
];

function getParentSection(pathname: string): string {
  const clean = pathname.replace(/^\/en/, "") || "/";
  const prefix = pathname.startsWith("/en") ? "/en" : "";

  const segments = clean.split("/").filter(Boolean);

  // Walk up from the full path, trying each parent
  while (segments.length > 1) {
    segments.pop();
    const candidate = "/" + segments.join("/");
    if (SECTION_PREFIXES.some((s) => candidate === s || candidate.startsWith(s + "/"))) {
      return prefix + candidate;
    }
  }

  // If the first segment matches a known section, redirect there
  if (segments.length === 1) {
    const candidate = "/" + segments[0];
    if (SECTION_PREFIXES.includes(candidate)) {
      return prefix + candidate;
    }
  }

  return prefix || "/";
}

export function NotFoundRedirect({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [seconds, setSeconds] = useState(5);
  const isEn = pathname.startsWith("/en") || locale === "en";

  const target = getParentSection(pathname);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.replace(target);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [target]);

  const label = target === "/" || target === "/en"
    ? "Home"
    : target.split("/").filter(Boolean).pop() ?? "Home";

  return (
    <div className="flex flex-col items-center gap-4">
      <a
        href={target}
        className="group inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 transition-transform group-hover:-translate-x-1"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        {isEn ? `Go to ${label}` : `Vai a ${label}`}
      </a>
      <p className="text-xs text-zinc-400">
        {isEn
          ? `Redirecting in ${Math.max(seconds, 0)}s...`
          : `Redirect tra ${Math.max(seconds, 0)}s...`}
      </p>
    </div>
  );
}
