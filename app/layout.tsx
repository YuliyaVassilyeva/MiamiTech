import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Welcome to Miami Tech",
  description:
    "New to Miami? Book a coffee chat to plug into the Miami tech scene — meet the right people, find the right rooms, and get settled fast.",
  openGraph: {
    title: "Welcome to Miami Tech",
    description:
      "New to Miami? Book a coffee chat to plug into the Miami tech scene.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-display">{children}</body>
    </html>
  );
}
