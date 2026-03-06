"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, ChefHat, HeartPulse, Calculator } from "lucide-react";
import type { NavItem } from "@/lib/site";

const icons = [Newspaper, ChefHat, HeartPulse, Calculator];

export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const pathForMatching = pathname.replace(/^\/en/, "") || "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-sm md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {items.map((item, i) => {
          const Icon = icons[i] ?? Newspaper;
          const isActive =
            pathForMatching === item.href ||
            pathForMatching.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[0.625rem] font-medium transition-colors ${
                isActive ? "text-emerald-600" : "text-zinc-400"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
              <span className="truncate max-w-[4.5rem]">
                {item.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
