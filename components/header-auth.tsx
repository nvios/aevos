"use client";

import { useEffect, useState, useRef } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/auth/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useTranslations } from 'next-intl';
import { analytics } from "@/lib/analytics/events";

export function HeaderAuth() {
  const supabase = getSupabaseClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(!!supabase);
  const [isOpen, setIsOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations('Auth');

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        analytics.identify(session.user.id, {
          email: session.user.email,
          auth_method: session.user.app_metadata.provider ?? "unknown",
        });
      }
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [supabase]);

  const handleSignOut = async () => {
    if (!supabase) return;
    analytics.signedOut();
    await supabase.auth.signOut();
    analytics.reset();
    setUser(null);
    setIsOpen(false);
    router.refresh();
  };

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-100"></div>;
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1 pr-3 hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-200"
        >
            {user.user_metadata?.avatar_url && !avatarError ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt={user.email || ""}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover border border-zinc-100"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500">
              <User className="h-4 w-4" />
            </div>
          )}
          <span className="hidden sm:block text-sm font-medium text-zinc-700 max-w-[100px] truncate">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </span>
          <ChevronDown className={clsx("h-4 w-4 text-zinc-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="px-3 py-2 border-b border-zinc-100 mb-1">
              <p className="text-xs text-zinc-500">{t('logged_in_as')}</p>
              <p className="text-sm font-medium text-zinc-900 truncate" title={user.email || ""}>{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
    >
      {t('login')}
    </Link>
  );
}
