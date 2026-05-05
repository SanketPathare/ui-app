"use client";

import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-brand-primary/30 selection:text-brand-primary">
      <Navbar />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
