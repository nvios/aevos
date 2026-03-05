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

export function generateMetadata({
  params,
}: {
  params: { province: string };
}): Metadata {
  const province = provinceMap[params.province];
  if (!province) {
    return {};
  }
  return buildMetadata({
    title: `Servizi longevita in ${province.title}`,
    description: `Offerte locali Aevos Health in ${province.title}: ${province.localFocus}.`,
    path: `/servizi/lombardia/${params.province}`,
  });
}

export default function ProvinceServicePage({
  params,
}: {
  params: { province: string };
}) {
  const province = provinceMap[params.province];
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
