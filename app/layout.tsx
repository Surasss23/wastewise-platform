import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WasteWise — A cleaner neighbourhood starts together",
  description: "WasteWise is a neighbourhood-first waste reporting, sorting and community awareness platform, beginning with a proposed pilot around Panjagutta, Hyderabad.",
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
