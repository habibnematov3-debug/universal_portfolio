import { configured } from "@/lib/supabase/server";
import LoginForm from "@/components/LoginForm";
import { uz } from "@/lib/text";
export const dynamic = "force-dynamic";
export default function Login() {
  return (
    <main className="shell max-w-lg py-20">
      <a href="/" className="font-bold">
        Portfolio
      </a>
      <h1 className="mb-8 mt-12 text-3xl font-semibold">{uz.login}</h1>
      {configured() ? <LoginForm /> : <p className="error">{uz.setup}</p>}
    </main>
  );
}
