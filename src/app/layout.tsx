import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/cal-sans";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "ZYND | Inteligência Artificial & Automação Corporativa",
  description: "Reinvente a eficiência da sua empresa com a ZYND. Desenvolvemos agentes de inteligência artificial autónomos, orquestradores de workflows cognitivos e hiperautomação sob medida.",
  keywords: ["Inteligência Artificial", "Hiperautomação", "RPA de IA", "Orquestração de Processos", "Process Mining", "Agentes Autónomos", "Enterprise AI"],
  authors: [{ name: "ZYND Team" }],
  robots: "index, follow",
  openGraph: {
    title: "ZYND | Inteligência Artificial & Automação Corporativa",
    description: "Orquestramos fluxos de trabalho inteligentes, eliminando fricções operacionais e escalando o potencial da sua empresa através de hiperautomação sob medida.",
    url: "https://zynd.ai",
    siteName: "ZYND",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYND | Inteligência Artificial & Automação Corporativa",
    description: "Sistemas cognitivos e hiperautomação sob medida.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Organization Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZYND",
    "url": "https://zynd.ai",
    "logo": "https://zynd.ai/logo.png",
    "description": "Sistemas cognitivos e hiperautomação sob medida para empresas.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99999-9999",
      "contactType": "sales",
      "email": "contato@zynd.ai",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    }
  };

  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
