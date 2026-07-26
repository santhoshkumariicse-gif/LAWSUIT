import { ReactNode } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07111f] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-[#07111f] to-[#07111f] pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <Scale className="text-[#d4af37] w-10 h-10" />
          <span className="font-heading font-bold text-3xl text-white tracking-tight">
            LawGuide<span className="text-[#d4af37]">AI</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-white/10">
          {children}
        </div>
      </div>
    </div>
  );
}
