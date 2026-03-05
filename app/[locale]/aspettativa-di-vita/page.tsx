import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";
import { localePath } from "@/lib/i18n/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: "Aspettativa di vita: fattori e miglioramenti concreti",
    titleEn: "Life expectancy: factors and concrete improvements",
    description: "Capire i principali driver di aspettativa di vita e trasformarli in azioni pratiche e monitorabili.",
    descriptionEn: "Understand the main drivers of life expectancy and turn them into practical, measurable actions.",
    path: "/aspettativa-di-vita",
    locale,
  });
}

export default async function AspettativaDiVitaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const lp = (path: string) => localePath(path, locale);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: isEn ? "Life expectancy" : "Aspettativa di vita", path: lp("/aspettativa-di-vita") },
  ]);
  const faq = faqJsonLd([
    {
      question: isEn ? "What determines individual life expectancy?" : "Da cosa dipende l'aspettativa di vita individuale?",
      answer: isEn
        ? "It depends on genetics, environment, daily habits and management of modifiable risk factors."
        : "Dipende da genetica, ambiente, abitudini quotidiane e gestione dei fattori di rischio modificabili.",
    },
    {
      question: isEn ? "Can life expectancy be increased?" : "Si può aumentare l'aspettativa di vita?",
      answer: isEn
        ? "You can improve the health trajectory by intervening on sleep, training, nutrition, prevention and adherence."
        : "Si può migliorare la traiettoria di salute intervenendo su sonno, allenamento, alimentazione, prevenzione e aderenza.",
    },
  ]);

  return (
    <section className="space-y-5">
      <Script id="aspettativa-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Script id="aspettativa-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <h1 className="text-3xl font-semibold">
        {isEn ? 'Life expectancy: an action-oriented guide' : "Aspettativa di vita: guida orientata all'azione"}
      </h1>
      <p className="max-w-3xl text-zinc-700">
        {isEn
          ? 'The variables that influence longevity are not only genetic: daily habits, body composition, sleep and adherence over time have a measurable impact.'
          : 'Le variabili che influenzano longevità non sono solo genetiche: abitudini quotidiane, composizione corporea, sonno e aderenza nel tempo hanno un impatto misurabile.'}
      </p>
      <div className="rounded-xl border border-zinc-200 p-4">
        <h2 className="mb-2 text-lg font-semibold">
          {isEn ? 'Turn theory into a plan' : 'Trasforma teoria in piano'}
        </h2>
        <p className="mb-3 text-sm text-zinc-700">
          {isEn
            ? 'Start the longevity calculator to receive immediate guidance and advanced comparisons after signing up.'
            : 'Avvia il calcolo longevità per ricevere indicazioni immediate e confronti avanzati dopo iscrizione.'}
        </p>
        <Link href={lp("/calcolo-longevita")} className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          {isEn ? 'Calculate now' : 'Calcola ora'}
        </Link>
      </div>
    </section>
  );
}
