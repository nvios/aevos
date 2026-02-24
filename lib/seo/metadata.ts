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
  const canonical = new URL(path, baseUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical,
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
