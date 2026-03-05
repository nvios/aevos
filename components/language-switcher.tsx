"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { localePath, internalPath } from "@/lib/i18n/paths";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const targetLocale = locale === "it" ? "en" : "it";

  let cleanPath = pathname;
  if (cleanPath.startsWith("/en")) {
    cleanPath = cleanPath.slice(3) || "/";
  }

  const internal = internalPath(cleanPath);
  const targetPath = localePath(internal, targetLocale);

  const href = targetLocale === "en"
    ? `/en${targetPath === "/" ? "" : targetPath}`
    : targetPath;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Set both our cookie and next-intl's NEXT_LOCALE cookie
    // to prevent next-intl from redirecting based on its stale cookie.
    document.cookie = `AEVOS_LOCALE=${targetLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    window.location.href = href;
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:border-zinc-300"
      title={locale === "it" ? "Switch to English" : "Passa all'italiano"}
    >
      <Globe className="h-3.5 w-3.5" />
      {locale === "it" ? "EN" : "IT"}
    </button>
  );
}
