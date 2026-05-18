import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { CartIcon } from "@/components/cart-icon";
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Venta Bodega Contreras — Todo debe salir",
  description:
    "La familia Contreras se va a México. Todo lo de la casa en venta. Precios de bodega, oportunidades reales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable}`}
    >
      <body
        className="bg-[#F4F1EA] text-[#0A0A0A] antialiased"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <header className="border-b-2 border-[#0A0A0A] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#F4F1EA] z-40">
          <a
            href="/"
            className="uppercase tracking-tight hover:opacity-70 transition-opacity font-black text-xl md:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bodega Contreras
          </a>
          <CartIcon />
        </header>
        <main>{children}</main>
        <footer className="border-t-2 border-[#0A0A0A] mt-16 px-4 md:px-8 py-8 text-center text-sm text-[#0A0A0A]/60">
          <p
            className="italic text-base mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;Hecho con cariño en Santiago, antes de que nos vayamos
            pa&apos;l norte&rdquo;
          </p>
          <p>© 2025 Familia Contreras Petrakova — Santiago, Chile</p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
