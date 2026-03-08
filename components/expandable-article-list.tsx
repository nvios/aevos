"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const INITIAL_COUNT = 3;
const STEP = 3;

export function ExpandableArticleList({
  total,
  locale,
  children,
}: {
  total: number;
  locale: string;
  children: React.ReactNode[];
}) {
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const canShowMore = visible < total;
  const canCollapse = visible > INITIAL_COUNT;

  return (
    <>
      {children.slice(0, visible)}

      {canShowMore && (
        <button
          onClick={() => setVisible((v) => Math.min(v + STEP, total))}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
        >
          {locale === "en" ? "Show more" : "Mostra altri"}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      )}

      {!canShowMore && canCollapse && (
        <button
          onClick={() => setVisible(INITIAL_COUNT)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
        >
          {locale === "en" ? "Show less" : "Mostra meno"}
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      )}
    </>
  );
}
