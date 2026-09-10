import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://traditumbyvictoria.ro"),
  title: {
    default: "Cofetărie artizanală în București – Traditum By Victoria",
    template: "%s – Traditum By Victoria",
  },
  description:
    "Torturi personalizate, prăjituri de casă și candy bar pentru evenimente în București și Ilfov. Cofetărie artizanală, la comandă.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${playfair.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-dvh bg-cream text-ink font-body">{children}</body>
    </html>
  );
}
