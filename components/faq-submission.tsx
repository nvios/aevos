"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/auth/supabase";
import { Send, ChevronDown } from "lucide-react";
import Link from "next/link";

export function FaqSubmission() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = getSupabaseClient();

  // Check user session on mount
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
      
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    if (!user) {
        setError(
          <span>
            Devi <Link href="/calcolo-longevita" className="underline hover:text-zinc-900">effettuare l&apos;accesso</Link> per inviare una domanda.
          </span>
        );
        return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate submission for now
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);
    setQuestion("");
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80 backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-zinc-100/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="text-lg font-semibold text-zinc-800">
            Inviaci un&apos;altra domanda
          </span>
          <ChevronDown
            className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="question" className="sr-only">
                    La tua domanda
                  </label>
                  <textarea
                    id="question"
                    rows={3}
                    className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-900 focus:ring-zinc-900 sm:text-sm"
                    placeholder="Scrivi qui la tua domanda..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                
                {error && <p className="text-sm text-red-600">{error}</p>}
                
                {isSuccess ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="text-sm font-medium">Domanda inviata con successo! Ti risponderemo presto via email.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !question.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Invio in corso..."
                    ) : (
                      <>
                        Invia Domanda
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
