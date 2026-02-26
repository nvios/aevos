import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { PROTOCOLS } from "@/lib/content/protocols";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Zap, Brain, Activity, Sun, Clock, Shield, TrendingUp, Calendar, Smile, Heart } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// Map icon names to components
const IconMap: Record<string, any> = {
  Zap, Brain, Activity, Sun, Clock, Shield, TrendingUp, Calendar, Smile, Heart
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const protocol = PROTOCOLS[slug];

  if (!protocol) {
    return {
      title: "Protocollo non trovato | Aevos Health",
    };
  }

  return {
    title: `${protocol.title} | Aevos Health`,
    description: protocol.seoDescription,
  };
}

export default async function ProtocolPage({ params }: Props) {
  const { slug } = await params;
  const protocol = PROTOCOLS[slug];

  if (!protocol) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-muted/30">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              Protocollo Clinico
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {protocol.title}
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto">
              {protocol.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="#pricing">
                  Inizia il Percorso <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#details">Scopri i Dettagli</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="details" className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-3">
            {protocol.benefits.map((benefit, index) => {
              const Icon = IconMap[benefit.icon] || Activity;
              return (
                <div key={index} className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Scegli il tuo percorso</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Soluzioni flessibili per ogni esigenza e obiettivo di salute.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:justify-center max-w-5xl mx-auto">
            {protocol.pricing.map((tier, index) => (
              <Card key={index} className="flex flex-col relative overflow-hidden border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>{tier.tier}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={tier.ctaLink}>{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8 text-center">Domande Frequenti</h2>
          <div className="space-y-6">
            {protocol.faq.map((item, index) => (
              <div key={index} className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
