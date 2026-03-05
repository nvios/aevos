"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { useLocale } from "next-intl";
import { localePath } from "@/lib/i18n/paths";
import { analytics } from "@/lib/analytics/events";

const POPOVER_WIDTH = 288; // w-72 = 18rem
const POPOVER_HEIGHT_ESTIMATE = 200;
const VIEWPORT_MARGIN = 12;

interface GlossaryPopoverProps {
  term: string;
  definition: string;
  slug: string;
  children: React.ReactNode;
}

export function GlossaryPopover({
  term,
  definition,
  slug,
  children,
}: GlossaryPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const [xOffset, setXOffset] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locale = useLocale();
  const lp = (path: string) => localePath(path, locale);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Position the popover within viewport bounds (vertical + horizontal)
  useLayoutEffect(() => {
    if (!isOpen || !popoverRef.current) {
      setXOffset(0);
      return;
    }

    const triggerRect = popoverRef.current.getBoundingClientRect();

    // Vertical: flip above trigger if not enough space below
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    setPosition(spaceBelow < POPOVER_HEIGHT_ESTIMATE + VIEWPORT_MARGIN ? "top" : "bottom");

    // Horizontal: popover is left-aligned with trigger by default (left-0).
    // Shift it so it stays within the viewport.
    const popoverLeft = triggerRect.left;
    const popoverRight = popoverLeft + POPOVER_WIDTH;

    let offset = 0;
    if (popoverRight > window.innerWidth - VIEWPORT_MARGIN) {
      offset = window.innerWidth - VIEWPORT_MARGIN - popoverRight;
    }
    if (popoverLeft + offset < VIEWPORT_MARGIN) {
      offset = VIEWPORT_MARGIN - popoverLeft;
    }
    setXOffset(offset);
  }, [isOpen]);

  const hasTrackedRef = useRef(false);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (!hasTrackedRef.current) {
      analytics.glossaryTermViewed(term);
      hasTrackedRef.current = true;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={popoverRef}
    >
      <span
        className="cursor-help underline decoration-dotted decoration-zinc-500 underline-offset-4 hover:decoration-zinc-900 hover:text-zinc-900 transition-all"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
      >
        {children}
      </span>

      {isOpen && (
        <div
          ref={contentRef}
          className={`absolute z-50 w-72 p-3 text-sm bg-white border border-zinc-200 rounded-lg shadow-xl font-normal normal-case tracking-normal leading-normal text-left
            ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}
            left-0 animate-in fade-in zoom-in-95 duration-200`}
          style={xOffset ? { transform: `translateX(${xOffset}px)` } : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible bridge to prevent closing when moving mouse over gap */}
          <div
            className={`absolute left-0 right-0 h-4 ${position === "top" ? "-bottom-4" : "-top-4"}`}
            aria-hidden="true"
          />

          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-4.5" />
            <h4 className="font-semibold text-zinc-900 m-0 leading-snug">{term}</h4>
          </div>
          <p className="text-zinc-600 mb-2 leading-snug">{definition}</p>
          <Link
            href={lp(`/glossario#${slug}`)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
          >
            {locale === 'en' ? 'See in glossary' : 'Approfondisci nel glossario'} &rarr;
          </Link>
        </div>
      )}
    </span>
  );
}
