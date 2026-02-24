import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { MapPin, Activity, Building2, Stethoscope } from "lucide-react";

export const metadata = buildMetadata({
  title: "Servizi e Partner per la Longevità",
  description:
    "Assessment personalizzati, partnership esclusive e servizi locali in Lombardia per ottimizzare la tua salute.",
  path: "/servizi",
});

const services = [
  {
    title: "Assessment Personalizzati",
    description: "Analisi completa del tuo stato di salute con piano d'azione su misura.",
    href: "/servizi/assessment",
    icon: Activity,
  },
  {
    title: "Partner Esclusivi",
    description: "Accesso a palestre, spa e centri benessere selezionati con vantaggi dedicati.",
    href: "/servizi/partner",
    icon: Building2,
  },
  {
    title: "Consulti Specialistici",
    description: "Mettiti in contatto con medici e nutrizionisti esperti in medicina della longevità.",
    href: "/servizi/consulti",
    icon: Stethoscope,
  },
];

const provinces = [
  { name: "Milano", href: "/servizi/lombardia/milano" },
  { name: "Bergamo", href: "/servizi/lombardia/bergamo" },
  { name: "Brescia", href: "/servizi/lombardia/brescia" },
];

export default function ServiziPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Servizi", path: "/servizi" },
  ]);

  return (
    <div className="space-y-12 py-12">
      <Script
        id="servizi-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
          Servizi e Partner
        </h1>
        <p className="max-w-2xl text-xl text-zinc-600">
          Accedi a servizi premium e specialisti selezionati per supportare il tuo percorso di longevità.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
              <service.icon className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-zinc-800">
              {service.title}
            </h2>
            <p className="text-zinc-600">{service.description}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-6 border-t border-zinc-200 pt-12">
        <h2 className="text-2xl font-bold text-zinc-800">Servizi Locali in Lombardia</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {provinces.map((province) => (
            <Link
              key={province.href}
              href={province.href}
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-zinc-500 group-hover:text-zinc-900" />
                <span className="font-medium text-zinc-800">{province.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
