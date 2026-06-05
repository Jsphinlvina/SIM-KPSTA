import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIM-KP",
  description: "Sistem Informasi Kerja Praktik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F7F8F0] min-h-screen`}>
        <div className="w-3/4 mx-auto relative min-h-screen flex flex-col">
          {children}
        </div>
        
      </body>
    </html>
  );
}