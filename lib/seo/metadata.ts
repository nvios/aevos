import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { localePath } from "@/lib/i18n/paths";

type BuildMetaParams = {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  path: string;
  locale?: string;
};

export function buildMetadata({
  title,
  titleEn,
  description,
  descriptionEn,
  path,
  locale = 'it',
}: BuildMetaParams): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonical = new URL(cleanPath, baseUrl).toString();
  const enPath = localePath(cleanPath, 'en');
  const enUrl = new URL(`/en${enPath === '/' ? '' : enPath}`, baseUrl).toString();

  const resolvedTitle = locale === 'en' && titleEn ? titleEn : title;
  const resolvedDesc = locale === 'en' && descriptionEn ? descriptionEn : description;

  return {
    title: resolvedTitle,
    description: resolvedDesc,
    alternates: {
      canonical: locale === 'en' ? enUrl : canonical,
      languages: {
        'it': canonical,
        'en': enUrl,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDesc,
      url: locale === 'en' ? enUrl : canonical,
      siteName: siteConfig.name,
      locale: locale === 'en' ? 'en_US' : siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDesc,
    },
  };
}
