import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { Activity, Stethoscope } from "lucide-react";
import { localePath } from "@/lib/i18n/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: "Servizi e Partner per la Longevità",
    titleEn: "Longevity Services & Partners",
    description: "Assessment personalizzati, partnership esclusive e servizi locali per ottimizzare la tua salute.",
    descriptionEn: "Personalized assessments, exclusive partnerships and local services to optimize your health.",
    path: "/servizi",
    locale,
  });
}

export default async function ServiziPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lp = (path: string) => localePath(path, locale);

  const services = [
    {
      title: locale === 'en' ? "Advanced Digital Screening" : "Screening Digitale Avanzato",
      description: locale === 'en'
        ? "A preliminary analysis of your aging profile based on blood biomarkers and lifestyle. The first step towards awareness."
        : "Un'analisi preliminare del tuo profilo di invecchiamento basata su biomarcatori ematici e stile di vita. Il primo passo verso la consapevolezza.",
      href: lp("/servizi/assessment-online"),
      icon: Activity,
    },
    {
      title: locale === 'en' ? "Clinical Protocol" : "Protocollo Clinico",
      description: locale === 'en'
        ? "The definitive experience. Direct monitoring at our center for functional tests, advanced imaging, and complete biological assessment."
        : "L'esperienza definitiva. Monitoraggio diretto nel nostro centro per test funzionali, imaging avanzato e valutazione biologica completa.",
      href: lp("/servizi/assessment-clinico"),
      icon: Stethoscope,
    },
  ];

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: locale === 'en' ? "Services" : "Servizi", path: lp("/servizi") },
  ]);

  return (
    <div className="space-y-12 py-12">
      <Script
        id="servizi-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
          {locale === 'en' ? 'The Gold Standard for Longevity' : 'Il Gold Standard per la Longevità'}
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-zinc-600">
          {locale === 'en'
            ? 'Beyond trends. A clinical approach consolidated by decades of research and field experience, to offer you maximum diagnostic precision.'
            : 'Oltre i trend del momento. Un approccio clinico consolidato da decenni di ricerca ed esperienza sul campo, per offrirti la massima precisione diagnostica.'}
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-300 hover:shadow-lg flex flex-col items-center text-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
              <service.icon className="h-8 w-8" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-zinc-800">
              {service.title}
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-6">{service.description}</p>
            <span className="mt-auto inline-flex items-center text-sm font-semibold text-zinc-900 group-hover:underline">
              {locale === 'en' ? 'Learn more' : 'Scopri di più'}
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto max-w-3xl space-y-8 border-t border-zinc-200 pt-12 text-center">
        <h2 className="text-3xl font-bold text-zinc-800">
          {locale === 'en' ? 'Why choose the on-site protocol?' : 'Perché scegliere il protocollo in sede?'}
        </h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          {locale === 'en'
            ? 'While digital screening offers a great starting point, visiting our clinic allows measurements impossible to do remotely: advanced body composition analysis, VO2 max tests, metabolic flexibility assessment, and in-depth cognitive screening.'
            : 'Mentre lo screening digitale offre un ottimo punto di partenza, la visita presso la nostra clinica permette misurazioni impossibili da remoto: analisi della composizione corporea avanzata, test VO2 max, valutazione della flessibilità metabolica e screening cognitivo approfondito.'}
        </p>
        <div className="pt-4">
          <Link
            href="mailto:info@aevos.it"
            className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            {locale === 'en' ? 'Book a consultation' : 'Prenota una consulenza orientativa'}
          </Link>
        </div>
      </div>
    </div>
  );
}
