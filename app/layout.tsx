import type { Metadata } from "next";
import "./globals.css";

import LoadingScreen from "../components/LoadingScreen";
import {
  ScrollProgressBar,
  TelemetryCursor,
} from "../components/MotionPrimitives";
import Navbar from "../components/Navbar";
import { FavoritesProvider } from "../lib/favorites";
import { LiveDataProvider } from "../lib/live-data";

export const metadata: Metadata = {
  title: "APEXORA | 2026 Interactive Formula 1 Experience",
  description:
    "APEXORA — Next-gen 2026 Formula 1 standings, live race countdown & weather forecasts, 3D cockpit & garage inspector, interactive world circuits, and fan zone.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LiveDataProvider>
          <FavoritesProvider>
            <ScrollProgressBar />
            <TelemetryCursor />
            <LoadingScreen />
            <Navbar />
            {children}
          </FavoritesProvider>
        </LiveDataProvider>
      </body>
    </html>
  );
}
