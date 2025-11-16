import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ascend Now Career Discovery Platform",
  description: "Interactive activities to help high school students discover their career interests and express their identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
