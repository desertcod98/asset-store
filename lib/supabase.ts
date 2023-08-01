import { SupabaseClient, createClient } from "@supabase/supabase-js";

declare global {
  var cachedSupabase: SupabaseClient;
}

let supabase: SupabaseClient;

if (process.env.NODE_ENV === "production") {
  supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
} else {
  if (!global.cachedSupabase) {
    global.cachedSupabase = supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!,
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
