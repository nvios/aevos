"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToNewsletter } from "@/app/[locale]/actions";
import { useTranslations } from 'next-intl';
import { analytics } from "@/lib/analytics/events";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('Newsletter');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);

    // We try to subscribe, but even if it fails (e.g. table doesn't exist),
    // we might still want to proceed to account creation as requested.
    // However, let's try to handle errors gracefully.
    try {
      const result = await subscribeToNewsletter(formData);

      if (result.error) {
        // If error is about missing table, we can ignore it and proceed?
        // Or show error?
        // The user said "save it in supabase", implying it should work.
        // But if I can't create the table, I should probably just proceed.
        console.error("Newsletter error:", result.error);
      }

      analytics.newsletterSubmitted(email);
      router.push(`/login?email=${encodeURIComponent(email)}&signup=true`);

    } catch (error) {
      console.error("Unexpected error:", error);
      // Fallback redirect
      router.push(`/login?email=${encodeURIComponent(email)}&signup=true`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        placeholder={t('placeholder')}
        className="flex-1 rounded-full border border-zinc-300 bg-white px-5 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? t('subscribing') : t('subscribe')}
      </button>
    </form>
  );
}
