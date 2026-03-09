import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";

const provinceMap: Record<string, { title: string; localFocus: string }> = {
  milano: {
    title: "Milano",
    localFocus: "assessment premium, executive health e partner wellness urbani",
  },
  bergamo: {
    title: "Bergamo",
    localFocus: "percorsi ibridi con partner fitness e recovery center",
  },
  brescia: {
    title: "Brescia",
    localFocus: "programmi personalizzati con focus monitoraggio e aderenza",
  },
};

export function generateStaticParams() {
  return Object.keys(provinceMap).map((province) => ({ province }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string; locale: string }>;
}): Promise<Metadata> {
  const { province: slug, locale } = await params;
  const province = provinceMap[slug];
  if (!province) {
    return {};
  }
  return buildMetadata({
    title: `Servizi longevità a ${province.title}`,
    titleEn: `Longevity services in ${province.title}`,
    description: `Offerte locali Aevos Health a ${province.title}: ${province.localFocus}.`,
    descriptionEn: `Aevos Health local services in ${province.title}: ${province.localFocus}.`,
    path: `/servizi/lombardia/${slug}`,
    locale,
  });
}

export default async function ProvinceServicePage({
  params,
}: {
  params: Promise<{ province: string; locale: string }>;
}) {
  const { province: slug } = await params;
  const province = provinceMap[slug];
  if (!province) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">
        Servizi Aevos Health a {province.title}
      </h1>
      <p className="max-w-3xl text-zinc-700">
        Landing locale conversion-focused per {province.localFocus}. Template
        progettato per integrare partner reali, FAQ geolocalizzate e CTA verso
        assessment.
      </p>
      <div className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700">
        CTA primaria consigliata: Prenota una valutazione iniziale.
      </div>
    </section>
  );
}
