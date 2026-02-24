import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { ArrowRight, Activity, ShieldCheck, TrendingUp, Users } from "lucide-react";

export const metadata = buildMetadata({
  title: "Longevità, prevenzione e performance quotidiana",
  description:
    "Aevos Health aiuta adulti ambiziosi a migliorare sonno, nutrizione, allenamento e monitoraggio con un approccio pragmatico.",
  path: "/",
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain}/ricerca?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const features = [
  {
    title: "Guide Evidence-Based",
    text: "Analisi approfondite su sonno, nutrizione ed esercizio, basate esclusivamente su studi clinici e meta-analisi.",
    href: "/guide",
    icon: Activity,
  },
  {
    title: "Strumenti Validati",
    text: "Selezione rigorosa di supplementi e tecnologie per la longevità, filtrati per efficacia dimostrata e ROI biologico.",
    href: "/prodotti",
    icon: ShieldCheck,
  },
  {
    title: "Ricerca e Analisi",
    text: "Sintesi operative delle ultime scoperte scientifiche. Trasformiamo paper complessi in protocolli applicabili.",
    href: "/ricerca",
    icon: TrendingUp,
  },
  {
    title: "Network Specializzato",
    text: "Accesso diretto a cliniche e professionisti della longevità selezionati per competenza e strumentazione.",
    href: "/servizi",
    icon: Users,
  },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-12">
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-24 text-center shadow-2xl sm:px-12 sm:py-32">
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-sm">
            <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500"></span>
            La scienza della longevità, semplificata.
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Scopri la tua reale <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              età biologica
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed">
            Non limitarti a contare gli anni. Ottieni un'analisi personalizzata del tuo stato di salute 
            e un piano d'azione concreto per rallentare l'invecchiamento.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/calcolo-longevita"
              className="group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-zinc-900 transition-all hover:bg-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Calcola ora
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/guide"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-600 bg-transparent px-8 text-base font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Esplora le Guide
            </Link>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
            Tutto ciò che serve per vivere meglio, più a lungo.
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Risorse curate per ottimizzare ogni aspetto della tua salute.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-800">{card.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{card.text}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mx-auto max-w-4xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-100 p-8 text-center sm:p-16">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-800">
              Scienza, non hype.
            </h2>
            <p className="mx-auto max-w-xl text-lg text-zinc-600">
              Unisciti a oltre 2.000 iscritti che ricevono ogni settimana consigli pratici 
              su longevità e performance, direttamente nella loro inbox.
            </p>
            
            <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="La tua email migliore"
                className="flex-1 rounded-full border border-zinc-300 bg-white px-5 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                Iscriviti
              </button>
            </form>
            <p className="text-xs text-zinc-500">
              Nessuno spam. Cancellati in qualsiasi momento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
