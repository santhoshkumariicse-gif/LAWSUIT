"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted the policy
    const hasConsented = localStorage.getItem("lawguide_cookie_consent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("lawguide_cookie_consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto glass-card border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl pointer-events-auto rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 blur-3xl" />
            
            <div className="flex-1 flex gap-4">
              <div className="hidden md:flex bg-[#0d1b2a] w-12 h-12 rounded-full items-center justify-center border border-[#d4af37]/30 flex-shrink-0">
                <Cookie className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="text-white font-heading font-bold text-lg mb-1">We respect your privacy</h3>
                <p className="text-[#b8c2cc] font-sans text-sm leading-relaxed">
                  To comply with the DPDP Act, 2023, we require your consent to use strictly necessary and analytical cookies. 
                  LawGuide AI processes your data securely. By continuing, you agree to our{" "}
                  <Link href="/privacy" className="text-[#d4af37] hover:underline">Privacy Policy</Link> and{" "}
                  <Link href="/terms" className="text-[#d4af37] hover:underline">Terms of Service</Link>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={acceptCookies}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f1d27a] text-[#07111f] font-sans font-bold hover:shadow-[0_0_15px_#d4af37] transition-all whitespace-nowrap"
              >
                Accept & Continue
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2.5 text-[#b8c2cc] hover:text-white rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
