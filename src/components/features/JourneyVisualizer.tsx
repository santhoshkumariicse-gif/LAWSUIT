"use client";

import { motion } from "framer-motion";
import {
  FileWarning,
  FolderSearch,
  FileSignature,
  Landmark,
  Gavel,
  CheckCircle,
} from "lucide-react";

const steps = [
  { id: 1, title: "Issue Reported", icon: FileWarning, desc: "Initial facts recorded" },
  { id: 2, title: "Evidence Collection", icon: FolderSearch, desc: "Gathering required docs" },
  { id: 3, title: "Complaint Filing", icon: FileSignature, desc: "Formal legal submission" },
  { id: 4, title: "Authority Review", icon: Landmark, desc: "Scrutiny by registry" },
  { id: 5, title: "Hearing", icon: Gavel, desc: "Arguments & evidence" },
  { id: 6, title: "Resolution", icon: CheckCircle, desc: "Final order or settlement" },
];

export default function JourneyVisualizer() {
  return (
    <section className="py-24 bg-[#07111f] relative overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
            Legal Journey <span className="text-[#d4af37]">Visualizer</span>
          </h2>
          <p className="text-[#b8c2cc] font-sans text-lg max-w-2xl mx-auto">
            Understand the step-by-step lifecycle of a typical legal proceeding in India.
          </p>
        </div>

        <div className="relative">
          {/* Animated Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block" />

          <motion.div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#f1d27a] to-[#d4af37] -translate-y-1/2 hidden md:block z-0"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-full glass-card border border-[#d4af37]/50 flex items-center justify-center mb-4 relative z-10 group-hover:border-[#d4af37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all bg-[#07111f]"
                  >
                    <Icon className="text-[#d4af37] w-7 h-7" />
                  </motion.div>
                  <h4 className="font-heading text-lg font-bold text-white mb-1">{step.title}</h4>
                  <p className="font-sans text-xs text-[#b8c2cc]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
