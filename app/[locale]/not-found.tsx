import Link from "next/link";
import { ArrowLeft, Dna } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-xl">
           <div className="h-32 w-32 rounded-full bg-emerald-500" />
           <div className="h-32 w-32 rounded-full bg-cyan-500 -ml-10" />
        </div>
        <div className="relative z-10 bg-zinc-50 p-4 rounded-full border border-zinc-200 shadow-sm">
          <Dna className="h-12 w-12 text-zinc-400" />
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          404: Link scaduto
        </h1>
        <p className="text-lg text-zinc-600">
          Sembra che questa pagina abbia superato la sua aspettativa di vita.
          <br className="hidden sm:block" />
          A differenza dei nostri consigli sulla longevità, questo link non era destinato a durare per sempre.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="group inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Torna alla Home
        </Link>
        <Link
          href="/articoli"
          className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:border-zinc-300"
        >
          Leggi gli articoli
        </Link>
      </div>
    </div>
  );
}
