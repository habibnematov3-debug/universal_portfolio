"use client";
import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { uz } from "@/lib/text";
import { publicUrl } from "@/lib/navigation";
import { z } from "zod";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (new URLSearchParams(location.search).has("error")) setMessage(uz.authError);
  }, []);
  async function login(google: boolean) {
    setBusy(true);
    setMessage("");
    try {
      const client = browserClient();
      if (google) {
        const { error } = await client.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: publicUrl("/auth/callback/") },
        });
        if (error) throw error;
      } else {
        if (!z.email().safeParse(email).success) {
          setMessage(uz.invalidEmail);
          return;
        }
        const { error } = await client.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: publicUrl("/auth/confirm/") },
        });
        if (error) throw error;
        setMessage(uz.sent);
      }
    } catch {
      setMessage(uz.authError);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="panel space-y-6">
      <button className="secondary w-full" disabled={busy} onClick={() => login(true)}>
        {uz.google}
      </button>
      <p className="text-center text-sm text-slate-500">{uz.emailAlternative}</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void login(false);
        }}
      >
        <label>
          {uz.email}
          <input
            autoComplete="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button disabled={busy} className="btn w-full">
          {busy ? uz.waiting : uz.send}
        </button>
      </form>
      <p role="status" className="muted">
        {message}
      </p>
    </div>
  );
}
