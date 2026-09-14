import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Nubpack Signup Wizard",
  description: "A highly interactive signup wizard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
