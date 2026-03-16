import type { Metadata } from "next";
import { Nunito, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "1er Encuentro Agroecológico Tomasino | Registro",
  description:
    "Encuentro comunitario para compartir conocimientos sobre agroecología, compostaje, semillas y producción local.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${nunito.variable} ${sourceSans.variable} font-sans min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
