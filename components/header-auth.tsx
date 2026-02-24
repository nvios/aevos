"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/auth/supabase";
import { User, LogOut } from "lucide-react";
import Link from "next/link";

export function HeaderAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-100"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.email}
              className="h-8 w-8 rounded-full border border-zinc-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200">
              <User className="h-4 w-4 text-zinc-500" />
            </div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          title="Esci"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
    >
      Accedi
    </Link>
  );
}
