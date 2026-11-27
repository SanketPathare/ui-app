"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col overflow-x-clip">
      <Navbar />
      <main className="relative z-10 flex-1">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-5 sm:py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
