import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WasteWise — Better waste habits, cleaner neighbourhoods",
  description: "A community-first waste management platform for cleaner neighbourhoods in Hyderabad.",
  applicationName: "WasteWise",
  metadataBase: new URL("https://wastewise-platform.vercel.app")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
