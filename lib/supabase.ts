import { SupabaseClient, createClient } from "@supabase/supabase-js";

declare global {
  var cachedSupabase: SupabaseClient;
}

let supabase: SupabaseClient;

const SUPABASE_URL = 'https://vrlmwbhzkrdtnghispyc.supabase.co'
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybG13Ymh6a3JkdG5naGlzcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA4Nzc1MzksImV4cCI6MjAwNjQ1MzUzOX0.28nPF_9NJiifgfor1aBVNtop8kvAL1KH4LK3eBZEn8s';

if (process.env.NODE_ENV === "production") {
  supabase = createClient(
    SUPABASE_URL,
    SUPABASE_API_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );
} else {
  if (!global.cachedSupabase) {
    global.cachedSupabase = supabase = createClient(
      SUPABASE_URL,
    SUPABASE_API_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );
  }
  supabase = global.cachedSupabase;
}
export default supabase;
