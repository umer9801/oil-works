import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Oil Works - POS System",
  description: "Point of Sale System for Oil Changing Shop",
  manifest: "/manifest.json",
  themeColor: "#1f2937",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
