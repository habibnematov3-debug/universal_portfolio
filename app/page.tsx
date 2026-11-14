import Link from "next/link";
import { uz } from "@/lib/text";
export default function Home() {
  return (
    <main className="shell">
      <header className="flex justify-between border-b border-stone-200 pb-6">
        <strong>{uz.brand}</strong>
        <Link href="/login">{uz.login} ↗</Link>
      </header>
      <section className="max-w-3xl py-24 sm:py-36">
        <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-emerald-800">
          {uz.landingEyebrow}
        </p>
        <h1 className="text-5xl font-semibold leading-tight sm:text-7xl">{uz.landingTitle}</h1>
        <p className="my-8 max-w-xl text-lg leading-8 text-slate-600">{uz.landingDescription}</p>
        <Link className="btn" href="/login">
          {uz.start} ↗
        </Link>
      </section>
      <footer className="border-t border-stone-200 pt-6 text-sm text-slate-500">
        {uz.brand} · {uz.tagline}
      </footer>
    </main>
  );
}
