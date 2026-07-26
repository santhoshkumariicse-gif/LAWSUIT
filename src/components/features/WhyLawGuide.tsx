"use client";

import { motion, Variants } from "framer-motion";
import {
  ShoppingCart,
  Users,
  Home,
  ShieldAlert,
  Briefcase,
  Car,
  Banknote,
  Gavel,
} from "lucide-react";

const practiceAreas = [
  { id: "consumer", name: "Consumer Law", icon: ShoppingCart },
  { id: "family", name: "Family Law", icon: Users },
  { id: "property", name: "Property Law", icon: Home },
  { id: "cyber", name: "Cyber Law", icon: ShieldAlert },
  { id: "employment", name: "Employment Law", icon: Briefcase },
  { id: "motor", name: "Motor Accident Law", icon: Car },
  { id: "cheque", name: "Cheque Bounce", icon: Banknote },
  { id: "criminal", name: "Criminal Law", icon: Gavel },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyLawGuide() {
  return (
    <section id="practice-areas" className="py-24 bg-[#07111f] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Why <span className="text-[#d4af37]">LawGuide AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[#b8c2cc] font-sans text-lg max-w-2xl mx-auto"
          >
            Explore our comprehensive AI-driven knowledge base covering India&apos;s most critical
            legal domains.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {practiceAreas.map((area) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={area.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-8 group cursor-pointer relative overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/0 to-[#d4af37]/0 group-hover:from-[#d4af37]/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                <div className="w-14 h-14 rounded-full bg-[#0d1b2a] border border-[#d4af37]/30 flex items-center justify-center mb-6 group-hover:border-[#d4af37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300">
                  <Icon className="w-6 h-6 text-[#d4af37]" />
                </div>

                <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-[#f1d27a] transition-colors">
                  {area.name}
                </h3>
                <p className="font-sans text-[#b8c2cc] text-sm">
                  Get instant AI guidance on {area.name.toLowerCase()} matters, relevant sections,
                  and required documents.
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
