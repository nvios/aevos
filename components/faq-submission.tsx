"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/auth/supabase";
import { Send } from "lucide-react";

export function FaqSubmission() {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = getSupabaseClient();

  // Load pending question on mount
  useEffect(() => {
    // Check for pending question
    const pendingQuestion = localStorage.getItem('pendingFaqQuestion');
    if (pendingQuestion) {
      setQuestion(pendingQuestion);
      // Optional: clear it immediately or keep it until successful submission
      // localStorage.removeItem('pendingFaqQuestion'); 
    }
  }, []);

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
      // Save question to local storage before redirecting
      localStorage.setItem('pendingFaqQuestion', question);
      window.location.href = '/login';
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate submission for now
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);
    setQuestion("");
    localStorage.removeItem('pendingFaqQuestion');

    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80 backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-zinc-100/50">
        <div className="flex w-full items-center justify-between px-6 py-4 text-left">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-emerald-700">
              Inviaci le tue domande
            </span>
            <span className="text-sm font-normal text-zinc-500">
              I nostri esperti risponderanno entro 24 ore.
            </span>
          </div>
        </div>

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
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuestion(value);
                    if (value) {
                      localStorage.setItem('pendingFaqQuestion', value);
                    } else {
                      localStorage.removeItem('pendingFaqQuestion');
                    }
                  }}
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
  );
}
