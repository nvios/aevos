"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { trackArticleView, trackArticleCTAClick } from "@/app/[locale]/actions";
import { analytics } from "@/lib/analytics/events";
import { collectViewContext } from "@/lib/analytics/device-profile";

export function ArticleViewTracker({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const posthog = usePostHog();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !slug) return;
    tracked.current = true;
    const sessionId = posthog?.get_session_id?.() ?? crypto.randomUUID();
    const context = collectViewContext(locale);
    trackArticleView(slug, sessionId, context);
  }, [slug, locale, posthog]);

  return null;
}

export function TrackedCTALink({
  slug,
  locale,
  href,
  text,
  description,
}: {
  slug: string;
  locale: string;
  href: string;
  text: string;
  description?: string;
}) {
  const handleClick = () => {
    analytics.ctaClicked({
      cta_text: text,
      cta_url: href,
      page: `/articoli/${slug}`,
      section: "article_cta",
    });
    trackArticleCTAClick(slug, locale);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-zinc-50 p-6 sm:flex-row sm:items-center sm:justify-between">
      {description && (
        <p className="text-lg font-medium text-zinc-800 sm:max-w-[60%]">
          {description}
        </p>
      )}
      <Link
        href={href}
        onClick={handleClick}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800"
      >
        {text}
      </Link>
    </div>
  );
}

export function TrackedRecommendationLink({
  href,
  articleSlug,
  source,
  position,
  currentPage,
  children,
  className,
}: {
  href: string;
  articleSlug: string;
  source: "trending" | "related" | "also_read" | "popular";
  position: number;
  currentPage: string;
  children: React.ReactNode;
  className?: string;
}) {
  const handleClick = () => {
    analytics.recommendationClicked({
      article_slug: articleSlug,
      source,
      position,
      page: currentPage,
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      data-reco-source={source}
    >
      {children}
    </Link>
  );
}
