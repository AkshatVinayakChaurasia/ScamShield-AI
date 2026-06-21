import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a single supabase client for interacting with your database
// using the service role key for administrative/backend tasks.
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && serviceKey) {
  supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.warn("⚠ Supabase admin not configured. Service features relying on service_role_key disabled.");
}

export { supabaseAdmin };
