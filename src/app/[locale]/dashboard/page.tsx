"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { Scale, Shield } from "lucide-react";
import dynamic from "next/dynamic";

// Phase 6: Code Splitting - dynamically import heavy icons and results components
const AlertCircle = dynamic(() => import("lucide-react").then((mod) => mod.AlertCircle));
const FileText = dynamic(() => import("lucide-react").then((mod) => mod.FileText));
const CheckCircle2 = dynamic(() => import("lucide-react").then((mod) => mod.CheckCircle2));

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    // Mock API call simulation
    setTimeout(() => {
      setIsLoading(false);
      setResult({
        confidence_score: 95,
        laws: ["Section 302 of Bharatiya Nyaya Sanhita (BNS)"],
        forum: "Sessions Court",
        steps: ["File an FIR", "Gather Evidence", "Engage a Defense Attorney"],
        citations: ["Document ID: bns-sec-302 - Punishment for Murder"],
        disclaimer: "This is AI-generated and not professional legal advice."
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="space-y-4 text-center md:text-left border-b border-white/10 pb-8">
          <div className="flex items-center justify-center md:justify-start space-x-3 text-emerald-400">
            <Scale size={32} />
            <h1 className="text-4xl md:text-5xl font-playfair font-bold tracking-tight text-white">
              LawGuide<span className="font-light">AI</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl font-light">
            Enterprise legal intelligence. Enter an issue to search the Indian knowledge base.
          </p>
        </header>

        {/* Input Section */}
        <section>
          <Card className="bg-zinc-900/50 border-white/5 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-6">
              <form onSubmit={handleAnalyze} className="space-y-4 flex flex-col">
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none min-h-[120px]"
                  placeholder="Describe the legal situation or upload a document snippet..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 flex items-center gap-2">
                    <Shield size={14} /> Secured by AES-256
                  </span>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !query.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8"
                  >
                    {isLoading ? "Analyzing Vector DB..." : "Run Analysis"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Loading Skeletons */}
        {isLoading && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <Skeleton className="h-8 w-48 bg-zinc-800" />
              <Skeleton className="h-6 w-24 bg-zinc-800 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-48 bg-zinc-800 rounded-xl" />
              <Skeleton className="h-48 bg-zinc-800 rounded-xl" />
            </div>
          </section>
        )}

        {/* Error Boundary Placeholder */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && !isLoading && (
          <section className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" /> Analysis Complete
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                Confidence: {result.confidence_score}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-white/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-zinc-200">
                    <Scale size={18} className="text-blue-400" /> Relevant Laws
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
                    {result.laws.map((law: string, i: number) => (
                      <li key={i}>{law}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-white/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-zinc-200">
                    <FileText size={18} className="text-amber-400" /> Grounding Citations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.citations.map((cite: string, i: number) => (
                      <li key={i} className="bg-black/30 p-3 rounded-md text-xs font-mono text-zinc-300 border border-white/5">
                        {cite}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex gap-3 text-zinc-500 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{result.disclaimer}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
