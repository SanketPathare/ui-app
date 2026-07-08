"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const particles = [
  { id: 1, x: "15%", y: "20%", size: 6, delay: 0, duration: 3 },
  { id: 2, x: "75%", y: "15%", size: 4, delay: 0.5, duration: 4 },
  { id: 3, x: "85%", y: "70%", size: 5, delay: 1, duration: 3.5 },
  { id: 4, x: "20%", y: "80%", size: 3, delay: 0.3, duration: 4.5 },
  { id: 5, x: "45%", y: "10%", size: 7, delay: 0.8, duration: 3.2 },
  { id: 6, x: "60%", y: "85%", size: 4, delay: 1.2, duration: 3.8 },
  { id: 7, x: "90%", y: "40%", size: 5, delay: 0.2, duration: 4.2 },
  { id: 8, x: "10%", y: "55%", size: 3, delay: 0.7, duration: 3.6 },
];

const codeSnippets = [
  "<div>", "const", "function", "return", "import", "export",
  "class", "async", "await", "=>", "{}", "[]", "&&", "||",
  "useState", "useEffect", "npm", "yarn", "build", "deploy",
];

export function CompilerLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 8 + 2;
        return next >= 100 ? 100 : next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black">
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ring-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ring-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float-up {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
      `}</style>

      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: "linear-gradient(135deg, #000000, #0a0a0a, #111111, #000000)",
          backgroundSize: "400% 400%",
          animation: "gradient-shift 8s ease infinite",
        }}
      />

      {/* Floating code snippets */}
      {codeSnippets.map((snippet, i) => (
        <div
          key={i}
          className="absolute text-[#ffffff08] font-mono text-xs select-none pointer-events-none"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 40 + 60}%`,
            animation: `float-up ${8 + Math.random() * 6}s linear infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        >
          {snippet}
        </div>
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/[0.06]"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.3, 0.7, 0.2, 0.6, 0.3],
            scale: [1, 1.3, 0.8, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Animated rings */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-32 h-32 rounded-full border border-[#ffffff12]"
            style={{ animation: "ring-rotate 4s linear infinite" }}
          />
          <div
            className="absolute w-24 h-24 rounded-full border border-[#ffffff08] border-t-white/20"
            style={{ animation: "ring-rotate-reverse 3s linear infinite" }}
          />
          <div
            className="absolute w-16 h-16 rounded-full border border-[#ffffff06] border-b-white/15"
            style={{ animation: "ring-rotate 2s linear infinite" }}
          />

          {/* Inner icon */}
          <motion.div
            className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </motion.div>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-2">
          <motion.h1
            className="text-2xl font-semibold text-white/80 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Initializing Environment
          </motion.h1>
          <motion.p
            className="text-sm text-white/30 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Loading modules & preparing workspace
          </motion.p>
        </div>

        {/* Loading bar */}
        <div className="w-64">
          <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/60 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-white/25 font-mono">Initializing</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={Math.floor(progress / 10)}
                className="text-[10px] text-white/30 font-mono tabular-nums"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/25"
              style={{
                animation: "pulse-dot 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <motion.p
        className="absolute bottom-8 text-[11px] text-white/15 font-mono z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        UI Engine
      </motion.p>
    </div>
  );
}
