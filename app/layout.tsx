import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "daryna_makhraieva | Кератин • Ботокс • Відновлення волосся",
  description:
    "Професійне відновлення волосся. Кератин, ботокс, холодне відновлення, тотальна реконструкція та домашній догляд.",
  keywords: [
    "кератин",
    "ботокс волосся",
    "відновлення волосся",
    "полірування волосся",
    "Дарина",
    "daryna_makhraieva",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

