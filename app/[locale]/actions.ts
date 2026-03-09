"use server";

import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

type ViewContext = {
  locale: string;
  device_tier: string;
  os_name: string;
  is_mobile: boolean;
  referrer_type: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  is_entry: boolean;
  user_id: string | null;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function trackArticleView(
  slug: string,
  sessionId: string,
  context: ViewContext
) {
  const supabase = getSupabase();
  if (!supabase || !slug || !sessionId) return;

  const hdrs = await headers();
  const country_code = hdrs.get("x-geo-country") ?? null;

  await Promise.all([
    supabase.rpc("increment_article_views", {
      article_slug: slug,
      p_locale: context.locale,
    }),
    supabase.from("reading_sessions").upsert(
      {
        session_id: sessionId,
        article_slug: slug,
        locale: context.locale,
        country_code,
        device_tier: context.device_tier,
        os_name: context.os_name,
        is_mobile: context.is_mobile,
        referrer_type: context.referrer_type,
        utm_source: context.utm_source,
        utm_medium: context.utm_medium,
        utm_campaign: context.utm_campaign,
        is_entry: context.is_entry,
        user_id: context.user_id,
      },
      { onConflict: "session_id,article_slug", ignoreDuplicates: true }
    ),
  ]);
}

export async function trackArticleCTAClick(slug: string, locale: string) {
  const supabase = getSupabase();
  if (!supabase || !slug) return;

  await supabase.rpc("increment_article_cta_clicks", {
    article_slug: slug,
    p_locale: locale,
  });
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
