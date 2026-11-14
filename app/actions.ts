"use server";
import { owner } from "@/lib/owner";
import { usernameSchema, profileSchema, validationMessage } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { uz } from "@/lib/text";
export async function claimUsername(raw: string) {
  const parsed = usernameSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { client, user } = await owner();
  const { error } = await client
    .from("profiles")
    .insert({ user_id: user.id, username: parsed.data });
  if (error) {
    const { data } = await client
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) return { ok: true };
    return {
      error: error.code === "23505" ? uz.usernameConflict : uz.saveError,
    };
  }
  return { ok: true };
}
export async function saveProfile(raw: unknown) {
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map(validationMessage).join(" ") };
  const { client, user } = await owner();
  const { data, error } = await client
    .from("profiles")
    .update(parsed.data)
    .eq("user_id", user.id)
    .select("username")
    .single();
  if (error || !data) return { error: uz.saveError };
  revalidatePath("/" + data.username);
  revalidatePath("/edit");
  return { ok: true };
}
export async function signOut() {
  const { client } = await owner();
  const { error } = await client.auth.signOut();
  return error ? { error: uz.logoutError } : { ok: true };
}
