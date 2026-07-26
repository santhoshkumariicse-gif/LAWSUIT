import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Scale, LogOut, FileText, User } from "lucide-react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#07111f] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0d1b2a] border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="text-[#d4af37] w-6 h-6" />
            <span className="font-heading font-bold text-xl text-white">
              LawGuide<span className="text-[#d4af37]">AI</span>
            </span>
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#d4af37]/10 text-[#d4af37] font-sans">
              <FileText className="w-4 h-4" /> My Queries
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 font-sans transition-colors">
              <User className="w-4 h-4" /> Profile
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-[#b8c2cc] mb-3 px-3 truncate">{(session.user as any).email}</p>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#ff4d4d] hover:bg-[#ff4d4d]/10 font-sans transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="md:hidden p-4 border-b border-white/10 bg-[#0d1b2a] flex justify-between items-center">
          <Scale className="text-[#d4af37] w-6 h-6" />
          <Link href="/api/auth/signout" className="text-xs text-[#ff4d4d]">Sign out</Link>
        </header>
        <main className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
