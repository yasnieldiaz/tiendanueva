import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Drone Parts Store | DJI, Autel, XAG, FIMI",
    template: "%s | Drone Parts Store",
  },
  description:
    "Official distributor of drone parts. DJI, Autel, XAG, FIMI spare parts and accessories. Fast shipping across Europe.",
  keywords: [
    "drone parts",
    "DJI parts",
    "Autel parts",
    "XAG drones",
    "FIMI parts",
    "drone accessories",
    "drone repair",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
