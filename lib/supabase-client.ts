"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type SupabaseBrowserConfig = {
  url: string;
  key: string;
};

export function createBrowserSupabaseClient(config: SupabaseBrowserConfig): SupabaseClient {
  return createClient(config.url, config.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}
