import { redirect } from "next/navigation";
import { configured, serverClient } from "./supabase/server";
export async function owner() {
  if (!configured()) redirect("/login");
  const client = await serverClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) redirect("/login");
  return { client, user };
}
