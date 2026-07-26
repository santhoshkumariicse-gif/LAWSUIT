"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      aria-label="Main Navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#07111f]/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="text-[#d4af37] w-8 h-8" />
          <div>
            <h1 className="font-heading text-xl font-bold text-white leading-none">
              LawGuide AI India
            </h1>
            <p className="text-[#b8c2cc] text-xs font-sans mt-1 tracking-wider">
              AI Legal Guidance Platform
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            "Home",
            "Legal Assistant",
            "Practice Areas",
            "Practice Mode",
            "Resources",
            "Contact",
          ].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm font-sans text-white/80 hover:text-[#d4af37] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-sm"
              aria-label={`Navigate to ${item}`}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="rounded-full">
            Start Legal Analysis
          </Button>
          
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
          ) : session ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-[#0d1b2a] flex items-center justify-center border border-[#d4af37]/50">
                  <User className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium leading-none">{session.user?.email || "User"}</span>
                  {/* @ts-ignore */}
                  <span className="text-[#d4af37] text-[10px] uppercase tracking-wider">{session.user?.role}</span>
                </div>
              </Link>
              <button 
                onClick={() => signOut()}
                className="p-2 text-[#b8c2cc] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-md"
                title="Sign out"
                aria-label="Sign out of your account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button 
              onClick={() => signIn()}
              className="ml-4"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
