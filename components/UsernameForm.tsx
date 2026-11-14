"use client";
import { useEffect, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { browserClient } from "@/lib/supabase/browser";
import { usernameSchema } from "@/lib/validation";
import { claimUsername } from "@/lib/actions";
import { uz } from "@/lib/text";
export default function UsernameForm() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    setAvailable(false);
    const check = usernameSchema.safeParse(name);
    if (!check.success) {
      setStatus(name ? check.error.issues[0].message : "");
      return;
    }
    setStatus(uz.checking);
    const timer = setTimeout(async () => {
      try {
        const { data, error } = await browserClient()
          .from("profiles")
          .select("username")
          .eq("username", name)
          .maybeSingle();
        if (!active) return;
        setAvailable(!error && !data);
        setStatus(error ? uz.networkError : data ? uz.taken : uz.available);
      } catch {
        if (active) setStatus(uz.networkError);
      }
    }, 350);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [name]);
  return (
    <form
      className="panel space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          const result = await claimUsername(name);
          if (result.error) setStatus(result.error);
          else {
            router.replace("/edit");

          }
        } catch {
          setStatus(uz.networkError);
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        {uz.username}
        <input
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          minLength={3}
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value.toLowerCase())}
        />
      </label>
      <p className="muted">
        {uz.yourLink}: /{name || uz.usernamePlaceholder}
      </p>
      <p role="status" className="muted">
        {status}
      </p>
      <button className="btn" disabled={!available || busy}>
        {uz.continue}
      </button>
    </form>
  );
}
