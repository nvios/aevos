import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { localeHref } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";

const CITIES: Record<string, { name: string; address?: string; partner?: string }> = {
  milano: { 
    name: "Milano", 
    address: "Via della Spiga, 1 (Partner Location)",
    partner: "Elite Wellness Club"
  },
  roma: { name: "Roma" },
  torino: { name: "Torino" },
  brescia: { name: "Brescia" },
  monza: { name: "Monza" },
};

type Props = {
  params: Promise<{ city: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, locale } = await params;
  const cityData = CITIES[city.toLowerCase()];

  if (!cityData) {
    return {
      title: "Sedi Aevos Health",
    };
  }

  return buildMetadata({
    title: `Centro Longevità ${cityData.name}`,
    titleEn: `Longevity Center ${cityData.name}`,
    description: `Il primo centro per la medicina della longevità e l'ottimizzazione biologica a ${cityData.name}. Test VO2 Max, DEXA e protocolli personalizzati.`,
    descriptionEn: `The first center for longevity medicine and biological optimization in ${cityData.name}. VO2 Max, DEXA and personalised protocols.`,
    path: `/sedi/${city.toLowerCase()}`,
    locale,
  });
}

export async function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({
    city,
  }));
}

export default async function LocalLandingPage({ params }: Props) {
  const { city, locale } = await params;
  const lp = (path: string) => localeHref(path, locale);
  const cityKey = city.toLowerCase();
  const cityData = CITIES[cityKey];

  if (!cityData) {
    notFound();
  }

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-24 text-center shadow-2xl sm:px-12 sm:py-32">
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-sm">
            <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
            Disponibile ora a {cityData.name}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            La scienza della longevità,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              vicino a te.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed">
            Portiamo il gold standard della diagnostica avanzata e dei protocolli anti-aging direttamente a {cityData.name}.
            {cityData.partner && <span className="block mt-2 text-emerald-400">In partnership con {cityData.partner}.</span>}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 rounded-full text-base" asChild>
              <Link href="mailto:info@aevos.it">
                Prenota un Check-up a {cityData.name}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-base bg-transparent text-white border-zinc-600 hover:bg-zinc-800 hover:text-white" asChild>
              <Link href={lp("/servizi")}>
                Scopri i Servizi
              </Link>
            </Button>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Servizi disponibili a {cityData.name}
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Accesso esclusivo alle tecnologie diagnostiche più avanzate.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Analisi VO2 Max",
              desc: "Il gold standard per misurare la tua efficienza cardiovascolare e predire la longevità.",
            },
            {
              title: "DEXA Scan & BIA",
              desc: "Analisi della composizione corporea con precisione clinica: massa magra, grasso viscerale e densità ossea.",
            },
            {
              title: "Screening Metabolico",
              desc: "Profilo ematico completo con biomarcatori avanzati non disponibili nei check-up standard.",
            },
          ].map((service, i) => (
            <Card key={i} className="border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Local Section */}
      <section className="bg-zinc-50 py-16 rounded-3xl">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">
            Perché scegliere Aevos {cityData.name}?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 text-left">
            {[
              "Protocolli validati scientificamente",
              "Partnership con strutture d'eccellenza",
              "Referti spiegati in modo semplice e azionabile",
              "Supporto continuo post-visita",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <span className="text-lg text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-zinc-900">
          Inizia il tuo percorso a {cityData.name}
        </h2>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Non aspettare che la salute diventi un problema. Ottimizzala oggi.
        </p>
        <Button size="lg" className="h-12 px-8 rounded-full text-base" asChild>
          <Link href="/contatti">
            Richiedi disponibilità
          </Link>
        </Button>
      </section>
    </div>
  );
}
