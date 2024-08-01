import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  title: "ThreadNest",
  description: "A simple nest for all your threads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
