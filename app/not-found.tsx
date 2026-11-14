import Link from "next/link";
import { uz } from "@/lib/text";
export default function NotFound() {
  return (
    <main className="shell py-24 text-center">
      <p className="mb-4 text-emerald-800">404</p>
      <h1 className="mb-8 text-3xl font-bold">{uz.notFound}</h1>
      <Link href="/" className="btn">
        {uz.home}
      </Link>
    </main>
  );
}
