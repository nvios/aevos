"use server";

import { headers, cookies } from "next/headers";
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

async function resolveCountryCode(): Promise<string | null> {
  const hdrs = await headers();
  const ck = (await cookies()).get("__geo")?.value;
  return hdrs.get("x-geo-country") ?? ck ?? null;
}

type ReadingSessionRow = {
  session_id: string;
  article_slug: string;
  locale: string;
  country_code: string | null;
  device_tier: string;
  os_name: string;
  is_mobile: boolean;
  referrer_type: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  is_entry: boolean;
  user_id?: string | null;
};

async function upsertReadingSession(
  supabase: ReturnType<typeof getSupabase> & object,
  row: ReadingSessionRow
) {
  const { error } = await supabase.from("reading_sessions").upsert(
    row,
    { onConflict: "session_id,article_slug", ignoreDuplicates: true }
  );

  if (!error) return;

  // If the column user_id doesn't exist yet, retry without it
  if (row.user_id != null && error.message?.includes("user_id")) {
    console.warn("[analytics] user_id column missing, retrying without it. Run migration 20260309.");
    const { user_id: _, ...rowWithoutUser } = row;
    const { error: retryError } = await supabase.from("reading_sessions").upsert(
      rowWithoutUser,
      { onConflict: "session_id,article_slug", ignoreDuplicates: true }
    );
    if (retryError) {
      console.error("[analytics] reading_sessions retry failed:", retryError.message);
    }
    return;
  }

  console.error("[analytics] reading_sessions upsert failed:", error.message);
}

export async function trackArticleView(
  slug: string,
  sessionId: string,
  context: ViewContext
) {
  const supabase = getSupabase();
  if (!supabase || !slug || !sessionId) return;

  const country_code = await resolveCountryCode();

  const row: ReadingSessionRow = {
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
    ...(context.user_id ? { user_id: context.user_id } : {}),
  };

  await Promise.all([
    supabase.rpc("increment_article_views", {
      article_slug: slug,
      p_locale: context.locale,
    }),
    upsertReadingSession(supabase, row),
  ]);
}

export async function trackRecipeView(
  slug: string,
  sessionId: string,
  context: ViewContext
) {
  const supabase = getSupabase();
  if (!supabase || !slug || !sessionId) return;

  const country_code = await resolveCountryCode();

  const row: ReadingSessionRow = {
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
    ...(context.user_id ? { user_id: context.user_id } : {}),
  };

  await Promise.all([
    supabase.rpc("increment_recipe_views", {
      recipe_slug: slug,
      p_locale: context.locale,
    }).then(({ error }) => {
      if (error) console.error("[analytics] increment_recipe_views failed:", error.message);
    }),
    upsertReadingSession(supabase, row),
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
