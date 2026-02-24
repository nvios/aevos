"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white/80 backdrop-blur-sm transition-all hover:border-zinc-300"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-lg font-semibold text-zinc-800">
              {item.question}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`grid transition-[grid-template-rows] duration-200 ease-out ${
              openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-6 pb-4 text-zinc-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
