import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Folio — sizning keyingi qadamingiz",
  description: "Fakultetingizga mos portfolio yarating. Ishlaringiz, tajribangiz va g‘oyalaringiz — bir joyda.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="antialiased">{children}</body>
    </html>
  );
}
