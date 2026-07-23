import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liiban Smart Mall — TDOMA S.C.",
  description:
    "An interactive, scroll-driven proposal for the Liiban Smart Mall — a G+15 mixed-use trade complex in Merkato, Addis Ababa: assembly, programme, phasing, financials and BOQ.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
