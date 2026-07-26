import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white pt-32 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center">
        <h1 className="font-heading text-5xl font-bold text-[#d4af37] mb-6">
          Legal Knowledge Hub
        </h1>
        <p className="text-[#b8c2cc] text-lg max-w-2xl mx-auto mb-12">
          We are currently curating the best legal resources, articles, and checklists for you. 
          Our comprehensive library will be available here soon.
        </p>
        
        <div className="glass-card p-12 rounded-3xl border border-white/10 max-w-2xl mx-auto mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent opacity-50" />
          <h2 className="text-3xl font-heading font-bold mb-4 relative z-10">Coming Soon</h2>
          <p className="text-[#b8c2cc] relative z-10">
            Bookmark this page and check back later for detailed guides on Consumer Rights, Cyber Safety, Property Laws, and more.
          </p>
        </div>

        <Link href="/">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f1d27a] text-[#07111f] font-sans font-bold hover:shadow-[0_0_20px_#d4af37] transition-all flex items-center gap-2 mx-auto">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
