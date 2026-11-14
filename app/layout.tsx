import type { Metadata } from "next";
import "./globals.css";
import { uz } from "@/lib/text";
export const metadata: Metadata = {
  title: uz.brand,
  description: uz.metaDescription,
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
