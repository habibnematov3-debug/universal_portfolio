"use client";
import { uz } from "@/lib/text";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="shell py-24 text-center">
      <h1 className="mb-8 text-2xl font-semibold">{uz.loadError}</h1>
      <button className="btn" onClick={reset}>
        {uz.retry}
      </button>
    </main>
  );
}
