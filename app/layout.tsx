import type { Metadata, Viewport } from "next"
import { Fraunces, Source_Sans_3 } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-app-sans",
})

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-app-display",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f1e6",
}

export const metadata: Metadata = {
  title: {
    default: "Inselführer",
    template: "%s · Inselführer",
  },
  description:
    "Filter für Fische, Insekten und Meerestiere in Animal Crossing: New Horizons. Nach Monat, Uhrzeit, Fundort und Preis in Sternis.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 pb-6 sm:px-6 md:py-6">
          {children}
        </div>
        <footer className="border-t border-border/80 pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:mt-8 md:pb-0">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm leading-relaxed text-muted-foreground sm:px-6 md:py-8">
            <p>
              Funddaten der deutschen Listen für{" "}
              <a className="underline decoration-border underline-offset-4 hover:text-foreground" href="https://www.acnewhorizons.de/new-horizons/guides/fische/">
                Fische
              </a>
              ,{" "}
              <a className="underline decoration-border underline-offset-4 hover:text-foreground" href="https://www.acnewhorizons.de/new-horizons/guides/insekten/">
                Insekten
              </a>{" "}
              und{" "}
              <a className="underline decoration-border underline-offset-4 hover:text-foreground" href="https://www.acnewhorizons.de/new-horizons/guides/meerestiere/">
                Meerestiere
              </a>
              . Voreingestellt ist die Nordhalbkugel.
            </p>
            <p>Kein offizielles Angebot von Nintendo.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
