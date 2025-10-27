import type { Metadata } from "next";
import "../styles/globals.css";
import SessionProviderClient from "./providers/SessionProviderClient";

export const metadata: Metadata = {
  title: "TrackMyRun - Mon journal running",
  description: "TrackMyRun – Application web de suivi du running. Journal de courses, statistiques, progression et gestion des séances en ligne.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (    
    <html lang="fr">
      <body
        className="bg-neutral-950 text-slate-100">
        <SessionProviderClient>
              {children}
        </SessionProviderClient>
      </body>
    </html>    
  );
}
