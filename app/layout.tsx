import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahmut Yücel — Yazılım Geliştirici",
  description:
    "Mahmut Yücel'in yazılım projeleri, teknik çalışmaları ve profesyonel portföyü.",
  keywords: [
    "Mahmut Yücel",
    "Yazılım Geliştirici",
    "Computer Engineering",
    "Next.js",
    "Python",
    "C#",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}