import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google"; // Changed to Poppins
import Provider from "./Provider";
import { TabProvider } from "@/context/TabsContext";
import { PermissionProvider } from "@/components/PermissionContact";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins", // Optional: define a CSS variable for Poppins
});

export const metadata: Metadata = {
  title: "Recruitment-Portal",
  description: "One Stop Solution for all CMS - Recruitment-Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Provider>
          <PermissionProvider>
          <Toaster position="bottom-right" closeButton richColors />
          <TabProvider>{children}</TabProvider>
          </PermissionProvider>
        </Provider>
      </body>
    </html>
  );
}
