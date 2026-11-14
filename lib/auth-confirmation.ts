import type { SupabaseClient } from "@supabase/supabase-js";

type ConfirmationAuth = Pick<SupabaseClient["auth"], "exchangeCodeForSession" | "verifyOtp">;

export async function confirmSignIn(
  params: URLSearchParams,
  auth: ConfirmationAuth,
): Promise<boolean> {
  if (params.has("error")) return false;
  const code = params.get("code");
  const hash = params.get("token_hash");
  if (!code && !hash) return false;

  try {
    // Default Supabase email templates return a PKCE code. Custom templates
    // may instead link directly here with a token hash.
    const { error } = code
      ? await auth.exchangeCodeForSession(code)
      : await auth.verifyOtp({ token_hash: hash!, type: "email" });
    return !error;
  } catch {
    return false;
  }
}
