import Link from "next/link";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-[#07111f] to-[#07111f] pointer-events-none" />

      <div className="glass-card max-w-lg w-full p-8 md:p-12 text-center relative z-10 border-t-4 border-t-[#d4af37]">
        <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-[#d4af37]" />
        </div>
        
        <h1 className="text-6xl font-heading font-bold text-white mb-2">
          404
        </h1>
        <h2 className="text-xl font-heading text-white/90 mb-4">Page Not Found</h2>
        
        <p className="text-[#b8c2cc] font-sans mb-8">
          The legal document or page you are looking for has been moved, deleted, or does not exist.
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f1d27a] text-[#07111f] font-sans font-bold hover:shadow-[0_0_15px_#d4af37] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
