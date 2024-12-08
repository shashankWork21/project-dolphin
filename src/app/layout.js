import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/general/header";
import Providers from "./providers";

export const metadata = {
  title: "Dolphin",
  description: "A platform for tracking your sessions, tasks, and progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
