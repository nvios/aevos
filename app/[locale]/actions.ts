"use server";

import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function trackArticleView(slug: string, sessionId: string) {
  const supabase = getSupabase();
  if (!supabase || !slug || !sessionId) return;

  await Promise.all([
    supabase.rpc("increment_article_views", { article_slug: slug }),
    supabase
      .from("reading_sessions")
      .upsert(
        { session_id: sessionId, article_slug: slug },
        { onConflict: "session_id,article_slug", ignoreDuplicates: true }
      ),
  ]);
}

export async function trackArticleCTAClick(slug: string) {
  const supabase = getSupabase();
  if (!supabase || !slug) return;

  await supabase.rpc("increment_article_cta_clicks", { article_slug: slug });
}

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email richiesta" };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return { error: "Configurazione Supabase mancante" };
  }

  // Try to insert into newsletter_subscribers
  // We assume the table exists. If not, this will fail.
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    // Check for unique violation (PostgreSQL code 23505)
    if (error.code === "23505") {
      return { success: true, message: "Email già iscritta" };
    }
    console.error("Newsletter subscription error:", error);
    return { error: "Errore durante l'iscrizione. Riprova più tardi." };
  }

  return { success: true };
}
