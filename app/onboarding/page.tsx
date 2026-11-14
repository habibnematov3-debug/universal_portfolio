import { owner } from "@/lib/owner";
import { redirect } from "next/navigation";
import UsernameForm from "@/components/UsernameForm";
import { uz } from "@/lib/text";
export const dynamic = "force-dynamic";
export default async function Onboarding() {
  const { client, user } = await owner();
  const { data, error } = await client
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw Error(uz.networkError);
  if (data) redirect("/edit");
  return (
    <main className="shell max-w-lg py-20">
      <h1 className="mb-6 text-3xl font-semibold">{uz.choose}</h1>
      <UsernameForm />
    </main>
  );
}
