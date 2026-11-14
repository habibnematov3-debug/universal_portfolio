import { owner } from "@/lib/owner";
import { redirect } from "next/navigation";
import { profileValues } from "@/lib/validation";
import EditForm from "@/components/EditForm";
export const dynamic = "force-dynamic";
export default async function Edit() {
  const { client, user } = await owner();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw Error("Profilni yuklab bo‘lmadi.");
  if (!data) redirect("/onboarding");
  return <EditForm initial={profileValues(data)} username={data.username} userId={user.id} />;
}
