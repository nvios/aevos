"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Info } from "lucide-react";

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
  const popoverRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close popover when clicking outside
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

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();
      const popoverHeight = 200; // Approximate height, or measure contentRef if needed
      const spaceBelow = window.innerHeight - rect.bottom;

      // If not enough space below (less than popover height + margin), show on top
      if (spaceBelow < popoverHeight) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms delay to allow moving mouse to popover
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
            -left-1/2 transform -translate-x-1/4 md:left-0 md:translate-x-0 animate-in fade-in zoom-in-95 duration-200`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible bridge to prevent closing when moving mouse over gap */}
          <div
            className={`absolute left-0 right-0 h-4 ${position === "top" ? "-bottom-4" : "-top-4"}`}
            aria-hidden="true"
          />

          <div className="flex items-center gap-1.5 mb-1">
            <Info className="w-4 h-4 text-zinc-500 shrink-0" />
            <h4 className="font-semibold text-zinc-900 m-0 leading-tight">{term}</h4>
          </div>
          <p className="text-zinc-600 mb-2 leading-snug">{definition}</p>
          <Link
            href={`/glossario#${slug}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
          >
            Approfondisci nel glossario &rarr;
          </Link>
        </div>
      )}
    </span>
  );
}
