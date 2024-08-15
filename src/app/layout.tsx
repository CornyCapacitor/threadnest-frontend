import { Navbar } from "@/components/layout/Navbar";
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
    <html lang="en" className="dark h-full px-1">
      <head>
        <link rel="icon" href="threadnest.svg" />
      </head>
      <body className={`${roboto.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex flex-grow flex-col">{children}</main>
      </body>
    </html>
  );
}
