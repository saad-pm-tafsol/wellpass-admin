import type { Metadata, Viewport } from "next";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";

import "./globals.css";
import { Providers } from "./providers";
import { NavigationLoader } from "@/components/wp/NavigationLoader";

function resolveMetadataBase(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const candidate = raw ? (/^https?:\/\//.test(raw) ? raw : `https://${raw}`) : "http://localhost:3000";
  try {
    return new URL(candidate);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: "WellPass Admin",
    template: "%s · WellPass Admin",
  },
  description: "Super-admin console for the WellPass platform — partners, customers, bookings, revenue and more.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <NavigationLoader />
      </body>
    </html>
  );
}
