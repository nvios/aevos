import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Scale, Dumbbell, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Test di Laboratorio e Diagnostica | Aevos Health",
  description: "Tecnologie avanzate per misurare la tua salute: Analisi BIA, Dinamometria e altro.",
};

export default function LabTestsPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Diagnostica Avanzata</h1>
        <p className="text-xl text-muted-foreground">
          Misurazioni cliniche precise per monitorare i tuoi progressi e ottimizzare la tua longevità.
          Disponibili presso il nostro centro.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
        {/* BIA Analysis */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Analisi BIA Professionale</CardTitle>
            <CardDescription>Composizione Corporea Avanzata</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-muted-foreground">
              Molto più di una semplice bilancia. La nostra tecnologia a bioimpedenza (Tanita/InBody) analizza nel dettaglio:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" /> Massa Muscolare Scheletrica
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" /> Percentuale di Grasso Corporeo
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" /> Grasso Viscerale (il più pericoloso)
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" /> Idratazione e Ritenzione Idrica
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/contatti?service=bia">Prenota Analisi (€50)</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Grip Strength */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
              <Dumbbell className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle>Test Forza Presa (Grip Strength)</CardTitle>
            <CardDescription>Biomarcatore di Longevità</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-muted-foreground">
              La forza della tua presa è uno dei più potenti predittori di longevità e salute generale, correlata alla forza totale e alla resilienza.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" /> Misurazione con Dinamometro Digitale
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" /> Confronto con benchmark per età/sesso
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" /> Monitoraggio asimmetrie dx/sx
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/contatti?service=grip">Prenota Test (€30)</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted/50 rounded-2xl p-8 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Pacchetto Check-up Completo</h3>
        <p className="text-muted-foreground mb-6">
          Ottieni un quadro completo combinando BIA, Grip Strength e analisi dei biomarcatori nel nostro Protocollo Longevità.
        </p>
        <Button size="lg" asChild>
          <Link href="/servizi/protocolli/longevita">
            Scopri Protocollo Longevità <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
