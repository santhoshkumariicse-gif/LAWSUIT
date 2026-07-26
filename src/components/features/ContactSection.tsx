"use client";

import { motion } from "framer-motion";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#0d1b2a] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Branding */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Scale className="text-[#d4af37] w-12 h-12 mb-6" />
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Premium Legal <br />
              <span className="text-glow-gold text-[#d4af37]">Consultancy</span>
            </h2>
            <p className="text-[#b8c2cc] font-sans text-lg mb-10 max-w-md">
              Need professional assistance beyond AI guidance? Our network of top-tier legal experts
              is ready to take your case.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#07111f] border border-[#d4af37]/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-xs font-sans text-[#b8c2cc] uppercase tracking-wider mb-1">
                    Toll-Free
                  </p>
                  <p className="text-white font-sans font-semibold">1800-LAWGUIDE</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#07111f] border border-[#d4af37]/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-xs font-sans text-[#b8c2cc] uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-white font-sans font-semibold">consult@lawguide.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#07111f] border border-[#d4af37]/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-xs font-sans text-[#b8c2cc] uppercase tracking-wider mb-1">
                    Headquarters
                  </p>
                  <p className="text-white font-sans font-semibold">Cyber City, Gurugram, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 md:p-10 border border-[#d4af37]/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-[50px] pointer-events-none" />

          <h3 className="font-heading text-2xl font-bold text-white mb-6">
            Request a Consultation
          </h3>
          <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-sans text-[#b8c2cc] uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#07111f] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-sans text-[#b8c2cc] uppercase tracking-wider mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full bg-[#07111f] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans text-[#b8c2cc] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-[#07111f] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-[#b8c2cc] uppercase tracking-wider mb-2">
                Legal Issue
              </label>
              <select className="w-full bg-[#07111f] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] outline-none transition-all">
                <option>Consumer Dispute</option>
                <option>Family / Divorce</option>
                <option>Property / Real Estate</option>
                <option>Criminal Defense</option>
                <option>Corporate / Business</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans text-[#b8c2cc] uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full bg-[#07111f] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] outline-none transition-all resize-none"
              />
            </div>

            <button className="w-full py-4 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f1d27a] text-[#07111f] font-sans font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
              Submit Request
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
