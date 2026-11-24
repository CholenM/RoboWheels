import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RoboWheels × 2026 NSTW | Evaluation Dashboard",
  description:
    "Quick, friendly trilingual (English, Tagalog, Bisaya) emoji evaluation dashboard for RoboWheels: Innovation for Every-Juan at 2026 NSTW.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fredoka.variable} ${plusJakarta.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen font-sans antialiased text-[#0B153C] bg-[#FFFBF5] selection:bg-amber-200 selection:text-[#0B153C]"
      >
        {children}
      </body>
    </html>
  );
}
