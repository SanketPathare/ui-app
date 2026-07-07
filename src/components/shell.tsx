"use client";

import { Navbar } from "@/components/navbar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <main className="relative z-10">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
