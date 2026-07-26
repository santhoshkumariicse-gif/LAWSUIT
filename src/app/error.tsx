"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Sentry } from "@/lib/sentry";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Phase 9: Global Error Tracking
    console.error("errorBoundary: Unhandled application error", error);
    Sentry.captureException(error, { tags: { boundary: "RootError" } });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff4d4d]/10 via-[#07111f] to-[#07111f] pointer-events-none" />

      <div className="glass-card max-w-lg w-full p-8 md:p-12 text-center relative z-10 border-t-4 border-t-[#ff4d4d]">
        <div className="w-20 h-20 bg-[#ff4d4d]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-[#ff4d4d]" />
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-white mb-4">
          Unexpected Error
        </h1>
        
        <p className="text-[#b8c2cc] font-sans mb-8">
          A critical system error occurred. We have logged this issue for our engineering team. 
          Please try refreshing the page or returning home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#ff4d4d]/10 text-[#ff4d4d] border border-[#ff4d4d]/30 font-sans font-bold hover:bg-[#ff4d4d]/20 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f1d27a] text-[#07111f] font-sans font-bold hover:shadow-[0_0_15px_#d4af37] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
        
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-black/50 border border-white/10 rounded-lg text-left overflow-x-auto">
            <p className="text-[#ff4d4d] text-xs font-mono whitespace-pre-wrap">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
