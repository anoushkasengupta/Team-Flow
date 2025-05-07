import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from '@/components/NavbarWrapper';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A modern task management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavbarWrapper />
        <div className="min-h-screen bg-gray-100">
          {children}
        </div>
        <ScrollToTopButton />
      </body>
    </html>
  );
}
