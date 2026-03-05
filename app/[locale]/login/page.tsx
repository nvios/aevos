"use client";

import { Suspense, useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/auth/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Lock } from "lucide-react";
import { analytics } from "@/lib/analytics/events";

function LoginForm() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isEn = locale === 'en';
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(
    searchParams.get("signup")
      ? (isEn ? "Complete registration by creating a password." : "Completa la registrazione creando una password.")
      : ""
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        analytics.identify(session.user.id, {
          email: session.user.email,
          auth_method: session.user.app_metadata.provider ?? "unknown",
        });
        router.push("/");
        router.refresh();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        analytics.identify(session.user.id, {
          email: session.user.email,
          auth_method: session.user.app_metadata.provider ?? "unknown",
        });
        if (event === "SIGNED_IN") {
          const method = (session.user.app_metadata.provider === "google" ? "google" : "email") as "google" | "email";
          analytics.loginCompleted(method, session.user.email ?? "");
        }
        router.push("/");
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleOAuth = async () => {
    if (!supabase) {
      setStatus(isEn ? "Configure Supabase to enable login." : "Configura Supabase per attivare il login.");
      return;
    }

    analytics.loginStarted("google");

    const redirectPath = locale === 'en' ? '/en/login' : '/login';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${redirectPath}`,
      },
    });

    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus(isEn ? "Redirecting to Google..." : "Reindirizzamento a Google...");
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setStatus("");

    analytics.loginStarted("email");

    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (!signIn.error) {
      const userId = signIn.data.user?.id;
      if (userId) {
        analytics.identify(userId, { email, auth_method: "email" });
        analytics.loginCompleted("email", email);
      }
      router.push("/");
      router.refresh();
      return;
    }

    const signUp = await supabase.auth.signUp({ email, password });
    if (signUp.error) {
      setStatus(signUp.error.message);
      setLoading(false);
      return;
    }

    const userId = signUp.data.user?.id;
    if (userId) {
      analytics.identify(userId, { email, auth_method: "email" });
      analytics.signupCompleted("email", email);
    }

    setStatus(isEn ? "Account created. Check your email to confirm." : "Account creato. Controlla la tua email per confermare.");
    setLoading(false);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
            <Lock className="h-6 w-6 text-zinc-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
            {isEn ? 'Sign in to your account' : 'Accedi al tuo account'}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            {isEn
              ? 'To save your progress and access exclusive content.'
              : 'Per salvare i tuoi progressi e accedere ai contenuti esclusivi.'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleOAuth}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {isEn ? 'Continue with Google' : 'Continua con Google'}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink-0 px-2 text-xs text-zinc-400">{isEn ? 'or email' : 'oppure email'}</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none" />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none" />
            <button type="submit" disabled={loading} className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
              {loading ? (isEn ? "Processing..." : "Elaborazione...") : (isEn ? "Sign in / Register" : "Accedi / Registrati")}
            </button>
          </form>

          {status && (
            <p className="text-center text-xs text-zinc-600 animate-pulse">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const locale = useLocale();
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">{locale === 'en' ? 'Loading...' : 'Caricamento...'}</div>}>
      <LoginForm />
    </Suspense>
  );
}
