import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { ReactNode } from "react";
import "./globals.css";
import { SocketProvider} from "@/app/provider/SocketProvider";
interface RootLayoutProps {
  children: ReactNode; // ReactNode allows any valid React child: JSX, string, array, etc.
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrainWave Junction",
  description: "For students",
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}>
      <SocketProvider>


{children}


      
</SocketProvider>
      
      </body>

    </html>
  );
}
