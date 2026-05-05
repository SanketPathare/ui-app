  import type { Metadata } from "next";
  import { Inter, Outfit } from "next/font/google";
  import "./globals.css";

  const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
  });

  const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
  });

  export const metadata: Metadata = {
    title: "UI Engine | Next-Gen CSS Design System",
    description: "The ultimate CSS and UI design architecture for modern engineering teams. Design, preview, and deploy high-fidelity styles in seconds.",
    keywords: ["CSS Engine", "UI Architecture", "Design Systems", "Glassmorphism Pro", "Advanced Gradients", "Developer Tools"],
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body
          className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#020617] text-slate-100 selection:bg-brand-primary/30 selection:text-brand-primary`}
        >
          {children}
        </body>
      </html>
    );
  }
