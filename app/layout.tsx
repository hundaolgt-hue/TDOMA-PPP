import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Mall — Development Proposal",
  description:
    "An interactive, scroll-driven proposal for the Smart Mall development: assembly, program, phasing, financials, and delivery track record.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
