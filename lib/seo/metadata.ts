import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type BuildMetaParams = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({
  title,
  description,
  path,
}: BuildMetaParams): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain;
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Canonical URL (defaulting to Italian version as main canonical)
  const canonical = new URL(cleanPath, baseUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'it': canonical,
        'en': new URL(`/en${cleanPath === '/' ? '' : cleanPath}`, baseUrl).toString(),
        'x-default': canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
