"use server";

import { createClient } from "@supabase/supabase-js";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) {
    return { error: "Email richiesta" };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { error: "Configurazione Supabase mancante" };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

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
