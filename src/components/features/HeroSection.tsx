"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const Counter = ({
  end,
  duration = 2,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const step = end / (duration * 60);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#07111f]"
    >
      {/* Background with Dark Overlay and Lady Justice Placeholder */}
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop')",
        }}
      />

      {/* Light Rays & Smoke Gradients */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#07111f] via-[#07111f]/80 to-transparent" />
      <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent" />

      {/* Floating Gold Particles (Simple CSS implementation via multiple elements) */}
      <div className="absolute inset-0 z-2 overflow-hidden pointer-events-none">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#d4af37] rounded-full shadow-[0_0_10px_#d4af37]"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              x: [null, (Math.random() - 0.5) * 100],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="inline-block py-1 px-4 rounded-full glass border-[#d4af37]/20 text-[#f1d27a] text-xs font-sans tracking-widest uppercase mb-6">
            Premium Legal AI
          </span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            Know Your Rights. <br />
            Navigate <span className="text-glow-gold text-[#d4af37]">Justice.</span> <br />
            Powered by AI.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl text-[#b8c2cc] font-sans text-lg md:text-xl leading-relaxed mb-10"
        >
          India&apos;s intelligent legal guidance platform helping citizens understand laws, rights,
          procedures, documents, and next legal steps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f1d27a] text-[#07111f] font-sans font-bold text-lg hover:shadow-[0_0_20px_#d4af37] hover:scale-105 transition-all">
            Analyze My Case
          </button>
          <button className="px-8 py-4 rounded-full glass border-white/20 text-white font-sans font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all">
            Explore Legal Areas
          </button>
        </motion.div>

        {/* Hero Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/10 pt-12 w-full max-w-5xl"
        >
          <div className="flex flex-col items-center">
            <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
              <Counter end={5000} suffix="+" />
            </h3>
            <p className="text-[#b8c2cc] font-sans text-sm uppercase tracking-wider">
              Cases Analyzed
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-heading text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
              <Counter end={150} suffix="+" />
            </h3>
            <p className="text-[#b8c2cc] font-sans text-sm uppercase tracking-wider">
              Legal Topics
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">24/7</h3>
            <p className="text-[#b8c2cc] font-sans text-sm uppercase tracking-wider">AI Guidance</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-heading text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
              <Counter end={98} suffix="%" />
            </h3>
            <p className="text-[#b8c2cc] font-sans text-sm uppercase tracking-wider">
              User Satisfaction
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
