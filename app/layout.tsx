import type { Metadata } from "next";
import "../src/personal.css";

export const metadata: Metadata = {
  title: "Shaxsiy portfolio",
  description: "Loyihalar, tajriba va men haqimda. O‘zbekcha, русский, English.",
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
